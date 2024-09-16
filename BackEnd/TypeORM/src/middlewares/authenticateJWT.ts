import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Usuario } from '../entity/Usuario';
import { AppDataSource } from '../data-source';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
    }

    const decoded = jwt.verify(token, secret) as { id: number };
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOne({ where: { id: decoded.id } });

    if (!usuario) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Adiciona o usuário ao objeto da requisição
    req.user = usuario;
    next();
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};
