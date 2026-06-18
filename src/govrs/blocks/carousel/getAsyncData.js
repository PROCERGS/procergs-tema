import { getQueryStringResults } from '@plone/volto/actions/querystringsearch/querystringsearch';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';
import { buildCarouselQuery } from './buildCarouselQuery';

export const getCarouselSubrequestId = (content, blockId) =>
  `${content?.UID || 'page'}-${blockId}-carousel-content`;

export default function getCarouselBlockAsyncData(props) {
  const { data, path, id, dispatch, content } = props;
  const query = buildCarouselQuery(data);

  if (!query) {
    return [
      async () => {
        return null;
      },
    ];
  }

  const subrequestID = getCarouselSubrequestId(content, id);

  return [
    dispatch(getQueryStringResults(getBaseUrl(path), query, subrequestID)),
  ];
}
