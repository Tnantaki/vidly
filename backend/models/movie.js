import mongoose from 'mongoose'
import Joi from '../startup/joi.js'
import { GenreSchema } from './genre.js';

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: GenreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0,
    max: 999999,
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 999999,
  },
});

const Movie = mongoose.model('Movies', MovieSchema)

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  })
  return schema.validate(movie);
}

export {Movie, validateMovie as validate }