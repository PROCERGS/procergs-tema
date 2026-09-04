import { defineMessages } from 'react-intl';
import {
  DEFAULT_BUTTON_COLORS,
  DEFAULT_BUTTON_HOVER_COLORS,
} from './normalizeButton';

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
  hover: {
    id: 'Hover',
    defaultMessage: 'Hover',
  },
  iconSection: {
    id: 'Procergs Button Icon Section',
    defaultMessage: 'Ícone',
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
  hoverColors: {
    id: 'Procergs Button Hover Colors',
    defaultMessage: 'Cores do botão no hover',
  },
  icon: {
    id: 'Procergs Button Icon',
    defaultMessage: 'Ícone (SVG recomendado)',
  },
  iconPosition: {
    id: 'Procergs Button Icon Position',
    defaultMessage: 'Posição do ícone',
  },
  alignment: {
    id: 'Procergs Button Alignment',
    defaultMessage: 'Alinhamento',
  },
});

export const ButtonBlockSchema = ({ intl, data }) => ({
  title: intl.formatMessage(messages.button),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.content),
      fields: ['title', 'href', 'openLinkInNewTab'],
    },
    {
      id: 'alignment',
      title: intl.formatMessage(messages.alignment),
      fields: ['buttonAlignment'],
    },
    {
      id: 'appearance',
      title: intl.formatMessage(messages.appearance),
      fields: ['colorPair'],
    },
    {
      id: 'hover',
      title: intl.formatMessage(messages.hover),
      fields: ['hoverColorPair'],
    },
    {
      id: 'icon',
      title: intl.formatMessage(messages.iconSection),
      fields: ['icon', 'iconPosition'],
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
      showBorder: true,
      legacyBorderColor: data?.borderColor,
    },
    hoverColorPair: {
      title: intl.formatMessage(messages.hoverColors),
      description:
        'Redefina as cores exibidas quando o ponteiro estiver sobre o botão.',
      widget: 'color_contrast',
      default: DEFAULT_BUTTON_HOVER_COLORS,
      showBorder: true,
      legacyBorderColor: data?.hoverBorderColor,
    },
    icon: {
      title: intl.formatMessage(messages.icon),
      widget: 'button_icon',
      imageSize: 'mini',
    },
    iconPosition: {
      title: intl.formatMessage(messages.iconPosition),
      choices: [
        ['top', 'Acima do texto'],
        ['left', 'À esquerda do texto'],
        ['right', 'À direita do texto'],
        ['bottom', 'Abaixo do texto'],
      ],
      default: 'left',
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
