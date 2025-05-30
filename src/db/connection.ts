// src/db/connection.ts
import sql, { ConnectionPool } from 'mssql';
import config from '../config';

const pool: ConnectionPool = new sql.ConnectionPool({
  user:     config.db.user,
  password: config.db.password,
  server:   config.db.server,
  database: config.db.database,
  port:     config.db.port,
  options:  config.db.options,
  pool:     config.db.pool,
});

const poolConnect: Promise<ConnectionPool> = pool
  .connect()
  .then((p) => {
    console.log('✅ Conectado a SQL Server');
    return p;
  })
  .catch((err: Error): never => {
    console.error('❌ Error de conexión a SQL Server', err);
    process.exit(1);
  });

export { sql, pool, poolConnect };
