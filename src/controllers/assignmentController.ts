import { Request, Response, NextFunction } from 'express';
import { assignCase, reassignCase } from '../services/assignmentService';

export const assignCaseHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { casoId, fiscalUserId } = req.body;
        const newId = await assignCase(casoId, fiscalUserId);
        res.status(201).json({ success: true, assignmentId: newId });
    } catch (err) {
        console.error('Error assigning case:', err);
        res.status(500).json({ success: false, message: 'Error assigning case' });
        next(err);
    }
};

/**
 * Handler para reasignar un caso.
 * POST /api/assignments/reassignCase
 */
export const reassignCaseHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { casoId, newFiscalUserId } = req.body;
        const resultado = await reassignCase(casoId, newFiscalUserId);
        if (resultado !== 'OK') {
            res
                .status(400)
                .json({ success: false, message: `Reasignación fallida: ${resultado}` });
            return;
        }

        res.json({ success: true, message: 'Caso reasignado correctamente' });
    } catch (err) {
        console.error('Error reassigning case:', err);
        res.status(500).json({ success: false, message: 'Error reasignando caso' });
        next(err);
    }
};