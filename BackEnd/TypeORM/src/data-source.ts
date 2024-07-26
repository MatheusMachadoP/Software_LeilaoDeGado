import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import path from "path";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Importa as suas entidades aqui
import { Perfil } from "./Perfil";
import { Usuario } from "./Usuario";
import { UsuarioPerfil } from "./UsuarioPerfil";
import { Leilao } from "./Leilao";
import { Lance } from "./Lance";
import { Transacao } from "./Transacao";
import { HistoricoTransacao } from "./HistoricoTransacao";
import { Logs } from "./Logs";

// Verifica se as variáveis de ambiente foram carregadas corretamente
if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
  throw new Error("Variáveis de ambiente do banco de dados não configuradas.");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10), // Converte a porta para número
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false, // Desative em produção!
  logging: false,
  entities: [
    Perfil,
    Usuario,
    UsuarioPerfil,
    Leilao,
    Lance,
    Transacao,
    HistoricoTransacao,
    Logs,
  ],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});
