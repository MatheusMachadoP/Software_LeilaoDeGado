// src/routes/leilao.ts
import express from 'express';
import { 
  createLeilao, 
  getLeiloesDisponiveis, 
  getLeilaoById, 
  participarLeilao 
} from '../controllers/leilaoController';
import { uploadMiddleware } from '../controllers/leilaoController'; // Importa de leilaoController.ts
import authenticateJWT from '../middlewares/authenticateJWT';

const router = express.Router();

// Rotas
router.post('/', authenticateJWT, uploadMiddleware, createLeilao); // POST /api/leiloes
router.get('/disponiveis', getLeiloesDisponiveis); // GET /api/leiloes/disponiveis
router.get('/:id', getLeilaoById); // GET /api/leiloes/:id
router.post('/:id/participar', authenticateJWT, participarLeilao); // POST /api/leiloes/:id/participar

export default router;