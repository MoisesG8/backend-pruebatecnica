import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requirePermission } from '../middleware/authorize';
import { generateCasesReport } from '../controllers/reportController';

const router = Router();

// Todas las rutas de reportes requieren JWT y permiso VerCasos
router.use(authenticate);
router.get(
  '/generateReportCases',
  requirePermission('GenerarReportes'),
  generateCasesReport
);

export default router;