export const GRID_IMAGE_ALIGNMENTS = ['left', 'right', 'center'];

const restrictGridImageAlignment = ({ schema }) => {
  if (schema.properties?.align) {
    schema.properties.align = {
      ...schema.properties.align,
      actions: GRID_IMAGE_ALIGNMENTS,
    };
  }

  return schema;
};

export default restrictGridImageAlignment;
