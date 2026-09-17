export function getCurrentContentEditPermission(state, userId) {
  if (!state.userSession?.token) return false;
  const requests = [state.actions, state.content?.get];
  if (
    requests.some((request) => {
      const status = request?.error?.status ?? request?.error?.response?.status;
      return [401, 403].includes(status);
    })
  )
    return false;
  if (
    requests.some(
      (request) => !request?.loaded || request.loading || request.error,
    )
  )
    return null;
  const lock = state.content?.data?.lock;
  const unlockRequired =
    lock?.locked && lock?.stealable && lock?.creator !== userId;

  return Boolean(
    state.userSession?.token &&
      state.actions?.loaded &&
      !state.actions.loading &&
      !state.actions.error &&
      state.content?.get?.loaded &&
      !state.content.get.loading &&
      !state.content.get.error &&
      !unlockRequired &&
      state.actions.actions?.object?.some((action) => action.id === 'edit'),
  );
}

export default function canEditCurrentContent(state, userId) {
  return Boolean(getCurrentContentEditPermission(state, userId));
}
