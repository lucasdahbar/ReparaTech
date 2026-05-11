import type { Request, Response } from 'express';

import { asyncHandler } from '../../shared/async-handler';
import { aparelhoIdSchema } from './aparelhos.schemas';
import { cadastrarAparelhoServico, listarAparelhosServico, obterAparelhoServico, removerAparelhoServico, atualizarAparelhoServico } from './aparelhos.service';

export const listarAparelhosController = asyncHandler(async (_req: Request, res: Response) => {
  const aparelhos = await listarAparelhosServico();
  res.json({ aparelhos });
});

export const obterAparelhoController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = aparelhoIdSchema.parse(req.params);
  const aparelho = await obterAparelhoServico(id);
  res.json({ aparelho });
});

export const cadastrarAparelhoController = asyncHandler(async (req: Request, res: Response) => {
  const aparelho = await cadastrarAparelhoServico(req.body);
  res.status(201).json({
    mensagem: 'Aparelho cadastrado com sucesso.',
    aparelho
  });
});

export const atualizarAparelhoController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = aparelhoIdSchema.parse(req.params);
  const aparelho = await atualizarAparelhoServico(id, req.body);
  res.json({
    mensagem: 'Aparelho atualizado com sucesso.',
    aparelho
  });
});

export const removerAparelhoController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = aparelhoIdSchema.parse(req.params);
  await removerAparelhoServico(id);
  res.json({ mensagem: 'Aparelho removido com sucesso.' });
});
