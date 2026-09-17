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

export const globalRegionsRequestMiddleware = () => {
  let requestId = 0;
  return (next) => (action) =>
    action?.request && REQUEST_TYPES.has(action.type)
      ? next({ ...action, globalRegionsRequestId: ++requestId })
      : next(action);
};

export const guardGlobalRegionsReducer =
  (reducer) =>
  (state, action = {}) => {
    if (SESSION_RESET_TYPES.has(action.type)) {
      return {
        ...reducer(undefined, {}),
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

    const nextState = reducer(state, action);
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

    return {
      ...nextState,
      requestIds,
      editPermission,
      permissionRefreshRequired,
    };
  };
