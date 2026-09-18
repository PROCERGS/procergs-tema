import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  GlobalRegionsContext,
  GlobalRegionsProvider,
  useGlobalRegions,
} from 'volto-global-regions';

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
  const globalRegions = useGlobalRegions();
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
    const source = snapshot
      ? {
          ...globalRegions,
          regions: snapshot.regions,
          etag: snapshot.etag,
          save: (name, region, options = {}) =>
            globalRegions.save(name, region, {
              etag: snapshot.etag,
              ...options,
            }),
          saveRegion: (name, region, options = {}) =>
            globalRegions.saveRegion(name, region, {
              etag: snapshot.etag,
              ...options,
            }),
        }
      : globalRegions;
    return restrictGlobalRegions(source, canEdit, preserveEditing);
  }, [canEdit, globalRegions, preserveEditing, snapshot]);

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
