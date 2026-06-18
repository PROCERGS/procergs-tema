import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { defineMessages, useIntl } from 'react-intl';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import CarouselBlockSchema from './schema';
import CarouselBlockBody from './CarouselBlockBody';
import withCarouselItems from './withCarouselItems';

const messages = defineMessages({
  carousel: {
    id: 'Carousel',
    defaultMessage: 'Carousel',
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
    carouselItems,
    carouselLoaded,
  } = props;
  const intl = useIntl();
  const schema = CarouselBlockSchema({ ...props, intl });

  return (
    <div className="block carousel">
      <div className="carousel-inner govrs-carousel-block">
        <CarouselBlockBody
          data={data}
          items={carouselItems}
          loaded={carouselLoaded}
        />
      </div>
      {!selected && <div className="carousel-overlay" />}
      <SidebarPortal selected={selected}>
        <BlockDataForm
          schema={schema}
          title={intl.formatMessage(messages.carousel)}
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
  carouselItems: PropTypes.arrayOf(PropTypes.object),
  carouselLoaded: PropTypes.bool,
};

export default compose(withBlockExtensions, withCarouselItems)(Edit);
