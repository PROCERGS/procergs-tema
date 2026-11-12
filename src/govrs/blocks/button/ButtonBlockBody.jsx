import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { Button } from '@procergs/react-govrs-ds';
import { normalizeButton } from './normalizeButton';
import { hexToRgba } from '../../helpers/colorContrast';

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
    '--procergs-button-resolved-background': hexToRgba(
      colors.background,
      colors.backgroundOpacity,
    ),
    '--procergs-button-resolved-border': hexToRgba(
      colors.border,
      colors.borderOpacity,
    ),
    '--procergs-button-foreground': colors.foreground,
    '--procergs-button-hover-foreground': colors.hover.foreground,
    '--procergs-button-resolved-hover-background': hexToRgba(
      colors.hover.background,
      colors.hover.backgroundOpacity,
    ),
    '--procergs-button-resolved-hover-border': hexToRgba(
      colors.hover.border,
      colors.hover.borderOpacity,
    ),
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

  return (
    <span className="procergs-button-block__appearance" style={style}>
      {href ? (
        <UniversalLink
          href={href}
          className={className}
          openLinkInNewTab={openLinkInNewTab}
          onClick={isEditMode ? (event) => event.preventDefault() : undefined}
        >
          <span className="govrs-button__label">{content}</span>
        </UniversalLink>
      ) : (
        <Button
          className="procergs-button-block__button"
          variant="primary"
          size="medium"
          disabled={!href}
        >
          {content}
        </Button>
      )}
    </span>
  );
};

ButtonBlockBody.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  isEditMode: PropTypes.bool,
};

export default ButtonBlockBody;
