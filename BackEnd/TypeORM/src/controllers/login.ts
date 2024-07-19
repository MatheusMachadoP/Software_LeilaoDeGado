import express from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entity/Usuario';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isValidPassword = await bcrypt.compare(senha, user.senha);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    res.json({ message: 'Login realizado com sucesso', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
});

export default router;
