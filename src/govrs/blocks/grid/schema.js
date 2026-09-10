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
    ],
    properties: {
      ...Object.fromEntries(
        backgroundFieldIds.map((id) => [id, sectionSchema.properties[id]]),
      ),
      headline: {
        title: 'Título',
      },
    },
    required: [],
  };
};

export const gridSchemaEnhancer = backgroundSchemaEnhancer;

export default GridBlockSchema;
