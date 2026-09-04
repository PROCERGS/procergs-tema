const configureButtonBlock = (config) => {
  const existing = config.blocks.blocksConfig.__button;

  if (!existing) {
    return config;
  }

  config.blocks.blocksConfig.__button = {
    ...existing,
    title: 'Botão',
    group: 'common',
    category: 'action',
    mostUsed: true,
  };

  return config;
};

export default configureButtonBlock;
