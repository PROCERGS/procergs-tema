import messages from './messages';
import { getAppearanceFields } from './getAppearanceFields';
import { getGridColumnCount, getGridListingMaxPerRow } from './gridRules';

const DEFAULT_HEADLINE_LEVELS = [
  ['h2', 'h2'],
  ['h3', 'h3'],
];

export const ListingBlockSchema = ({
  data = {},
  intl,
  gridColumns: gridColumnsProp,
}) => {
  const variation = data.variation || 'default';
  const appearanceFields = getAppearanceFields(variation, data);
  const gridColumns = getGridColumnCount(gridColumnsProp);
  const isInGrid = Boolean(gridColumns);
  const maxPerRow = getGridListingMaxPerRow({
    variation,
    cardSize: data.cardSize,
    gridColumns,
  });
  const forceMediaAbove = variation === 'default' && gridColumns > 2;

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
        widget: 'listing_querystring',
        isFileListing: variation === 'file',
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
                ['icons', intl.formatMessage(messages.mediaPresetIcons)],
                ['none', intl.formatMessage(messages.mediaPresetNone)],
              ]
            : [
                ['mixed', intl.formatMessage(messages.mediaPresetMixed)],
                ['images', intl.formatMessage(messages.mediaPresetImages)],
                ['icons', intl.formatMessage(messages.mediaPresetIcons)],
                ['none', intl.formatMessage(messages.mediaPresetNone)],
              ],
        default: variation === 'link' ? 'none' : 'mixed',
      },
      mediaPosition: {
        title: intl.formatMessage(messages.mediaPosition),
        description: intl.formatMessage(
          forceMediaAbove
            ? messages.mediaPositionGridDescription
            : messages.mediaPositionDescription,
        ),
        choices: forceMediaAbove
          ? [['above', intl.formatMessage(messages.mediaPositionAbove)]]
          : [
              ['left', intl.formatMessage(messages.mediaPositionLeft)],
              ['above', intl.formatMessage(messages.mediaPositionAbove)],
            ],
        default: forceMediaAbove ? 'above' : 'left',
        noValueOption: false,
      },
      groupBy: {
        title: intl.formatMessage(messages.groupBy),
        choices: [
          ['subject', intl.formatMessage(messages.groupBySubject)],
          ['portal_type', intl.formatMessage(messages.groupByPortalType)],
        ],
        default: 'subject',
        noValueOption: false,
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
        title:
          variation === 'card'
            ? intl.formatMessage(messages.perRow)
            : intl.formatMessage(messages.itemsPerRow),
        type: 'number',
        default: 3,
        minimum: 1,
        ...(maxPerRow ? { maximum: maxPerRow } : {}),
        ...(isInGrid
          ? {
              description: intl.formatMessage(messages.perRowGridDescription),
            }
          : {}),
      },
      cardOverflow: {
        title: intl.formatMessage(messages.cardOverflow),
        description: isInGrid
          ? intl.formatMessage(messages.cardOverflowGridDescription)
          : undefined,
        choices: isInGrid
          ? [['wrap', intl.formatMessage(messages.cardOverflowWrap)]]
          : [
              ['wrap', intl.formatMessage(messages.cardOverflowWrap)],
              ['scroll', intl.formatMessage(messages.cardOverflowScroll)],
            ],
        default: 'wrap',
        noValueOption: false,
      },
      cardVariant: {
        title: intl.formatMessage(messages.cardVariant),
        choices: [
          ['post', intl.formatMessage(messages.post)],
          ['list', intl.formatMessage(messages.list)],
          ['news', intl.formatMessage(messages.news)],
          ['icon', intl.formatMessage(messages.icon)],
        ],
        default: 'news',
      },
      cardSize: {
        title: intl.formatMessage(messages.cardSize),
        choices: [
          ['small', intl.formatMessage(messages.small)],
          ['large', intl.formatMessage(messages.large)],
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
