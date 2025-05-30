import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import { getUserForLogin } from '../services/authServices';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;
    const user = await getUserForLogin(username);

    if (!user) {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.PasswordHash.toString());
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      return;
    }

    const payload = {
      userId: user.UserID,
      username: user.Username,
      roleId: user.RoleID,
    };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });

    res.json({ success: true, token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: 'Error durante el inicio de sesión' });
    next(err);
  }
};