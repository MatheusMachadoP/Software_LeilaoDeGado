import express, { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entity/Usuario';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

const loginHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;
    console.log('Tentativa de login com email:', email);

    // Repositório de usuários
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepository.findOne({ where: { email: email.toLowerCase() } });

    if (!usuario) {
      console.log('Usuário não encontrado:', email);
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    // Comparar senhas
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      console.log('Senha incorreta para o usuário:', email);
      res.status(401).json({ message: 'Senha incorreta' });
      return;
    }

    // Geração do token JWT
    const token = jwt.sign(
      { id: usuario.id, tipo_usuario: usuario.tipo_usuario },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login foi um sucesso',
      token,
      tipo_usuario: usuario.tipo_usuario,
    });
  } catch (error) {
    console.error('Erro ao processar login:', error);
    res.status(500).send('Erro Interno do Servidor');
  }
};

// Definir a rota de login
router.post('/', loginHandler);

export { router as loginRouter };