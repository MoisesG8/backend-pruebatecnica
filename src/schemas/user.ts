// src/schemas/user.ts

import Joi from 'joi';

/**
 * Esquema Joi para crear un usuario.
 */
export const createUserSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(100)
    .required(),

  password: Joi.string()
    .min(8)
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  roleId: Joi.number()
    .integer()
    .required(),

  dpi: Joi.string()
    .length(13)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': 'DPI debe tener exactamente 13 caracteres numéricos',
      'string.pattern.base': 'DPI sólo puede contener dígitos numéricos'
    }),

  primerNombre: Joi.string()
    .max(50)
    .required(),

  segundoNombre: Joi.string()
    .max(50)
    .allow('', null),

  primerApellido: Joi.string()
    .max(50)
    .required(),

  segundoApellido: Joi.string()
    .max(50)
    .allow('', null),

  fechaNacimiento: Joi.date()
    .iso()
    .less('now')
    .required()
    .messages({
      'date.format': 'Fecha de nacimiento debe estar en formato ISO (YYYY-MM-DD)',
      'date.less': 'Fecha de nacimiento debe ser anterior al día de hoy'
    }),

  telefono: Joi.string()
    .length(8)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.length': 'Teléfono debe tener exactamente 8 dígitos',
      'string.pattern.base': 'Teléfono sólo puede contener dígitos'
    }),

    fiscaliaID: Joi.number()
    .integer()
    .required()
});
