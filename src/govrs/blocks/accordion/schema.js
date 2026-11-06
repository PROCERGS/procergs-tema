import messages from './messages';

const panelItemSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.items),
  addMessage: intl.formatMessage(messages.addPanel),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.defaultTheme),
      fields: ['title', 'content', 'disabled'],
    },
  ],
  properties: {
    title: {
      title: intl.formatMessage(messages.panelTitle),
    },
    content: {
      title: intl.formatMessage(messages.panelContent),
      widget: 'textarea',
    },
    disabled: {
      title: intl.formatMessage(messages.disabled),
      type: 'boolean',
      default: false,
    },
  },
  required: ['title'],
});

export const AccordionBlockSchema = ({ data, intl }) => ({
  title: intl.formatMessage(messages.accordion),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.content),
      fields: ['headline', 'items'],
    },
    {
      id: 'behavior',
      title: intl.formatMessage(messages.behavior),
      fields: [
        'collapsed',
        'nonExclusive',
        'rightArrows',
        'filtering',
        ...(data?.filtering
          ? [
              'filterPlaceholder',
              'filterLabel',
              'clearFilterLabel',
              'noResultsMessage',
            ]
          : []),
      ],
    },
    {
      id: 'appearance',
      title: intl.formatMessage(messages.appearance),
      fields: ['theme', 'titleSize'],
    },
    {
      id: 'style',
      title: intl.formatMessage(messages.style),
      fields: ['align'],
    },
  ],
  properties: {
    headline: {
      title: intl.formatMessage(messages.headline),
    },
    items: {
      title: intl.formatMessage(messages.items),
      widget: 'object_list',
      schema: panelItemSchema({ intl }),
      default: [],
    },
    collapsed: {
      title: intl.formatMessage(messages.collapsed),
      type: 'boolean',
      default: true,
    },
    nonExclusive: {
      title: intl.formatMessage(messages.nonExclusive),
      type: 'boolean',
      default: true,
    },
    rightArrows: {
      title: intl.formatMessage(messages.rightArrows),
      type: 'boolean',
      default: true,
    },
    filtering: {
      title: intl.formatMessage(messages.filtering),
      type: 'boolean',
      default: false,
    },
    filterPlaceholder: {
      title: intl.formatMessage(messages.filterPlaceholder),
      default: intl.formatMessage(messages.filterPlaceholderDefault),
    },
    filterLabel: {
      title: intl.formatMessage(messages.filterLabel),
      default: intl.formatMessage(messages.filterLabelDefault),
    },
    clearFilterLabel: {
      title: intl.formatMessage(messages.clearFilterLabel),
      default: intl.formatMessage(messages.clearFilterLabelDefault),
    },
    noResultsMessage: {
      title: intl.formatMessage(messages.noResultsMessage),
      default: intl.formatMessage(messages.noResultsMessageDefault),
    },
    theme: {
      title: intl.formatMessage(messages.theme),
      choices: [
        ['default', intl.formatMessage(messages.defaultTheme)],
        ['dark', intl.formatMessage(messages.darkTheme)],
      ],
      default: 'default',
    },
    titleSize: {
      title: intl.formatMessage(messages.titleSize),
      choices: [
        ['h2', 'h2'],
        ['h3', 'h3'],
        ['h4', 'h4'],
        ['h5', 'h5'],
        ['h6', 'h6'],
      ],
      default: 'h3',
    },
    align: {
      title: intl.formatMessage(messages.alignment),
      widget: 'align',
      actions: ['left', 'center'],
    },
  },
  required: [],
});

export default AccordionBlockSchema;
