import express from 'express'
import { Movie, validate } from '../models/movie.js'
import { Genre } from '../models/genre.js'
import authorize from '../middleware/authorize.js'
import admin from '../middleware/admin.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const movies = await Movie
      .find()
      .sort('name')

    res.send(movies)
  } catch (error) {
    res.status(500).send('Error query data from database')
  }
  return
})

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)

    if (!movie) {
      res.status(404).send('The course with the given id was not found.')
      return
    }
    res.send(movie)
  } catch (error) {
    res.status(500).send('Error on server.')  
  }
  return
})

router.post("/", authorize, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genreId.");

    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });
    const result = await movie.save();
    res.send(result);
  } catch (error) {
    res.status(500).send("Error on save data into database");
  }
  return;
});

router.put('/:id', authorize, async (req, res) => {
  const {error} = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const movie = await Movie.findById(req.params.id)
    if (!movie) {
      return res.status(404).send("There aren't the given id in the movies.")
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genreId.");

    movie.set({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    })
    const result = await movie.save()
    res.send(result)
  } catch (error) {
    res.status(500).send('Error on server.')
  }
  return
})

router.delete('/:id', [authorize, admin], async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) {
      return res.status(404).send('There are not the given id in movies.')
    }
  
    res.send(`The movie id: "${movie.id}" had been deleted.`)
  } catch (error) {
    res.status(500).send('Error on server.')
  }
  return
})

export default router