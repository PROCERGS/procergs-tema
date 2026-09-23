import React from 'react';
import PropTypes from 'prop-types';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import DivisorBlockBody from './DivisorBlockBody';
import { normalizeDivisor } from './normalizeDivisor';

const View = ({ data }) => {
  const { orientation } = normalizeDivisor(data);

  return (
    <div
      className={
        'block procergsDivisor govrs-divisor-block govrs-divisor-block--' +
        orientation
      }
    >
      <DivisorBlockBody data={data} />
    </div>
  );
};

View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default withBlockExtensions(View);
