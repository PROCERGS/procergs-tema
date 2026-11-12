import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Divisor } from '@procergs/react-govrs-ds';
import DefaultEditBlockWrapper from '@plone/volto/components/manage/Blocks/Container/EditBlockWrapper';
import { normalizeDivisor } from '../divisor/normalizeDivisor';
import { getGridDividerVisibility } from './getGridDividerVisibility';

const GridDividersContext = createContext(null);

export const GridDividersProvider = ({ data, children }) => (
  <GridDividersContext.Provider
    value={
      data.verticalDividers === true
        ? normalizeDivisor({
            variant: data.dividerVariant,
            thickness: data.dividerThickness,
            orientation: 'vertical',
          })
        : null
    }
  >
    {children}
  </GridDividersContext.Provider>
);

GridDividersProvider.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.node,
};

const GridColumnDivider = () => {
  const divisor = useContext(GridDividersContext);
  const dividerRef = useRef(null);
  const [visibility, setVisibility] = useState({
    vertical: false,
    horizontal: false,
  });

  useEffect(() => {
    if (!divisor) return undefined;
    const column = dividerRef.current?.closest('.column, .contained');
    const container = column?.parentElement;
    if (!container) return undefined;
    const columns = Array.from(container.children).filter((element) =>
      element.matches('.column, .contained'),
    );
    const update = () => {
      const next = getGridDividerVisibility(
        columns.map((element) => element.offsetTop),
        columns.indexOf(column),
      );
      setVisibility((current) =>
        current.vertical === next.vertical &&
        current.horizontal === next.horizontal
          ? current
          : next,
      );
    };
    update();
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(container);
    columns.forEach((element) => observer?.observe(element));
    window.addEventListener('resize', update);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [divisor]);

  return divisor ? (
    <>
      <div
        ref={dividerRef}
        className="govrs-grid-column-divider"
        data-visible={visibility.vertical}
        aria-hidden="true"
      >
        <Divisor {...divisor} />
      </div>
      <div
        className="govrs-grid-row-divider"
        data-visible={visibility.horizontal}
        aria-hidden="true"
      >
        <Divisor {...divisor} orientation="horizontal" />
      </div>
    </>
  ) : null;
};

export const GridViewColumn = ({ children }) => (
  <Grid.Column>
    {children}
    <GridColumnDivider />
  </Grid.Column>
);

GridViewColumn.propTypes = { children: PropTypes.node };

export const GridEditBlockWrapper = ({ children, ...props }) => (
  <DefaultEditBlockWrapper {...props}>
    {children}
    <GridColumnDivider />
  </DefaultEditBlockWrapper>
);

GridEditBlockWrapper.propTypes = { children: PropTypes.node };
