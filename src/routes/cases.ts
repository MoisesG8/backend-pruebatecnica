import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireAdmin, requirePermission } from '../middleware/authorize';
import { validateBody } from '../middleware/validation';
import { createCaseHandler, getAllCases, getAllCasesWithFiscalHandler, getCaseById } from '../controllers/caseController';
import { createCaseSchema } from '../schemas/cases';

const router = Router();

// Todas las rutas requieren JWT
router.use(authenticate);

// Endpoint de creación solo para Admin
router.post(
    '/addCase',
    requireAdmin,
    validateBody(createCaseSchema),
    createCaseHandler
);

// Rutas de lectura disponibles para todos los roles con acceso a casos
router.get('/getAllCases', getAllCases);

router.get(
    '/withfiscal',
    requirePermission('VerCasos'),
    getAllCasesWithFiscalHandler
);
router.get('/:id', getCaseById);


export default router;