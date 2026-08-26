import { defineMessages } from 'react-intl';
import { getAppearanceFields } from './getAppearanceFields';

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
  showTags: {
    id: 'Show tags',
    defaultMessage: 'Exibir tags',
  },
  tagsLimit: {
    id: 'Number of tags',
    defaultMessage: 'Quantidade de tags',
  },
  cardOverflow: {
    id: 'Card overflow',
    defaultMessage: 'Quando os cards não cabem',
  },
  cardOverflowWrap: {
    id: 'Wrap to next row',
    defaultMessage: 'Quebrar linha',
  },
  cardOverflowScroll: {
    id: 'Horizontal scroll',
    defaultMessage: 'Rolagem horizontal',
  },
});

const DEFAULT_HEADLINE_LEVELS = [
  ['h2', 'h2'],
  ['h3', 'h3'],
];

export const ListingBlockSchema = ({ data = {}, intl }) => {
  const variation = data.variation || 'default';
  const appearanceFields = getAppearanceFields(variation, data);

  return {
    title: intl.formatMessage(messages.listing),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.content),
        fields: ['headline', 'headlineTag', 'querystring'],
      },
      ...(appearanceFields.length > 0
        ? [
            {
              id: 'appearance',
              title: intl.formatMessage(messages.appearance),
              fields: appearanceFields,
            },
          ]
        : []),
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
          variation === 'link'
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
        default: variation === 'link' ? 'none' : 'mixed',
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
      cardOverflow: {
        title: intl.formatMessage(messages.cardOverflow),
        choices: [
          ['wrap', intl.formatMessage(messages.cardOverflowWrap)],
          ['scroll', intl.formatMessage(messages.cardOverflowScroll)],
        ],
        default: 'wrap',
        noValueOption: false,
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
      showTags: {
        title: intl.formatMessage(messages.showTags),
        type: 'boolean',
        default: false,
      },
      tagsLimit: {
        title: intl.formatMessage(messages.tagsLimit),
        choices: [
          ['1', '1'],
          ['2', '2'],
          ['3', '3'],
        ],
        default: '3',
        noValueOption: false,
      },
    },
    required: [],
  };
};

export default ListingBlockSchema;
