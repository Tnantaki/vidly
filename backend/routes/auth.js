import express from 'express'
import _ from 'lodash'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Joi from 'joi';
import { User } from '../models/user.js';

const router = express.Router()

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.findOne({email: req.body.email})
  if (!user) return res.status(400).send('Invalid email.')
  
  const isValidPass = await bcrypt.compare(req.body.password, user.password)
  if (!isValidPass) return res.status(400).send('Invalid password.')

  const token = user.generateAuthToken()
  res.send(token)
  return
})

function validate(User) {
  const schema = Joi.object({
    email: Joi.string().min(4).max(255).required().email(),
    password: Joi.string().min(6).max(50).required(),
  })
  return schema.validate(User);
}

export default router