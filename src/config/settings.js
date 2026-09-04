const configureSettings = (config) => {
  config.settings.navDepth = 2;

  const apiExpanders = (config.settings.apiExpanders || []).map((expander) => ({
    ...expander,
    ...(Array.isArray(expander.GET_CONTENT)
      ? {
          GET_CONTENT: expander.GET_CONTENT.filter(
            (component) => component !== 'actions',
          ),
        }
      : {}),
  }));

  config.settings.apiExpanders = [
    ...apiExpanders,
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

  config.settings.procergsSection = {
    maxLength: 50,
    allowedBlocks: [
      'slate',
      'image',
      'teaser',
      'listing',
      'banner',
      'carousel',
      'maps',
      'accordion',
      'slateTable',
      'gridBlock',
      'procergsButton',
    ],
  };

  return config;
};

export default configureSettings;
