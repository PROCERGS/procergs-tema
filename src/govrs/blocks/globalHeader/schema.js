import { defineMessages } from 'react-intl';

const messages = defineMessages({
  header: {
    id: 'GovRS header',
    defaultMessage: 'Cabeçalho GovRS',
  },
  default: {
    id: 'Default',
    defaultMessage: 'Configuração',
  },
  appearance: {
    id: 'Appearance',
    defaultMessage: 'Aparência do Padrão 2',
  },
  variation: {
    id: 'Header variation',
    defaultMessage: 'Variação',
  },
  behavior: {
    id: 'Behavior',
    defaultMessage: 'Comportamento',
  },
  showLogo: {
    id: 'Show header logo',
    defaultMessage: 'Exibir logo',
  },
  showTitle: {
    id: 'Show header title',
    defaultMessage: 'Exibir título',
  },
  logoBackgroundColor: {
    id: 'Logo background color',
    defaultMessage: 'Cor de fundo do logo',
  },
  logoBackgroundOpacity: {
    id: 'Logo background opacity',
    defaultMessage: 'Opacidade do fundo do logo',
  },
  menuBackgroundColor: {
    id: 'Menu background color',
    defaultMessage: 'Cor de fundo do menu',
  },
  menuBackgroundOpacity: {
    id: 'Menu background opacity',
    defaultMessage: 'Opacidade do fundo do menu',
  },
  allowOverlay: {
    id: 'Allow group overlay',
    defaultMessage: 'Permitir overlay do bloco Grupo',
  },
  description: {
    id: 'GovRS header description',
    defaultMessage:
      'Este é o cabeçalho atual do site, exclusivo desta região. Logo, menu e busca continuam vindo das fontes já usadas pelo tema.',
  },
});

const HeaderBlockSchema = ({ intl, data }) => {
  const isDefault2 = data?.variation === 'default2';

  return {
    title: intl.formatMessage(messages.header),
    description: intl.formatMessage(messages.description),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.default),
        fields: isDefault2
          ? ['variation', 'showLogo']
          : ['variation', 'showLogo', 'showTitle'],
      },
      ...(isDefault2
        ? [
            {
              id: 'appearance',
              title: intl.formatMessage(messages.appearance),
              fields: [
                'logoBackgroundColor',
                'logoBackgroundOpacity',
                'menuBackgroundColor',
                'menuBackgroundOpacity',
              ],
            },
          ]
        : []),
      {
        id: 'behavior',
        title: intl.formatMessage(messages.behavior),
        fields: ['allowOverlay'],
      },
    ],
    properties: {
      variation: {
        title: intl.formatMessage(messages.variation),
        choices: [
          ['default', 'Padrão'],
          ['default2', 'Padrão 2'],
        ],
        default: 'default',
      },
      showLogo: {
        title: intl.formatMessage(messages.showLogo),
        description: 'Desmarque para retirar o logo do cabeçalho.',
        type: 'boolean',
        default: true,
      },
      showTitle: {
        title: intl.formatMessage(messages.showTitle),
        description: 'Desmarque para retirar o título do site do cabeçalho.',
        type: 'boolean',
        default: true,
      },
      logoBackgroundColor: {
        title: intl.formatMessage(messages.logoBackgroundColor),
        description: 'Escolha qualquer cor para a caixa do logo.',
        widget: 'color_input',
        default: '#ffffff',
      },
      logoBackgroundOpacity: {
        title: intl.formatMessage(messages.logoBackgroundOpacity),
        description: 'Use um valor entre 0 (transparente) e 1 (opaco).',
        type: 'number',
        minimum: 0,
        maximum: 1,
        default: 0.82,
      },
      menuBackgroundColor: {
        title: intl.formatMessage(messages.menuBackgroundColor),
        description: 'Escolha qualquer cor para a caixa do menu.',
        widget: 'color_input',
        default: '#172b36',
      },
      menuBackgroundOpacity: {
        title: intl.formatMessage(messages.menuBackgroundOpacity),
        description: 'Use um valor entre 0 (transparente) e 1 (opaco).',
        type: 'number',
        minimum: 0,
        maximum: 1,
        default: 0.78,
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
  };
};

export default HeaderBlockSchema;
