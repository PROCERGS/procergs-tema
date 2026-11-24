import React from 'react';
import TeaserEdit from '@plone/volto/components/manage/Blocks/Teaser/Edit';

const TeaserBlockEdit = (props) => (
  <TeaserEdit
    {...props}
    onChangeBlock={(block, nextData) => {
      // Volto's source refresh omits variation-specific fields.
      const keepButton =
        props.data.variation === 'withButton' &&
        nextData.variation === undefined;
      props.onChangeBlock(
        block,
        keepButton
          ? {
              variation: props.data.variation,
              buttonLabel: props.data.buttonLabel,
              openLinkInNewTab: props.data.openLinkInNewTab,
              ...nextData,
            }
          : nextData,
      );
    }}
  />
);

export default TeaserBlockEdit;
