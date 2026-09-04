import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { Button } from '@procergs/react-govrs-ds';
import { normalizeButton } from './normalizeButton';

const ButtonBlockBody = ({ data, isEditMode = false }) => {
  const { label, href, openLinkInNewTab, colors } = normalizeButton(data);
  const className = cx(
    'procergs-button-block__button',
    'govrs-button',
    'govrs-button--primary',
    'govrs-button--medium',
  );
  const style = {
    '--procergs-button-background': colors.background,
    '--procergs-button-foreground': colors.foreground,
  };

  if (href && !isEditMode) {
    return (
      <UniversalLink
        href={href}
        className={className}
        openLinkInNewTab={openLinkInNewTab}
        style={style}
      >
        <span className="govrs-button__label">{label}</span>
      </UniversalLink>
    );
  }

  return (
    <Button
      className="procergs-button-block__button"
      variant="primary"
      size="medium"
      disabled={!href && !isEditMode}
      style={style}
    >
      {label}
    </Button>
  );
};

ButtonBlockBody.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default ButtonBlockBody;
