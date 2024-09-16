import express from 'express';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entity/Usuario';
import { validateUsuario } from '../middlewares/validateUsuario';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', validateUsuario, async (req, res, next) => {
  try {
    const { nome_completo, email, telefone, cpf, senha } = req.body;

    console.log('Iniciando cadastro com dados:', req.body);

    // Verifica se o email já está registrado
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const existingUserByEmail = await usuarioRepository.findOne({ where: { email: email.toLowerCase() } });

    if (existingUserByEmail) {
      console.log('Tentativa de cadastro com email já registrado:', email);
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Verifica se o CPF já está registrado
    const existingUserByCPF = await usuarioRepository.findOne({ where: { cpf } });

    if (existingUserByCPF) {
      console.log('Tentativa de cadastro com CPF já registrado:', cpf);
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }

    // Geração do salt e hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(senha, salt);

    console.log('Senha criptografada:', hashedSenha);

    // Criação de uma nova instância de usuário
    const usuario = new Usuario();
    usuario.nome_completo = nome_completo;
    usuario.email = email.toLowerCase();
    usuario.telefone_celular = telefone;
    usuario.cpf = cpf;
    usuario.senha = hashedSenha;

    // Salva o novo usuário no banco de dados
    await usuarioRepository.save(usuario);

    console.log('Usuário salvo no banco de dados:', usuario);

    // Remover o campo senha da resposta antes de enviar ao cliente
    const { senha: _, ...userWithoutPassword } = usuario;

    // Geração do token JWT
    const token = jwt.sign(
      { id: usuario.id }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: '1h' }
    );

    console.log('Token JWT gerado:', token);

    // Retorna o usuário recém-criado e o token na resposta
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: userWithoutPassword, token });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    next(error);
  }
});

export default router;
