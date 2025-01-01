import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'

class Pagination extends Component {
  render() { 
    const {totalPages, pageSize, currentPage, onPageChange} = this.props
    
    const pageCount = Math.ceil(totalPages /  pageSize)
    const pages = _.range(1, pageCount + 1)

    if (pages < 2) return null
    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          {pages.map((page) => (
            <li
              key={page}
              className={
                page === currentPage ? "page-item active" : "page-item"
              }
            >
              <a className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
 
Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;