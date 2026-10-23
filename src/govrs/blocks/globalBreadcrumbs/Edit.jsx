import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import messages from './messages';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import BreadcrumbsBlockSchema from './schema';
import { ProcergsGlobalBreadcrumbsBlock } from '../../components/Breadcrumbs/Breadcrumbs';

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
          description={intl.formatMessage(messages.editorDescription)}
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
