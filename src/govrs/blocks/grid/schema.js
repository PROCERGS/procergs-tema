import messages from './messages';
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
    title: intl.formatMessage(messages.grid),
    block: 'grid',
    fieldsets: [
      backgroundFieldset,
      {
        id: 'content',
        title: intl.formatMessage(messages.content),
        fields: ['headline'],
      },
      {
        id: 'dividers',
        title: intl.formatMessage(messages.dividers),
        fields: ['verticalDividers'],
      },
    ],
    properties: {
      ...Object.fromEntries(
        backgroundFieldIds.map((id) => [id, sectionSchema.properties[id]]),
      ),
      headline: {
        title: intl.formatMessage(messages.title),
      },
      verticalDividers: {
        title: intl.formatMessage(messages.verticalDividers),
        type: 'boolean',
        default: false,
      },
      dividerVariant: {
        title: intl.formatMessage(messages.dividerVariant),
        choices: [
          ['default', intl.formatMessage(messages.defaultVariant)],
          ['dashed', intl.formatMessage(messages.dashedVariant)],
        ],
        default: 'default',
      },
      dividerThickness: {
        title: intl.formatMessage(messages.dividerThickness),
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
