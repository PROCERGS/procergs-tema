import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import messages from './messages';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import StateBarBlockSchema from './schema';
import { ProcergsGlobalStateBarBlock } from '../../components/Header/StateBar';

const StateBarBlockEdit = (props) => {
  const {
    block,
    blocksErrors,
    onChangeBlock,
    data,
    selected,
    navRoot,
    contentType,
  } = props;
  const intl = useIntl();
  const schema = StateBarBlockSchema({ ...props, intl });

  return (
    <>
      <ProcergsGlobalStateBarBlock {...props} />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.stateBar)}
          description={intl.formatMessage(messages.editorDescription)}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          onChangeBlock={onChangeBlock}
          formData={data}
          block={block}
          navRoot={navRoot}
          contentType={contentType}
          errors={blocksErrors}
        />
      </SidebarPortal>
    </>
  );
};

StateBarBlockEdit.propTypes = {
  block: PropTypes.string,
  selected: PropTypes.bool,
  data: PropTypes.objectOf(PropTypes.any),
  onChangeBlock: PropTypes.func,
};

export default StateBarBlockEdit;
