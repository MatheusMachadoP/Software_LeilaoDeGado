"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const data_source_1 = require("./data-source");
const Usuario_1 = require("./entity/Usuario");
const login_1 = __importDefault(require("./controllers/login"));
const usuario_1 = __importDefault(require("./controllers/usuario"));
const errorHandler_1 = require("./middlewares/errorHandler");
const leilao_1 = __importDefault(require("./controllers/leilao"));
// Carregar as variáveis de ambiente do arquivo .env
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/leiloes', leilao_1.default);
data_source_1.AppDataSource.initialize().then(async () => {
    console.log("Data Source has been initialized!");
    // Configura as rotas
    app.use('/login', login_1.default);
    app.use('/usuarios', usuario_1.default);
    // Rota para criar usuários
    app.post('/usuarios', async (req, res) => {
        const { nome_completo, email, telefone, cpf, senha } = req.body;
        try {
            // Criptografa a senha antes de salvar
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedSenha = await bcryptjs_1.default.hash(senha, salt);
            // Cria uma nova instância de usuário com os dados recebidos
            const usuario = new Usuario_1.Usuario();
            usuario.nome_completo = nome_completo;
            usuario.email = email.toLowerCase(); // Converte o email para minúsculas
            usuario.telefone_celular = telefone;
            usuario.cpf = cpf;
            usuario.senha = hashedSenha;
            // Salva o novo usuário no banco de dados
            const usuarioRepository = data_source_1.AppDataSource.getRepository(Usuario_1.Usuario);
            await usuarioRepository.save(usuario);
            // Retorna o usuário criado como resposta
            res.json(usuario);
        }
        catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ message: 'Erro ao cadastrar usuário' });
        }
    });
    // Middleware de tratamento de erros
    app.use(errorHandler_1.errorHandler);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Error during Data Source initialization", err);
});
