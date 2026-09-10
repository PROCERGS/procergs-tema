import React from 'react';
import PropTypes from 'prop-types';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import config from '@plone/volto/registry';
import isNestedContainer from '../container/isNestedContainer';
import { getRenderableBlocksConfig } from '../container/restrictions';
import SectionBlockBody from './SectionBlockBody';

const View = (props) => {
  const { data, path, className, style } = props;
  const metadata = props.metadata || props.properties;
  const blockConfig =
    props.blocksConfig?.[data['@type']] ||
    config.blocks.blocksConfig[data['@type']];
  const configuredBlocks = blockConfig.blocksConfig || props.blocksConfig || {};
  const blocksConfig = getRenderableBlocksConfig({
    allowedBlocks: Object.keys(configuredBlocks),
    blocksConfig: configuredBlocks,
    fallbackBlocksConfig: config.blocks.blocksConfig,
    data,
  });
  const location = props.location || { pathname: path };

  return (
    <SectionBlockBody
      data={data}
      className={className}
      style={style}
      isNested={isNestedContainer(props.properties, props.isContainer)}
    >
      <RenderBlocks
        {...props}
        blockWrapperTag={undefined}
        content={data}
        metadata={metadata}
        location={location}
        blocksConfig={blocksConfig}
        isContainer
      />
    </SectionBlockBody>
  );
};

View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  path: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  metadata: PropTypes.objectOf(PropTypes.any),
  properties: PropTypes.objectOf(PropTypes.any),
  blocksConfig: PropTypes.objectOf(PropTypes.any),
  isContainer: PropTypes.bool,
};

export default withBlockExtensions(View);
