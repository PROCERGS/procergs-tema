import messages from './messages';
import { blocksFormGenerator } from '@plone/volto/helpers/Blocks/Blocks';
import sectionTemplate from './section-1.svg';

const templates = () => (intl) => [
  {
    image: sectionTemplate,
    id: 'procergs-section-empty',
    title: intl.formatMessage(messages.emptySection),
    blocksData: blocksFormGenerator(1, 'empty'),
  },
];

export default templates;
