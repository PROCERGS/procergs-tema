import React from 'react';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { getContentIcon } from '@plone/volto/helpers/Content/Content';
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';
import { resolveImageUrlFromContent } from '../../helpers/resolveImageUrlFromContent';

const UNSAFE_ICON_PROTOCOL = /^(javascript|vbscript|data):/i;

const getOwnIcon = (item) => {
  const icon = item?.icon;
  if (typeof icon !== 'string') {
    return undefined;
  }

  const trimmed = icon.trim();
  if (!trimmed || UNSAFE_ICON_PROTOCOL.test(trimmed)) {
    return undefined;
  }

  return <img src={flattenToAppURL(trimmed)} alt="" />;
};

const getTypeIcon = (item) => {
  const name = getContentIcon(item?.['@type'], Boolean(item?.is_folderish));
  if (!name) {
    return undefined;
  }

  return <Icon name={name} size="24px" ariaHidden />;
};

export const resolveListItemMedia = (item, mediaPreset = 'mixed') => {
  const image = resolveImageUrlFromContent(item);

  if (mediaPreset === 'none') {
    return {};
  }

  if (mediaPreset === 'images') {
    return image ? { image } : {};
  }

  if (mediaPreset === 'icons') {
    if (image) {
      return { icon: <img src={image} alt="" /> };
    }

    const typeIcon = getTypeIcon(item);
    return typeIcon ? { icon: typeIcon } : {};
  }

  const media = {};
  const ownIcon = getOwnIcon(item);

  if (image) {
    media.image = image;
  }

  if (ownIcon) {
    media.icon = ownIcon;
  }

  return media;
};
