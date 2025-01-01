// Test-Driven Development
// POST /api/returns {customerId, movieId}

// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found in customer/movie
// Return 400 if rental already processed
// Return 200 if valid request
// Set the return date
// Calculate the rental fee
// Increase the stock
// Return the rental

import request from 'supertest'
import mongoose from 'mongoose'
import { Rental } from '../../models/rental.js'
import { User } from '../../models/user.js'
import { Movie } from '../../models/movie.js'
import moment from 'moment'

let server

beforeAll(async () => {
  const {default: s} = await import('../../index.js')
  server = s
})

afterAll(async () => {
  await server.close()
  await mongoose.connection.close()
})

describe('/api/returns', ()=>{
  let customerId
  let movieId
  let rental
  let movie
  let token
  let payload

  beforeEach(async () => {
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    movie = new Movie({
      _id: movieId,
      title: '12345',
      genre: {
        name: '12345'
      },
      numberInStock: 1,
      dailyRentalRate: 2
    })
    await movie.save()

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });
    await rental.save();

    token = new User().generateAuthToken()
    payload = {
      customerId,
      movieId      
    }
  });

  afterEach(async()=> {
    await Rental.deleteMany({})
    await Movie.deleteMany({})
  })

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send(payload)
  }

  // it('should working', async () => {
  //   const rentalSearch = await Rental.findById(rental._id)
  //   expect(rentalSearch).not.toBeNull()
  // })

  it('should return 401 if client is not logged in', async()=>{
    token = ''
    const res = await exec()
    expect(res.status).toBe(401)
  })

  it('should return 400 if customerId is not provided', async()=>{
    payload = {movieId}
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should return 400 if movieId is not provided', async()=>{
    payload = {customerId}
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should return 404 if no rental found in customer/movie', async()=>{
    await Rental.deleteMany({})
    const res = await exec()
    expect(res.status).toBe(404)
  })

  it('should return 400 if retal already processed', async()=>{
    rental.dateReturned = new Date()
    await rental.save()
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should return 200 if valid request', async()=>{
    const res = await exec()
    expect(res.status).toBe(200)
  })

  it('should set the dateReturned if valid request', async()=>{
    await exec()
    const rentalDB = await Rental.findById(rental._id)
    const diffTime = new Date() - rentalDB.dateReturned
    // for more specific, check the number is a real date number
    expect(diffTime).toBeLessThan(5 * 1000) // less than 5 sec
  })

  it('should calculate the rental fee', async()=>{
    // calcuate 7 days before and use toDate() to convert to Date javascript
    rental.dateOut = moment().add(-7, 'days').toDate()
    await rental.save()
    await exec()
    const rentalDB = await Rental.findById(rental._id)
    expect(rentalDB.rentalFee).toBe(14)
  })

  it('should increase the stock', async()=>{
    await exec()
    const movieDB = await Movie.findById(movie._id)
    expect(movieDB.numberInStock).toBe(2)
  })

  it('should return rental', async()=>{
    const res = await exec()
    const rentalDB = await Rental.findById(rental._id)
    expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
      'dateOut',
      'dateReturned',
      'rentalFee',
      'customer',
      'movie'
    ]))
  })
})