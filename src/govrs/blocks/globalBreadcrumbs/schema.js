import { defineMessages } from 'react-intl';

const messages = defineMessages({
  breadcrumbs: {
    id: 'GovRS breadcrumbs',
    defaultMessage: 'Breadcrumbs GovRS',
  },
  default: {
    id: 'Default',
    defaultMessage: 'Configuração',
  },
  showHome: {
    id: 'Show breadcrumbs home',
    defaultMessage: 'Exibir página inicial',
  },
  homeLabel: {
    id: 'Breadcrumbs home label',
    defaultMessage: 'Rótulo acessível da página inicial',
  },
  ariaLabel: {
    id: 'Breadcrumbs aria label',
    defaultMessage: 'Rótulo acessível da navegação',
  },
  behavior: {
    id: 'Behavior',
    defaultMessage: 'Comportamento',
  },
  allowOverlay: {
    id: 'Allow group overlay',
    defaultMessage: 'Permitir overlay do bloco Grupo',
  },
  description: {
    id: 'GovRS breadcrumbs description',
    defaultMessage:
      'Os itens são preenchidos automaticamente a partir da navegação estrutural da página atual.',
  },
});

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
