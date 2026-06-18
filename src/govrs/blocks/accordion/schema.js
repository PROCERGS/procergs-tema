import { defineMessages } from 'react-intl';

const messages = defineMessages({
  accordion: {
    id: 'Accordion',
    defaultMessage: 'Accordion',
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
  style: {
    id: 'Style',
    defaultMessage: 'Style',
  },
  headline: {
    id: 'Headline',
    defaultMessage: 'Headline',
  },
  items: {
    id: 'Panels',
    defaultMessage: 'Panels',
  },
  addPanel: {
    id: 'Add panel',
    defaultMessage: 'Add panel',
  },
  panelTitle: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  panelContent: {
    id: 'Content',
    defaultMessage: 'Content',
  },
  disabled: {
    id: 'Disabled',
    defaultMessage: 'Disabled',
  },
  collapsed: {
    id: 'Collapsed by default',
    defaultMessage: 'Collapsed by default',
  },
  nonExclusive: {
    id: 'Allow multiple open panels',
    defaultMessage: 'Allow multiple open panels',
  },
  rightArrows: {
    id: 'Arrows on the right',
    defaultMessage: 'Arrows on the right',
  },
  filtering: {
    id: 'Enable panel filter',
    defaultMessage: 'Enable panel filter',
  },
  filterPlaceholder: {
    id: 'Filter placeholder',
    defaultMessage: 'Filter placeholder',
  },
  filterLabel: {
    id: 'Filter label',
    defaultMessage: 'Filter label',
  },
  clearFilterLabel: {
    id: 'Clear filter label',
    defaultMessage: 'Clear filter label',
  },
  noResultsMessage: {
    id: 'No results message',
    defaultMessage: 'No results message',
  },
  theme: {
    id: 'Theme',
    defaultMessage: 'Theme',
  },
  titleSize: {
    id: 'Title size',
    defaultMessage: 'Title size',
  },
  alignment: {
    id: 'Alignment',
    defaultMessage: 'Alignment',
  },
});

const panelItemSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.items),
  addMessage: intl.formatMessage(messages.addPanel),
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
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
      default: 'Digite para filtrar...',
    },
    filterLabel: {
      title: intl.formatMessage(messages.filterLabel),
      default: 'Filtrar painéis do accordion',
    },
    clearFilterLabel: {
      title: intl.formatMessage(messages.clearFilterLabel),
      default: 'Limpar filtro',
    },
    noResultsMessage: {
      title: intl.formatMessage(messages.noResultsMessage),
      default: 'Nenhum painel corresponde ao filtro informado.',
    },
    theme: {
      title: intl.formatMessage(messages.theme),
      choices: [
        ['default', 'Default'],
        ['dark', 'Dark'],
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
