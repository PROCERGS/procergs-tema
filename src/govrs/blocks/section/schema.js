import { defineMessages } from 'react-intl';

const messages = defineMessages({
  section: {
    id: 'Section',
    defaultMessage: 'Grupo',
  },
  background: {
    id: 'Background',
    defaultMessage: 'Fundo',
  },
  layout: {
    id: 'Layout',
    defaultMessage: 'Layout',
  },
  integration: {
    id: 'Page integration',
    defaultMessage: 'Integração com a página',
  },
  backgroundType: {
    id: 'Background type',
    defaultMessage: 'Tipo de fundo',
  },
  colors: {
    id: 'Background and text colors',
    defaultMessage: 'Cores de fundo e texto',
  },
  image: {
    id: 'Background image',
    defaultMessage: 'Imagem de fundo',
  },
  videoFile: {
    id: 'Background video file',
    defaultMessage: 'Arquivo de vídeo de fundo',
  },
  videoSource: {
    id: 'Background video source',
    defaultMessage: 'Origem do vídeo',
  },
  videoUrl: {
    id: 'Background video URL',
    defaultMessage: 'URL do YouTube',
  },
  videoStart: {
    id: 'Background video start',
    defaultMessage: 'Início do vídeo (segundos)',
  },
  videoEnd: {
    id: 'Background video end',
    defaultMessage: 'Fim do vídeo (segundos)',
  },
  mediaPosition: {
    id: 'Media position',
    defaultMessage: 'Posição da mídia',
  },
  overlayOpacity: {
    id: 'Overlay opacity',
    defaultMessage: 'Opacidade da camada de contraste',
  },
  minHeight: {
    id: 'Minimum height',
    defaultMessage: 'Altura mínima',
  },
  contentWidth: {
    id: 'Content width',
    defaultMessage: 'Largura do conteúdo',
  },
  spacing: {
    id: 'Vertical spacing',
    defaultMessage: 'Espaçamento vertical',
  },
  overlayHeader: {
    id: 'Use background behind header',
    defaultMessage: 'Estender o fundo sob o Header',
  },
  overlayFooter: {
    id: 'Use background behind footer',
    defaultMessage: 'Estender o fundo sob o Footer',
  },
});

const imageBrowserField = (title) => ({
  title,
  widget: 'image',
  objectBrowserPickerType: 'image',
});

export const sectionSchemaEnhancer = ({ schema, formData }) => {
  const videoSource =
    formData?.videoSource || (formData?.videoFile ? 'file' : 'youtube');
  const backgroundFields = {
    none: ['backgroundType'],
    color: ['backgroundType', 'colorPair'],
    image: [
      'backgroundType',
      'colorPair',
      'backgroundImage',
      'mediaPosition',
      'overlayOpacity',
    ],
    video: [
      'backgroundType',
      'colorPair',
      'videoSource',
      videoSource === 'file' ? 'videoFile' : 'videoUrl',
      'videoStart',
      'videoEnd',
      'mediaPosition',
      'overlayOpacity',
    ],
  };

  schema.fieldsets[0].fields =
    backgroundFields[formData?.backgroundType] || backgroundFields.none;
  const integrationFieldset = schema.fieldsets.find(
    (fieldset) => fieldset.id === 'integration',
  );
  integrationFieldset.fields = ['overlayHeader', 'overlayFooter'];

  return schema;
};

export const SectionBlockSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.section),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.background),
      fields: [
        'backgroundType',
        'colorPair',
        'backgroundImage',
        'videoSource',
        'videoFile',
        'videoUrl',
        'videoStart',
        'videoEnd',
        'mediaPosition',
        'overlayOpacity',
      ],
    },
    {
      id: 'layout',
      title: intl.formatMessage(messages.layout),
      fields: ['minHeight', 'contentWidth', 'spacing'],
    },
    {
      id: 'integration',
      title: intl.formatMessage(messages.integration),
      fields: ['overlayHeader', 'overlayFooter'],
    },
  ],
  properties: {
    backgroundType: {
      title: intl.formatMessage(messages.backgroundType),
      choices: [
        ['none', 'Sem fundo'],
        ['color', 'Cor'],
        ['image', 'Imagem'],
        ['video', 'Vídeo'],
      ],
      default: 'none',
    },
    colorPair: {
      title: intl.formatMessage(messages.colors),
      description:
        'Escolha um par GovRS ou aplique livremente cores personalizadas.',
      widget: 'color_contrast',
      default: {
        background: '#ffffff',
        foreground: '#000000',
      },
    },
    backgroundImage: imageBrowserField(intl.formatMessage(messages.image)),
    videoSource: {
      title: intl.formatMessage(messages.videoSource),
      choices: [
        ['youtube', 'URL do YouTube'],
        ['file', 'Arquivo do Plone'],
      ],
      default: 'youtube',
    },
    videoFile: {
      title: intl.formatMessage(messages.videoFile),
      description: 'Selecione um conteúdo File com mídia MP4 ou WebM.',
      widget: 'object_browser',
      mode: 'link',
      allowExternals: false,
      selectedItemAttrs: ['@id', 'Title', '@type', 'getContentType'],
    },
    videoUrl: {
      title: intl.formatMessage(messages.videoUrl),
      description: 'Use uma URL de vídeo, Shorts ou live do YouTube.',
      widget: 'url',
    },
    videoStart: {
      title: intl.formatMessage(messages.videoStart),
      description: 'Deixe 0 para iniciar desde o começo.',
      type: 'number',
      minimum: 0,
      default: 0,
    },
    videoEnd: {
      title: intl.formatMessage(messages.videoEnd),
      description:
        'Opcional. Quando preenchido, o vídeo retorna ao início configurado.',
      type: 'number',
      minimum: 0,
    },
    mediaPosition: {
      title: intl.formatMessage(messages.mediaPosition),
      choices: [
        ['center', 'Centro'],
        ['top', 'Topo'],
        ['bottom', 'Base'],
        ['left', 'Esquerda'],
        ['right', 'Direita'],
      ],
      default: 'center',
    },
    overlayOpacity: {
      title: intl.formatMessage(messages.overlayOpacity),
      description: 'Defina livremente a opacidade da camada sobre a mídia.',
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.6,
    },
    minHeight: {
      title: intl.formatMessage(messages.minHeight),
      choices: [
        ['auto', 'Automática'],
        ['50vh', 'Metade da tela'],
        ['70vh', 'Destaque'],
        ['100svh', 'Tela inteira'],
      ],
      default: 'auto',
    },
    contentWidth: {
      title: intl.formatMessage(messages.contentWidth),
      choices: [
        ['narrow', 'Estreita'],
        ['default', 'Padrão'],
        ['layout', 'Ampla'],
        ['full', 'Total'],
      ],
      default: 'layout',
    },
    spacing: {
      title: intl.formatMessage(messages.spacing),
      choices: [
        ['compact', 'Compacto'],
        ['default', 'Padrão'],
        ['spacious', 'Espaçoso'],
      ],
      default: 'default',
    },
    overlayHeader: {
      title: intl.formatMessage(messages.overlayHeader),
      description:
        'Só tem efeito quando este grupo é o primeiro bloco da página.',
      type: 'boolean',
      default: false,
    },
    overlayFooter: {
      title: intl.formatMessage(messages.overlayFooter),
      description:
        'Só tem efeito quando este grupo é o último bloco da página.',
      type: 'boolean',
      default: false,
    },
  },
  required: [],
});

export default SectionBlockSchema;
