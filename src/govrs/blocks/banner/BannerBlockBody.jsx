import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Banner } from '@procergs/react-govrs-ds';
import { normalizeBanner } from './normalizeBanner';

const BannerBlockBody = ({ data, isEditMode = false }) => {
  const hasImage = Boolean(
    (typeof data.image === 'string' && data.image) || data.image?.[0],
  );
  const bannerProps = normalizeBanner(data, { isEditMode });

  if (!hasImage || !bannerProps.imageUrl) {
    return (
      <div className="govrs-banner-block__empty">
        <FormattedMessage
          id="Choose a banner image"
          defaultMessage="Choose a banner image"
        />
      </div>
    );
  }

  return (
    <Banner
      {...bannerProps}
      className="govrs-banner-block__banner"
    />
  );
};

BannerBlockBody.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default BannerBlockBody;
