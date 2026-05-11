import type { ErrorRequestHandler, RequestHandler } from 'express';
import { Prisma } from '@prisma/client';

import { ApiError } from '../shared/api-error';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      mensagem: error.message,
      detalhes: error.detalhes
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        mensagem: 'Já existe um registro com esses dados.'
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({
        mensagem: 'Registro não encontrado.'
      });
    }
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      mensagem: 'JSON inválido.'
    });
  }

  console.error('Erro inesperado na API ReparaTech:', error);
  return res.status(500).json({
    mensagem: 'Erro interno do servidor.'
  });
};
