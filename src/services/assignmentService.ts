import { poolConnect, sql, pool } from '../db/connection';

/**
 * Invoca el SP sp_AssignCase para crear una asignación.
 */
export async function assignCase(
  casoId: number,
  fiscalUserId: number
): Promise<number> {
  await poolConnect;
  const req = pool.request();
  req.input('CasoID', sql.Int, casoId);
  req.input('FiscalUserID', sql.Int, fiscalUserId);
  req.output('NewAssignmentID', sql.Int);

  const result = await req.execute('sp_AssignCase');
  return result.output.NewAssignmentID as number;
}

/**
 * Invoca el SP sp_ReassignCase y devuelve el mensaje de resultado.
 * @param casoId       ID del caso a reasignar
 * @param newFiscalId  ID del nuevo fiscal
 * @returns            'OK' o el motivo de fallo
 */
export async function reassignCase(
    casoId: number,
    newFiscalId: number
  ): Promise<string> {
    await poolConnect;
    const req = pool.request();
    req.input('CasoID', sql.Int, casoId);
    req.input('NuevoFiscalID', sql.Int, newFiscalId);
    req.output('Resultado', sql.NVarChar(200));
  
    await req.execute('sp_ReassignCase');
    return req.parameters.Resultado.value as string;
  }