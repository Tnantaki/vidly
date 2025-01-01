import express from 'express'
import { Genre, validate } from '../models/genre.js'
import authorize from '../middleware/authorize.js'
import admin from '../middleware/admin.js'
import validateObjectId from '../middleware/validateObjectId.js'
import validator from '../middleware/validate.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const genres = await Genre.find().select('id name')
  return res.send(genres)
})

router.get('/:id', validateObjectId, async (req, res) => {

  const genre = await Genre.findById(req.params.id).select('id name')

  if (!genre) {
    return res.status(404).send('The course with the given id was not found.')
  }
  return res.send(genre)
})

router.post('/', [authorize, validator(validate)], async (req, res) => {
  const genre = new Genre({
    name: req.body.name
  })

  const result = await genre.save()
  return res.send(result)
})

router.put('/:id', [authorize, validateObjectId, validator(validate)], async (req, res) => {
  const genre = await Genre.findById(req.params.id)
  if (!genre) {
    return res.status(404).send('There are not the given id in the genres.')
  }

  genre.set({
    name: req.body.name
  })
  const result = await genre.save()
  return res.send(result)
})

router.delete('/:id', [authorize, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id)
  if (!genre) {
    return res.status(404).send('There are not the given id in genres.')
  }

  return res.send(genre)
})

export default router