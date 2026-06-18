import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import remove from 'lodash/remove';
import { Button } from 'semantic-ui-react';
import cx from 'classnames';
import { defineMessages, injectIntl } from 'react-intl';
import { Table as GovrsTable } from '@procergs/react-govrs-ds';

import Cell from '@plone/volto-slate/blocks/Table/Cell';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
import { BlockDataForm } from '@plone/volto/components/manage/Form';
import TableSchema from '@plone/volto-slate/blocks/Table/schema';

import rowBeforeSVG from '@plone/volto/icons/row-before.svg';
import rowAfterSVG from '@plone/volto/icons/row-after.svg';
import colBeforeSVG from '@plone/volto/icons/column-before.svg';
import colAfterSVG from '@plone/volto/icons/column-after.svg';
import rowDeleteSVG from '@plone/volto/icons/row-delete.svg';
import colDeleteSVG from '@plone/volto/icons/column-delete.svg';

const getId = () => Math.floor(Math.random() * Math.pow(2, 24)).toString(32);

function getEmptyParagraph() {
  return [{ type: 'p', children: [{ text: '' }] }];
}

const emptyCell = (type = 'data') => ({
  key: getId(),
  type: type,
  value: getEmptyParagraph(),
});

const emptyRow = (cells) => ({
  key: getId(),
  cells: map(cells, () => emptyCell()),
});

const initialTable = {
  hideHeaders: false,
  fixed: true,
  compact: false,
  basic: false,
  celled: true,
  inverted: false,
  striped: false,
  rows: [
    {
      key: getId(),
      cells: [
        {
          key: getId(),
          type: 'header',
          value: getEmptyParagraph(),
        },
        {
          key: getId(),
          type: 'header',
          value: getEmptyParagraph(),
        },
      ],
    },
    {
      key: getId(),
      cells: [
        {
          key: getId(),
          type: 'data',
          value: getEmptyParagraph(),
        },
        {
          key: getId(),
          type: 'data',
          value: getEmptyParagraph(),
        },
      ],
    },
  ],
};

const messages = defineMessages({
  insertRowBefore: {
    id: 'Insert row before',
    defaultMessage: 'Insert row before',
  },
  insertRowAfter: {
    id: 'Insert row after',
    defaultMessage: 'Insert row after',
  },
  deleteRow: {
    id: 'Delete row',
    defaultMessage: 'Delete row',
  },
  insertColBefore: {
    id: 'Insert col before',
    defaultMessage: 'Insert col before',
  },
  insertColAfter: {
    id: 'Insert col after',
    defaultMessage: 'Insert col after',
  },
  deleteCol: {
    id: 'Delete col',
    defaultMessage: 'Delete col',
  },
  left: {
    id: 'Left',
    defaultMessage: 'Left',
  },
  center: {
    id: 'Center',
    defaultMessage: 'Center',
  },
  right: {
    id: 'Right',
    defaultMessage: 'Right',
  },
  bottom: {
    id: 'Bottom',
    defaultMessage: 'Bottom',
  },
  middle: {
    id: 'Middle',
    defaultMessage: 'Middle',
  },
  top: {
    id: 'Top',
    defaultMessage: 'Top',
  },
});

class Edit extends Component {

  static propTypes = {
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    detached: PropTypes.bool,
    index: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    onAddBlock: PropTypes.func.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onInsertBlock: PropTypes.func.isRequired,
    onMutateBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
  };

  static defaultProps = {
    detached: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      headers: [],
      rows: {},
      selected: {
        row: 0,
        cell: 0,
      },
      isClient: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSelectCell = this.onSelectCell.bind(this);
    this.onInsertRowBefore = this.onInsertRowBefore.bind(this);
    this.onInsertRowAfter = this.onInsertRowAfter.bind(this);
    this.onInsertColBefore = this.onInsertColBefore.bind(this);
    this.onInsertColAfter = this.onInsertColAfter.bind(this);
    this.onDeleteRow = this.onDeleteRow.bind(this);
    this.onDeleteCol = this.onDeleteCol.bind(this);
    this.onChangeCell = this.onChangeCell.bind(this);
    this.toggleCellType = this.toggleCellType.bind(this);
  }

