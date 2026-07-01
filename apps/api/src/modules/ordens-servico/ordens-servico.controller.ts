import type { Request, Response } from 'express';

import { asyncHandler } from '../../shared/async-handler';
import { gerarComprovanteOrdemServico } from '../comprovantes/comprovantes.service';
import {
  atualizarOrdemServico,
  atualizarStatusOrdemServico,
  cadastrarOrdemServico,
  listarOrdensServico,
  obterOrdemServico,
  removerOrdemServico,
  vincularPecaNaOrdemServico
} from './ordens-servico.service';
import { ordemServicoIdSchema } from './ordens-servico.schemas';

export const listarOrdensServicoController = asyncHandler(async (_req: Request, res: Response) => {
  const ordens = await listarOrdensServico();
  res.json({ ordens });
});

export const obterOrdemServicoController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = ordemServicoIdSchema.parse(req.params);
  const ordem = await obterOrdemServico(id);
  res.json({ ordem });
});

export const gerarComprovanteOrdemServicoController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = ordemServicoIdSchema.parse(req.params);
  const comprovante = await gerarComprovanteOrdemServico(id);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${comprovante.nomeArquivo}"`);
  res.send(comprovante.arquivo);
});

export const cadastrarOrdemServicoController = asyncHandler(async (req: Request, res: Response) => {
  const ordem = await cadastrarOrdemServico(req.body);
  res.status(201).json({
    mensagem: 'Ordem de serviço cadastrada com sucesso.',
    ordem
  });
});

export const atualizarOrdemServicoController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = ordemServicoIdSchema.parse(req.params);
  const ordem = await atualizarOrdemServico(id, req.body);
  res.json({
    mensagem: 'Ordem de serviço atualizada com sucesso.',
    ordem
  });
});

export const atualizarStatusOrdemServicoController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = ordemServicoIdSchema.parse(req.params);
  const ordem = await atualizarStatusOrdemServico(id, req.body);
  res.json({
    mensagem: 'Status da ordem de serviço atualizado com sucesso.',
    ordem
  });
});

export const vincularPecaNaOrdemServicoController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = ordemServicoIdSchema.parse(req.params);
  const ordem = await vincularPecaNaOrdemServico(id, req.body);
  res.json({
    mensagem: 'Peça vinculada à ordem de serviço com sucesso.',
    ordem
  });
});

export const removerOrdemServicoController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = ordemServicoIdSchema.parse(req.params);
  await removerOrdemServico(id);
  res.json({
    mensagem: 'Ordem de serviço removida com sucesso.'
  });
});
