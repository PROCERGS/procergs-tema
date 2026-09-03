import { defineMessages } from 'react-intl';

const messages = defineMessages({
  footer: {
    id: 'GovRS footer',
    defaultMessage: 'Rodapé GovRS',
  },
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  behavior: {
    id: 'Behavior',
    defaultMessage: 'Behavior',
  },
  allowOverlay: {
    id: 'Allow group overlay',
    defaultMessage: 'Permitir overlay do bloco Grupo',
  },
  description: {
    id: 'GovRS footer description',
    defaultMessage:
      'Este é o rodapé atual do site, exclusivo desta região. Links e créditos continuam vindo das fontes já usadas pelo tema.',
  },
});

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
