import fs from 'fs';
import path from 'path';
import express from 'express';
import multer from 'multer';
import { AppDataSource } from '../data-source';
import { Leilao } from '../entity/Leilao';
import { Usuario } from '../entity/Usuario';

// Verifica se o diretório de upload existe, se não, cria o diretório
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurando o multer para lidar com o upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // pasta onde as imagens serão armazenadas
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
router.post('/', upload.single('foto'), async (req, res, next) => {
  try {
    console.log('Recebendo dados para criação de leilão:', req.body);

    const { nome_ativo, raca, data_inicio, valor_inicial, duracao, descricao, criadorId } = req.body;

    // Verifica se a data é válida antes de tentar salvar
    const dataValida = new Date(data_inicio);
    if (isNaN(dataValida.getTime())) {
      console.error('Data de início inválida:', data_inicio);
      return res.status(400).json({ message: 'Data de início inválida' });
    }

    console.log('Data de início válida:', dataValida.toISOString());

    // Verifica se o usuário criador existe
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const criador = await usuarioRepository.findOne({ where: { id: criadorId } });

    if (!criador) {
      console.log('Tentativa de criar leilão com criador não encontrado:', criadorId);
      return res.status(400).json({ message: 'Usuário criador não encontrado' });
    }

    console.log('Usuário criador encontrado:', criador);

    // Criação de uma nova instância de leilão
    const leilao = new Leilao();
    leilao.nomeAtivo = nome_ativo;
    leilao.raca = raca;
    leilao.dataInicio = dataValida;  // Aqui, a data já foi validada
    leilao.valorInicial = parseFloat(valor_inicial);
    leilao.duracao = duracao;
    leilao.descricao = descricao;

    if (req.file) {
      leilao.foto = req.file.filename; // Salva o nome do arquivo no banco de dados
      console.log('Foto recebida e salva:', req.file.filename);
    }

    leilao.criador = criador;

    console.log('Dados do leilão antes de salvar:', leilao);

    // Salva o novo leilão no banco de dados
    const leilaoRepository = AppDataSource.getRepository(Leilao);
    await leilaoRepository.save(leilao);

    console.log('Leilão criado com sucesso:', leilao);

    res.status(201).json({ message: 'Leilão criado com sucesso', leilao });
  } catch (error) {
    console.error('Erro ao criar leilão:', error);
    next(error); // Passa o erro para o middleware de tratamento de erros
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
    console.error('Erro ao buscar leilão:', error);
    next(error);
  }
});

// Atualizar Leilão
router.put('/:id', upload.single('foto'), async (req, res, next) => {
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
      leilao.foto = req.file.filename; // Atualiza o arquivo da foto, se houver um novo upload
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
router.delete('/:id', async (req, res, next) => {
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
