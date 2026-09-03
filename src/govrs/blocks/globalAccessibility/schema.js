import { defineMessages } from 'react-intl';

const messages = defineMessages({
  accessibilityBar: {
    id: 'GovRS accessibility bar',
    defaultMessage: 'Barra de Acessibilidade',
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
    id: 'GovRS accessibility bar description',
    defaultMessage:
      'Barra com atalhos de conteúdo, menu, busca, contraste e mapa do site.',
  },
  allowOverlay: {
    id: 'Allow group overlay',
    defaultMessage: 'Permitir overlay do bloco Grupo',
  },
});

const AccessibilityBarBlockSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.accessibilityBar),
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

export default AccessibilityBarBlockSchema;
