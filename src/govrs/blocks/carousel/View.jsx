import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import CarouselBlockBody from './CarouselBlockBody';
import withCarouselItems from './withCarouselItems';

const View = ({ data, carouselItems, carouselLoaded }) => (
  <div className="block carousel">
    <div className="carousel-inner govrs-carousel-block">
      <CarouselBlockBody
        data={data}
        items={carouselItems}
        loaded={carouselLoaded}
      />
    </div>
  </div>
);

View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  carouselItems: PropTypes.arrayOf(PropTypes.object),
  carouselLoaded: PropTypes.bool,
};

export default compose(withBlockExtensions, withCarouselItems)(View);
