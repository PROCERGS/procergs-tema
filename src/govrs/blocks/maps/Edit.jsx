import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { defineMessages, useIntl } from 'react-intl';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import MapsBlockSchema from './schema';
import MapBlockBody from './MapBlockBody';

const messages = defineMessages({
  maps: {
    id: 'Maps',
    defaultMessage: 'Maps',
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
  const schema = MapsBlockSchema({ ...props, intl });

  return (
    <div
      className={cx(
        'block maps align',
        {
          center: !data.align,
        },
        data.align,
      )}
    >
      <div
        className={cx('maps-inner govrs-map-block', {
          'full-width': data.align === 'full',
        })}
      >
        <MapBlockBody data={data} />
      </div>
      {!selected && <div className="map-overlay" />}
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.maps)}
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
