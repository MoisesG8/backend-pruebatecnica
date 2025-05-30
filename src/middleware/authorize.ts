import { Request, Response, NextFunction } from 'express';
import { pool, poolConnect, sql } from '../db/connection';

/**
 * Middleware para restringir acceso solo a Admin (roleId = 1).
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.roleId !== 1) {
    res
      .status(403)
      .json({ success: false, message: 'Acceso denegado: sólo Admin' });
    return;
  }
  next();
};

export const requirePermission = (permission: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const roleId = req.user?.roleId;
      if (!roleId) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }
  
      // Admin siempre tiene acceso
      if (roleId === 1) {
        next();
        return;
      }
  
      try {
        await poolConnect;
        const result = await pool
          .request()
          .input('RoleID', sql.Int, roleId)
          .input('PermissionName', sql.NVarChar(50), permission)
          .query(
            `SELECT 1 FROM dbo.Permisos p
             JOIN dbo.Permisos_Rol pr ON p.PermisoID = pr.PermisoID
             WHERE p.Name = @PermissionName AND pr.RoleID = @RoleID`
          );
  
        if (result.recordset.length > 0) {
          next();
        } else {
          res
            .status(403)
            .json({ success: false, message: 'Acceso denegado: permiso insuficiente' });
        }
      } catch (err) {
        console.error('Error checking permissions:', err);
        res.status(500).json({ success: false, message: 'Error al verificar permisos' });
        next(err);
      }
    };
  };
