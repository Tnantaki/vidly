import React, { Component } from 'react'

class ListGroup extends Component {
  render() { 
    const {items, selectedItem, onItemSelect} = this.props

    return (
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            key={index}
            className={
              item._id === selectedItem._id
                ? "list-group-item active"
                : "list-group-item"
            }
            onClick={() => onItemSelect(item)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    );
  }
}
 
export default ListGroup;