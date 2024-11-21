// src/middlewares/authenticateJWT.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  // Adicione outros campos conforme necessário
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
      if (err) {
        return res.sendStatus(403);
      }

      const { userId } = payload as JwtPayload;
      req.user = { id: userId };
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export default authenticateJWT;