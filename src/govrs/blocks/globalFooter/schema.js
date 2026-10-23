import messages from './messages';

const FooterBlockSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.footer),
  description: intl.formatMessage(messages.description),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.default),
      fields: [],
    },
    {
      id: 'behavior',
      title: intl.formatMessage(messages.behavior),
      fields: ['allowOverlay'],
    },
  ],
  properties: {
    allowOverlay: {
      title: intl.formatMessage(messages.allowOverlay),
      description:
        'Quando habilitado, o fundo do último Grupo da página pode aparecer sob este bloco.',
      type: 'boolean',
      default: true,
    },
  },
  required: [],
});

export default FooterBlockSchema;
