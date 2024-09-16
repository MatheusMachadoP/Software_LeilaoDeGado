"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Usuario_1 = require("../entity/Usuario");
const data_source_1 = require("../data-source");
const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const usuarioRepository = data_source_1.AppDataSource.getRepository(Usuario_1.Usuario);
        const usuario = await usuarioRepository.findOne({ where: { id: decoded.id } });
        if (!usuario) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }
        // Adiciona o usuário ao objeto da requisição
        req.user = usuario;
        next();
    }
    catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(403).json({ message: 'Token inválido ou expirado' });
    }
};
exports.authenticateJWT = authenticateJWT;
