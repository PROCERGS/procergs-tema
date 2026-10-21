import React from 'react';
import cx from 'classnames';
import config from '@plone/volto/registry';
import DefaultBody from '@plone/volto/components/manage/Blocks/Teaser/DefaultBody';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import { isInternalURL } from '@plone/volto/helpers/Url/Url';

const TeaserWithButton = (props) => {
  const { data, className, style, isEditMode = false } = props;
  const target = data.href?.[0];
  if (!target?.['@id']) return <DefaultBody {...props} />;

  const Image = config.getComponent('Image').component;
  const image = data.preview_image?.[0];
  const imageUrl = image?.['@id'];
  const hasImage =
    imageUrl || target.hasPreviewImage || target.image_field || image;
  const imageProps =
    imageUrl && !image.image_field
      ? { src: imageUrl }
      : {
          item: image || target,
          imageField: image ? image.image_field : target.image_field,
        };
  const openLinkInNewTab = Boolean(
    data.openLinkInNewTab ||
      (config.settings.openExternalLinkInNewTab &&
        !isInternalURL(target['@id'])),
  );

  return (
    <div
      className={cx('block teaser procergs-teaser--with-button', className)}
      style={style}
    >
      <div className="teaser-item default">
        {hasImage && (
          <div className="image-wrapper">
            <Image {...imageProps} alt="" loading="lazy" responsive />
          </div>
        )}
        <div className="content">
          {data.head_title && <div className="headline">{data.head_title}</div>}
          <h2>{data.title}</h2>
          {!data.hide_description && <p>{data.description}</p>}
          <UniversalLink
            href={target['@id']}
            className="procergs-teaser-button govrs-button govrs-button--medium"
            openLinkInNewTab={openLinkInNewTab}
            onClick={isEditMode ? (event) => event.preventDefault() : undefined}
          >
            <span className="govrs-button__label">
              {data.buttonLabel?.trim() || 'Saiba mais'}
            </span>
            <span aria-hidden="true">→</span>
          </UniversalLink>
        </div>
      </div>
    </div>
  );
};

export default TeaserWithButton;
