import { defineMessages } from 'react-intl';
import { addStyling } from '@plone/volto/helpers/Extensions/withBlockSchemaEnhancer';

const messages = defineMessages({
  buttonBlock: {
    id: 'Procergs Button Block',
    defaultMessage: 'Botão',
  },
  buttonTitle: {
    id: 'Procergs Button Title',
    defaultMessage: 'Texto do botao',
  },
  buttonLink: {
    id: 'Procergs Button Link',
    defaultMessage: 'Link',
  },
  openLinkInNewTab: {
    id: 'Procergs Open in new tab',
    defaultMessage: 'Abrir em nova aba',
  },
  buttonVariant: {
    id: 'Procergs Button Variant',
    defaultMessage: 'Variante',
  },
  buttonSize: {
    id: 'Procergs Button Size',
    defaultMessage: 'Tamanho',
  },
  buttonAlignment: {
    id: 'Procergs Button Alignment',
    defaultMessage: 'Alinhamento',
  },
});

export const ButtonSchema = (props) => {
  const { intl } = props;

  const schema = {
    title: intl.formatMessage(messages.buttonBlock),
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'title',
          'href',
          'openLinkInNewTab',
          'buttonAlignment',
          'buttonVariant',
          'buttonSize',
        ],
      },
    ],
    properties: {
      title: {
        title: intl.formatMessage(messages.buttonTitle),
      },
      href: {
        title: intl.formatMessage(messages.buttonLink),
        widget: 'object_browser',
        mode: 'link',
        selectedItemAttrs: ['Title', 'Description', 'hasPreviewImage'],
        allowExternals: true,
      },
      openLinkInNewTab: {
        title: intl.formatMessage(messages.openLinkInNewTab),
        type: 'boolean',
      },
      buttonVariant: {
        title: intl.formatMessage(messages.buttonVariant),
        choices: [
          ['primary', 'Primary'],
          ['secondary', 'Secondary'],
          ['tertiary', 'Tertiary'],
        ],
        default: 'primary',
      },
      buttonAlignment: {
        title: intl.formatMessage(messages.buttonAlignment),
        choices: [
          ['left', 'Esquerda'],
          ['center', 'Centro'],
          ['right', 'Direita'],
          ['full', 'Largura total'],
        ],
        default: 'left',
      },
      buttonSize: {
        title: intl.formatMessage(messages.buttonSize),
        choices: [
          ['small', 'Small'],
          ['medium', 'Medium'],
          ['large', 'Large'],
        ],
        default: 'medium',
      },
    },
    required: [],
  };

  addStyling({ schema, intl });

  return schema;
};
