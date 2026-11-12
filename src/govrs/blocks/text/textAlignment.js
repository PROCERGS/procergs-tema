export const TEXT_ALIGNMENTS = ['left', 'center', 'right'];
export const DEFAULT_TEXT_ALIGNMENT = 'left';

export const normalizeTextAlignment = (alignment) =>
  TEXT_ALIGNMENTS.includes(alignment) ? alignment : DEFAULT_TEXT_ALIGNMENT;
