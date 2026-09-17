export const normalizeDivisor = (data = {}) => {
  const thickness = Number(data.thickness);

  return {
    variant: data.variant === 'dashed' ? 'dashed' : 'default',
    thickness: [1, 2, 4].includes(thickness) ? thickness : 1,
    orientation: data.orientation === 'vertical' ? 'vertical' : 'horizontal',
  };
};

export default normalizeDivisor;
