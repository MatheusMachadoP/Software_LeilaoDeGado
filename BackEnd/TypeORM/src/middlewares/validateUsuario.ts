import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { Usuario } from '../entity/Usuario';
import { plainToClass } from 'class-transformer';

export const validateUsuario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Converte os dados da requisição em uma instância da classe Usuario
    const usuario = plainToClass(Usuario, req.body);

    // Realiza a validação dos dados com base nos decorators da classe Usuario
    const errors = await validate(usuario);

    if (errors.length > 0) {
      // Se houver erros, envia uma resposta com os erros
      return res.status(400).json({ errors });
    }

    // Se não houver erros, passa para o próximo middleware ou rota
    next();
  } catch (error) {
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
};
