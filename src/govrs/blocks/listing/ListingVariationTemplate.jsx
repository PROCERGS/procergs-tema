import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import { List } from '@procergs/react-govrs-ds';
import { getListingVariation } from './getListingVariation';
import { getListVariantProps } from './getListVariantProps';
import { normalizeListItems } from './normalizeListItems';
import { withDefaultListingTags } from './withDefaultListingTags';
import {
  getListingItemHrefFromEvent,
  isClickableDefaultListing,
  shouldHandleListingNavigation,
} from './listingItemNavigation';

const ListingVariationTemplate = ({ id, items, isEditMode, ...data }) => {
  const history = useHistory();
  const listingData = { ...data, variation: id };
  const listProps = getListVariantProps(listingData);
  const variation = getListingVariation(listingData);
  const normalizedItems = normalizeListItems(items, listingData, {
    isEditMode,
  });
  const listItems =
    variation === 'default'
      ? withDefaultListingTags(normalizedItems)
      : normalizedItems;
  const isClickableDefault = isClickableDefaultListing(
    listingData,
    listItems,
    isEditMode,
  );

  const handleListClick = (event) => {
    if (!isClickableDefault || !shouldHandleListingNavigation(event)) {
      return;
    }

    const href = getListingItemHrefFromEvent(
      event,
      listItems,
      Boolean(listingData.labeled),
    );
    if (!href) {
      return;
    }

    event.preventDefault();
    history.push(href);
  };

  return (
    <div onClick={handleListClick}>
      <List
        {...listProps}
        items={listItems}
        className={cx('govrs-listing-block__list', {
          'govrs-listing-block__list--media-left':
            listProps.mediaPosition === 'left',
          'govrs-listing-block__list--show-tags':
            variation === 'default' && Boolean(listingData.showTags),
          'govrs-listing-block__list--clickable': isClickableDefault,
        })}
      />
    </div>
  );
};

ListingVariationTemplate.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.array,
  isEditMode: PropTypes.bool,
};

ListingVariationTemplate.defaultProps = {
  items: [],
  isEditMode: false,
};

export default ListingVariationTemplate;
