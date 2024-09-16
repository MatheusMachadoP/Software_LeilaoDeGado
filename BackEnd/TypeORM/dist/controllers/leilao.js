"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const data_source_1 = require("../data-source");
const Leilao_1 = require("../entity/Leilao");
const authenticateJWT_1 = require("../middlewares/authenticateJWT");
const uploadDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('O arquivo deve ser uma imagem!'));
        }
    }
});
const router = express_1.default.Router();
// Criar Leilão
router.post('/', authenticateJWT_1.authenticateJWT, upload.single('foto'), async (req, res, next) => {
    try {
        const usuarioAutenticado = req.user;
        if (!usuarioAutenticado) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }
        const { nome_ativo, raca, data_inicio, valor_inicial, duracao, descricao } = req.body;
        const dataValida = new Date(data_inicio);
        if (isNaN(dataValida.getTime())) {
            return res.status(400).json({ message: 'Data de início inválida' });
        }
        const leilao = new Leilao_1.Leilao();
        leilao.nomeAtivo = nome_ativo;
        leilao.raca = raca;
        leilao.dataInicio = dataValida;
        leilao.valorInicial = parseFloat(valor_inicial);
        leilao.duracao = duracao;
        leilao.descricao = descricao;
        leilao.criador = usuarioAutenticado;
        if (req.file) {
            leilao.foto = req.file.filename;
        }
        const leilaoRepository = data_source_1.AppDataSource.getRepository(Leilao_1.Leilao);
        await leilaoRepository.save(leilao);
        res.status(201).json({ message: 'Leilão criado com sucesso', leilao });
    }
    catch (error) {
        next(error);
    }
});
// Buscar todos os Leilões
router.get('/', async (req, res, next) => {
    try {
        const leilaoRepository = data_source_1.AppDataSource.getRepository(Leilao_1.Leilao);
        const leiloes = await leilaoRepository.find();
        res.json(leiloes);
    }
    catch (error) {
        next(error);
    }
});
// Buscar todos os Leilões de um usuário específico
router.get('/meus-leiloes', authenticateJWT_1.authenticateJWT, async (req, res, next) => {
    try {
        const usuarioAutenticado = req.user;
        if (!usuarioAutenticado) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }
        const leilaoRepository = data_source_1.AppDataSource.getRepository(Leilao_1.Leilao);
        const leiloes = await leilaoRepository.find({
            where: { criador: usuarioAutenticado },
            relations: ['criador']
        });
        if (leiloes.length === 0) {
            return res.status(404).json({ message: 'Nenhum leilão encontrado para este usuário' });
        }
        res.json(leiloes);
    }
    catch (error) {
        next(error);
    }
});
// Buscar Leilão por ID
router.get('/:id', async (req, res, next) => {
    try {
        const leilaoRepository = data_source_1.AppDataSource.getRepository(Leilao_1.Leilao);
        const leilao = await leilaoRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!leilao) {
            return res.status(404).json({ message: 'Leilão não encontrado' });
        }
        res.json(leilao);
    }
    catch (error) {
        next(error);
    }
});
// Atualizar Leilão
router.put('/:id', authenticateJWT_1.authenticateJWT, upload.single('foto'), async (req, res, next) => {
    try {
        const leilaoRepository = data_source_1.AppDataSource.getRepository(Leilao_1.Leilao);
        let leilao = await leilaoRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!leilao) {
            return res.status(404).json({ message: 'Leilão não encontrado' });
        }
        const { nomeAtivo, raca, dataInicio, valorInicial, duracao, descricao, status } = req.body;
        leilao.nomeAtivo = nomeAtivo ?? leilao.nomeAtivo;
        leilao.raca = raca ?? leilao.raca;
        leilao.dataInicio = dataInicio ? new Date(dataInicio) : leilao.dataInicio;
        leilao.valorInicial = valorInicial ? parseFloat(valorInicial) : leilao.valorInicial;
        leilao.duracao = duracao ?? leilao.duracao;
        leilao.descricao = descricao ?? leilao.descricao;
        if (req.file) {
            leilao.foto = req.file.filename;
        }
        leilao.status = status ?? leilao.status;
        await leilaoRepository.save(leilao);
        res.json({ message: 'Leilão atualizado com sucesso', leilao });
    }
    catch (error) {
        next(error);
    }
});
// Deletar Leilão
router.delete('/:id', authenticateJWT_1.authenticateJWT, async (req, res, next) => {
    try {
        const leilaoRepository = data_source_1.AppDataSource.getRepository(Leilao_1.Leilao);
        const leilao = await leilaoRepository.findOne({ where: { id: parseInt(req.params.id) } });
        if (!leilao) {
            return res.status(404).json({ message: 'Leilão não encontrado' });
        }
        await leilaoRepository.remove(leilao);
        res.json({ message: 'Leilão deletado com sucesso' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
