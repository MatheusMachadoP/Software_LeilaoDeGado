/// <reference path="./types/index.d.ts" />

import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import bodyParser from 'body-parser';
import usuarioRouter from './controllers/usuario';
import leilaoRouter from './routes/leilao';
import { errorHandler } from './middlewares/errorHandler';
import { loginRouter } from './controllers/login';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json()); // Middleware para parsear JSON
app.use(bodyParser.urlencoded({ extended: true })); // Middleware para parsear URL-encoded

// Inicialize a conexão com o banco de dados e o servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });

// Rotas
app.use('/usuarios', usuarioRouter);
app.use('/leiloes', leilaoRouter);
app.use('/login', loginRouter); 
// app.use(bodyParser.json()); // Middleware para parsear JSON
// app.use('/api', leilaoRouter); // Usar as rotas definidas em leilao.ts


// Interface para o erro
interface CustomError extends Error {
  status?: number;
}

// Middleware de tratamento de erros
app.use((err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  errorHandler(err, req, res, next);
});