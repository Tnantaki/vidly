import express from 'express'
import helloRouter from '../routes/hello.js'
import coursesRouter from '../routes/courses.js'
import genresRouter from '../routes/genres.js'
import customerRouter from '../routes/customers.js'
import movieRouter from '../routes/movies.js'
import rentalRouter from '../routes/rentals.js'
import userRouter from '../routes/users.js'
import authRouter from '../routes/auth.js'
import returnRouter from '../routes/returns.js'
import error from "../middleware/error.js";

export default function(app) {
  // use express.json in middleware
  // express.json is middleware function for parse request wiht JSON payloads
  app.use(express.json())

  app.use('/', helloRouter)
  app.use('/api/courses', coursesRouter)
  app.use('/api/genres', genresRouter)
  app.use('/api/customers', customerRouter)
  app.use('/api/movies', movieRouter)
  app.use('/api/rentals', rentalRouter)
  app.use('/api/users', userRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/returns', returnRouter)
  app.use(error)
}