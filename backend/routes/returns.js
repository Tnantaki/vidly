import express from 'express'
import authorize from '../middleware/authorize.js'
import Joi from '../startup/joi.js'
import { Rental } from '../models/rental.js'
import validator from '../middleware/validate.js'
import { Movie } from '../models/movie.js'

const router = express.Router()

router.post("/", [authorize, validator(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId)
  if (!rental) return res.status(404).send("rental was not found");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("movie was not found");

  if (rental.dateReturned)
    return res.status(400).send("return already processed");

  const session = await Rental.startSession();
  if (!session)
    return res.status(500).send("Unable to start database session.");
  session.startTransaction();

  rental.return()

  const updatedRental = await rental.save({ session });
  movie.numberInStock++;
  await movie.save({ session });

  await session.commitTransaction();

  res.send(updatedRental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  })
  return schema.validate(req)
}

export default router