import { defineMessages } from 'react-intl';

const messages = defineMessages({
  stateBar: {
    id: 'GovRS state bar',
    defaultMessage: 'Barra do Estado',
  },
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  behavior: {
    id: 'Behavior',
    defaultMessage: 'Comportamento',
  },
  description: {
    id: 'GovRS state bar description',
    defaultMessage:
      'Barra Standalone oficial do Governo do Estado do Rio Grande do Sul.',
  },
  allowOverlay: {
    id: 'Allow group overlay',
    defaultMessage: 'Permitir overlay do bloco Grupo',
  },
});

const StateBarBlockSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.stateBar),
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
        'Quando habilitado, o fundo do primeiro Grupo da página pode aparecer sob este bloco.',
      type: 'boolean',
      default: true,
    },
  },
  required: [],
});

export default StateBarBlockSchema;
