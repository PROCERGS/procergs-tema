export const getGridDividerVisibility = (rowTops, index) => {
  const top = rowTops[index];
  const sameRow = (other) =>
    typeof other === 'number' && Math.abs(top - other) < 1;

  return {
    vertical: index >= 0 && sameRow(rowTops[index + 1]),
    horizontal: index > 0 && !sameRow(rowTops[0]),
  };
};
