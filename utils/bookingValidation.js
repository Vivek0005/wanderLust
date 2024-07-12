const Joi = require('joi');

const bookingSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required'
  }),
  phone: Joi.string().required().messages({
    'string.empty': 'Phone number is required',
    'any.required': 'Phone number is required'
  }),
  checkin: Joi.date().required().messages({
    'date.base': 'Check-in date must be a valid date',
    'any.required': 'Check-in date is required'
  }),
  checkout: Joi.date().required().messages({
    'date.base': 'Check-out date must be a valid date',
    'any.required': 'Check-out date is required'
  }),
  requests: Joi.string().allow('').optional(),
  listing: Joi.string().required().messages({
    'string.empty': 'Listing ID is required',
    'any.required': 'Listing ID is required'
  }),
  user: Joi.string().required().messages({
    'string.empty': 'User ID is required',
    'any.required': 'User ID is required'
  })
});

module.exports = bookingSchema;
