import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import path from "path";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Importa as suas entidades aqui
import { Usuario } from "./entity/Usuario";
import { Leilao } from "./entity/Leilao";
import { Lance } from "./entity/Lance";
import { Transacao } from "./entity/Transacao";
import { HistoricoTransacao } from "./entity/HistoricoTransacao";
import { Logs } from "./entity/Logs";

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
  synchronize: true, // Desative em produção!
  logging: false,
  entities: [
    Usuario,
    Leilao,
    Lance,
    Transacao,
    HistoricoTransacao,
    Logs,
  ],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});