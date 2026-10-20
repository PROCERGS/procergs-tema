import { defineMessages } from 'react-intl';
import { isSecretariatEnabled } from './settings';

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

const AccessibilityBarBlockSchema = ({ intl, data = {} }) => {
  const schema = {
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
  };

  if (!isSecretariatEnabled()) {
    // O InlineForm do Volto exige o fieldset default, mesmo sem campos.
    schema.fieldsets.find(({ id }) => id === 'default').fields = [];
    delete schema.properties.isSecretariat;
    delete schema.properties.secretariatText;
    delete schema.properties.secretariatImage;
  }

  return schema;
};

export default AccessibilityBarBlockSchema;
