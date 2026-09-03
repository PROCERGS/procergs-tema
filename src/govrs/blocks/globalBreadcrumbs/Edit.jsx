import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import BreadcrumbsBlockSchema from './schema';
import { ProcergsGlobalBreadcrumbsBlock } from '../../components/Breadcrumbs/Breadcrumbs';

const messages = defineMessages({
  breadcrumbs: {
    id: 'GovRS breadcrumbs',
    defaultMessage: 'Breadcrumbs GovRS',
  },
  description: {
    id: 'GovRS breadcrumbs description',
    defaultMessage:
      'Navegação estrutural exclusiva da região global do Header, preenchida automaticamente com a página atual.',
  },
});

const BreadcrumbsBlockEdit = (props) => {
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
  const schema = BreadcrumbsBlockSchema({ ...props, intl });

  return (
    <>
      <ProcergsGlobalBreadcrumbsBlock {...props} isEditPreview />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.breadcrumbs)}
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

BreadcrumbsBlockEdit.propTypes = {
  block: PropTypes.string,
  selected: PropTypes.bool,
  data: PropTypes.objectOf(PropTypes.any),
  onChangeBlock: PropTypes.func,
};

export default BreadcrumbsBlockEdit;
