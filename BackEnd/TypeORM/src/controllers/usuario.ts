import express from 'express';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entity/Usuario';
import { validateUsuario } from '../middlewares/validateUsuario'; // Middleware para validação de dados
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/', validateUsuario, async (req, res, next) => {
  try {
    const { nome_completo, email, telefone, cpf, senha } = req.body;

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

    // Criação de uma nova instância de usuário
    const usuario = new Usuario();
    usuario.nome_completo = nome_completo;
    usuario.email = email.toLowerCase(); // Armazenando o email em letras minúsculas para evitar problemas de case sensitivity
    usuario.telefone_celular = telefone;
    usuario.cpf = cpf;
    usuario.senha = hashedSenha;

    // Adicionando logs para verificar a senha antes e depois do hash
    console.log('Senha antes de hash:', senha);
    console.log('Senha hash:', hashedSenha);

    // Salva o novo usuário no banco de dados
    await usuarioRepository.save(usuario);

    // Remover o campo senha da resposta antes de enviar ao cliente
    const { senha: _, ...userWithoutPassword } = usuario;

    // Retorna o usuário recém-criado na resposta, sem a senha
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: userWithoutPassword });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error); // Log do erro para depuração
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
});

export default router;
