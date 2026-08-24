import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import AccordionBlockBody from './AccordionBlockBody';

const View = ({ data }) => (
  <div
    className={cx(
      'block accordion align',
      {
        center: !data.align,
      },
      data.align,
    )}
  >
    <div
      className={cx('accordion-inner govrs-accordion-block', {
        'full-width': data.align === 'full',
      })}
    >
      <AccordionBlockBody data={data} />
    </div>
  </div>
);

View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default compose(withBlockExtensions)(View);
