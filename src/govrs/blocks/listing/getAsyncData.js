import { getQueryStringResults } from '@plone/volto/actions/querystringsearch/querystringsearch';
import qs from 'query-string';
import { slugify } from '@plone/volto/helpers/Utils/Utils';
import { listingNeedsFullObjects } from './getListingVariant';

const getCurrentPage = (location, id) => {
  const pageQueryParam = qs.parse(location.search);
  switch (Object.keys(pageQueryParam).length) {
    case 0:
      return 1;
    case 1:
      return pageQueryParam['page'] || pageQueryParam[slugify(`page-${id}`)];
    default:
      return pageQueryParam[slugify(`page-${id}`)];
  }
};

export default function getListingBlockAsyncData(props) {
  const { data, path, location, id, dispatch, content } = props;
  const subrequestID = content?.UID ? `${content?.UID}-${id}` : id;
  const currentPage = getCurrentPage(location, id);

  if (!data.querystring) {
    return [
      async () => {
        return null;
      },
    ];
  }

  const queryPayload = {
    ...data.querystring,
    ...(listingNeedsFullObjects(data)
      ? { fullobjects: 1 }
      : { metadata_fields: '_all' }),
  };

  return [
    dispatch(
      getQueryStringResults(path, queryPayload, subrequestID, currentPage),
    ),
  ];
}
