import { poolConnect, sql, pool } from '../db/connection';

export interface CreateCaseDTO {
    caseNumber: string;
    title: string;
    description?: string | null;
    createdByUserId: number;
    currentStatusID: number;
    priority: number;
}

export interface CaseRecord {
    CasoID: number;
    CaseNumber: string;
    Title: string;
    Description: string;
    CreatedByUserID: number;
    CurrentStatusID: number;
    Priority: number;
    CreatedAt: Date;
    UpdatedAt: Date;
    Username: string;
    CurrentStatus: string;
}

export interface CaseWithFiscal {
    CasoID: number;
    CaseNumber: string;
    Title: string;
    Priority: number;
    Name: string;
    AssignedFiscal: string | null;
}
/**
 * Invoca el SP sp_CreateCase y devuelve el nuevo CasoID.
 */
export async function createCaseSP(
    data: CreateCaseDTO
): Promise<number> {
    await poolConnect;
    const req = pool.request();
    req
        .input('CaseNumber', sql.NVarChar(50), data.caseNumber)
        .input('Title', sql.NVarChar(200), data.title)
        .input('Description', sql.NVarChar(sql.MAX), data.description || null)
        .input('CreatedByUserID', sql.Int, data.createdByUserId)
        .input('CurrentStatusID', sql.Int, data.currentStatusID)
        .input('Priority', sql.TinyInt, data.priority)
        .output('NewCaseID', sql.Int);

    const result = await req.execute('sp_CreateCase');
    return result.output.NewCaseID as number;
}

/**
 * Invoca el SP sp_GetAllCases y devuelve todos los casos.
 */
export async function getAllCasesSP(): Promise<CaseRecord[]> {
    await poolConnect;
    const result = await pool.request().execute<CaseRecord>('sp_GetAllCases');
    return result.recordset;
}

/**
 * Invoca el SP sp_GetCaseByID y devuelve un caso o null.
 */
export async function getCaseByIdSP(caseId: number): Promise<CaseRecord | null> {
    console.log(`Invoking stored procedure sp_GetCaseByID with CaseID: ${caseId}`);
    await poolConnect;
    const req = pool.request();
    req.input('CaseID', sql.Int, caseId);
    const result = await req.execute<CaseRecord>('sp_GetCaseByID');
    return result.recordset[0] || null;
}

/**
 * Invoca el SP sp_GetAllCasesWithFiscal y devuelve los casos con fiscal asignado.
 */
export async function getAllCasesWithFiscalSP(): Promise<CaseWithFiscal[]> {
    console.log('Invoking stored procedure sp_GetAllCasesWithFiscal');
    await poolConnect;
    const result = await pool.request()
        .execute<CaseWithFiscal>('sp_GetAllCasesWithFiscal');
    return result.recordset;
}
