const configureSettings = (config) => {
  config.settings.navDepth = 2;

  config.settings.apiExpanders = [
    ...(config.settings.apiExpanders || []),
    {
      match: '',
      GET_CONTENT: ['inherit'],
      querystring: {
        'expand.inherit.behaviors':
          'procergs.sitebase.header,voltolighttheme.header',
      },
    },
  ];

  config.settings.procergsFooter = {
    navigationLabel: 'Rodapé principal',
    asidePosition: 'after',
    socialLinks: {},
    license: '',
    children: null,
  };

  return config;
};

export default configureSettings;
