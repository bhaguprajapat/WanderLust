import Joi from "joi";

// Listing validation schema
const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0)
  }).required()
});

// Review validation schema
const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    comment: Joi.string().required()
  }).required()
});

export { listingSchema, reviewSchema };