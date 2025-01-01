import Joi from 'joi'
import joiObjectid from 'joi-objectid';

Joi.objectId = joiObjectid(Joi)

export default Joi
