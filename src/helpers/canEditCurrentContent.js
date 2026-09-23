export function getCurrentContentEditPermission(state, userId) {
  if (!state.userSession?.token) return false;
  const lock = state.content?.data?.lock;
  const unlockRequired =
    lock?.locked && lock?.stealable && lock?.creator !== userId;

  return Boolean(
    state.userSession?.token &&
    !unlockRequired &&
    state.actions?.actions?.object?.some((action) => action.id === 'edit'),
  );
}

export default function canEditCurrentContent(state, userId) {
  return Boolean(getCurrentContentEditPermission(state, userId));
}
