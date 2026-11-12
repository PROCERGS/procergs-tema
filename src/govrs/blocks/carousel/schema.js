import messages from './messages';

export const CarouselBlockSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.carousel),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.content),
      fields: ['href', 'linkToContent', 'sort_on', 'sort_order'],
    },
    {
      id: 'behavior',
      title: intl.formatMessage(messages.behavior),
      fields: [
        'autoplay',
        'autoplaySpeed',
        'circular',
        'enableSwipe',
        'noArrowsMobile',
      ],
    },
    {
      id: 'appearance',
      title: intl.formatMessage(messages.appearance),
      fields: ['indicators'],
    },
  ],
  properties: {
    href: {
      title: intl.formatMessage(messages.target),
      description: intl.formatMessage(messages.targetDescription),
      widget: 'object_browser',
      mode: 'link',
      selectedItemAttrs: [
        'Title',
        'Description',
        'hasPreviewImage',
        'image_field',
        'image_scales',
        '@type',
        'is_folderish',
      ],
      allowExternals: false,
    },
    linkToContent: {
      title: intl.formatMessage(messages.linkToContent),
      description: intl.formatMessage(messages.linkToContentDescription),
      type: 'boolean',
      default: false,
    },
    sort_on: {
      title: intl.formatMessage(messages.sortOn),
      choices: [
        ['getObjPositionInParent', intl.formatMessage(messages.sortPosition)],
        ['effective', intl.formatMessage(messages.sortEffective)],
        ['sortable_title', intl.formatMessage(messages.sortTitle)],
        ['modified', intl.formatMessage(messages.sortModified)],
      ],
      default: 'getObjPositionInParent',
    },
    sort_order: {
      title: intl.formatMessage(messages.sortOrder),
      choices: [
        ['ascending', intl.formatMessage(messages.ascending)],
        ['descending', intl.formatMessage(messages.descending)],
      ],
      default: 'ascending',
    },
    autoplay: {
      title: intl.formatMessage(messages.autoplay),
      type: 'boolean',
      default: true,
    },
    autoplaySpeed: {
      title: intl.formatMessage(messages.autoplaySpeed),
      type: 'number',
      default: 3000,
    },
    circular: {
      title: intl.formatMessage(messages.circular),
      type: 'boolean',
      default: true,
    },
    enableSwipe: {
      title: intl.formatMessage(messages.enableSwipe),
      type: 'boolean',
      default: true,
    },
    noArrowsMobile: {
      title: intl.formatMessage(messages.noArrowsMobile),
      type: 'boolean',
      default: true,
    },
    indicators: {
      title: intl.formatMessage(messages.indicators),
      choices: [
        ['default', intl.formatMessage(messages.defaultIndicators)],
        ['inside', intl.formatMessage(messages.insideIndicators)],
        ['numbers', intl.formatMessage(messages.numbersIndicators)],
      ],
      default: 'default',
    },
  },
  required: ['href'],
});

export default CarouselBlockSchema;
