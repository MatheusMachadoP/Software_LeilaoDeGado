// controllers/usuario.ts
import { Request, Response, NextFunction, Router } from 'express';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entity/Usuario';
import bcrypt from 'bcryptjs';
import authenticateJWT from '../middlewares/authenticateJWT';


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

// Função para atualizar o endereço da carteira do usuário
export const updateWalletAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId, walletAddress } = req.body;
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOneBy({ id: userId });

    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    usuario.endereco_carteira = walletAddress;
    await usuarioRepository.save(usuario);

    res.status(200).json({ message: 'Endereço da carteira atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar o endereço da carteira:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar o endereço da carteira', error });
    next(error);
  }
};

// Função para remover o endereço da carteira do usuário
export const removeWalletAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.body;
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOneBy({ id: userId });

    if (!usuario) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    usuario.endereco_carteira = undefined;
    await usuarioRepository.save(usuario);

    res.status(200).json({ message: 'Endereço da carteira removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover o endereço da carteira:', error);
    res.status(500).json({ message: 'Erro interno ao remover o endereço da carteira', error });
    next(error);
  }
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

// Rota para atualizar o endereço da carteira do usuário
router.post('/update-wallet-address', (req: Request, res: Response, next: NextFunction) => {
  if  (req) {
	updateWalletAddress(req, res, next);
  console.log("Carteira conectada com sucesso !")
  } else {
	res.status(401).send('Unauthorized');
  }
}); // POST /api/usuarios/update-wallet-address
// Rota para remover o endereço da carteira do usuário
router.post('/remove-wallet-address', removeWalletAddress);

// Rota para criação de usuário com o middleware de validação
router.post('/create', createUser);

export default router;
