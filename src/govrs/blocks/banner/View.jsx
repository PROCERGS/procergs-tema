import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import BannerBlockBody from './BannerBlockBody';

const View = ({ data }) => (
  <div
    className={cx(
      'block banner align',
      {
        center: !data.align,
      },
      data.align,
    )}
  >
    <div
      className={cx('banner-inner govrs-banner-block', {
        'full-width': data.align === 'full',
      })}
    >
      <BannerBlockBody data={data} />
    </div>
  </div>
);

View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default compose(withBlockExtensions)(View);
