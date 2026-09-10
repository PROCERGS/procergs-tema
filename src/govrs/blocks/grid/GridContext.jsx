import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const GridColumnsContext = createContext(null);

export const GridColumnsProvider = ({ columns, children }) => (
  <GridColumnsContext.Provider value={columns}>
    {children}
  </GridColumnsContext.Provider>
);

GridColumnsProvider.propTypes = {
  columns: PropTypes.number.isRequired,
  children: PropTypes.node,
};

export const useGridColumns = () => useContext(GridColumnsContext);
