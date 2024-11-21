import express, { Router, Request, Response, NextFunction } from 'express';
import { updateWalletAddress, removeWalletAddress } from '../controllers/usuario';
import authenticateJWT from '../middlewares/authenticateJWT';

const router = express.Router();

// Rota para atualizar o endereço da carteira do usuário
router.post('/update-wallet-address', authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
	updateWalletAddress(req, res, next);
  } else {
	res.status(401).send('Unauthorized');
  }
}); // POST /api/usuarios/update-wallet-address
// Rota para remover o endereço da carteira do usuário
router.post('/remove-wallet-address', removeWalletAddress);

export default router;