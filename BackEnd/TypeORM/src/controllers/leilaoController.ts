// src/controllers/leilaoController.ts

import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Leilao, StatusLeilao } from '../entity/Leilao';
import { Usuario } from '../entity/Usuario';
import { Lance } from '../entity/Lance';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Configuração do diretório de upload
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Função para criar um leilão
export const createLeilao = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nome_ativo, raca, data_inicio, horasDuracao, minutosDuracao, valor_inicial, descricao } = req.body;
    
    // Obtenha o ID do usuário autenticado do objeto req.user (definido pelo middleware authenticateJWT)
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const usuarioAutenticado = await AppDataSource.getRepository(Usuario).findOneBy({ id: userId });

    if (!usuarioAutenticado || usuarioAutenticado.tipo_usuario !== 'Leiloeiro') {
      res.status(403).json({ message: 'Apenas Leiloeiros podem criar leilões' });
      return;
    }

    const horas = parseInt(horasDuracao, 10);
    const minutos = parseInt(minutosDuracao, 10);
    const valorInicialParse = parseFloat(valor_inicial);
    const inicioLeilao = new Date(data_inicio);
    const dataTermino = new Date(inicioLeilao);
    dataTermino.setHours(dataTermino.getHours() + (isNaN(horas) ? 0 : horas));
    dataTermino.setMinutes(dataTermino.getMinutes() + (isNaN(minutos) ? 0 : minutos));

    const leilao = new Leilao();
    leilao.nomeAtivo = nome_ativo || 'Ativo Desconhecido';
    leilao.raca = raca || 'Desconhecida';
    leilao.dataInicio = inicioLeilao;
    leilao.valorInicial = isNaN(valorInicialParse) ? 0 : valorInicialParse;
    leilao.dataTermino = dataTermino;
    leilao.descricao = descricao || 'Sem descrição';
    leilao.criador = usuarioAutenticado;
    leilao.status = StatusLeilao.ABERTO;

    if (req.file) {
      leilao.foto = req.file.filename;
    }

    const leilaoRepository = AppDataSource.getRepository(Leilao);
    await leilaoRepository.save(leilao);
    res.status(201).json({ message: 'Leilão criado com sucesso', leilao });
  } catch (error) {
    console.error('Erro ao criar leilão:', error);
    res.status(500).json({ message: 'Erro interno ao criar leilão', error });
    next(error);
  }
};

// Exportar o middleware de upload
export const uploadMiddleware = upload.single('foto');

// Função para obter leilões disponíveis
export const getLeiloesDisponiveis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('Buscando leilões disponíveis no banco de dados...');
    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leiloesDisponiveis = await leilaoRepository.find({
      where: { status: StatusLeilao.ABERTO },
      relations: ['criador', 'lances'],
    });
    console.log(`Leilões encontrados: ${leiloesDisponiveis.length}`);
    res.json(leiloesDisponiveis);
  } catch (error) {
    console.error('Erro ao buscar leilões disponíveis:', error);
    res.status(500).json({ message: 'Erro ao buscar leilões disponíveis' });
    next(error);
  }
};

// Função para obter detalhes do leilão por ID
export const getLeilaoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leilaoId = parseInt(req.params.id, 10);
    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leilao = await leilaoRepository.findOne({
      where: { id: leilaoId },
      relations: ['criador', 'lances']
    });

    if (!leilao) {
      res.status(404).json({ message: 'Leilão não encontrado' });
      return;
    }

    res.json(leilao);
  } catch (error) {
    console.error('Erro ao buscar leilão por ID:', error);
    res.status(500).json({ message: 'Erro interno ao buscar leilão', error });
    next(error);
  }
};

export const participarLeilao = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leilaoId = parseInt(req.params.id, 10);
    const { valor } = req.body;

    // Supondo que o middleware authenticateJWT anexou o ID do usuário em req.user.id
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const usuarioAutenticado = await AppDataSource.getRepository(Usuario).findOneBy({ id: userId });

    if (!usuarioAutenticado) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leilao = await leilaoRepository.findOne({
      where: { id: leilaoId },
      relations: ['lances']
    });

    if (!leilao) {
      res.status(404).json({ message: 'Leilão não encontrado' });
      return;
    }

    // Verificar se o leilão ainda está aberto
    if (leilao.status !== StatusLeilao.ABERTO) {
      res.status(400).json({ message: 'Leilão não está aberto para participação' });
      return;
    }

    const lance = new Lance();
    lance.valor = valor;
    lance.usuario = usuarioAutenticado;
    lance.leilao = leilao;

    const lanceRepository = AppDataSource.getRepository(Lance);
    await lanceRepository.save(lance);

    res.status(201).json({ message: 'Lance realizado com sucesso', lance });
  } catch (error) {
    console.error('Erro ao participar do leilão:', error);
    res.status(500).json({ message: 'Erro interno ao participar do leilão', error });
    next(error);
  }
};

// Função para realizar um lance (Sugestão: utilizar a mesma lógica de participarLeilao)
export const realizarLance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leilaoId = parseInt(req.params.id, 10);
    const { valor } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const usuarioAutenticado = await AppDataSource.getRepository(Usuario).findOneBy({ id: userId });

    if (!usuarioAutenticado) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leilao = await leilaoRepository.findOne({
      where: { id: leilaoId },
      relations: ['lances']
    });

    if (!leilao) {
      res.status(404).json({ message: 'Leilão não encontrado' });
      return;
    }

    // Verificar se o leilão ainda está aberto
    if (leilao.status !== StatusLeilao.ABERTO) {
      res.status(400).json({ message: 'Leilão não está aberto para participação' });
      return;
    }

    const lance = new Lance();
    lance.valor = valor;
    lance.usuario = usuarioAutenticado;
    lance.leilao = leilao;

    const lanceRepository = AppDataSource.getRepository(Lance);
    await lanceRepository.save(lance);

    res.status(201).json({ message: 'Lance realizado com sucesso', lance });
  } catch (error) {
    console.error('Erro ao realizar lance:', error);
    res.status(500).json({ message: 'Erro interno ao realizar lance', error });
    next(error);
  }
};