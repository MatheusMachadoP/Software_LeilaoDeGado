import express from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entity/Usuario';
import { UsuarioPerfil } from '../entity/UsuarioPerfil';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    const usuario = await usuarioRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['perfis', 'perfis.perfil'], 
    });

    if (!usuario || !usuario.senha) {
      return res.status(404).json({ message: 'Usuário ou senha inválidos' });
    }

    const isValidPassword = await bcrypt.compare(senha, usuario.senha);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }

    const perfis = usuario.perfis && usuario.perfis.length > 0
      ? usuario.perfis.map(up => up.perfil?.nome || 'Perfil Desconhecido')
      : [];

    const usuarioSemSenha = { ...usuario };
    delete usuarioSemSenha.senha;

    res.json({ message: 'Login realizado com sucesso', usuario: usuarioSemSenha, perfis });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

export default router;
