import { Request, Response } from 'express';
import { AppDataSource } from '../data-source'; // Certifique-se de que o caminho está correto
import { Usuario } from '../entity/Usuario'; // Certifique-se de que o caminho está correto

export const updateWalletAddress = async (req: Request, res: Response): Promise<void> => {
  const { userId, walletAddress } = req.body;

  if (!userId || !walletAddress) {
    res.status(400).json({ message: 'User ID e endereço da carteira são obrigatórios' });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(Usuario);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado' });
      return;
    }

    user.endereco_carteira = walletAddress;
    await userRepository.save(user);

    res.status(200).json({ message: 'Endereço da carteira atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar o endereço da carteira:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar o endereço da carteira' });
  }
};