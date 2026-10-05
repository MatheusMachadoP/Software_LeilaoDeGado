// src/controllers/leilaoController.ts

import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Leilao, StatusLeilao } from '../entity/Leilao';
import { Usuario } from '../entity/Usuario';
import { Lance } from '../entity/Lance';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { deployLeilaoContract, darLanceOnChain, finalizarLeilaoOnChain } from '../blockchain/leilaoContract';

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

    const duracaoRodadaSegundos = ((isNaN(horas) ? 0 : horas) * 3600) + ((isNaN(minutos) ? 0 : minutos) * 60) || 3600;

    try {
      const { endereco, txHashCriacao } = await deployLeilaoContract({
        nomeAtivo: leilao.nomeAtivo!,
        precoInicial: leilao.valorInicial,
        duracaoRodadaSegundos,
        numeroRodadas: 1,
        data: inicioLeilao.toISOString(),
      });

      leilao.enderecoContrato = endereco;
      leilao.txHashCriacao = txHashCriacao;
      await leilaoRepository.save(leilao);
    } catch (chainError) {
      console.error('Erro ao publicar leilão na blockchain:', chainError);
      await leilaoRepository.remove(leilao);
      res.status(502).json({ message: 'Leilão não pôde ser publicado na blockchain', error: String(chainError) });
      return;
    }

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

    if (!leilao.enderecoContrato) {
      res.status(409).json({ message: 'Este leilão não possui contrato na blockchain associado' });
      return;
    }

    let txHash: string;
    try {
      const resultado = await darLanceOnChain(
        leilao.enderecoContrato,
        Number(valor),
        usuarioAutenticado.nome_completo,
        usuarioAutenticado.cpf
      );
      txHash = resultado.txHash;
    } catch (chainError) {
      console.error('Erro ao registrar lance na blockchain:', chainError);
      res.status(502).json({ message: 'Lance rejeitado pelo contrato (verifique se o valor é maior que o lance atual)', error: String(chainError) });
      return;
    }

    const lance = new Lance();
    lance.valor = valor;
    lance.usuario = usuarioAutenticado;
    lance.leilao = leilao;
    lance.txHash = txHash;

    const lanceRepository = AppDataSource.getRepository(Lance);
    await lanceRepository.save(lance);

    res.status(201).json({ message: 'Lance realizado com sucesso', lance });
  } catch (error) {
    console.error('Erro ao participar do leilão:', error);
    res.status(500).json({ message: 'Erro interno ao participar do leilão', error });
    next(error);
  }
};

// Função para encerrar um leilão: fecha o contrato on-chain e define o vencedor a partir dos lances registrados
export const finalizarLeilao = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leilaoId = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leilao = await leilaoRepository.findOne({
      where: { id: leilaoId },
      relations: ['criador', 'lances', 'lances.usuario'],
    });

    if (!leilao) {
      res.status(404).json({ message: 'Leilão não encontrado' });
      return;
    }

    if (leilao.criador?.id !== userId) {
      res.status(403).json({ message: 'Apenas o criador do leilão pode encerrá-lo' });
      return;
    }

    if (leilao.status !== StatusLeilao.ABERTO) {
      res.status(400).json({ message: 'Leilão já está encerrado' });
      return;
    }

    if (leilao.enderecoContrato) {
      try {
        await finalizarLeilaoOnChain(leilao.enderecoContrato);
      } catch (chainError) {
        console.error('Erro ao encerrar leilão na blockchain:', chainError);
        res.status(502).json({ message: 'Erro ao encerrar leilão na blockchain', error: String(chainError) });
        return;
      }
    }

    const maiorLance = (leilao.lances || []).reduce<Lance | null>((maior, atual) => {
      return !maior || Number(atual.valor) > Number(maior.valor) ? atual : maior;
    }, null);

    leilao.status = StatusLeilao.FECHADO;
    if (maiorLance?.usuario) {
      leilao.vencedor = maiorLance.usuario;
    }

    await leilaoRepository.save(leilao);
    res.status(200).json({ message: 'Leilão encerrado com sucesso', leilao });
  } catch (error) {
    console.error('Erro ao encerrar leilão:', error);
    res.status(500).json({ message: 'Erro interno ao encerrar leilão', error });
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