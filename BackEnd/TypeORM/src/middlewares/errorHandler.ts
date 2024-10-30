import { Request, Response, NextFunction } from 'express';

// Middleware de tratamento de erros
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): Response | void => {
    console.error('Erro capturado pelo middleware:', err);

    // Log dos dados da requisição que podem ter causado o erro
    console.log('Dados da requisição:', {
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers
    });

    // Verifica o tipo do erro e ajusta a resposta
    if (err.name === 'EntityNotFound') {
        console.log('Erro de entidade não encontrada:', err.message);
        return res.status(404).json({ message: 'Recurso não encontrado' });
    }

    if (err.name === 'QueryFailedError') {
        console.log('Erro de falha na consulta ao banco de dados:', err.message);
        if (err.code === '23505') {
            console.log('Erro de unicidade detectado:', err.detail);
            return res.status(400).json({ message: 'Erro de unicidade: já existe um registro com essas informações' });
        }
        return res.status(400).json({ message: 'Erro na consulta ao banco de dados' });
    }

    // Se o erro não foi tratado acima, retorna um erro genérico
    console.error('Erro não tratado, retornando erro interno do servidor:', err.message);
    return res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
};