import TeaserWithButton from '../../govrs/blocks/teaser/WithButton';
import TeaserBlockEdit from '../../govrs/blocks/teaser/Edit';

export const withButtonSchema = ({ schema }) => ({
  ...schema,
  fieldsets: [
    ...schema.fieldsets,
    {
      id: 'button',
      title: 'Botão',
      fields: ['buttonLabel', 'openLinkInNewTab'],
    },
  ],
  properties: {
    ...schema.properties,
    buttonLabel: { title: 'Texto do botão', default: 'Saiba mais' },
  },
});

const configureTeaserBlock = (config) => {
  const blocks = config.blocks.blocksConfig;
  const variations = [
    ...blocks.teaser.variations.filter(({ id }) => id !== 'withButton'),
    {
      id: 'withButton',
      title: 'Com botão',
      template: TeaserWithButton,
      schemaEnhancer: withButtonSchema,
    },
  ];
  blocks.teaser = { ...blocks.teaser, edit: TeaserBlockEdit, variations };
  // Volto keeps a separate Teaser definition inside the Grid.
  if (blocks.gridBlock?.blocksConfig?.teaser) {
    blocks.gridBlock.blocksConfig.teaser = {
      ...blocks.gridBlock.blocksConfig.teaser,
      edit: TeaserBlockEdit,
      variations,
    };
  }
  return config;
};

export default configureTeaserBlock;
