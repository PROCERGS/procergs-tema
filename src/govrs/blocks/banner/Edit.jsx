import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { defineMessages, useIntl } from 'react-intl';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import BannerBlockSchema from './schema';
import BannerBlockBody from './BannerBlockBody';

const messages = defineMessages({
  banner: {
    id: 'Banner',
    defaultMessage: 'Banner',
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
  const schema = BannerBlockSchema({ ...props, intl });

  return (
    <div
      className={cx(
        'block banner align',
        {
          center: !Boolean(data.align),
        },
        data.align,
      )}
    >
      <div
        className={cx('banner-inner govrs-banner-block', {
          'full-width': data.align === 'full',
        })}
      >
        <BannerBlockBody data={data} isEditMode />
      </div>
      {!selected && <div className="banner-overlay" />}
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.banner)}
          onChangeField={(id, value, itemInfo = {}) => {
            const nextData = {
              ...data,
              [id]: value,
            };

            if (id === 'image') {
              if (value && itemInfo.image_field) {
                nextData.image_field = itemInfo.image_field;
              }
              if (value && itemInfo.image_scales) {
                nextData.image_scales = itemInfo.image_scales;
              }
              if (!value) {
                delete nextData.image_field;
                delete nextData.image_scales;
              }
            }

            onChangeBlock(block, nextData);
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
