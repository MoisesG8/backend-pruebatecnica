import Joi from 'joi';

/**
 * Esquema Joi para creación de casos.
 */
export const createCaseSchema = Joi.object({
  caseNumber: Joi.string().max(50).required(),
  title: Joi.string().max(200).required(),
  description: Joi.string().max(1000).allow(null, '').optional(),
  currentStatusID: Joi.number().integer().required(),
  priority: Joi.number().integer().min(1).max(5).required(),
});
