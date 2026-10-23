import messages from './messages';

export const BannerBlockSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.banner),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.content),
      fields: ['image', 'imageAlt', 'link'],
    },
    {
      id: 'appearance',
      title: intl.formatMessage(messages.appearance),
      fields: ['type'],
    },
    {
      id: 'style',
      title: intl.formatMessage(messages.style),
      fields: ['align'],
    },
  ],
  properties: {
    image: {
      title: intl.formatMessage(messages.image),
      widget: 'image',
    },
    imageAlt: {
      title: intl.formatMessage(messages.imageAlt),
      description: intl.formatMessage(messages.imageAltDescription),
    },
    link: {
      title: intl.formatMessage(messages.link),
      description: intl.formatMessage(messages.linkDescription),
      widget: 'url',
    },
    type: {
      title: intl.formatMessage(messages.bannerType),
      choices: [
        ['default', intl.formatMessage(messages.defaultType)],
        ['quadrado', intl.formatMessage(messages.squareType)],
        ['variant4', intl.formatMessage(messages.variant4Type)],
      ],
      default: 'default',
    },
    align: {
      title: intl.formatMessage(messages.alignment),
      widget: 'align',
      actions: ['left', 'center', 'full'],
    },
  },
  required: ['image'],
});

export default BannerBlockSchema;
