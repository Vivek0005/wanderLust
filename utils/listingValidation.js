const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required'
  }),
  location: Joi.string().required().messages({
    'string.empty': 'Location is required',
    'any.required': 'Location is required'
  }),
  country: Joi.string().required().messages({
    'string.empty': 'Country is required',
    'any.required': 'Country is required'
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least 0',
    'any.required': 'Price is required'
  }),
  image: Joi.object({
    url: Joi.string().uri().optional().messages({
      'string.uri': 'Image URL must be a valid URI'
    }),
    filename: Joi.string().optional().messages({
      'string.base': 'Image filename must be a string'
    }),
  }).optional()
});

module.exports = listingSchema;
