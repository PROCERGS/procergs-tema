import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import DivisorBlockSchema from './schema';
import DivisorBlockBody from './DivisorBlockBody';
import { normalizeDivisor } from './normalizeDivisor';

const messages = defineMessages({
  divisor: {
    id: 'Procergs Divisor Block',
    defaultMessage: 'Divisor',
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
  const schema = DivisorBlockSchema({ ...props, intl });
  const { orientation } = normalizeDivisor(data);

  return (
    <div
      className={
        'block procergsDivisor govrs-divisor-block govrs-divisor-block--edit govrs-divisor-block--' +
        orientation
      }
    >
      <DivisorBlockBody data={data} />
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.divisor)}
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

export default withBlockExtensions(Edit);
