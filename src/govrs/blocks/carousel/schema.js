import { defineMessages } from 'react-intl';

const messages = defineMessages({
  carousel: {
    id: 'Carousel',
    defaultMessage: 'Carousel',
  },
  content: {
    id: 'Content',
    defaultMessage: 'Content',
  },
  behavior: {
    id: 'Behavior',
    defaultMessage: 'Behavior',
  },
  appearance: {
    id: 'Appearance',
    defaultMessage: 'Appearance',
  },
  target: {
    id: 'Target',
    defaultMessage: 'Target',
  },
  targetDescription: {
    id: 'Folder whose first 5 pages or news items will be shown in the carousel',
    defaultMessage:
      'Folder whose first 5 pages or news items will be shown in the carousel (images and files are ignored)',
  },
  sortOn: {
    id: 'Sort on',
    defaultMessage: 'Sort on',
  },
  sortOrder: {
    id: 'Sort order',
    defaultMessage: 'Sort order',
  },
  sortPosition: {
    id: 'Position in folder',
    defaultMessage: 'Position in folder',
  },
  sortEffective: {
    id: 'Publication date',
    defaultMessage: 'Publication date',
  },
  sortTitle: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  sortModified: {
    id: 'Last modified',
    defaultMessage: 'Last modified',
  },
  ascending: {
    id: 'Ascending',
    defaultMessage: 'Ascending',
  },
  descending: {
    id: 'Descending',
    defaultMessage: 'Descending',
  },
  autoplay: {
    id: 'Autoplay',
    defaultMessage: 'Autoplay',
  },
  autoplaySpeed: {
    id: 'Autoplay speed (ms)',
    defaultMessage: 'Autoplay speed (ms)',
  },
  circular: {
    id: 'Circular',
    defaultMessage: 'Circular',
  },
  enableSwipe: {
    id: 'Enable swipe',
    defaultMessage: 'Enable swipe',
  },
  noArrowsMobile: {
    id: 'Hide arrows on mobile',
    defaultMessage: 'Hide arrows on mobile',
  },
  indicators: {
    id: 'Indicators',
    defaultMessage: 'Indicators',
  },
  linkToContent: {
    id: 'Link slides to content pages',
    defaultMessage: 'Link slides to content pages',
  },
  linkToContentDescription: {
    id: 'When enabled, each slide links to its corresponding page or news item',
    defaultMessage:
      'When enabled, each slide links to its corresponding page or news item',
  },
});

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
        ['default', 'Default'],
        ['inside', 'Inside'],
        ['numbers', 'Numbers'],
      ],
      default: 'default',
    },
  },
  required: ['href'],
});

export default CarouselBlockSchema;
