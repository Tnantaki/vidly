import mongoose from 'mongoose' // mongoDB client
import logger from './logger.js'
import env from 'dotenv'
env.config({path: '../.env'})

export default function() {
  // to use transaction I have to set replica
  // use directConnection for single node replica
  const replica = '?replicaSet=rs0&authSource=admin&directConnection=true'
  const url_db = process.env.MONGODB + replica

  mongoose.connect(url_db)
    .then(() => logger.info('Connected to MongoDB...'))
    .catch(err => logger.error('Could not connect to MongoDB...'))
}