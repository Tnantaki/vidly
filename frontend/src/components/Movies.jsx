import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteMovie, getMovies } from "../services/movieService";
import { paginage } from "../utils/paginate";
import { getGenres } from '../services/genreService';
import MoviesTable from './MoviesTable';
import Pagination from './common/Pagination';
import ListGroup from './common/ListGroup';
import SearchBox from './common/SearchBox';

const genreDefault = {_id: '', name: 'All Genres'}

class Movies extends Component {
  state = {
    movies: [], // set empty movies
    genres: [], // set empty genre
    pageSize: 4,
    currentPage: 1,
    selectedGenre: genreDefault,
    sortColumn: {name: 'title', order: 'asc'},
    searchQuery: '',
  };

  // Working after create DOM, seem like fetch data from backend
  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [genreDefault, ...data]

    const { data: movies } = await getMovies();
    this.setState({movies, genres})
  }

  handleOnDelete = async (id) => {
    const originalMovies = this.state.movies
    const movies = originalMovies.filter((m) => m._id !== id);
    this.setState({ movies });

    try {
      await deleteMovie(id)
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error('This movie has already been deleted.')
    
      this.setState({movies: originalMovies})
    }

  };

  handleLike = (id) => {
    const movies = this.state.movies.map((m) => {
      if (m._id === id) m.liked = !m.liked;
      return m;
    });
    this.setState({ movies });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = (genre) => {
    this.setState({ selectedGenre: genre, currentPage: 1, searchQuery: '' });
  };

  handleSort = (sortColumn) => {
    this.setState({sortColumn})
  }

  handleSearch = (query) => {
    this.setState({searchQuery: query, selectedGenre: genreDefault, currentPage: 1})
  }

  getPageMovies = () => {
    const {
      movies,
      currentPage,
      pageSize,
      selectedGenre,
      sortColumn,
      searchQuery,
    } = this.state;

    let filteredMoviesGenre = null
    if (searchQuery) {
      filteredMoviesGenre = movies.filter((m) =>
        m.title.toLocaleLowerCase().includes(searchQuery)
      );
    } else {
      filteredMoviesGenre =
        selectedGenre && selectedGenre._id
          ? movies.filter((m) => m.genre._id === selectedGenre._id)
          : movies;
    }
    const sortedMovies = _.orderBy(
      filteredMoviesGenre,
      [sortColumn.name],
      [sortColumn.order]
    );
    const filteredMoviesPage = paginage(sortedMovies, currentPage, pageSize);
    return { totalCount: filteredMoviesGenre.length, movies: filteredMoviesPage}
  }

  render() {
    const { length: totalPages } = this.state.movies;

    if (!totalPages) return <p>There are no movies in the database.</p>;

    const { currentPage, pageSize, genres, selectedGenre, sortColumn, searchQuery} =
      this.state;

    const {totalCount, movies} = this.getPageMovies()

    const { user } = this.props;

    return (
      <div className="movies row">
        <div className="col-2">
          <ListGroup
            items={genres}
            selectedItem={selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (
            <Link to="/movies/new">
              <button className="btn btn-primary mb-3">New Movie</button>
            </Link>
          )}
          <p>Showing {totalCount} movies in the database.</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleOnDelete}
            onSort={this.handleSort}
          />
          <Pagination
            totalPages={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}
 
export default Movies;