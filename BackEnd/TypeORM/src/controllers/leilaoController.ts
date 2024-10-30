import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Leilao, StatusLeilao } from '../entity/Leilao';
import { Usuario } from '../entity/Usuario';
import fs from 'fs';
import path from 'path';

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Função para criar um leilão
export const createLeilao = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { nome_ativo, raca, data_inicio, horasDuracao, minutosDuracao, valor_inicial, descricao } = req.body;
    const usuarioAutenticado = await AppDataSource.getRepository(Usuario).findOneBy({ id: 1 });

    if (!usuarioAutenticado || usuarioAutenticado.tipo_usuario !== 'Leiloeiro') {
      res.status(401).json({ message: 'Apenas Leiloeiros podem criar leilões' });
      return;
    }

    const horas = parseInt(horasDuracao, 10);
    const minutos = parseInt(minutosDuracao, 10);
    const valorInicial = parseFloat(valor_inicial);
    const inicioLeilao = new Date(data_inicio);
    const dataTermino = new Date(inicioLeilao);
    dataTermino.setHours(dataTermino.getHours() + horas);
    dataTermino.setMinutes(dataTermino.getMinutes() + minutos);

    const leilao = new Leilao();
    leilao.nomeAtivo = nome_ativo;
    leilao.raca = raca;
    leilao.dataInicio = inicioLeilao;
    leilao.valorInicial = valorInicial;
    leilao.dataTermino = dataTermino;
    leilao.descricao = descricao;
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

// Função para listar leilões disponíveis
export const getLeiloesDisponiveis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leiloesDisponiveis = await leilaoRepository.find({
      where: { status: StatusLeilao.ABERTO },
      relations: ['criador'],
    });
    res.json(leiloesDisponiveis);
  } catch (error) {
    console.error('Erro ao buscar leilões disponíveis:', error);
    next(error);
  }
};

// Função para obter detalhes do leilão por ID
export const getLeilaoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leilaoId = parseInt(req.params.id, 10);
    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leilao = await leilaoRepository.findOne({ where: { id: leilaoId }, relations: ['criador'] });

    if (!leilao) {
      res.status(404).json({ message: 'Leilão não encontrado' });
      return;
    }

    res.json(leilao);
  } catch (error) {
    console.error('Erro ao buscar leilão por ID:', error);
    next(error);
  }
};
