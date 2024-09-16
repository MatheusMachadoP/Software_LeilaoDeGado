"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: path_1.default.resolve(__dirname, "..", ".env") });
// Importa as suas entidades aqui
const Perfil_1 = require("./entity/Perfil");
const Usuario_1 = require("./entity/Usuario");
const UsuarioPerfil_1 = require("./entity/UsuarioPerfil");
const Leilao_1 = require("./entity/Leilao");
const Lance_1 = require("./entity/Lance");
const Transacao_1 = require("./entity/Transacao");
const HistoricoTransacao_1 = require("./entity/HistoricoTransacao");
const Logs_1 = require("./entity/Logs");
// Verifica se as variáveis de ambiente foram carregadas corretamente
if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
    throw new Error("Variáveis de ambiente do banco de dados não configuradas.");
}
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10), // Converte a porta para número
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, // Desative em produção!
    logging: false,
    entities: [
        Perfil_1.Perfil,
        Usuario_1.Usuario,
        UsuarioPerfil_1.UsuarioPerfil,
        Leilao_1.Leilao,
        Lance_1.Lance,
        Transacao_1.Transacao,
        HistoricoTransacao_1.HistoricoTransacao,
        Logs_1.Logs,
    ],
    migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
