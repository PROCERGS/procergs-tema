import React from 'react';
import cx from 'classnames';
import { defineMessages, useIntl } from 'react-intl';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { BlockWrapper } from '@kitconcept/volto-bm3-compat';
import { Button as GovrsButton } from '@procergs/react-govrs-ds';

const messages = defineMessages({
  defaultText: {
    id: 'Procergs Button Default Text',
    defaultMessage: 'Botao',
  },
  invalidLink: {
    id: 'Procergs Button Invalid Link',
    defaultMessage: 'Nao foi possivel renderizar o botao. Revise o link.',
  },
});

const VALID_VARIANTS = ['primary', 'secondary', 'tertiary'];
const VALID_SIZES = ['small', 'medium', 'large'];

const getSafeValue = (value, allowed, fallback) =>
  allowed.includes(value) ? value : fallback;

const getLinkUrl = (href) => {
  if (!href) return null;
  if (Array.isArray(href)) return href[0]?.['@id'] || null;
  if (typeof href === 'string') return href;
  return null;
};

const LegacyWrapper = ({ children, data }) => {
  const align =
    data?.buttonAlignment || data?.align || data?.styles?.align || 'left';
  const fullWidth = align === 'full';

  return (
    <div className="button container procergs-button-block">
      <div
        className={cx(
          'procergs-button-block__inner',
          `align-${align}`,
          fullWidth && 'is-full-width',
        )}
      >
        {children}
      </div>
    </div>
  );
};

const View = (props) => {
  const { data = {}, isEditMode = false } = props;
  const intl = useIntl();
  const align = data.buttonAlignment || data.align || data?.styles?.align || 'left';

  const label = data.title || intl.formatMessage(messages.defaultText);
  const variant = getSafeValue(data.buttonVariant, VALID_VARIANTS, 'primary');
  const size = getSafeValue(data.buttonSize, VALID_SIZES, 'medium');
  const loading = false;
  const fullWidth = align === 'full';
  const linkUrl = getLinkUrl(data.href);
  const hasLinkValue = Boolean(data.href && (Array.isArray(data.href) ? data.href.length : true));
  const invalidLink = hasLinkValue && !linkUrl;

  if (invalidLink) {
    return (
      <BlockWrapper {...props} ExtraWrapper={(wrapperProps) => <LegacyWrapper {...wrapperProps} data={data} />}>
        <p className="procergs-button-block__error">
          {intl.formatMessage(messages.invalidLink)}
        </p>
      </BlockWrapper>
    );
  }

  const linkClassName = cx(
    'procergs-button-block__button',
    'govrs-button',
    `govrs-button--${variant}`,
    `govrs-button--${size}`,
    fullWidth && 'govrs-button--block',
    loading && 'govrs-button--loading',
  );

  let content;

  if (linkUrl && !isEditMode) {
    content = (
      <UniversalLink
        href={linkUrl}
        className={linkClassName}
        openLinkInNewTab={data.openLinkInNewTab}
      >
        <span className="govrs-button__label">{label}</span>
      </UniversalLink>
    );
  } else {
    content = (
      <GovrsButton
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        loading={loading}
        disabled={!linkUrl && !isEditMode}
      >
        {label}
      </GovrsButton>
    );
  }

  return (
    <BlockWrapper
      {...props}
      ExtraWrapper={(wrapperProps) => <LegacyWrapper {...wrapperProps} data={data} />}
    >
      {content}
    </BlockWrapper>
  );
};

export default View;
