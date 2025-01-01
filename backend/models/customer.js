import mongoose from "mongoose";
import Joi from "../startup/joi.js";

const CustomerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: { type: String, required: true, minlength: 3, maxlength: 255 },
  phone: { type: String, required: true, maxlength: 20 },
});

const Customer = mongoose.model("Customers", CustomerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).max(255).required(),
    phone: Joi.string().max(20).required(),
  });
  return schema.validate(customer);
}

export { Customer, CustomerSchema, validateCustomer as validate };
