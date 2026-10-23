import messages from './messages';

const BreadcrumbsBlockSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.breadcrumbs),
  description: intl.formatMessage(messages.description),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.default),
      fields: ['showHome', 'homeLabel', 'ariaLabel'],
    },
    {
      id: 'behavior',
      title: intl.formatMessage(messages.behavior),
      fields: ['allowOverlay'],
    },
  ],
  properties: {
    showHome: {
      title: intl.formatMessage(messages.showHome),
      type: 'boolean',
      default: true,
    },
    homeLabel: {
      title: intl.formatMessage(messages.homeLabel),
      default: 'Página inicial',
    },
    ariaLabel: {
      title: intl.formatMessage(messages.ariaLabel),
      default: 'Migalhas de pão',
    },
    allowOverlay: {
      title: intl.formatMessage(messages.allowOverlay),
      description:
        'Quando habilitado, o fundo do primeiro Grupo da página pode aparecer sob este bloco.',
      type: 'boolean',
      default: true,
    },
  },
  required: [],
});

export default BreadcrumbsBlockSchema;
