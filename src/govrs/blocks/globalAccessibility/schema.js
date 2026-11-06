import messages from './messages';

const AccessibilityBarBlockSchema = ({ intl, data = {} }) => ({
  title: intl.formatMessage(messages.accessibilityBar),
  description: intl.formatMessage(messages.description),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.default),
      fields: [
        'isSecretariat',
        ...(data.isSecretariat === true
          ? ['secretariatText', 'secretariatImage']
          : []),
      ],
    },
    {
      id: 'behavior',
      title: intl.formatMessage(messages.behavior),
      fields: ['allowOverlay'],
    },
  ],
  properties: {
    isSecretariat: {
      title: 'É vinculada a uma secretaria',
      description:
        'Divide a barra em identificação da secretaria, atalhos e controles de acessibilidade.',
      type: 'boolean',
      default: false,
    },
    secretariatText: {
      title: 'Nome da secretaria',
      type: 'string',
    },
    secretariatImage: {
      title: 'Imagem da secretaria',
      description: 'Imagem pequena exibida antes do nome da secretaria.',
      widget: 'image',
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

export default AccessibilityBarBlockSchema;
