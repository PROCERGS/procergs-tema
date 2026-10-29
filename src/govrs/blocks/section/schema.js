import messages from './messages';

const imageBrowserField = (title) => ({
  title,
  widget: 'image',
  objectBrowserPickerType: 'image',
});

export const backgroundSchemaEnhancer = ({ schema, formData }) => {
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

  return schema;
};

export const sectionSchemaEnhancer = (args) => {
  const schema = backgroundSchemaEnhancer(args);
  const integrationFieldset = schema.fieldsets.find(
    (fieldset) => fieldset.id === 'integration',
  );

  if (integrationFieldset) {
    integrationFieldset.fields = ['overlayHeader', 'overlayFooter'];
  }

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
      description: intl.formatMessage(messages.videoFileDescription),
      widget: 'object_browser',
      mode: 'link',
      allowExternals: false,
      selectedItemAttrs: ['@id', 'Title', '@type', 'getContentType'],
    },
    videoUrl: {
      title: intl.formatMessage(messages.videoUrl),
      description: intl.formatMessage(messages.videoUrlDescription),
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

export const NestedSectionBlockSchema = ({ intl }) => {
  const schema = SectionBlockSchema({ intl });
  const backgroundFieldset = schema.fieldsets.find(
    (fieldset) => fieldset.id === 'default',
  );
  const layoutFieldset = schema.fieldsets.find(
    (fieldset) => fieldset.id === 'layout',
  );

  return {
    ...schema,
    fieldsets: [backgroundFieldset, { ...layoutFieldset, fields: ['spacing'] }],
  };
};

export default SectionBlockSchema;
