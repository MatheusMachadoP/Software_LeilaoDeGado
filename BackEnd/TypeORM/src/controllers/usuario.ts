import express from 'express';
import { AppDataSource } from '../data-source';
import { Usuario } from '../entity/Usuario';
import { validateUsuario } from '../middlewares/validateUsuario'; // Middleware para validação de dados
import bcrypt from 'bcryptjs'; 

const router = express.Router();

router.post('/', validateUsuario, async (req, res, next) => {
  try {
    const { nome_completo, email, telefone, cpf, senha } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(senha, salt);
    const usuario = new Usuario();
    usuario.nome_completo = nome_completo;
    usuario.email = email;
    usuario.telefone_celular = telefone;
    usuario.cpf = cpf;
    usuario.senha = hashedSenha;

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    await usuarioRepository.save(usuario);

    res.json(usuario);
  } catch (error) {
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
});

export default router;
