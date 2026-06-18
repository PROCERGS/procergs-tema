import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { uploadContent } from '@plone/volto-slate/actions/content';
import saveSlateBlockSelection from '@plone/volto-slate/actions/selection';
import DefaultTextBlockEditor from '@plone/volto-slate/blocks/Text/DefaultTextBlockEditor';
import DetachedTextBlockEditor from '@plone/volto-slate/blocks/Text/DetachedTextBlockEditor';
import { TEXT_TYPOGRAPHY_CLASSES } from '../../constants/typography';

import '@plone/volto-slate/blocks/Text/css/editor.css';

const TextBlockEdit = (props) => {
  const Editor = props.detached
    ? DetachedTextBlockEditor
    : DefaultTextBlockEditor;

  return (
    <div className={cx(TEXT_TYPOGRAPHY_CLASSES)}>
      <Editor {...props} />
    </div>
  );
};

export default connect(
  (state, props) => {
    const blockId = props.block;
    return {
      defaultSelection: blockId
        ? state.slate_block_selections?.[blockId]
        : null,
      uploadRequest: state.upload_content?.[props.block]?.upload || {},
      uploadedContent: state.upload_content?.[props.block]?.data || {},
    };
  },
  {
    uploadContent,
    saveSlateBlockSelection,
  },
)(TextBlockEdit);
