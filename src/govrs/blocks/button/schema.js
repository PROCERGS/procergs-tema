import { defineMessages } from 'react-intl';
import { DEFAULT_BUTTON_COLORS } from './normalizeButton';

const messages = defineMessages({
  button: {
    id: 'Procergs Button Block',
    defaultMessage: 'Botão',
  },
  content: {
    id: 'Content',
    defaultMessage: 'Conteúdo',
  },
  appearance: {
    id: 'Appearance',
    defaultMessage: 'Aparência',
  },
  title: {
    id: 'Procergs Button Label',
    defaultMessage: 'Texto do botão',
  },
  link: {
    id: 'Procergs Button Link',
    defaultMessage: 'Destino',
  },
  openLinkInNewTab: {
    id: 'Procergs Button Open in new tab',
    defaultMessage: 'Abrir em nova aba',
  },
  colors: {
    id: 'Procergs Button Colors',
    defaultMessage: 'Cores do botão e do texto',
  },
  alignment: {
    id: 'Procergs Button Alignment',
    defaultMessage: 'Alinhamento',
  },
});

export const ButtonBlockSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.button),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.content),
      fields: ['title', 'href', 'openLinkInNewTab'],
    },
    {
      id: 'appearance',
      title: intl.formatMessage(messages.appearance),
      fields: ['colorPair', 'buttonAlignment'],
    },
  ],
  properties: {
    title: {
      title: intl.formatMessage(messages.title),
    },
    href: {
      title: intl.formatMessage(messages.link),
      widget: 'object_browser',
      mode: 'link',
      allowExternals: true,
      selectedItemAttrs: ['@id', 'Title'],
    },
    openLinkInNewTab: {
      title: intl.formatMessage(messages.openLinkInNewTab),
      type: 'boolean',
      default: false,
    },
    colorPair: {
      title: intl.formatMessage(messages.colors),
      description:
        'Escolha um par GovRS ou aplique cores personalizadas com contraste adequado.',
      widget: 'color_contrast',
      default: DEFAULT_BUTTON_COLORS,
    },
    buttonAlignment: {
      title: intl.formatMessage(messages.alignment),
      choices: [
        ['left', 'Esquerda'],
        ['center', 'Centro'],
        ['right', 'Direita'],
      ],
      default: 'left',
    },
  },
  required: ['title', 'href'],
});

export default ButtonBlockSchema;
