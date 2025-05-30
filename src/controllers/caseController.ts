import { Request, Response, NextFunction } from 'express';
import {
    createCaseSP,
    getAllCasesSP,
    getCaseByIdSP,
    getAllCasesWithFiscalSP
} from '../services/caseService';

export const createCaseHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            caseNumber,
            title,
            description,
            currentStatusID,
            priority,
        } = req.body;
        const createdByUserId = req.user!.userId;
        console.log('Creating case with data:', createdByUserId);
        const newCaseId = await createCaseSP({
            caseNumber,
            title,
            description,
            createdByUserId,
            currentStatusID,
            priority,
        });

        res.status(201).json({ success: true, caseId: newCaseId });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error creando caso' });
        console.error('Error creating case:', err);
        next(err);
    }
};

export const getAllCases = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const cases = await getAllCasesSP();
        res.json({ success: true, cases });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error obteniendo casos' });
        console.error('Error getting all cases:', err);
        next(err);
    }
};

export const getCaseById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log('Fetching case by ID:', req.params.id);
        const caseId = parseInt(req.params.id, 10);
        const record = await getCaseByIdSP(caseId);
        if (!record) {
            res.status(404).json({ success: false, message: 'Caso no encontrado' });
            return;
        }
        res.json({ success: true, case: record });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error obteniendo caso' });
        console.error('Error getting case by ID:', err);
        next(err);
    }
};

export const getAllCasesWithFiscalHandler = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log('Fetching all cases with fiscal');
        const cases = await getAllCasesWithFiscalSP();
        res.json({ success: true, cases });
    } catch (err) {
    res.status(500).json({ success: false, message: 'Error obteniendo casos con fiscales' });
        console.error('Error getting all cases with fiscal:', err);
        next(err);
    }
};