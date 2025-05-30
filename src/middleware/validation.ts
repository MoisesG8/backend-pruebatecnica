import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

/**
 * Middleware para validar req.body con un esquema Joi.
 * - `schema`: esquema Joi para validar.
 * - abortEarly: false para recolectar todos los errores.
 * - stripUnknown: true para quitar campos no definidos en el esquema.
 */
export const validateBody = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(d => d.message);
      res.status(400).json({
        success: false,
        message: 'Errores de validación en el cuerpo de la petición',
        errors,
      });
      return;
    }

    // Reemplaza req.body con los valores validados y saneados
    req.body = value;
    next();
  };
};
