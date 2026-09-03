import { defineMessages } from 'react-intl';
import { blocksFormGenerator } from '@plone/volto/helpers/Blocks/Blocks';
import sectionTemplate from './section-1.svg';

const messages = defineMessages({
  emptySection: {
    id: 'Empty section',
    defaultMessage: 'Grupo vazio',
  },
});

const templates = () => (intl) => [
  {
    image: sectionTemplate,
    id: 'procergs-section-empty',
    title: intl.formatMessage(messages.emptySection),
    blocksData: blocksFormGenerator(1, 'empty'),
  },
];

export default templates;
