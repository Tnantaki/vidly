import mongoose from 'mongoose'
import Joi from '../startup/joi.js'

const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model('Genre', GenreSchema)

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required()
  })
  return schema.validate(genre);
}

export {
  Genre,
  GenreSchema,
  validateGenre as validate
};