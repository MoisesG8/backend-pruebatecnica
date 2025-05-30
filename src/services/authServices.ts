import { poolConnect, sql, pool} from '../db/connection';

type DbUser = {
  UserID: number;
  Username: string;
  PasswordHash: Buffer;
  RoleID: number;
};

export const getUserForLogin = async (username: string): Promise<DbUser | null> => {
  await poolConnect;
  const request = pool.request();
  request.input('Username', sql.NVarChar(100), username);
  const result = await request.execute<DbUser>('sp_GetUserForLogin');
  return result.recordset[0] || null;
};
