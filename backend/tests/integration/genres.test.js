// import {jest} from '@jest/globals';
// jest.useFakeTimers();
import request from 'supertest'
import mongoose from 'mongoose' // mongoDB client
import { Genre } from '../../models/genre.js'
import { User } from '../../models/user.js'

let server

// When import server, the server will be run
beforeAll(async () => {
  const {default: s} = await import('../../index.js')
  server = s
})

// After all testing, down server and disconnection to mongoDB
afterAll(async () => {
  await server.close()
  await mongoose.connection.close()
})

describe('/api/genres', () => {
  afterEach(async () => {
    await Genre.deleteMany({}) // remove mock database that we generate
  })

  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        {name: 'genre1'},
        {name: 'genre2'},
      ])

      const res = await request(server).get('/api/genres')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy()
    })
  })

  describe('GET /:id', () => {
    it('should return genre', async() => {
      const genre = await Genre.collection.insertOne({name: 'genre1'})
      const id = genre.insertedId.toHexString()

      console.log(id)
      const res = await request(server).get('/api/genres/' + id)
      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({name: 'genre1'})
    })

    it('should return 404, if invalid id is passed', async() => {
      const res = await request(server).get(`/api/genres/1`)
      expect(res.status).toBe(404)
    })

    it('should return 404, if the id is not exist', async() => {
      const id = new mongoose.Types.ObjectId()
      const res = await request(server).get('/api/genres/' + id)
      expect(res.status).toBe(404)
    })
  })

  describe('POST /', () => {
    // To write the clear test code
    // 1. Find the repetitive pattern in each test and defined in parent scope.
    let token
    let name

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({name})
    }

    // 2. Change the parameter as match in each test
    beforeEach(() => {
      token = new User().generateAuthToken()
      name = 'genre1'
    })

    // we only write 1 test for authorize for check middleware is working on
    // the API, and write unit test to authorize middleware function separate.
    // So, we didn't have to test repetive authorize middleware test in other
    // method like Delete and Update.
    it('should return 401 if client is not logged in', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 400 if name in genre less than 5 characters', async () => {
      name = '1234'
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if name in genre more than 50 characters', async () => {
      name = new Array(52).join('A') // A 51 characters
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should save the genre if input is valid', async () => {
      exec()
      const genre = await Genre.find({name: 'genre1'}) // query data in mongoDB
      expect(genre).not.toBeNull()
    })

    it('should return genre if input is valid', async () => {
      const res = await exec()
      expect(res.body).toHaveProperty('_id') // check only have the key
      expect(res.body).toHaveProperty('name', 'genre1')
    })
  })

  describe('PUT /', () => {
    let token
    let name
    let id

    const exec = async () => {
      return await request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({name})
    }

    beforeEach(async () => {
      const genre = await Genre.collection.insertOne({ name: "genre1" });
      id = genre.insertedId.toHexString()
      token = new User().generateAuthToken();
      name = "genre2";
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 400 if name in genre less than 5 characters', async () => {
      name = '1234'
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 400 if name in genre more than 50 characters', async () => {
      name = new Array(52).join('A') // A 51 characters
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('should return 404 if id is invlid', async () => {
      id = 1
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should return 404 if id is not exist in database', async () => {
      id = new mongoose.Types.ObjectId().toHexString()
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should update new genre if input valid', async () => {
      const res = await exec()
      const updatedGenre = await Genre.findById(id) // query data in mongoDB
      expect(res.status).toBe(200)
      expect(updatedGenre.name).toBe(name)
    })

    it('should return updated genre if input is valid', async () => {
      const res = await exec()
      expect(res.body).toHaveProperty('_id') // check only have the key
      expect(res.body).toHaveProperty('name', name)
    })
  })

  describe('DELELT /', () => {
    let token
    let id

    const exec = async () => {
      return await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
    }

    beforeEach(async () => {
      const mockGenre = await Genre.collection.insertOne({ name: 'genre1' });
      id = mockGenre.insertedId.toHexString();
      token = new User({isAdmin: true}).generateAuthToken();
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 403 if client is not admin', async () => {
      token = new User({isAdmin: false}).generateAuthToken();
      const res = await exec()
      expect(res.status).toBe(403)
    })

    it('should return 404 if id is invalid', async () => {
      id = 1
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should return 404 if id was not found', async () => {
      id = new mongoose.Types.ObjectId().toHexString()
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should delete genre if input valid', async () => {
      await exec()
      const genreInDB = await Genre.findById(id)
      expect(genreInDB).toBeNull()
    })

    it('should return deleted genre if input valid', async () => {
      const res = await exec()
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('name', 'genre1')
    })
  })
})