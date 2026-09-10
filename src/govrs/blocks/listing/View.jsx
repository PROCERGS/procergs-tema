import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import ListingBlockBody from './ListingBlockBody';
import {
  getListingVariation,
  listingNeedsFullObjects,
} from './getListingVariation';
import { useGridColumns } from '../grid/GridContext';
import { normalizeListingForGrid } from './gridRules';

const View = ({ data, path, pathname, className, style, ...props }) => {
  const gridColumns = useGridColumns();
  const normalizedData = normalizeListingForGrid(data, gridColumns);

  return (
    <div
      className={cx(
        'block listing',
        getListingVariation(normalizedData),
        gridColumns && 'listing--in-grid',
        className,
      )}
      style={style}
    >
      <ListingBlockBody
        {...props}
        data={normalizedData}
        gridColumns={gridColumns}
        path={path ?? pathname}
        variation={{
          ...props.variation,
          fullobjects: listingNeedsFullObjects(normalizedData),
        }}
      />
    </div>
  );
};

View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
  block: PropTypes.string,
};

export default compose(withBlockExtensions)(View);
