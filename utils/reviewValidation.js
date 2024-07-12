const Joi = require("joi");

const reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required().messages({
      'string.empty': 'Comment is required',
      'any.required': 'Comment is required'
    }),
    rating: Joi.number().min(1).max(5).required().messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5',
      'any.required': 'Rating is required'
    }),
  }).required().messages({
    'any.required': 'Review information is required'
  }),
});

module.exports = reviewSchema;
