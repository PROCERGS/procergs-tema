import PropTypes from 'prop-types';
import cx from 'classnames';
import { Grid } from 'semantic-ui-react';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { withBlockExtensions } from '@plone/volto/helpers/Extensions';
import config from '@plone/volto/registry';
import isNestedContainer from '../container/isNestedContainer';
import SectionBlockBody from '../section/SectionBlockBody';
import { GridColumnsProvider } from './GridContext';

const GridBlockView = (props) => {
  const { data, path, className, style } = props;
  const metadata = props.metadata || props.properties;

  if (data.blocks_layout === undefined) {
    return null;
  }

  const columns = data.blocks_layout.items;
  const blockConfig =
    props.blocksConfig?.[data['@type']] ||
    config.blocks.blocksConfig[data['@type']];
  const blocksConfig = blockConfig.blocksConfig || props.blocksConfig;
  const location = props.location || { pathname: path };

  return (
    <SectionBlockBody
      data={data}
      blockType="gridBlock"
      variant="grid"
      className={cx(
        {
          one: columns.length === 1,
          two: columns.length === 2,
          three: columns.length === 3,
          four: columns.length >= 4,
        },
        className,
      )}
      style={style}
      isNested={isNestedContainer(props.properties, props.isContainer)}
    >
      <GridColumnsProvider columns={columns.length}>
        {data.headline && <h2 className="headline">{data.headline}</h2>}
        <Grid stackable stretched columns={columns.length}>
          <RenderBlocks
            {...props}
            blockWrapperTag={Grid.Column}
            metadata={metadata}
            content={data}
            location={location}
            blocksConfig={blocksConfig}
            isContainer
          />
        </Grid>
      </GridColumnsProvider>
    </SectionBlockBody>
  );
};

GridBlockView.propTypes = {
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

export default withBlockExtensions(GridBlockView);
