import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import HeaderBlockSchema from './schema';
import { ProcergsGlobalHeaderBlock } from '../../components/Header/Header';

const messages = defineMessages({
  header: {
    id: 'GovRS header',
    defaultMessage: 'Cabeçalho GovRS',
  },
  description: {
    id: 'GovRS header description',
    defaultMessage:
      'Este é o cabeçalho atual do site, exclusivo desta região. Logo, menu e busca continuam vindo das fontes já usadas pelo tema.',
  },
});

const HeaderBlockEdit = (props) => {
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
  const schema = HeaderBlockSchema({ ...props, intl });

  return (
    <>
      <ProcergsGlobalHeaderBlock {...props} />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.header)}
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

HeaderBlockEdit.propTypes = {
  block: PropTypes.string,
  selected: PropTypes.bool,
  data: PropTypes.object,
  onChangeBlock: PropTypes.func,
};

export default HeaderBlockEdit;
