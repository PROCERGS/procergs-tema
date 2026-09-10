import MapBlockView from '../../govrs/blocks/maps/View';
import MapBlockEdit from '../../govrs/blocks/maps/Edit';
import MapsBlockSchema from '../../govrs/blocks/maps/schema';
import mapsGridRules from '../../govrs/blocks/maps/gridRules';

const configureMapsBlock = (config) => {
  config.blocks.blocksConfig.maps = {
    ...config.blocks.blocksConfig.maps,
    view: MapBlockView,
    edit: MapBlockEdit,
    blockSchema: MapsBlockSchema,
    gridRules: mapsGridRules,
  };

  return config;
};

export default configureMapsBlock;
