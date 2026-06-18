import { defineMessages } from 'react-intl';

const messages = defineMessages({
  banner: {
    id: 'Banner',
    defaultMessage: 'Banner',
  },
  content: {
    id: 'Content',
    defaultMessage: 'Content',
  },
  appearance: {
    id: 'Appearance',
    defaultMessage: 'Appearance',
  },
  style: {
    id: 'Style',
    defaultMessage: 'Style',
  },
  image: {
    id: 'Image',
    defaultMessage: 'Image',
  },
  imageAlt: {
    id: 'Image alt text',
    defaultMessage: 'Image alt text',
  },
  imageAltDescription: {
    id: 'Accessible description for the banner image',
    defaultMessage: 'Accessible description for the banner image',
  },
  link: {
    id: 'Link',
    defaultMessage: 'Link',
  },
  linkDescription: {
    id: 'Absolute URL to open when the banner is clicked',
    defaultMessage: 'Absolute URL to open when the banner is clicked',
  },
  bannerType: {
    id: 'Banner type',
    defaultMessage: 'Banner type',
  },
  alignment: {
    id: 'Alignment',
    defaultMessage: 'Alignment',
  },
});

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
        ['default', 'Default'],
        ['quadrado', 'Square'],
        ['variant4', 'Variant 4'],
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
