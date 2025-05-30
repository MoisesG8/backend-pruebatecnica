import { Router } from 'express';
import { login } from '../controllers/authController';
import { validateBody } from '../middleware/validation';
import { loginSchema } from '../schemas/auth';

const router = Router();

router.post(
  '/login',
  validateBody(loginSchema),
  login
);

export default router;