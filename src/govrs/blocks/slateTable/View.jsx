import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { Table as GovrsTable } from '@procergs/react-govrs-ds';
import {
  serializeNodes,
  serializeNodesToText,
} from '@plone/volto-slate/editor/render';
import { Node } from 'slate';

const serializeCell = (cell) => {
  if (!cell?.value || Node.string({ children: cell.value }).length === 0) {
    return '\u00A0';
  }

  return serializeNodes(cell.value);
};

const View = ({ data }) => {
  const [state, setState] = useState({
    column: null,
    direction: null,
  });

  const table = data?.table;

  const headers = useMemo(() => table?.rows?.[0]?.cells ?? [], [table?.rows]);

  const rows = useMemo(() => {
    const items = {};
    if (!table?.rows) return items;

    table.rows.forEach((row, index) => {
      if (index === 0) return;

      items[index] = row.cells.map((cell) => ({
        ...cell,
        value: serializeCell(cell),
        valueText:
          cell.value && Node.string({ children: cell.value }).length > 0
            ? serializeNodesToText(cell.value)
            : '\u00A0',
      }));
    });

    return items;
  }, [table?.rows]);

  const sortedRowKeys = useMemo(() => {
    const rowKeys = Object.keys(rows);
    if (state.column === null) return rowKeys;

    return rowKeys.sort((a, b) => {
      const aText = rows[a][state.column].valueText;
      const bText = rows[b][state.column].valueText;

      if (state.direction === 'ascending' ? aText < bText : aText > bText) {
        return -1;
      }
      if (state.direction === 'ascending' ? aText > bText : aText < bText) {
        return 1;
      }
      return 0;
    });
  }, [rows, state]);

  const handleSort = (index) => {
    if (!table?.sortable) return;

    setState({
      column: index,
      direction:
        state.column !== index
          ? 'ascending'
          : state.direction === 'ascending'
            ? 'descending'
            : 'ascending',
    });
  };

  if (!table) {
    return null;
  }

  return (
    <GovrsTable variant="irregular" className="procergs-slate-table-block">
      <table className="slate-table-block">
        {!table.hideHeaders ? (
          <thead>
            <tr>
              {headers.map((cell, index) => (
                <th
                  key={cell.key}
                  scope="col"
                  tabIndex={table.sortable ? 0 : -1}
                  aria-sort={
                    state.column === index ? state.direction : 'none'
                  }
                  onClick={() => handleSort(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleSort(index);
                    }
                  }}
                >
                  {serializeCell(cell)}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {map(sortedRowKeys, (rowKey) => (
            <tr key={rowKey}>
              {map(rows[rowKey], (cell) => {
                const isHeaderCell = cell.type === 'header';
                const CellTag = isHeaderCell ? 'th' : 'td';

                return (
                  <CellTag
                    key={cell.key}
                    {...(isHeaderCell ? { scope: 'row' } : {})}
                  >
                    {cell.value}
                  </CellTag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </GovrsTable>
  );
};

View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
