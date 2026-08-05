import React from 'react';
import PropTypes from 'prop-types';
import { List } from '@procergs/react-govrs-ds';
import { getListVariantProps } from './getListVariantProps';
import { normalizeListItems } from './normalizeListItems';

const ListingVariationTemplate = ({ id, items, isEditMode, ...data }) => {
  const listingData = { ...data, variation: id };

  return (
    <List
      {...getListVariantProps(listingData)}
      items={normalizeListItems(items, listingData, { isEditMode })}
      className="govrs-listing-block__list"
    />
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
