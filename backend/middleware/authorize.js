import jwt from 'jsonwebtoken'
import env from 'dotenv'

env.config()

function authorize(req, res, next) {
  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('Access denied, No token provided.')

  try {
    // jwt.verify use for decoded payload and verify
    // - we can use jwt.io brower or jwt.decode() funciton to decoded payload.
    // - we can only verify is it valid token by using private key.
    const decoded = jwt.verify(token, process.env.API_PRIVATE_KEY)
    req.user = decoded  
    next()
  } catch (error) {
    res.status(400).send('Invalid token.')
  }
}

export default authorize