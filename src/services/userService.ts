import { poolConnect, sql, pool } from '../db/connection';

export interface Fiscal {
    UserID: number;
    Username: string;
    Email: string;
    DPI: string;
    PrimerNombre: string;
    SegundoNombre?: string;
    PrimerApellido: string;
    SegundoApellido?: string;
    FechaNacimiento: string; // 'YYYY-MM-DD'
    Telefono: string;
    Fiscalia: string;
    CreatedAt: string;
    UpdatedAt: string;
}

export async function createUser(data: {
    username: string;
    passwordHash: Buffer;
    email: string;
    roleId: number;
    dpi: string;
    primerNombre: string;
    segundoNombre?: string;
    primerApellido: string;
    segundoApellido?: string;
    fechaNacimiento: string; // 'YYYY-MM-DD'
    telefono: string;
    fiscaliaID: number;
}): Promise<number> {
    await poolConnect;
    const req = pool.request();

    req
        .input('Username', sql.NVarChar(100), data.username)
        .input('PasswordHash', sql.VarBinary(256), data.passwordHash)
        .input('Email', sql.NVarChar(150), data.email)
        .input('RoleID', sql.Int, data.roleId)
        .input('DPI', sql.NVarChar(13), data.dpi)
        .input('PrimerNombre', sql.NVarChar(50), data.primerNombre)
        .input('SegundoNombre', sql.NVarChar(50), data.segundoNombre || null)
        .input('PrimerApellido', sql.NVarChar(50), data.primerApellido)
        .input('SegundoApellido', sql.NVarChar(50), data.segundoApellido || null)
        .input('FechaNacimiento', sql.Date, data.fechaNacimiento)
        .input('Telefono', sql.NVarChar(8), data.telefono)
        .input('FiscaliaID', sql.Int, data.fiscaliaID)
        .output('NewUserID', sql.Int);

    console.log('Executing stored procedure sp_CreateUser with inputs:', {
        Username: data.username,
        FiscaliaID: data.fiscaliaID
    });
    const result = await req.execute('sp_CreateUser');
    return result.output.NewUserID as number;
}

export async function getAllFiscalesSP(): Promise<Fiscal[]> {
    await poolConnect;
    const result = await pool.request().execute<Fiscal>('sp_GetFiscales');
    return result.recordset;
}