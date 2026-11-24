module.exports = (api) => {
  const extracting = api.env('i18n');

  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],
    plugins: extracting
      ? [['react-intl', { messagesDir: './build/messages/' }]]
      : [],
  };
};
