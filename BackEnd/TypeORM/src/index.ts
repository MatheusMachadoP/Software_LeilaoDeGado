import "reflect-metadata";
import dotenv from 'dotenv';
import { AppDataSource } from "./data-source";
import express from 'express';
import cors from 'cors';

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // Defina suas rotas aqui
    app.post('/usuarios', async (req, res) => {
      const { nome_completo, email, telefone, cpf, senha, remember_me } = req.body;
      const usuario = AppDataSource.getRepository('Usuario').create({
        nome_completo,
        email,
        telefone,
        cpf,
        senha,
        remember_me,
      });
      await AppDataSource.getRepository('Usuario').save(usuario);
      res.json(usuario);
    });

    // Inicie o servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
