import request from 'supertest'
import mongoose from 'mongoose' // mongoDB client
import { Genre } from '../../models/genre.js'
import { User } from '../../models/user.js'

let server

beforeAll(async () => {
  const {default: s} = await import('../../index.js')
  server = s
})

afterAll(async () => {
  await server.close()
  await mongoose.connection.close()
})

describe('auth middleware', () => {
  afterEach(async () => {
    await Genre.deleteMany({})
  })

  let token

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({name: 'genre1'})
  }

  beforeEach(() => {
    token = new User().generateAuthToken()
  })

  it('should return 401 if no token provided', async() => {
    token = '' // if put null, it will be convert to null string
    const res = await exec()
    expect(res.status).toBe(401)
  })

  it('should return 400 if invalid token', async() => {
    token = 'a'
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('should return 200 if valid token', async() => {
    const res = await exec()
    expect(res.status).toBe(200)
  })
})
