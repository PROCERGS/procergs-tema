import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { defineMessages, useIntl } from 'react-intl';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import AccordionBlockSchema from './schema';
import AccordionBlockBody from './AccordionBlockBody';

const messages = defineMessages({
  accordion: {
    id: 'Accordion',
    defaultMessage: 'Accordion',
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
  const schema = AccordionBlockSchema({ ...props, intl });

  return (
    <div
      className={cx(
        'block accordion align',
        {
          center: !Boolean(data.align),
        },
        data.align,
      )}
    >
      <div
        className={cx('accordion-inner govrs-accordion-block', {
          'full-width': data.align === 'full',
        })}
      >
        <AccordionBlockBody data={data} />
      </div>
      {!selected && <div className="accordion-overlay" />}
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.accordion)}
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
