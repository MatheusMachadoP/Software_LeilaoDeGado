import express from 'express';
import { createLeilao, getLeiloesDisponiveis, getLeilaoById } from '../controllers/leilaoController';
import multer from 'multer';
import path from 'path';

// Configuração do multer
const uploadDir = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = express.Router();

// Rotas
router.post('/', upload.single('foto'), createLeilao);
router.get('/disponiveis', getLeiloesDisponiveis);
router.get('/:id', getLeilaoById);

export default router;