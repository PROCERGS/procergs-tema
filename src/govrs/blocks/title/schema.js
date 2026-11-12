export const PUBLICATION_DATE_ALIGNMENT_FIELD = 'publicationDateAlignment';

const TitleBlockSettingsSchema = {
  title: 'Data de publicação',
  fieldsets: [
    {
      id: 'default',
      title: 'Data de publicação',
      fields: [PUBLICATION_DATE_ALIGNMENT_FIELD],
    },
  ],
  properties: {
    [PUBLICATION_DATE_ALIGNMENT_FIELD]: {
      title: 'Alinhamento',
      choices: [
        ['left', 'À esquerda'],
        ['center', 'Centralizada'],
        ['right', 'À direita'],
      ],
      default: 'left',
    },
  },
  required: [],
};

export default TitleBlockSettingsSchema;