  componentDidMount() {
    if (!this.props.data.table || isEmpty(this.props.data.table)) {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        table: initialTable,
      });
    }
    this.setState({ isClient: true });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.data.table || isEmpty(nextProps.data.table)) {
      this.props.onChangeBlock(nextProps.block, {
        ...nextProps.data,
        table: initialTable,
      });
    }
  }

  onChange(id, value) {
    const table = this.props.data.table;
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        [id]: value,
      },
    });
  }

  onSelectCell(row, cell) {
    this.setState({ selected: { row, cell } });
  }

  onChangeCell(row, cell, slateValue) {
    const table = JSON.parse(JSON.stringify(this.props.data.table));
    table.rows[row].cells[cell] = {
      ...table.rows[row].cells[cell],
      value: JSON.parse(JSON.stringify(slateValue)),
    };
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table,
    });
  }

  toggleCellType() {
    const table = { ...this.props.data.table };
    let type =
      table.rows[this.state.selected.row].cells[this.state.selected.cell].type;
    table.rows[this.state.selected.row].cells[this.state.selected.cell].type =
      type === 'header' ? 'data' : 'header';
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table,
    });
  }

  onInsertRowBefore() {
    const table = this.props.data.table;
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: [
          ...table.rows.slice(0, this.state.selected.row),
          emptyRow(table.rows[0].cells),
          ...table.rows.slice(this.state.selected.row),
        ],
      },
    });
    this.setState({
      selected: {
        row: this.state.selected.row + 1,
        cell: this.state.selected.cell,
      },
    });
  }

  onInsertRowAfter() {
    const table = this.props.data.table;
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: [
          ...table.rows.slice(0, this.state.selected.row + 1),
          emptyRow(table.rows[0].cells),
          ...table.rows.slice(this.state.selected.row + 1),
        ],
      },
    });
  }

  onInsertColBefore() {
    const table = this.props.data.table;
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: map(table.rows, (row, index) => ({
          ...row,
          cells: [
            ...row.cells.slice(0, this.state.selected.cell),
            emptyCell(table.rows[index].cells[this.state.selected.cell].type),
            ...row.cells.slice(this.state.selected.cell),
          ],
        })),
      },
    });
    this.setState({
      selected: {
        row: this.state.selected.row,
        cell: this.state.selected.cell + 1,
      },
    });
  }

  onInsertColAfter() {
    const table = this.props.data.table;
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: map(table.rows, (row, index) => ({
          ...row,
          cells: [
            ...row.cells.slice(0, this.state.selected.cell + 1),
            emptyCell(table.rows[index].cells[this.state.selected.cell].type),
            ...row.cells.slice(this.state.selected.cell + 1),
          ],
        })),
      },
    });
  }

  onDeleteCol() {
    const table = this.props.data.table;

    if (this.state.selected.cell === table.rows[0].cells.length - 1) {
      this.setState({
        selected: {
          row: this.state.selected.row,
          cell: this.state.selected.cell - 1,
        },
      });
    }

    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: map(table.rows, (row) => ({
          ...row,
          cells: remove(
            row.cells,
            (cell, index) => index !== this.state.selected.cell,
          ),
        })),
      },
    });
  }

  onDeleteRow() {
    const table = this.props.data.table;

    if (this.state.selected.row === table.rows.length - 1) {
      this.setState({
        selected: {
          row: this.state.selected.row - 1,
          cell: this.state.selected.cell,
        },
      });
    }

    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      table: {
        ...table,
        rows: remove(
          table.rows,
          (row, index) => index !== this.state.selected.row,
        ),
      },
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selected && !this.props.selected) {
      this.setState({ selected: null });
    }
  }

  render() {
    const headers = this.props.data.table?.rows?.[0]?.cells || [];
    const rows =
      this.props.data.table?.rows?.filter((_, index) => index > 0) || [];
    const schema = TableSchema(this.props);

    return (

      <div
        className={cx('block table procergs-slate-table-block', {
          selected: this.props.selected,
        })}
      >
        {this.props.selected && (
          <div className="toolbar">
            <Button.Group>
              <Button
                icon
                basic
                onClick={this.onInsertRowBefore}
                title={this.props.intl.formatMessage(messages.insertRowBefore)}
                aria-label={this.props.intl.formatMessage(
                  messages.insertRowBefore,
                )}
              >
                <Icon name={rowBeforeSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                onClick={this.onInsertRowAfter}
                title={this.props.intl.formatMessage(messages.insertRowAfter)}
                aria-label={this.props.intl.formatMessage(
                  messages.insertRowAfter,
                )}
              >
                <Icon name={rowAfterSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                onClick={this.onDeleteRow}
                disabled={this.props.data.table?.rows?.length === 1}
                title={this.props.intl.formatMessage(messages.deleteRow)}
                aria-label={this.props.intl.formatMessage(messages.deleteRow)}
              >
                <Icon name={rowDeleteSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                onClick={this.onInsertColBefore}
                title={this.props.intl.formatMessage(messages.insertColBefore)}
                aria-label={this.props.intl.formatMessage(
                  messages.insertColBefore,
                )}
              >
                <Icon name={colBeforeSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                onClick={this.onInsertColAfter}
                title={this.props.intl.formatMessage(messages.insertColAfter)}
                aria-label={this.props.intl.formatMessage(
                  messages.insertColAfter,
                )}
              >
                <Icon name={colAfterSVG} size="24px" />
              </Button>
            </Button.Group>
            <Button.Group>
              <Button
                icon
                basic
                onClick={this.onDeleteCol}
                disabled={this.props.data.table?.rows?.[0].cells.length === 1}
                title={this.props.intl.formatMessage(messages.deleteCol)}
                aria-label={this.props.intl.formatMessage(messages.deleteCol)}
              >
                <Icon name={colDeleteSVG} size="24px" />
              </Button>
            </Button.Group>
          </div>
        )}
        {this.props.data.table && (
          <GovrsTable variant="irregular">
            <table className="slate-table-block">
              {!this.props.data.table.hideHeaders ? (
                <thead>
                  <tr>
                    {headers.map((cell, cellIndex) => (
                      <th key={cell.key} scope="col">
                        <Cell
                          value={cell.value}
                          row={0}
                          cell={cellIndex}
                          onSelectCell={this.onSelectCell}
                          selected={
                            this.props.selected &&
                            this.state.selected &&
                            0 === this.state.selected.row &&
                            cellIndex === this.state.selected.cell
                          }
                          selectedCell={this.state.selected}
                          isTableBlockSelected={this.props.selected}
                          onAddBlock={this.props.onAddBlock}
                          onSelectBlock={this.props.onSelectBlock}
                          onChange={this.onChangeCell}
                          index={this.props.index}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {map(rows, (row, rowIndex) => (
                  <tr key={row.key}>
                    {map(row.cells, (cell, cellIndex) => {
                      const isHeaderCell = cell.type === 'header';
                      const CellTag = isHeaderCell ? 'th' : 'td';
                      const isSelected =
                        this.props.selected &&
                        this.state.selected &&
                        rowIndex + 1 === this.state.selected.row &&
                        cellIndex === this.state.selected.cell;

                      return (
                        <CellTag
                          key={cell.key}
                          {...(isHeaderCell ? { scope: 'row' } : {})}
                          className={isSelected ? 'selected' : undefined}
                        >
                          <Cell
                            value={cell.value}
                            row={rowIndex + 1}
                            cell={cellIndex}
                            onSelectCell={this.onSelectCell}
                            selected={isSelected}
                            selectedCell={this.state.selected}
                            isTableBlockSelected={this.props.selected}
                            onAddBlock={this.props.onAddBlock}
                            onSelectBlock={this.props.onSelectBlock}
                            onChange={this.onChangeCell}
                            index={this.props.index}
                          />
                        </CellTag>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </GovrsTable>
        )}
        {this.props.selected && this.state.selected && this.state.isClient && (
          <SidebarPortal selected={this.props.selected}>
            <BlockDataForm
              schema={schema}
              title={schema.title}
              onChangeField={(id, value) => {
                this.props.onChangeBlock(this.props.block, {
                  ...this.props.data,
                  [id]: value,
                });
              }}
              onChangeBlock={this.props.onChangeBlock}
              formData={this.props.data}
              block={this.props.block}
              blocksConfig={this.props.blocksConfig}
            />
          </SidebarPortal>
        )}
      </div>
    );
  }
}

export default injectIntl(Edit);
