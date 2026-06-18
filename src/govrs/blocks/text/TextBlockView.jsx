import React from 'react';
import cx from 'classnames';
import {
  serializeNodes,
  serializeNodesToText,
} from '@plone/volto-slate/editor/render';
import config from '@plone/volto/registry';
import isEqual from 'lodash/isEqual';
import Slugger from 'github-slugger';
import { normalizeString } from '@plone/volto/helpers/Utils/Utils';
import {
  TEXT_HEADERS_DESKTOP,
  TEXT_TYPOGRAPHY_WRAPPER,
} from '../../constants/typography';

const TextBlockView = (props) => {
  const { id, data, styling = {}, className } = props;
  const { value, override_toc } = data;
  const metadata = props.metadata || props.properties;
  const { topLevelTargetElements } = config.settings.slate;

  const getAttributes = (node, path) => {
    const res = { ...styling };
    if (node.type && isEqual(path, [0])) {
      if (topLevelTargetElements.includes(node.type) || override_toc) {
        const text = serializeNodesToText(node?.children || []);
        const slug = Slugger.slug(normalizeString(text));
        res.id = slug || id;
      }
    }
    return res;
  };

  return (
    <div
      className={cx(TEXT_TYPOGRAPHY_WRAPPER, TEXT_HEADERS_DESKTOP, className)}
    >
      {serializeNodes(value, getAttributes, { metadata })}
    </div>
  );
};

export default TextBlockView;
