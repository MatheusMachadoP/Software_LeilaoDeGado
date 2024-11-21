import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../data-source';
import { Leilao } from '../entity/Leilao';
import { Usuario } from '../entity/Usuario';
import { Lance } from '../entity/Lance';

// Função para realizar um lance
export const realizarLance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leilaoId = parseInt(req.params.id, 10);
    const { valor } = req.body;
    const usuarioAutenticado = await AppDataSource.getRepository(Usuario).findOneBy({ id: 1 }); // Substitua 1 pelo ID do usuário autenticado

    if (!usuarioAutenticado) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }

    const leilaoRepository = AppDataSource.getRepository(Leilao);
    const leilao = await leilaoRepository.findOne({ where: { id: leilaoId } });

    if (!leilao) {
      res.status(404).json({ message: 'Leilão não encontrado' });
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