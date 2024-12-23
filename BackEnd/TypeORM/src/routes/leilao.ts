import express from 'express';
import { createLeilao, getLeiloesDisponiveis, getLeilaoById, participarLeilao, uploadMiddleware } from '../controllers/leilaoController';
import authenticateJWT from '../middlewares/authenticateJWT';

const router = express.Router();

// Rota para criar um leilão
router.post('/', authenticateJWT, uploadMiddleware, createLeilao);

// Rota para obter leilões disponíveis
router.get('/disponiveis', getLeiloesDisponiveis);

// Rota para obter detalhes do leilão por ID
router.get('/:id', getLeilaoById);

// Rota para participar do leilão
router.post('/:id/participar', authenticateJWT, participarLeilao);

export default router;