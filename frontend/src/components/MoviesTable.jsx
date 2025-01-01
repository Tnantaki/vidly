import React, { Component } from 'react'
import Like from './common/Like';
import Table from './common/Table';
import { Link } from 'react-router-dom';
import auth from '../services/authService'

class MoviesTable extends Component {
  columns = [
    {
      name: "title",
      label: "Title",
      content: (movie) => (
        <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
      ),
    },
    { name: "genre.name", label: "Genre" },
    { name: "numberInStock", label: "Stock" },
    { name: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      label: "Like",
      content: (movie) => (
        <Like
          isLiked={movie.liked}
          onLike={() => this.props.onLike(movie._id)}
        />
      ),
    },
  ];

  deleteColumn = {
      key: "delete",
      content: (movie) => (
        auth.getCurrentUser() &&
        <button
          onClick={() => this.props.onDelete(movie._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      ),
  }

  constructor() {
    super()
    const user = auth.getCurrentUser()
    if (user && user.isAdmin) this.columns.push(this.deleteColumn)
  }

  render() {
    const { movies, onSort, sortColumn } = this.props;

    return (
      <Table
        data={movies}
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}
 
export default MoviesTable;