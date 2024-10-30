// controllers/usuario.ts
import { Request, Response, NextFunction, Router } from 'express';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entity/Usuario';
import bcrypt from 'bcryptjs';

const router = Router();

// Função para verificar se o usuário já existe por email ou CPF
const checkUserExists = async (email: string, cpf: string) => {
  const usuarioRepository = AppDataSource.getRepository(Usuario);
  const [existingUserByEmail, existingUserByCpf] = await Promise.all([
    usuarioRepository.findOne({ where: { email } }),
    usuarioRepository.findOne({ where: { cpf } }),
  ]);
  return { existingUserByEmail, existingUserByCpf };
};

// Função para criar novo usuário
export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { nome_completo, email, telefone_celular, cpf, senha, tipo_usuario } = req.body;

  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const { existingUserByEmail, existingUserByCpf } = await checkUserExists(email, cpf);

    if (existingUserByEmail) {
      res.status(400).json({ message: 'Email já cadastrado' });
      return;
    }

    if (existingUserByCpf) {
      res.status(400).json({ message: 'CPF já cadastrado' });
      return;
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    const usuario = usuarioRepository.create({
      nome_completo,
      email,
      telefone_celular, // Atualizado para corresponder ao nome da propriedade na entidade
      cpf,
      senha: hashedSenha,
      tipo_usuario,
    });

    await usuarioRepository.save(usuario);
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    next(error);
  }
};

// Rota para criação de usuário com o middleware de validação
router.post('/create', createUser);

export default router;
