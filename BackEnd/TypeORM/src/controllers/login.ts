import express from 'express';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entity/Usuario';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, senha } = req.body;
  
  // Logando a tentativa de login para verificação
  console.log('Tentativa de login com email:', email);

  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    // Busca o usuário pelo email, tratando o email em lowercase
    const usuario = await usuarioRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['perfis', 'perfis.perfil'],  // Certifique-se de que essas relações estão corretamente configuradas
    });

    // Logando o resultado da busca
    console.log('Usuário encontrado:', usuario);

    // Verifica se o usuário foi encontrado
    if (!usuario) {
      console.log('Usuário não encontrado:', email);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica se a senha é válida comparando com a senha criptografada no banco de dados
    const isValidPassword = await bcrypt.compare(senha, usuario.senha);
    if (!isValidPassword) {
      console.log('Senha inválida para o usuário:', email);
      return res.status(401).json({ message: 'Senha inválida' });
    }

    console.log('Login realizado com sucesso para o usuário:', email);

    // Prepara uma lista de perfis para incluir na resposta, se existirem
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
