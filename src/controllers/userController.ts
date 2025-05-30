import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { createUser, getAllFiscalesSP } from '../services/userService';

export const createUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      username, password, email, roleId,
      dpi, primerNombre, segundoNombre,
      primerApellido, segundoApellido,
      fechaNacimiento, telefono, fiscaliaID
    } = req.body;

    const passwordHash = Buffer.from(await bcrypt.hash(password, 10), 'utf8');
    console.log('Parametros para crear usuario:', {
      username,
      email,
      roleId,
      dpi,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento,
      telefono,
      fiscaliaID
    }
    )
    const newUserId = await createUser({
      username,
      passwordHash,
      email,
      roleId,
      dpi,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento,
      telefono,
      fiscaliaID
    });

    res.status(201).json({ success: true, userId: newUserId });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ success: false, message: 'Error creating user' });
    next(err);
  }
};

export const getAllFiscales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fiscalsRaw = await getAllFiscalesSP();
    // Formatear fechas para quitar la hora
    const fiscals = fiscalsRaw.map(f => ({
      ...f,
      FechaNacimiento: new Date(f.FechaNacimiento).toISOString().split('T')[0],
      CreatedAt:       new Date(f.CreatedAt).toISOString().split('T')[0],
      UpdatedAt:       new Date(f.UpdatedAt).toISOString().split('T')[0],
    }));
    res.json({ success: true, fiscals });
  } catch (err) {
    console.error('Error getting all fiscals:', err);
    res.status(500).json({ success: false, message: 'Error getting fiscals' });
    next(err);
  }
}
