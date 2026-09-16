import {
  SectionBlockSchema,
  backgroundSchemaEnhancer,
} from '../section/schema';

export const GridBlockSchema = ({ intl }) => {
  const sectionSchema = SectionBlockSchema({ intl });
  const backgroundFieldset = sectionSchema.fieldsets.find(
    (fieldset) => fieldset.id === 'default',
  );
  const backgroundFieldIds = backgroundFieldset.fields;

  return {
    title: 'Grid',
    block: 'grid',
    fieldsets: [
      backgroundFieldset,
      {
        id: 'content',
        title: 'Conteúdo',
        fields: ['headline'],
      },
      {
        id: 'dividers',
        title: 'Divisores',
        fields: ['verticalDividers'],
      },
    ],
    properties: {
      ...Object.fromEntries(
        backgroundFieldIds.map((id) => [id, sectionSchema.properties[id]]),
      ),
      headline: {
        title: 'Título',
      },
      verticalDividers: {
        title: 'Separar blocos com divisor vertical',
        type: 'boolean',
        default: false,
      },
      dividerVariant: {
        title: 'Tipo de divisor',
        choices: [
          ['default', 'Default'],
          ['dashed', 'Dashed'],
        ],
        default: 'default',
      },
      dividerThickness: {
        title: 'Espessura do divisor',
        choices: [
          ['1', '1 px'],
          ['2', '2 px'],
          ['4', '4 px'],
        ],
        default: '1',
      },
    },
    required: [],
  };
};

export const gridSchemaEnhancer = (args) => {
  const schema = backgroundSchemaEnhancer(args);
  const dividers = schema.fieldsets.find(({ id }) => id === 'dividers');
  if (dividers) {
    dividers.fields =
      args.formData?.verticalDividers === true
        ? ['verticalDividers', 'dividerVariant', 'dividerThickness']
        : ['verticalDividers'];
  }
  return schema;
};

export default GridBlockSchema;
