import express from 'express'
import { Rental, validate } from '../models/rental.js'
import { Customer } from '../models/customer.js'
import { Movie } from "../models/movie.js";
import authorize from '../middleware/authorize.js';

const router = express.Router()

router.get('/', authorize, async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut')

  res.send(rentals)
})

router.get('/:id', authorize, async (req, res) => {
  const rental = await Rental.findById(req.params.id)

  if (!rental) {
    return res.status(404).send('The rental with the given id was not found.')
  }
  res.send(rental)
})

router.post("/", authorize, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customerId.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movieId.");

  if (movie.numberInStock === 0) return res.status(400).send("Movie not in stock.")

  const session = await Rental.startSession()
  if (!session) return res.status(500).send('Unable to start database session.')

  // Start Trancsaction for using session
  // when save data, it will be save to the session
  // until we commit session, it will push to the database
  session.startTransaction()

  try {
    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    await rental.save({session})
    movie.numberInStock--
    await movie.save({session})

    await session.commitTransaction()
    res.send(rental);
  } catch (error) {
    res.status(500).send("Error on save data into database");
    console.log(error)
  }
  return;
});

export default router