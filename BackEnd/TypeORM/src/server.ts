import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { AppDataSource } from './data-source';
import loginRouter from './controllers/login';
import usuarioRouter from './controllers/usuario'; // Novo controller para as rotas de usuário
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

AppDataSource.initialize().then(async () => {
    console.log("Data Source has been initialized!");

    app.use('/login', loginRouter);
    app.use('/usuarios', usuarioRouter); // Usa o novo controller de usuário
    app.use(errorHandler); // Middleware para tratamento de erros

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Error during Data Source initialization", err);
});
