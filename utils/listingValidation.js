const Joi = require("joi");
const ExpressError = require("./ExpressError.js");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().uri().optional(),
  }),
});

module.exports = listingSchema;
