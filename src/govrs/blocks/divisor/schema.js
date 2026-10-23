import messages from './messages';

export const DivisorBlockSchema = ({ intl }) => ({
  title: intl.formatMessage(messages.divisor),
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.appearance),
      fields: ['variant', 'thickness', 'orientation'],
    },
  ],
  properties: {
    variant: {
      title: intl.formatMessage(messages.variant),
      choices: [
        ['default', intl.formatMessage(messages.defaultVariant)],
        ['dashed', intl.formatMessage(messages.dashedVariant)],
      ],
      default: 'default',
    },
    thickness: {
      title: intl.formatMessage(messages.thickness),
      choices: [
        ['1', '1 px'],
        ['2', '2 px'],
        ['4', '4 px'],
      ],
      default: '1',
    },
    orientation: {
      title: intl.formatMessage(messages.orientation),
      choices: [
        ['horizontal', 'Horizontal'],
        ['vertical', 'Vertical'],
      ],
      default: 'horizontal',
    },
  },
  required: [],
});

export default DivisorBlockSchema;
