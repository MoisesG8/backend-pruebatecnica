// src/routes/users.ts
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/authorize';
import { validateBody } from '../middleware/validation';
import { createUserHandler, getAllFiscales } from '../controllers/userController';
import { createUserSchema } from '../schemas/user';
import { get } from 'http';

const router = Router();

/**
 * POST /api/users
 * - Autenticación JWT requerida
 * - Solo usuarios Admin (roleId = 1)
 * Body: { username, password, email, roleId, dpi, primerNombre, segundoNombre, primerApellido, segundoApellido, fechaNacimiento, telefono }
 * Crea un nuevo usuario en la base de datos mediante el SP sp_CreateUser.
 */
router.post(
  '/registerUser',
  authenticate,
  requireAdmin,
  validateBody(createUserSchema),
  createUserHandler
);

router.get(
  '/getAllFiscales',
    authenticate,
    requireAdmin,
    getAllFiscales
);

export default router;
