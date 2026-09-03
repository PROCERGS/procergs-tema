import PropTypes from 'prop-types';
import { PUBLICATION_DATE_ALIGNMENT_FIELD } from './schema';

export const NEWS_ITEM = 'News Item';

const DATE_ALIGNMENT_OPTIONS = ['left', 'center', 'right'];

export const formatPublicationDate = (value) => {
  if (!value || typeof value !== 'string') return null;

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(year, Number(month) - 1, day));

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

const PublicationDate = ({ properties, data }) => {
  if (properties?.['@type'] !== NEWS_ITEM) return null;

  const publicationDate = formatPublicationDate(properties.effective);
  const alignment = DATE_ALIGNMENT_OPTIONS.includes(
    data?.[PUBLICATION_DATE_ALIGNMENT_FIELD],
  )
    ? data[PUBLICATION_DATE_ALIGNMENT_FIELD]
    : 'left';

  return publicationDate ? (
    <p
      className={`paragraph-12-small procergs-news-publication-date procergs-news-publication-date--${alignment}`}
    >
      {publicationDate}
    </p>
  ) : null;
};

PublicationDate.propTypes = {
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.objectOf(PropTypes.any),
};

PublicationDate.defaultProps = {
  data: {},
};

export default PublicationDate;
