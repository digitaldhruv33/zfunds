import Joi from 'joi';

export const productSchema = Joi.object({
	name: Joi.string().required().trim().min(1),
	category: Joi.string().required().trim(),
	description: Joi.string(),
});
