import { defineMessages } from 'react-intl';

const messages = defineMessages({
  listing: {
    id: 'Listing',
    defaultMessage: 'Listing',
  },
  content: {
    id: 'Content',
    defaultMessage: 'Content',
  },
  appearance: {
    id: 'Appearance',
    defaultMessage: 'Appearance',
  },
  query: {
    id: 'Query',
    defaultMessage: 'Query',
  },
  headline: {
    id: 'Headline',
    defaultMessage: 'Headline',
  },
  headlineTag: {
    id: 'Headline level',
    defaultMessage: 'Headline level',
  },
  variant: {
    id: 'Variant',
    defaultMessage: 'Variant',
  },
  horizontal: {
    id: 'Horizontal layout',
    defaultMessage: 'Horizontal layout',
  },
  labeled: {
    id: 'Group items by label',
    defaultMessage: 'Group items by label',
  },
  collapsible: {
    id: 'Collapsible groups',
    defaultMessage: 'Collapsible groups',
  },
  mediaPreset: {
    id: 'Media preset',
    defaultMessage: 'Media preset',
  },
  groupBy: {
    id: 'Group by',
    defaultMessage: 'Group by',
  },
  numbered: {
    id: 'Numbered list',
    defaultMessage: 'Numbered list',
  },
  invert: {
    id: 'Invert meta and title',
    defaultMessage: 'Invert meta and title',
  },
  perRow: {
    id: 'Cards per row',
    defaultMessage: 'Cards per row',
  },
  cardVariant: {
    id: 'Card style',
    defaultMessage: 'Card style',
  },
  cardSize: {
    id: 'Card size',
    defaultMessage: 'Card size',
  },
  showCardAction: {
    id: 'Show card action link',
    defaultMessage: 'Show card action link',
  },
});

const DEFAULT_HEADLINE_LEVELS = [
  ['h2', 'h2'],
  ['h3', 'h3'],
];

const getAppearanceFields = (variant, data) => {
  switch (variant) {
    case 'link':
      return ['numbered', 'invert', 'mediaPreset'];
    case 'card':
      return ['perRow', 'cardVariant', 'cardSize', 'showCardAction'];
    default:
      return [
        'horizontal',
        'labeled',
        ...(data?.labeled ? ['collapsible', 'groupBy'] : []),
        'mediaPreset',
      ];
  }
};

export const ListingBlockSchema = ({ data = {}, intl }) => {
  const variant = data.variant || 'default';

  return {
    title: intl.formatMessage(messages.listing),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.content),
        fields: ['headline', 'headlineTag', 'querystring', 'variant'],
      },
      {
        id: 'appearance',
        title: intl.formatMessage(messages.appearance),
        fields: getAppearanceFields(variant, data),
      },
    ],
    properties: {
      headline: {
        title: intl.formatMessage(messages.headline),
      },
      headlineTag: {
        title: intl.formatMessage(messages.headlineTag),
        choices: DEFAULT_HEADLINE_LEVELS,
        default: 'h2',
        noValueOption: false,
      },
      querystring: {
        title: intl.formatMessage(messages.query),
        widget: 'querystring',
      },
      variant: {
        title: intl.formatMessage(messages.variant),
        choices: [
          ['default', 'Default'],
          ['link', 'Link'],
          ['card', 'Card'],
        ],
        default: 'default',
      },
      horizontal: {
        title: intl.formatMessage(messages.horizontal),
        type: 'boolean',
        default: false,
      },
      labeled: {
        title: intl.formatMessage(messages.labeled),
        type: 'boolean',
        default: false,
      },
      collapsible: {
        title: intl.formatMessage(messages.collapsible),
        type: 'boolean',
        default: true,
      },
      mediaPreset: {
        title: intl.formatMessage(messages.mediaPreset),
        choices:
          variant === 'link'
            ? [
                ['icons', 'Icons'],
                ['none', 'None'],
              ]
            : [
                ['mixed', 'Mixed'],
                ['images', 'Images'],
                ['icons', 'Icons'],
                ['none', 'None'],
              ],
        default: variant === 'link' ? 'none' : 'mixed',
      },
      groupBy: {
        title: intl.formatMessage(messages.groupBy),
        choices: [
          ['portal_type', 'Content type'],
          ['none', 'None'],
        ],
        default: 'portal_type',
      },
      numbered: {
        title: intl.formatMessage(messages.numbered),
        type: 'boolean',
        default: false,
      },
      invert: {
        title: intl.formatMessage(messages.invert),
        type: 'boolean',
        default: false,
      },
      perRow: {
        title: intl.formatMessage(messages.perRow),
        type: 'number',
        default: 3,
      },
      cardVariant: {
        title: intl.formatMessage(messages.cardVariant),
        choices: [
          ['post', 'Post'],
          ['list', 'List'],
          ['news', 'News'],
          ['icon', 'Icon'],
        ],
        default: 'news',
      },
      cardSize: {
        title: intl.formatMessage(messages.cardSize),
        choices: [
          ['small', 'Small'],
          ['large', 'Large'],
        ],
        default: 'small',
      },
      showCardAction: {
        title: intl.formatMessage(messages.showCardAction),
        type: 'boolean',
        default: true,
      },
    },
    required: [],
  };
};

export default ListingBlockSchema;
