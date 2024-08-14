import express from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entity/Usuario';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    // Garante que o email seja tratado em lowercase para evitar problemas de case-sensitivity
    const usuario = await usuarioRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['perfis', 'perfis.perfil'],  // Carrega os perfis relacionados para uso posterior
    });

    // Verifica se o usuário foi encontrado
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se a senha é válida
    const isValidPassword = await bcrypt.compare(senha, usuario.senha);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    // Prepara uma lista de perfis para incluir na resposta
    const perfis = usuario.perfis && usuario.perfis.length > 0
      ? usuario.perfis.map(up => up.perfil?.nome || 'Perfil Desconhecido')
      : [];

    // Retorna sucesso com os perfis do usuário
    res.json({ message: 'Login realizado com sucesso', perfis });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

export default router;
