import type { z } from 'zod';

import { ApiError } from '../../shared/api-error';
import {
  atualizarCliente,
  buscarClientePorDocumento,
  buscarClientePorEmail,
  buscarClientePorId,
  criarCliente,
  excluirCliente,
  listarClientes as listarClientesRepositorio
} from './clientes.repository';
import { clienteCreateSchema, clienteUpdateSchema } from './clientes.schemas';

type ClienteCreateInput = z.infer<typeof clienteCreateSchema>;
type ClienteUpdateInput = z.infer<typeof clienteUpdateSchema>;

const validarConflitos = async (dados: ClienteCreateInput | ClienteUpdateInput, clienteId?: string) => {
  if (dados.documento) {
    const clienteComDocumento = await buscarClientePorDocumento(dados.documento);

    if (clienteComDocumento && clienteComDocumento.id !== clienteId) {
      throw new ApiError(409, 'Já existe um cliente cadastrado com este documento.');
    }
  }

  if (dados.email) {
    const clienteComEmail = await buscarClientePorEmail(dados.email);

    if (clienteComEmail && clienteComEmail.id !== clienteId) {
      throw new ApiError(409, 'Já existe um cliente cadastrado com este e-mail.');
    }
  }
};

export const listarClientes = async () => {
  return listarClientesRepositorio();
};

export const obterCliente = async (id: string) => {
  const cliente = await buscarClientePorId(id);

  if (!cliente) {
    throw new ApiError(404, 'Cliente não encontrado.');
  }

  return cliente;
};

export const cadastrarCliente = async (dados: unknown) => {
  const resultado = clienteCreateSchema.safeParse(dados);

  if (!resultado.success) {
    throw new ApiError(400, 'Os dados do cliente estão inválidos.', resultado.error.flatten());
  }

  await validarConflitos(resultado.data);
  return criarCliente({
    ...resultado.data
  });
};

export const alterarCliente = async (id: string, dados: unknown) => {
  const resultado = clienteUpdateSchema.safeParse(dados);

  if (!resultado.success) {
    throw new ApiError(400, 'Os dados enviados para atualização estão inválidos.', resultado.error.flatten());
  }

  if (Object.keys(resultado.data).length === 0) {
    throw new ApiError(400, 'Informe ao menos um campo para atualizar o cliente.');
  }

  const clienteExistente = await buscarClientePorId(id);

  if (!clienteExistente) {
    throw new ApiError(404, 'Cliente não encontrado.');
  }

  await validarConflitos(resultado.data, id);
  return atualizarCliente(id, resultado.data);
};

export const removerCliente = async (id: string) => {
  const clienteExistente = await buscarClientePorId(id);

  if (!clienteExistente) {
    throw new ApiError(404, 'Cliente não encontrado.');
  }

  await excluirCliente(id);
};
