import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { defineMessages, useIntl } from 'react-intl';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import ButtonBlockSchema from './schema';
import ButtonBlockBody from './ButtonBlockBody';
import { normalizeButton } from './normalizeButton';

const messages = defineMessages({
  button: {
    id: 'Procergs Button Block',
    defaultMessage: 'Botão',
  },
});

const Edit = (props) => {
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
  const schema = ButtonBlockSchema({ ...props, intl });
  const { alignment } = normalizeButton(data);

  return (
    <div className="block procergsButton govrs-button-block">
      <div
        className={cx(
          'procergs-button-block__inner',
          `procergs-button-block__inner--${alignment}`,
        )}
      >
        <ButtonBlockBody data={data} isEditMode />
      </div>
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.button)}
          onChangeField={(id, value) =>
            onChangeBlock(block, {
              ...data,
              [id]: value,
            })
          }
          onChangeBlock={onChangeBlock}
          formData={data}
          block={block}
          navRoot={navRoot}
          contentType={contentType}
          errors={blocksErrors}
        />
      </SidebarPortal>
    </div>
  );
};

Edit.propTypes = {
  selected: PropTypes.bool.isRequired,
  block: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  onChangeBlock: PropTypes.func.isRequired,
};

export default compose(withBlockExtensions)(Edit);
