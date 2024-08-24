import { Request, Response, NextFunction } from 'express';

// Middleware de tratamento de erros
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Erro:', err);

    // Verifica o tipo do erro e ajusta a resposta
    if (err.name === 'EntityNotFound') {
        return res.status(404).json({ message: 'Recurso não encontrado' });
    }

    if (err.name === 'QueryFailedError') {
        if (err.code === '23505') {
            return res.status(400).json({ message: 'Erro de unicidade: já existe um registro com essas informações' });
        }
        return res.status(400).json({ message: 'Erro na consulta ao banco de dados' });
    }

    // Se o erro não foi tratado acima, retorna um erro genérico
    return res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
};
