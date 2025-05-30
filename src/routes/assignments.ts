import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/authorize';
import { validateBody } from '../middleware/validation';
import { assignCaseHandler, reassignCaseHandler } from '../controllers/assignmentController';
import { assignCaseSchema } from '../schemas/assignment';
import { reassignSchema } from '../schemas/assignment';
const router = Router();

/**
 * Rutas para asignación y reasignación de casos
 * - Todas las rutas requieren autenticación JWT
 * - Permisos específicos para asignar y reasignar casos
 */
// Todas las rutas requieren JWT válido
router.use(authenticate);
// Solo el permiso 'AsignarCasos' permite asignar
router.post(
    '/assignCase',
    requirePermission('AsignarCasos'),
    validateBody(assignCaseSchema),
    assignCaseHandler
);

router.post(
    '/reassignCase',
    requirePermission('ReasignarCasos'),
    validateBody(reassignSchema),
    reassignCaseHandler
);

export default router;