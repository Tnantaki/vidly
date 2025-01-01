import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import env from 'dotenv'
import Joi from '../startup/joi.js'

env.config()

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024, // will keep the hash password
  },
  isAdmin: Boolean
});

// Because, We want only User route to generate auth token.
// So, we defined the method in this class.
UserSchema.methods.generateAuthToken = function() {
  const payload = {
    _id: this._id,
    name: this.name,
    email: this.email,
    isAdmin: this.isAdmin,
  }
  const token = jwt.sign(payload, process.env.API_PRIVATE_KEY)
  return token
}

const User = mongoose.model('User', UserSchema)

function validateUser(User) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    email: Joi.string().min(4).max(255).required().email(),
    password: Joi.string().min(6).max(50).required(),
  })
  return schema.validate(User);
}

export {
  User,
  validateUser as validate
};