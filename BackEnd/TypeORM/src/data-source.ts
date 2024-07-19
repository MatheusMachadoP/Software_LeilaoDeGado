import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "./entity/Usuario";
import { Carteira } from "./entity/Carteira";
import dotenv from 'dotenv';

dotenv.config();

console.log({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Usuario, Carteira],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
