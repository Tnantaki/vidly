import React, { Component } from 'react'

// Interface
// columns: array
// sortColumn: object
// onSort: function

class TableHeader extends Component {
  raiseSort = (colName) => {
    const sortColumn = {...this.props.sortColumn}
    if (colName === sortColumn.name) {
      sortColumn.order = (sortColumn.order === 'asc') ? 'desc' : 'asc'
    } else {
      sortColumn.name = colName
      sortColumn.order = 'asc'
    }
    this.props.onSort(sortColumn)
  }

  renderSortIcon = (column) => {
    const { sortColumn } = this.props;
    if (column.name !== sortColumn.name) return null
    if (sortColumn.order === "asc")
      return <i className="fa-solid fa-sort-up"></i>;
    return <i className="fa-solid fa-sort-down"></i>
  }

  render() { 
    return (
      <thead>
        <tr>
          {this.props.columns.map((column, index) => (
            <th key={index} className='clickable' onClick={() => this.raiseSort(column.name)}>
              {column.label} {this.renderSortIcon(column)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}
 
export default TableHeader;