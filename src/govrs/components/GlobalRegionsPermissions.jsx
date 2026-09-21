import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GlobalRegionsContext,
  GlobalRegionsProvider,
  SAVE_GLOBAL_REGIONS,
  useGlobalRegions,
} from 'volto-global-regions';
import { buildCollectionSaveRequest } from '../../helpers/globalRegionsRequests';

export function restrictGlobalRegions(
  globalRegions,
  canEdit,
  preserveEditing = false,
) {
  const save = (...args) =>
    canEdit
      ? globalRegions.save(...args)
      : Promise.reject(new Error('Sem permissão para editar regiões globais.'));
  const saveRegion = (...args) =>
    canEdit
      ? globalRegions.saveRegion(...args)
      : Promise.reject(new Error('Sem permissão para editar regiões globais.'));

  return {
    ...globalRegions,
    canEdit,
    editingRegion:
      canEdit || preserveEditing ? globalRegions.editingRegion : null,
    beginEditing: (...args) => {
      if (canEdit) globalRegions.beginEditing(...args);
    },
    save,
    saveRegion,
  };
}

export function GlobalRegionsPermissionBoundary({
  children,
  token,
  userId,
  canEditContent,
}) {
  const dispatch = useDispatch();
  const globalRegions = useGlobalRegions();
  const collection = useSelector(
    (state) => state.globalRegions?.collection || {},
  );
  const storedData = useSelector((state) => state.globalRegions?.data || {});
  const sessionUser = token ? userId : null;
  const sessionVersion = useSelector(
    (state) => state.globalRegions?.sessionVersion || 0,
  );
  const globalRegionsRef = useRef(globalRegions);
  globalRegionsRef.current = globalRegions;
  const { cancelEditing, editingRegion } = globalRegions;
  const editingSnapshot = useRef(null);
  const permissionRefreshRequired = useSelector((state) =>
    Boolean(state.globalRegions?.permissionRefreshRequired),
  );

  const saveNamedRegion = useCallback(
    (name, region, options = {}) => {
      const etag = options.etag ?? globalRegions.etag;
      return dispatch({
        type: SAVE_GLOBAL_REGIONS,
        fieldName: name,
        regionName: name,
        definitions: globalRegions.definitions,
        getETag: globalRegions.settings?.getETag,
        region,
        etag: etag || null,
        request: buildCollectionSaveRequest(
          { collection, data: storedData },
          name,
          region,
          {
            op: 'patch',
            path:
              globalRegions.settings?.savePath ||
              globalRegions.settings?.rootPath ||
              '/',
            headers: {
              Prefer: 'return=representation',
              ...(etag ? { 'If-Match': etag } : {}),
              ...(options.headers || {}),
            },
          },
        ),
      });
    },
    [collection, dispatch, globalRegions, storedData],
  );

  useEffect(() => {
    if (permissionRefreshRequired) {
      Promise.resolve()
        .then(() => globalRegionsRef.current.fetch())
        .catch(() => {});
    }
  }, [permissionRefreshRequired]);

  useEffect(() => {
    globalRegionsRef.current.cancelEditing();
    Promise.resolve()
      .then(() => globalRegionsRef.current.fetch())
      .catch(() => {});
  }, [sessionUser, sessionVersion]);

  const canEdit = Boolean(token && canEditContent);
  const preserveEditing = canEdit;

  if (!preserveEditing || !editingRegion) {
    editingSnapshot.current = null;
  } else if (editingSnapshot.current?.region !== editingRegion) {
    editingSnapshot.current = {
      region: editingRegion,
      regions: globalRegions.regions,
      etag: globalRegions.etag,
    };
  }
  const snapshot = editingSnapshot.current;

  useEffect(() => {
    if (!preserveEditing && editingRegion) cancelEditing();
  }, [preserveEditing, cancelEditing, editingRegion]);

  const value = useMemo(() => {
    const source = {
      ...globalRegions,
      ...(snapshot
        ? {
            regions: snapshot.regions,
            etag: snapshot.etag,
          }
        : {}),
      save: (name, region, options = {}) =>
        saveNamedRegion(name, region, {
          ...(snapshot ? { etag: snapshot.etag } : {}),
          ...options,
        }),
      saveRegion: (name, region, options = {}) =>
        saveNamedRegion(name, region, {
          ...(snapshot ? { etag: snapshot.etag } : {}),
          ...options,
        }),
    };
    return restrictGlobalRegions(source, canEdit, preserveEditing);
  }, [canEdit, globalRegions, preserveEditing, saveNamedRegion, snapshot]);

  return (
    <GlobalRegionsContext.Provider value={value}>
      {children}
    </GlobalRegionsContext.Provider>
  );
}

export default function GlobalRegionsPermissions(props) {
  return (
    <GlobalRegionsProvider autoFetch={false}>
      <GlobalRegionsPermissionBoundary {...props} />
    </GlobalRegionsProvider>
  );
}
