import MapBlockView from '../../govrs/blocks/maps/View';
import MapBlockEdit from '../../govrs/blocks/maps/Edit';
import MapsBlockSchema from '../../govrs/blocks/maps/schema';

const configureMapsBlock = (config) => {
  config.blocks.blocksConfig.maps = {
    ...config.blocks.blocksConfig.maps,
    view: MapBlockView,
    edit: MapBlockEdit,
    blockSchema: MapsBlockSchema,
  };

  return config;
};

export default configureMapsBlock;
