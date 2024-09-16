"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const Usuario_1 = require("../entity/Usuario");
const validateUsuario_1 = require("../middlewares/validateUsuario"); // Middleware para validação de dados
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.post('/', validateUsuario_1.validateUsuario, async (req, res, next) => {
    try {
        const { nome_completo, email, telefone, cpf, senha } = req.body;
        // Verifica se o email já está registrado
        const usuarioRepository = data_source_1.AppDataSource.getRepository(Usuario_1.Usuario);
        const existingUserByEmail = await usuarioRepository.findOne({ where: { email: email.toLowerCase() } });
        if (existingUserByEmail) {
            console.log('Tentativa de cadastro com email já registrado:', email);
            return res.status(400).json({ message: 'Email já cadastrado' });
        }
        // Verifica se o CPF já está registrado
        const existingUserByCPF = await usuarioRepository.findOne({ where: { cpf } });
        if (existingUserByCPF) {
            console.log('Tentativa de cadastro com CPF já registrado:', cpf);
            return res.status(400).json({ message: 'CPF já cadastrado' });
        }
        // Geração do salt e hash da senha
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedSenha = await bcryptjs_1.default.hash(senha, salt);
        // Criação de uma nova instância de usuário
        const usuario = new Usuario_1.Usuario();
        usuario.nome_completo = nome_completo;
        usuario.email = email.toLowerCase(); // Armazenando o email em letras minúsculas para evitar problemas de case sensitivity
        usuario.telefone_celular = telefone;
        usuario.cpf = cpf;
        usuario.senha = hashedSenha;
        // Salva o novo usuário no banco de dados
        await usuarioRepository.save(usuario);
        // Remover o campo senha da resposta antes de enviar ao cliente
        const { senha: _, ...userWithoutPassword } = usuario;
        // Geração do token JWT
        const token = jsonwebtoken_1.default.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' } // Define o tempo de expiração do token conforme sua necessidade
        );
        // Retorna o usuário recém-criado e o token na resposta
        res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: userWithoutPassword, token });
    }
    catch (error) {
        console.error('Erro ao cadastrar usuário:', error); // Log do erro para depuração
        next(error); // Passa o erro para o middleware de tratamento de erros
    }
});
exports.default = router;
