import express from 'express'
import { Customer, validate } from "../models/customer.js";
import authorize from '../middleware/authorize.js'

const router = express.Router()

router.get('/', authorize, async (req, res) => {
  try {
    const customers = await Customer.find()

    res.send(customers)
  } catch (error) {
    res.status(500).send('Error query data from database')
  }
  return
})

router.get('/:id', authorize, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)

    if (!customer) {
      res.status(404).send('The customer with the given id was not found.')
      return
    }
    res.send(customer)
  } catch (error) {
    res.status(500).send('Error on server.')  
  }
  return
})

router.post('/', authorize, async (req, res) => {
  const { error } = validate(req.body)
  if (error) {
    res.status(400).send(error.details[0].message)
    return
  }
  
  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  })

  try {
    const result = await customer.save()
    res.send(result)
  } catch (error) {
    res.status(500).send('Error on save data into database')
  }
  return
})

router.put('/:id', authorize, async (req, res) => {
  try {
    const {error} = validate(req.body)
    if (error) {
      res.status(400).send(error.details[0].message)
      return
    }

    const customer = await Customer.findById(req.params.id)
    if (!customer) {
      res.status(404).send('There are not the given id in the customers.')
      return
    }

    customer.set({
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone
    })
    const result = await customer.save()
    res.send(result)
  } catch (error) {
    res.status(500).send('Error on server.')
  }
  return
})

router.delete('/:id', authorize, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) {
      res.status(404).send('There are not the given id in customers.')
      return
    }
  
    res.send(`The customer id: "${customer.id}" had been deleted.`)
  } catch (error) {
    res.status(500).send('Error on server.')
  }
  return
})

export default router