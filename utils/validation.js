import Joi from "joi";

// Listing validation schema
export const listingValidationSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0)
  }).required()
});

// Review validation schema
export const reviewValidationSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    comment: Joi.string().required()
  }).required()
});
