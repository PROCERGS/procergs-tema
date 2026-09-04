import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { Button } from '@procergs/react-govrs-ds';
import { normalizeButton } from './normalizeButton';

const ButtonBlockBody = ({ data, isEditMode = false }) => {
  const { label, href, openLinkInNewTab, iconUrl, iconPosition, colors } =
    normalizeButton(data);
  const className = cx(
    'procergs-button-block__button',
    'govrs-button',
    'govrs-button--primary',
    'govrs-button--medium',
  );
  const style = {
    '--procergs-button-background': colors.background,
    '--procergs-button-foreground': colors.foreground,
    '--procergs-button-border': colors.border,
    ...(colors.hover.background && {
      '--procergs-button-hover-background': colors.hover.background,
    }),
    ...(colors.hover.foreground && {
      '--procergs-button-hover-foreground': colors.hover.foreground,
    }),
    ...(colors.hover.border && {
      '--procergs-button-hover-border': colors.hover.border,
    }),
  };
  const content = (
    <span
      className={`procergs-button-block__content procergs-button-block__content--${iconPosition}`}
    >
      {iconUrl ? (
        <span
          className="procergs-button-block__icon"
          aria-hidden="true"
          style={{
            WebkitMaskImage: `url(${JSON.stringify(iconUrl)})`,
            maskImage: `url(${JSON.stringify(iconUrl)})`,
          }}
        />
      ) : null}
      <span className="procergs-button-block__text">{label}</span>
    </span>
  );

  if (href && !isEditMode) {
    return (
      <UniversalLink
        href={href}
        className={className}
        openLinkInNewTab={openLinkInNewTab}
        style={style}
      >
        <span className="govrs-button__label">{content}</span>
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
      {content}
    </Button>
  );
};

ButtonBlockBody.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default ButtonBlockBody;
