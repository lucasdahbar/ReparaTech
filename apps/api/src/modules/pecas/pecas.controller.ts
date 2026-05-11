import type { Request, Response } from 'express';

import { asyncHandler } from '../../shared/async-handler';
import { cadastrarPeca, listarPecas, obterPeca, atualizarPeca, removerPeca } from './pecas.service';
import { pecaIdSchema } from './pecas.schemas';

export const listarPecasController = asyncHandler(async (_req: Request, res: Response) => {
  const pecas = await listarPecas();
  res.json({ pecas });
});

export const obterPecaController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = pecaIdSchema.parse(req.params);
  const peca = await obterPeca(id);
  res.json({ peca });
});

export const cadastrarPecaController = asyncHandler(async (req: Request, res: Response) => {
  const peca = await cadastrarPeca(req.body);
  res.status(201).json({
    mensagem: 'Peça cadastrada com sucesso.',
    peca
  });
});

export const atualizarPecaController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = pecaIdSchema.parse(req.params);
  const peca = await atualizarPeca(id, req.body);
  res.json({
    mensagem: 'Peça atualizada com sucesso.',
    peca
  });
});

export const removerPecaController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = pecaIdSchema.parse(req.params);
  await removerPeca(id);
  res.json({
    mensagem: 'Peça removida com sucesso.'
  });
});
