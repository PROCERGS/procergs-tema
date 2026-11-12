import messages from './messages';
import {
  DEFAULT_BUTTON_COLORS,
  DEFAULT_BUTTON_HOVER_COLORS,
} from './normalizeButton';

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
        'Escolha as cores. Em opacidade, 0% é transparente e 100% é sólido.',
      widget: 'color_contrast',
      default: { ...DEFAULT_BUTTON_COLORS },
      showBorder: true,
      showOpacity: true,
      legacyBorderColor: data?.borderColor,
    },
    hoverColorPair: {
      title: intl.formatMessage(messages.hoverColors),
      description: 'Defina como o botão aparece ao passar o ponteiro.',
      widget: 'color_contrast',
      default: { ...DEFAULT_BUTTON_HOVER_COLORS },
      showBorder: true,
      showOpacity: true,
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
