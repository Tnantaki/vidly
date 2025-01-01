import React, { Component } from 'react'
import _ from 'lodash'

// Interface
// data: array

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item)
    return _.get(item, column.name)
  }
  render() { 
    const { data, columns } = this.props;

    return (
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((column, index) => (
              <td key={index}>{this.renderCell(item, column)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}
 
export default TableBody;