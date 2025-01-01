import express from 'express'
import _ from 'lodash'
import bcrypt from 'bcrypt'
import { User, validate } from '../models/user.js';
import authorize from '../middleware/authorize.js';

const router = express.Router()

router.get('/me', authorize, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({email: req.body.email})
  if (user) return res.status(400).send('Email already in use.')
  
  user = new User(_.pick(req.body, ['name', 'email', 'password']))
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)

  await user.save()

  // In case that we want website login auto after register, send token in header
  // set 'x-' prefix to header key for custom header.
  const token = user.generateAuthToken()
  res
    .header('x-auth-token', token)
    .header('access-control-expose-headers', 'x-auth-token') // this set will make client see custom header
    .send(_.pick(user, ['_id', 'name', 'email']))
  return
})

export default router