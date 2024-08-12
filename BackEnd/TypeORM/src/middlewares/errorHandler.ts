import { Request, Response, NextFunction } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof EntityNotFoundError) {
    return res.status(404).json({ message: err.message });
  }

  if (err instanceof QueryFailedError) {
    if (err.driverError?.code === '23505') { 
      return res.status(400).json({ message: 'Email ou CPF já cadastrado' });
    }
  }

  console.error(err); // Log do erro no console

  res.status(500).json({ message: 'Internal server error' });
};
