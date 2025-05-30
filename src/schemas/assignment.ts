import Joi from 'joi';

export const assignCaseSchema = Joi.object({
  casoId: Joi.number().integer().required(),
  fiscalUserId: Joi.number().integer().required(),
});

export const reassignSchema = Joi.object({
    casoId: Joi.number().integer().required(),
    newFiscalUserId: Joi.number().integer().required()
});