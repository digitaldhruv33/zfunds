import Joi from 'joi';

export const userSchema = Joi.object({
	name: Joi.string().required().trim().min(1),
	mobile_number: Joi.number().required(),
	role: Joi.string().required().trim(),
});

export const userSchemaVerify = Joi.object({
	name: Joi.string().required().trim().min(1),
	mobile_number: Joi.number().required(),
	role: Joi.string().required().trim(),
	otp: Joi.string().required().trim(),
});
