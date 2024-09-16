"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = require("../data-source");
const Usuario_1 = require("../entity/Usuario");
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const { email, senha } = req.body;
    // Logando a tentativa de login para verificação
    console.log('Tentativa de login com email:', email);
    try {
        const usuarioRepository = data_source_1.AppDataSource.getRepository(Usuario_1.Usuario);
        // Busca o usuário pelo email, tratando o email em lowercase
        const usuario = await usuarioRepository.findOne({
            where: { email: email.toLowerCase() },
            relations: ['perfis', 'perfis.perfil'], // Certifique-se de que essas relações estão corretamente configuradas
        });
        // Logando o resultado da busca
        console.log('Usuário encontrado:', usuario);
        // Verifica se o usuário foi encontrado
        if (!usuario) {
            console.log('Usuário não encontrado:', email);
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        // Verifica se a senha é válida comparando com a senha criptografada no banco de dados
        const isValidPassword = await bcryptjs_1.default.compare(senha, usuario.senha);
        if (!isValidPassword) {
            console.log('Senha inválida para o usuário:', email);
            return res.status(401).json({ message: 'Senha inválida' });
        }
        console.log('Login realizado com sucesso para o usuário:', email);
        // Geração do token JWT
        const token = jsonwebtoken_1.default.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' } // Define o tempo de expiração do token conforme sua necessidade
        );
        // Prepara uma lista de perfis para incluir na resposta, se existirem
        const perfis = usuario.perfis && usuario.perfis.length > 0
            ? usuario.perfis.map(up => up.perfil?.nome || 'Perfil Desconhecido')
            : [];
        // Retorna sucesso com os perfis do usuário e o token JWT
        res.json({ message: 'Login realizado com sucesso', token, perfis });
    }
    catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});
exports.default = router;
