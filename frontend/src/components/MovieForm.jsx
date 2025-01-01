import React from 'react'
import Form from './common/Form'
import Joi from 'joi-browser'
import { getGenres } from '../services/genreService';
import { getMovie, saveMovie } from '../services/movieService';
import withRouter from './common/withRouter'

class MovieForm extends Form {
  state = {
    data: { title: "", genreId: "", numberInStock: 0, dailyRentalRate: 0 },
    errors: {},
    genres: [],
  };

  schema = {
    title: Joi.string().required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("Number of Stock"),
    dailyRentalRate: Joi.number().required().min(0).max(10).label("Rate"),
  };

  doSubmit = async () => {
    await saveMovie(this.state.data);
    this.props.router.navigate("/movies", { replace: true });
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateMovie() {
    const { id } = this.props.router.params;
    if (!id) return;

    try {
      const { data: movie } = await getMovie(id);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        return this.props.router.navigate("/not-found", { replace: true });
      }
    }
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovie();
  }

  render() {
    return (
      <div>
        <h1> MovieForm </h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")}
          {this.renderSelect("genreId", "Genre", this.state.genres)}
          {this.renderInput("numberInStock", "Number of Stock")}
          {this.renderInput("dailyRentalRate", "Rate")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default withRouter(MovieForm);