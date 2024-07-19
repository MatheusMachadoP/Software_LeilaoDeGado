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
      // Extrai os dados do corpo da requisição
      const { nome_completo, email, telefone, cpf, senha, remember_me } = req.body;
      
      // Cria uma nova instância de usuário com os dados recebidos
      const usuario = AppDataSource.getRepository('Usuario').create({
        nome_completo,
        email,
        telefone,
        cpf,
        senha,
        remember_me,
      });
      
      // Salva o novo usuário no banco de dados
      await AppDataSource.getRepository('Usuario').save(usuario);
      
      // Retorna o usuário criado como resposta
      res.json(usuario);
    });

    // Inicie o servidor na porta especificada no .env ou na porta 3000
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // caso a inicialização do Data Source falhe
    console.error("Error during Data Source initialization", err);
  });
