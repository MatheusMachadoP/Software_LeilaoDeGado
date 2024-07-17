import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { Usuario } from './entity/Usuario';
import { Carteira } from './entity/Carteira';

const app = express();
app.use(cors());
app.use(express.json());

// Iniciar a conexão com o banco de dados
AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!");
}).catch((err) => {
    console.error("Error during Data Source initialization", err);
});

// Rota para criar um usuário
app.post('/usuarios', async (req, res) => {
    const { nome_completo, email, telefone, cpf, senha, remember_me } = req.body;
    const usuario = new Usuario();
    usuario.nome_completo = nome_completo;
    usuario.email = email;
    usuario.telefone = telefone;
    usuario.cpf = cpf;
    usuario.senha = senha;
    usuario.remember_me = remember_me;

    const usuarioRepository = AppDataSource.getRepository(Usuario);
    await usuarioRepository.save(usuario);

    res.json(usuario);
});

// Rota para listar usuários
app.get('/usuarios', async (req, res) => {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const usuarios = await usuarioRepository.find();
    res.json(usuarios);
});

// Outras rotas CRUD para usuários e carteiras...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
