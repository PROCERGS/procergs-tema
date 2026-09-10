import { getListingVariation } from './getListingVariation';

const IMAGE_GALLERY_VARIATION = 'imageGallery';
const SUMMARY_VARIATION = 'summary';

export const getGridColumnCount = (gridColumns) => {
  const value = Number(gridColumns);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : null;
};

export const getGridListingMaxPerRow = ({
  variation,
  cardSize,
  gridColumns,
}) => {
  const columns = getGridColumnCount(gridColumns);
  if (!columns) return null;

  if (variation === 'card' && cardSize === 'large') {
    return 1;
  }

  if (!['default', 'card'].includes(variation)) {
    return null;
  }

  if (columns === 1) return 3;
  if (columns === 2) return 2;
  return 1;
};

export const getGridListingVariations = (variations = [], gridColumns) => {
  const columns = getGridColumnCount(gridColumns);
  return columns && columns >= 4
    ? (variations || []).filter(({ id }) => id !== IMAGE_GALLERY_VARIATION)
    : variations || [];
};

export const normalizeListingForGrid = (data = {}, gridColumns) => {
  const columns = getGridColumnCount(gridColumns);
  if (!columns) return data;

  const variation = getListingVariation(data);
  let normalized = data;
  const setValue = (key, value) => {
    if (normalized[key] === value) return;

    if (normalized === data) {
      normalized = { ...data };
    }

    normalized[key] = value;
  };

  if (
    variation === 'default' &&
    !data.horizontal &&
    columns > 2 &&
    data.mediaPosition !== 'above'
  ) {
    setValue('mediaPosition', 'above');
  }

  if (variation === 'card') {
    setValue('cardOverflow', 'wrap');
  }

  if ((variation === 'default' && data.horizontal) || variation === 'card') {
    const maximum = getGridListingMaxPerRow({
      variation,
      cardSize: data.cardSize,
      gridColumns: columns,
    });
    const configured = Math.max(1, Number(data.perRow) || 3);
    setValue('perRow', Math.min(configured, maximum));
  }

  if (variation === IMAGE_GALLERY_VARIATION && columns >= 4) {
    setValue('variation', SUMMARY_VARIATION);
  }

  return normalized;
};
