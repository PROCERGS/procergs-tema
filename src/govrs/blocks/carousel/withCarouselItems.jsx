import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { getQueryStringResults } from '@plone/volto/actions/querystringsearch/querystringsearch';
import { getBaseUrl } from '@plone/volto/helpers/Url/Url';
import { buildCarouselQuery } from './buildCarouselQuery';
import { getCarouselSubrequestId } from './getAsyncData';
import {
  CAROUSEL_ITEM_LIMIT,
  filterCarouselContentItems,
} from './filterCarouselContentItems';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

const withCarouselItems = (WrappedComponent) => {
  function WithCarouselItems(props) {
    const { data = {}, id, block, properties: content, path, pathname } =
      props;
    const dispatch = useDispatch();
    const blockId = id ?? block;
    const pagePath = path ?? pathname;
    const [initialPath] = React.useState(getBaseUrl(pagePath));
    const subrequestID = getCarouselSubrequestId(content, blockId);
    const hrefId = data.href?.[0]?.['@id'];
    const query = React.useMemo(() => buildCarouselQuery(data), [data]);

    const querystringResults = useSelector(
      (state) => state.querystringsearch.subrequests,
    );

    useDeepCompareEffect(() => {
      if (!hrefId || !query || !initialPath) {
        return;
      }

      dispatch(getQueryStringResults(initialPath, query, subrequestID));
    }, [dispatch, hrefId, initialPath, query, subrequestID]);

    const carouselItems = hrefId
      ? filterCarouselContentItems(
          querystringResults?.[subrequestID]?.items || [],
        ).slice(0, CAROUSEL_ITEM_LIMIT)
      : [];
    const carouselLoaded =
      !hrefId || Boolean(querystringResults?.[subrequestID]?.loaded);

    return (
      <WrappedComponent
        {...props}
        carouselItems={carouselItems}
        carouselLoaded={carouselLoaded}
      />
    );
  }

  WithCarouselItems.displayName = `WithCarouselItems(${getDisplayName(
    WrappedComponent,
  )})`;

  return hoistNonReactStatics(WithCarouselItems, WrappedComponent);
};

export default withCarouselItems;
