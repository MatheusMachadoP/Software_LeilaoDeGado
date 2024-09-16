import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { Usuario } from '../entity/Usuario';
import { plainToClass } from 'class-transformer';

export const validateUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Recebendo dados para validação:', req.body);

    const usuario = plainToClass(Usuario, req.body);
    console.log('Validando a instância:', usuario);

    const errors = await validate(usuario);

    if (errors.length > 0) {
      console.log('Erros de validação:', errors);
      return res.status(400).json({
        message: 'Erro de validação nos dados fornecidos.',
        details: errors,
      });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de validação:', error);
    next(error);
  }
};


