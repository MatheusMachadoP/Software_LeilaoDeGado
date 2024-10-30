import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../entity/Usuario';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    if (typeof user !== 'string') {
      req.user = user as Usuario; // Assuming `user` is the payload of the token
    } else {
      return res.status(403).json({ message: 'Invalid token' });
    }
    next();
  });
};

export default authenticateJWT;