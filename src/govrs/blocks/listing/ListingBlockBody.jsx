import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Dimmer, Loader } from 'semantic-ui-react';
import Slugger from 'github-slugger';
import { List } from '@procergs/react-govrs-ds';
import withQuerystringResults from '@plone/volto/components/manage/Blocks/Listing/withQuerystringResults';
import { normalizeString } from '@plone/volto/helpers/Utils/Utils';
import config from '@plone/volto/registry';
import Pagination from '../../components/Pagination/Pagination';
import {
  getListingVariation,
  isDsListingVariation,
  resolveListingVariationConfig,
} from './getListingVariation';
import { getListVariantProps } from './getListVariantProps';
import { normalizeListItems } from './normalizeListItems';

const Headline = ({ headlineTag = 'h2', id, data, listingItems }) => {
  const Tag = headlineTag;
  const slug = Slugger.slug(normalizeString(data.headline));
  const headlineId = slug || id;

  return (
    <Tag
      id={headlineId}
      className={cx('govrs-listing-block__headline', 'headline', {
        emptyListing: !(listingItems?.length > 0),
      })}
    >
      {data.headline}
    </Tag>
  );
};

Headline.propTypes = {
  headlineTag: PropTypes.string,
  id: PropTypes.string,
  data: PropTypes.object,
  listingItems: PropTypes.array,
};

const ListingBlockBody = withQuerystringResults((props) => {
  const {
    data = {},
    id,
    isEditMode,
    listingItems,
    totalPages,
    onPaginationChange,
    currentPage,
    total,
    batch_size,
    isFolderContentsListing,
    hasLoaded,
    variation: variationProp,
  } = props;

  const listingRef = createRef();
  const variationId = getListingVariation(data);
  const useDsList = isDsListingVariation(variationId);
  const variationConfig = resolveListingVariationConfig(
    data,
    variationProp,
    config.blocks?.blocksConfig?.listing?.variations,
  );
  const ListingBodyTemplate = variationConfig?.template;
  const NoResults =
    variationConfig?.noResultsComponent ||
    config.blocks?.blocksConfig?.listing?.noResultsComponent;
  const HeadlineTag = data.headlineTag || 'h2';
  const hasItems = listingItems?.length > 0;

  let listContent = null;
  if (hasItems) {
    if (useDsList) {
      listContent = (
        <List
          {...getListVariantProps(data)}
          items={normalizeListItems(listingItems, data, { isEditMode })}
          className="govrs-listing-block__list"
        />
      );
    } else if (ListingBodyTemplate) {
      listContent = (
        <ListingBodyTemplate
          items={listingItems}
          isEditMode={isEditMode}
          {...data}
          {...variationConfig}
        />
      );
    }
  }

  const emptyMessage =
    hasLoaded &&
    (NoResults ? (
      <NoResults isEditMode={isEditMode} {...data} />
    ) : (
      <FormattedMessage
        id="No results found."
        defaultMessage="No results found."
      />
    ));

  return (
    <div
      className={cx(
        'govrs-listing-block',
        `govrs-listing-block--${variationId}`,
      )}
    >
      {data.headline && (
        <Headline
          headlineTag={HeadlineTag}
          id={id}
          listingItems={listingItems}
          data={data}
        />
      )}
      {listContent ? (
        <div ref={listingRef}>
          {listContent}
          <Pagination
            page={currentPage}
            pageSize={batch_size}
            totalItems={
              total || (totalPages > 0 ? totalPages * (batch_size || 1) : 0)
            }
            onPageChange={(page) => {
              if (!isEditMode) {
                listingRef.current?.scrollIntoView({ behavior: 'smooth' });
              }
              onPaginationChange(null, { activePage: page });
            }}
            className="govrs-listing-block__pagination"
          />
        </div>
      ) : isEditMode ? (
        <div
          className="govrs-listing-block__empty listing message"
          ref={listingRef}
        >
          {isFolderContentsListing && (
            <FormattedMessage
              id="No items found in this container."
              defaultMessage="No items found in this container."
            />
          )}
          {emptyMessage}
          <Dimmer active={!hasLoaded} inverted>
            <Loader indeterminate size="small">
              <FormattedMessage id="loading" defaultMessage="Loading" />
            </Loader>
          </Dimmer>
        </div>
      ) : (
        <div
          className="govrs-listing-block__empty emptyListing"
          ref={listingRef}
        >
          {emptyMessage}
          <Dimmer active={!hasLoaded} inverted>
            <Loader indeterminate size="small">
              <FormattedMessage id="loading" defaultMessage="Loading" />
            </Loader>
          </Dimmer>
        </div>
      )}
    </div>
  );
});

export default ListingBlockBody;
