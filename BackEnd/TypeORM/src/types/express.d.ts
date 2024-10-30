// src/types/express.d.ts
import { Usuario } from '../entity/Usuario';

declare global {
  namespace Express {
    interface Request {
      user?: Usuario; // Ajuste o tipo conforme necessário
    }
  }
}