import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; 
import { AppDataSource } from './data-source';
import loginRouter from './controllers/login';
import { Usuario } from './entity/Usuario';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");

  app.post('/usuarios', async (req, res) => {
    const { nome_completo, email, telefone, cpf, senha, remember_me } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(senha, salt);

    const usuario = new Usuario();
    usuario.nome_completo = nome_completo;
    usuario.email = email;
    usuario.telefone = telefone;
    usuario.cpf = cpf;
    usuario.senha = hashedSenha;
    usuario.remember_me = remember_me;

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    await usuarioRepository.save(usuario);

    res.json(usuario);
  });

  app.use('/login', loginRouter);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Error during Data Source initialization", err);
});
