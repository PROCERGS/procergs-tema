import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import AccessibilityBarBlockSchema from './schema';
import { ProcergsGlobalAccessibilityBarBlock } from '../../components/Header/AccessibilityBar';

const messages = defineMessages({
  accessibilityBar: {
    id: 'GovRS accessibility bar',
    defaultMessage: 'Barra de Acessibilidade',
  },
  description: {
    id: 'GovRS accessibility bar description',
    defaultMessage:
      'Barra exclusiva da região global do Header, com atalhos e controles de acessibilidade.',
  },
});

const AccessibilityBarBlockEdit = (props) => {
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
  const schema = AccessibilityBarBlockSchema({ ...props, intl });

  return (
    <>
      <ProcergsGlobalAccessibilityBarBlock {...props} />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.accessibilityBar)}
          description={intl.formatMessage(messages.description)}
          onChangeField={(id, value) => {
            onChangeBlock(block, {
              ...data,
              [id]: value,
            });
          }}
          onChangeBlock={onChangeBlock}
          formData={{
            ...data,
            allowOverlay: data?.allowOverlay !== false,
          }}
          block={block}
          navRoot={navRoot}
          contentType={contentType}
          errors={blocksErrors}
        />
      </SidebarPortal>
    </>
  );
};

AccessibilityBarBlockEdit.propTypes = {
  block: PropTypes.string,
  selected: PropTypes.bool,
  data: PropTypes.objectOf(PropTypes.any),
  onChangeBlock: PropTypes.func,
};

export default AccessibilityBarBlockEdit;
