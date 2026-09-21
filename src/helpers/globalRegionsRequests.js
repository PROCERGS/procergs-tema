const REQUEST_TYPES = new Set(['FETCH_GLOBAL_REGIONS', 'SAVE_GLOBAL_REGIONS']);
const SESSION_RESET_TYPES = new Set([
  'LOGIN_PENDING',
  'LOGIN_SUCCESS',
  'LOGIN_FAIL',
  'LOGOUT_PENDING',
  'LOGOUT_SUCCESS',
  'LOGOUT_FAIL',
  'LOGIN_RENEW_FAIL',
]);

export const GLOBAL_REGIONS_COLLECTION_FIELD = 'global_regions';
const RESERVED_COLLECTION_KEYS = new Set(['blocks', 'blocks_layout']);

const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

export const isValidRegionDocument = (value) =>
  isObject(value) &&
  isObject(value.blocks) &&
  isObject(value.blocks_layout) &&
  Array.isArray(value.blocks_layout.items);

const copyValidRegions = (source, target) => {
  if (!isObject(source)) return target;
  Object.entries(source).forEach(([name, value]) => {
    if (RESERVED_COLLECTION_KEYS.has(name)) return;
    if (isValidRegionDocument(value)) {
      target[name] = value;
    }
  });
  return target;
};

const instanceFieldNames = (definitions = {}) => {
  const names = Object.keys(definitions);
  return [...new Set(names.map((name) => definitions[name]?.fieldName || name))];
};

export const mergeRegionCollection = (state, regionName, region) => {
  const merged = copyValidRegions(
    state?.data,
    copyValidRegions(state?.collection, {}),
  );
  if (isValidRegionDocument(region)) {
    merged[regionName] = region;
  } else {
    delete merged[regionName];
  }
  return merged;
};

export const flattenRegionCollection = (
  action,
  { fillMissing = true } = {},
) => {
  if (!isObject(action?.result)) return action;
  if (
    !Object.prototype.hasOwnProperty.call(
      action.result,
      GLOBAL_REGIONS_COLLECTION_FIELD,
    )
  ) {
    return action;
  }

  const collection = action.result[GLOBAL_REGIONS_COLLECTION_FIELD];
  const definitions = action.definitions || {};
  const namedMap = copyValidRegions(isObject(collection) ? collection : {}, {});
  const names = Object.keys(definitions);

  if (fillMissing) {
    names.forEach((name) => {
      if (!Object.prototype.hasOwnProperty.call(namedMap, name)) {
        namedMap[name] =
          isObject(collection) &&
          Object.prototype.hasOwnProperty.call(collection, name)
            ? collection[name]
            : null;
      }
    });
  }

  if (!fillMissing && Object.keys(namedMap).length === 0) {
    return action;
  }

  const instanceFields = instanceFieldNames(definitions).reduce(
    (fields, fieldName) => {
      fields[fieldName] = { ...namedMap };
      return fields;
    },
    {},
  );

  return {
    ...action,
    result: {
      ...action.result,
      ...instanceFields,
    },
  };
};

export const buildCollectionSaveRequest = (
  state,
  regionName,
  region,
  request = {},
) => ({
  ...request,
  data: {
    [GLOBAL_REGIONS_COLLECTION_FIELD]: mergeRegionCollection(
      state,
      regionName,
      region,
    ),
  },
});

export const globalRegionsRequestMiddleware = ({ getState } = {}) => {
  let requestId = 0;
  return (next) => (action) => {
    if (!action?.request || !REQUEST_TYPES.has(action.type)) {
      return next(action);
    }

    const nextAction = { ...action, globalRegionsRequestId: ++requestId };
    if (action.type !== 'SAVE_GLOBAL_REGIONS') {
      return next(nextAction);
    }

    const region =
      action.region ??
      action.request.data?.[action.fieldName] ??
      action.request.data?.[action.regionName];

    return next({
      ...nextAction,
      request: buildCollectionSaveRequest(
        getState?.()?.globalRegions,
        action.regionName,
        region,
        action.request,
      ),
    });
  };
};

export const guardGlobalRegionsReducer =
  (reducer) =>
  (state, action = {}) => {
    if (SESSION_RESET_TYPES.has(action.type)) {
      return {
        ...reducer(undefined, {}),
        collection: {},
        editPermission: null,
        requestIds: {},
        sessionVersion: (state?.sessionVersion || 0) + 1,
      };
    }

    const match =
      /^(FETCH_GLOBAL_REGIONS|SAVE_GLOBAL_REGIONS)_(PENDING|SUCCESS|FAIL)$/.exec(
        action.type,
      );
    if (!match) return reducer(state, action);
    const [, requestType, status] = match;
    const requestId = action.globalRegionsRequestId;

    if (requestId === undefined) return state || reducer(undefined, {});
    if (status !== 'PENDING' && state?.requestIds?.[requestType] !== requestId)
      return state;

    const flattenedAction =
      status === 'SUCCESS'
        ? flattenRegionCollection(action, {
            fillMissing: requestType === 'FETCH_GLOBAL_REGIONS',
          })
        : action;
    const nextState = reducer(state, flattenedAction);
    const requestIds = {
      ...state?.requestIds,
      [requestType]: status === 'PENDING' ? requestId : null,
    };
    let editPermission = state?.editPermission ?? null;
    let permissionRefreshRequired = state?.permissionRefreshRequired || false;
    if (requestType === 'FETCH_GLOBAL_REGIONS') {
      editPermission = status === 'SUCCESS' ? Boolean(nextState.canEdit) : null;
      permissionRefreshRequired = false;
    }
    const errorStatus = action.error?.status ?? action.error?.response?.status;
    if (status === 'FAIL' && [401, 403].includes(errorStatus)) {
      editPermission = requestType === 'FETCH_GLOBAL_REGIONS' ? false : null;
      permissionRefreshRequired = requestType === 'SAVE_GLOBAL_REGIONS';
    }

    let collection = state?.collection || {};
    let data = nextState.data;
    if (status === 'SUCCESS' && requestType === 'FETCH_GLOBAL_REGIONS') {
      collection = isObject(action.result?.[GLOBAL_REGIONS_COLLECTION_FIELD])
        ? action.result[GLOBAL_REGIONS_COLLECTION_FIELD]
        : {};
      data = copyValidRegions(collection, {});
    }
    if (status === 'SUCCESS' && requestType === 'SAVE_GLOBAL_REGIONS') {
      const saved = isValidRegionDocument(action.region)
        ? action.region
        : data?.[action.regionName];
      data = {
        ...copyValidRegions(collection, {}),
        ...copyValidRegions(data, {}),
        [action.regionName]: saved,
      };
      collection = mergeRegionCollection(
        {
          collection: isObject(action.result?.[GLOBAL_REGIONS_COLLECTION_FIELD])
            ? action.result[GLOBAL_REGIONS_COLLECTION_FIELD]
            : state?.collection,
          data,
        },
        action.regionName,
        saved,
      );
      data = copyValidRegions(collection, {});
    }

    return {
      ...nextState,
      data,
      requestIds,
      collection,
      editPermission,
      permissionRefreshRequired,
    };
  };
