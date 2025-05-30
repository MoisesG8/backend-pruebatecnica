import { Request, Response, NextFunction } from 'express';
import ExcelJS from 'exceljs';
import { getAllCasesWithFiscalSP } from '../services/caseService';

/**
 * Genera un reporte Excel con casos y fiscal asignado.
 *
 */
export const generateCasesReport = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cases = await getAllCasesWithFiscalSP();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('CasosAsignados');

    sheet.columns = [
      { header: 'Caso ID', key: 'CasoID', width: 10 },
      { header: 'Número de Caso', key: 'CaseNumber', width: 20 },
      { header: 'Título', key: 'Title', width: 30 },
      { header: 'Prioridad', key: 'Priority', width: 10 },
      { header: 'Fiscal Asignado', key: 'AssignedFiscal', width: 25 },
    ];

    cases.forEach(c => {
      sheet.addRow({
        CasoID: c.CasoID,
        CaseNumber: c.CaseNumber,
        Title: c.Title,
        Priority: c.Priority,
        AssignedFiscal: c.AssignedFiscal || 'No asignado',
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="Reporte_Casos_Asig.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
};