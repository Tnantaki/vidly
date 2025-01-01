import express from 'express'
import Joi from 'joi'

const router = express.Router()

const courses = [
  {id: 1, name: "course1"},
  {id: 2, name: "course2"},
  {id: 3, name: "course3"}
]

router.get('/', (req, res) => {
  res.send(courses)
})

router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if (!course) {
    res.status(404).send('The course with the given id was not found.')
    return
  }
  res.send(course)
})

router.post('/', (req, res) => {
  // declare schema: shape of body object do we want
  const { error } = validateCourse(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  }
  courses.push(course)
  res.send(course)
})

router.put('/:id', (req, res) => {
  // 1.Look up the course, if not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if (!course) {
    res.status(404).send('The course with the given id was not found.')
    return
  }

  // 2.Validate, if invalid, return 400 - Bad request
  const { error } = validateCourse(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }

  // 3.Update course, return the updated course
  course.name = req.body.name
  res.send(course)
})

router.delete('/:id', (req, res) => {
  // 1.Look up the course, if not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if (!course)
    return res.status(404).send('The course with the given id was not found.')

  // 2.Delete the course
  const index = courses.indexOf(course)
  courses.splice(index, 1)

  // 3.Response
  res.send(`The course id: ${course.id} had been deleted.`)
})

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })
  return schema.validate(course);
}

export default router