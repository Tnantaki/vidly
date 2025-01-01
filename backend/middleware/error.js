import logger from '../startup/logger.js'

function error(err, req, res, next) {
  logger.error(err)
  res.status(500).send('Error to connect to database')
}

export default error