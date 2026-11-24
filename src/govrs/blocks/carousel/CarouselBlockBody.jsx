import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Carousel } from '@procergs/react-govrs-ds';
import { normalizeSlides } from './normalizeSlides';
import messages from './messages';

const CarouselBlockBody = ({ data, items = [], loaded = true }) => {
  const slides = normalizeSlides(items, {
    linkToContent: Boolean(data.linkToContent),
  });
  const hasTarget = Boolean(data.href?.[0]?.['@id']);

  if (!hasTarget) {
    return (
      <div className="govrs-carousel-block__empty">
        <FormattedMessage {...messages.empty} />
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="govrs-carousel-block__empty">
        <FormattedMessage {...messages.loading} />
      </div>
    );
  }

  return (
    <Carousel
      variant="default"
      items={slides}
      autoplay={data.autoplay !== false}
      autoplaySpeed={data.autoplaySpeed ?? 3000}
      circular={data.circular !== false}
      width="default"
      indicators={data.indicators || 'default'}
      enableSwipe={data.enableSwipe !== false}
      noArrowsMobile={data.noArrowsMobile !== false}
      className="govrs-carousel-block__carousel"
    />
  );
};

CarouselBlockBody.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  loaded: PropTypes.bool,
};

export default CarouselBlockBody;
