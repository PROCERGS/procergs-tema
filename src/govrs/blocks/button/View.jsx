import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import ButtonBlockBody from './ButtonBlockBody';
import { normalizeButton } from './normalizeButton';

const View = ({ data }) => {
  const { alignment } = normalizeButton(data);

  return (
    <div className="block procergsButton govrs-button-block">
      <div
        className={cx(
          'procergs-button-block__inner',
          `procergs-button-block__inner--${alignment}`,
        )}
      >
        <ButtonBlockBody data={data} />
      </div>
    </div>
  );
};

View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default compose(withBlockExtensions)(View);
