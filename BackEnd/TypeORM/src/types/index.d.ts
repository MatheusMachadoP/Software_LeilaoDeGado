// src/types/express/index.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        // Adicione outros campos conforme necessário
      };
    }
  }
}

export {}; // Adicionado para garantir que o arquivo seja tratado como um módulo