/// <reference path="../types/express.d.ts" />
import fs from 'fs';
import path from 'path';
import express from 'express';
import multer from 'multer';
import { AppDataSource } from '../data-source';
import { Leilao } from '../entity/Leilao';
import { authenticateJWT } from '../middlewares/authenticateJWT';

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('O arquivo deve ser uma imagem!'));
    }
  }
});

const router = express.Router();

// Criar Leilão
router.post('/', authenticateJWT, upload.single('foto'), async (req, res, next) => {
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

    const leilao = new Leilao();
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

    const leilaoRepository = AppDataSource.getRepository(Leilao);
    await leilaoRepository.save(leilao);

    res.status(201).json({ message: 'Leilão criado com sucesso', leilao });
  } catch (error) {
    console.error('Erro ao criar leilão:', error);
    next(error);
  }
});

// Buscar todos os Leilões
router.get('/', async (req, res, next) => {
  try {
    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leiloes = await leilaoRepository.find();
    res.json(leiloes);
  } catch (error) {
    console.error('Erro ao buscar leilões:', error);
    next(error);
  }
});

// Buscar todos os Leilões de um usuário específico
router.get('/meus-leiloes', authenticateJWT, async (req, res, next) => {
  try {
    console.log('Usuário autenticado:', req.user);  // Log para depuração
    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leiloes = await leilaoRepository.find({
      where: { criador: req.user },  // Filtrando os leilões pelo usuário autenticado
      relations: ['criador'],
    });
    console.log('Leilões encontrados:', leiloes);  // Log para depuração
    res.json(leiloes);  // Respondendo com os leilões encontrados
  } catch (error) {
    next(error);  // Passando qualquer erro para o middleware de tratamento de erros
  }
});


// Buscar Leilão por ID
router.get('/:id', async (req, res, next) => {
  try {
    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leilao = await leilaoRepository.findOne({ where: { id: parseInt(req.params.id) } });

    if (!leilao) {
      return res.status(404).json({ message: 'Leilão não encontrado' });
    }

    res.json(leilao);
  } catch (error) {
    console.error('Erro ao buscar leilão por ID:', error);
    next(error);
  }
});

// Atualizar Leilão
router.put('/:id', authenticateJWT, upload.single('foto'), async (req, res, next) => {
  try {
    const leilaoRepository = AppDataSource.getRepository(Leilao);
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
  } catch (error) {
    console.error('Erro ao atualizar leilão:', error);
    next(error);
  }
});

// Deletar Leilão
router.delete('/:id', authenticateJWT, async (req, res, next) => {
  try {
    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leilao = await leilaoRepository.findOne({ where: { id: parseInt(req.params.id) } });

    if (!leilao) {
      return res.status(404).json({ message: 'Leilão não encontrado' });
    }

    await leilaoRepository.remove(leilao);

    res.json({ message: 'Leilão deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar leilão:', error);
    next(error);
  }
});

export default router;
