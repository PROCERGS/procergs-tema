import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import MapBlockBody from './MapBlockBody';

const View = ({ data }) => (
  <div
    className={cx(
      'block maps align',
      {
        center: !Boolean(data.align),
      },
      data.align,
    )}
  >
    <div
      className={cx('maps-inner govrs-map-block', {
        'full-width': data.align === 'full',
      })}
    >
      <MapBlockBody data={data} />
    </div>
  </div>
);

View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default compose(withBlockExtensions)(View);
