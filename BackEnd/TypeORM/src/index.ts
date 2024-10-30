// index.ts
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import usuarioRouter from './controllers/usuario';
import leilaoRouter from './routes/leilao';
import { errorHandler } from './middlewares/errorHandler';
import { loginRouter } from './controllers/login';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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

// Middleware de tratamento de erros
app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  errorHandler(err, req, res, next);
});
