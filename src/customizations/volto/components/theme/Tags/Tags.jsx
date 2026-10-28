import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import config from '@plone/registry';
import { Tag } from '@procergs/react-govrs-ds';

const Tags = ({ content }) => {
  const tags = content?.subjects || [];

  if (!config.settings.showTags || !tags.length) {
    return null;
  }

  return (
    <Container className="tags govrs-content-tags">
      {tags.map((tag) => (
        <Link
          className="govrs-content-tags__link"
          to={`/busca?Subject=${encodeURIComponent(tag)}`}
          key={tag}
        >
          <Tag variant="text" label={tag} showIcon={false} />
        </Link>
      ))}
    </Container>
  );
};

Tags.propTypes = {
  content: PropTypes.shape({
    subjects: PropTypes.arrayOf(PropTypes.string),
  }),
};

Tags.defaultProps = {
  content: {
    subjects: [],
  },
};

export default Tags;
