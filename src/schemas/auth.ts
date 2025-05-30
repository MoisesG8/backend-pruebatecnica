import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().required(),
});