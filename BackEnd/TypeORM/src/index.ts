import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { AppDataSource } from './data-source';
import { Usuario } from './entity/Usuario';
import loginRouter from './controllers/login';
import usuarioRouter from './controllers/usuario';
import { errorHandler } from './middlewares/errorHandler';
import leilaoRouter from './controllers/leilao';

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/leiloes', leilaoRouter);

AppDataSource.initialize().then(async () => {
    console.log("Data Source has been initialized!");

    // Configura as rotas
    app.use('/login', loginRouter);
    app.use('/usuarios', usuarioRouter);

    // Rota para criar usuários
    app.post('/usuarios', async (req, res) => {
        const { nome_completo, email, telefone, cpf, senha } = req.body;

        try {
            // Criptografa a senha antes de salvar
            const salt = await bcrypt.genSalt(10);
            const hashedSenha = await bcrypt.hash(senha, salt);

            // Cria uma nova instância de usuário com os dados recebidos
            const usuario = new Usuario();
            usuario.nome_completo = nome_completo;
            usuario.email = email.toLowerCase(); // Converte o email para minúsculas
            usuario.telefone_celular = telefone;
            usuario.cpf = cpf;
            usuario.senha = hashedSenha;

            // Salva o novo usuário no banco de dados
            const usuarioRepository = AppDataSource.getRepository(Usuario);
            await usuarioRepository.save(usuario);

            // Retorna o usuário criado como resposta
            res.json(usuario);
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ message: 'Erro ao cadastrar usuário' });
        }
    });

    // Middleware de tratamento de erros
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Error during Data Source initialization", err);
});
