import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import ListingBlockBody from './ListingBlockBody';
import { getListingVariant } from './getListingVariant';

const View = ({ data, path, pathname, className, style, ...props }) => (
  <div
    className={cx('block listing', getListingVariant(data), className)}
    style={style}
  >
    <ListingBlockBody {...props} data={data} path={path ?? pathname} />
  </div>
);

View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
  block: PropTypes.string,
};

export default compose(withBlockExtensions)(View);
