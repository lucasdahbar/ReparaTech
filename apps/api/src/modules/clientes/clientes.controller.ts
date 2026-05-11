import type { Request, Response } from 'express';

import { asyncHandler } from '../../shared/async-handler';
import { alterarCliente, cadastrarCliente, listarClientes, obterCliente, removerCliente } from './clientes.service';
import { clienteIdSchema } from './clientes.schemas';

export const listarClientesController = asyncHandler(async (_req: Request, res: Response) => {
  const clientes = await listarClientes();
  res.json({ clientes });
});

export const obterClienteController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = clienteIdSchema.parse(req.params);
  const cliente = await obterCliente(id);
  res.json({ cliente });
});

export const cadastrarClienteController = asyncHandler(async (req: Request, res: Response) => {
  const cliente = await cadastrarCliente(req.body);
  res.status(201).json({
    mensagem: 'Cliente cadastrado com sucesso.',
    cliente
  });
});

export const alterarClienteController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = clienteIdSchema.parse(req.params);
  const cliente = await alterarCliente(id, req.body);
  res.json({
    mensagem: 'Cliente atualizado com sucesso.',
    cliente
  });
});

export const removerClienteController = asyncHandler(async (req: Request, res: Response) => {
  const { id } = clienteIdSchema.parse(req.params);
  await removerCliente(id);

  res.json({
    mensagem: 'Cliente removido com sucesso.'
  });
});
