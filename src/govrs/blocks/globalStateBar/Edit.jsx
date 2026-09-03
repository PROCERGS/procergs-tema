import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import StateBarBlockSchema from './schema';
import { ProcergsGlobalStateBarBlock } from '../../components/Header/StateBar';

const messages = defineMessages({
  stateBar: {
    id: 'GovRS state bar',
    defaultMessage: 'Barra do Estado',
  },
  description: {
    id: 'GovRS state bar description',
    defaultMessage: 'Barra Standalone exclusiva da região global do Header.',
  },
});

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
          description={intl.formatMessage(messages.description)}
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
