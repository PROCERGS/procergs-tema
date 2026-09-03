import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import FooterBlockSchema from './schema';
import { ProcergsGlobalFooterBlock } from '../../components/Footer/Footer';

const messages = defineMessages({
  footer: {
    id: 'GovRS footer',
    defaultMessage: 'Rodapé GovRS',
  },
  description: {
    id: 'GovRS footer description',
    defaultMessage:
      'Este é o rodapé atual do site, exclusivo desta região. Links e créditos continuam vindo das fontes já usadas pelo tema.',
  },
});

const FooterBlockEdit = (props) => {
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
  const schema = FooterBlockSchema({ ...props, intl });

  return (
    <>
      <ProcergsGlobalFooterBlock {...props} />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.footer)}
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

FooterBlockEdit.propTypes = {
  block: PropTypes.string,
  selected: PropTypes.bool,
  data: PropTypes.object,
  onChangeBlock: PropTypes.func,
};

export default withBlockExtensions(FooterBlockEdit);
