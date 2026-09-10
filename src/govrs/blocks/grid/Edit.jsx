import PropTypes from 'prop-types';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { setUIState } from '@plone/volto/actions/form/form';
import ContainerEdit from '../container/Edit';
import isNestedContainer from '../container/isNestedContainer';
import SectionBlockBody from '../section/SectionBlockBody';
import { GridColumnsProvider } from './GridContext';

const GridBlockEdit = (props) => {
  const { data, className, style } = props;
  const columnsLength = data?.blocks_layout?.items?.length || 0;
  const columnsClassNames = {
    one: columnsLength === 1,
    two: columnsLength === 2,
    three: columnsLength === 3,
    four: columnsLength >= 4,
  };
  const selectedBlock = useSelector((state) => state.form.ui.gridSelected);
  const dispatch = useDispatch();

  return (
    <SectionBlockBody
      data={data}
      blockType="gridBlock"
      variant="grid"
      className={cx(columnsClassNames, className)}
      style={style}
      isNested={isNestedContainer(props.properties, props.isContainer)}
      isEditMode
    >
      <GridColumnsProvider columns={columnsLength}>
        <div
          className={cx('grid-items', columnsClassNames)}
          onClick={(event) => {
            if (!event.block) dispatch(setUIState({ gridSelected: null }));
          }}
          role="presentation"
        >
          <ContainerEdit
            {...props}
            selectedBlock={selectedBlock}
            setSelectedBlock={(id) =>
              dispatch(setUIState({ gridSelected: id }))
            }
            direction="horizontal"
          />
        </div>
      </GridColumnsProvider>
    </SectionBlockBody>
  );
};

GridBlockEdit.propTypes = {
  block: PropTypes.string.isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  onChangeBlock: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  manage: PropTypes.bool.isRequired,
  className: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.any),
  properties: PropTypes.objectOf(PropTypes.any),
  isContainer: PropTypes.bool,
};

export default GridBlockEdit;
