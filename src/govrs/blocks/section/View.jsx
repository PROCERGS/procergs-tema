import React from 'react';
import PropTypes from 'prop-types';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import config from '@plone/volto/registry';
import SectionBlockBody from './SectionBlockBody';

const View = (props) => {
  const { data, path, className, style } = props;
  const metadata = props.metadata || props.properties;
  const blocksConfig =
    config.blocks.blocksConfig[data['@type']].blocksConfig ||
    props.blocksConfig;
  const location = props.location || { pathname: path };

  return (
    <SectionBlockBody data={data} className={className} style={style}>
      <RenderBlocks
        {...props}
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
};

export default withBlockExtensions(View);
