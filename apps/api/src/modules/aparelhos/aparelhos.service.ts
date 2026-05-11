import { Prisma } from '@prisma/client';
import type { z } from 'zod';

import { prisma } from '../../lib/prisma';
import { ApiError } from '../../shared/api-error';
import { buscarClientePorId } from '../clientes/clientes.repository';
import { criarAparelho, excluirAparelho, listarAparelhos, atualizarAparelho, buscarAparelhoPorId } from './aparelhos.repository';
import { aparelhoCreateSchema, aparelhoUpdateSchema } from './aparelhos.schemas';

type AparelhoCreateInput = z.infer<typeof aparelhoCreateSchema>;
type AparelhoUpdateInput = z.infer<typeof aparelhoUpdateSchema>;

const validarUnicidade = async (dados: { numeroSerie?: string | null; imei?: string | null }, aparelhoId?: string) => {
  if (dados.numeroSerie) {
    const existente = await prisma.aparelho.findFirst({
      where: { numeroSerie: dados.numeroSerie }
    });

    if (existente && existente.id !== aparelhoId) {
      throw new ApiError(409, 'Já existe um aparelho cadastrado com este número de série.');
    }
  }

  if (dados.imei) {
    const existente = await prisma.aparelho.findFirst({
      where: { imei: dados.imei }
    });

    if (existente && existente.id !== aparelhoId) {
      throw new ApiError(409, 'Já existe um aparelho cadastrado com este IMEI.');
    }
  }
};

export const listarAparelhosServico = async () => {
  return listarAparelhos();
};

export const obterAparelhoServico = async (id: string) => {
  const aparelho = await buscarAparelhoPorId(id);

  if (!aparelho) {
    throw new ApiError(404, 'Aparelho não encontrado.');
  }

  return aparelho;
};

export const cadastrarAparelhoServico = async (dados: unknown) => {
  const resultado = aparelhoCreateSchema.safeParse(dados);

  if (!resultado.success) {
    throw new ApiError(400, 'Os dados do aparelho estão inválidos.', resultado.error.flatten());
  }

  const cliente = await buscarClientePorId(resultado.data.clienteId);

  if (!cliente) {
    throw new ApiError(404, 'Cliente não encontrado.');
  }

  await validarUnicidade(resultado.data);

  return criarAparelho({
    cliente: {
      connect: {
        id: resultado.data.clienteId
      }
    },
    marca: resultado.data.marca,
    modelo: resultado.data.modelo,
    numeroSerie: resultado.data.numeroSerie,
    imei: resultado.data.imei,
    defeitoRelatado: resultado.data.defeitoRelatado
  });
};

export const atualizarAparelhoServico = async (id: string, dados: unknown) => {
  const resultado = aparelhoUpdateSchema.safeParse(dados);

  if (!resultado.success) {
    throw new ApiError(400, 'Os dados enviados para atualização do aparelho estão inválidos.', resultado.error.flatten());
  }

  if (Object.keys(resultado.data).length === 0) {
    throw new ApiError(400, 'Informe ao menos um campo para atualizar o aparelho.');
  }

  const aparelhoExistente = await buscarAparelhoPorId(id);

  if (!aparelhoExistente) {
    throw new ApiError(404, 'Aparelho não encontrado.');
  }

  if (resultado.data.clienteId) {
    const cliente = await buscarClientePorId(resultado.data.clienteId);

    if (!cliente) {
      throw new ApiError(404, 'Cliente não encontrado.');
    }
  }

  await validarUnicidade(resultado.data, id);

  const dadosAtualizacao: Prisma.AparelhoUpdateInput = {};

  if (resultado.data.clienteId !== undefined) {
    dadosAtualizacao.cliente = {
      connect: {
        id: resultado.data.clienteId
      }
    };
  }

  if (resultado.data.marca !== undefined) {
    dadosAtualizacao.marca = resultado.data.marca;
  }

  if (resultado.data.modelo !== undefined) {
    dadosAtualizacao.modelo = resultado.data.modelo;
  }

  if (resultado.data.numeroSerie !== undefined) {
    dadosAtualizacao.numeroSerie = resultado.data.numeroSerie;
  }

  if (resultado.data.imei !== undefined) {
    dadosAtualizacao.imei = resultado.data.imei;
  }

  if (resultado.data.defeitoRelatado !== undefined) {
    dadosAtualizacao.defeitoRelatado = resultado.data.defeitoRelatado;
  }

  return atualizarAparelho(id, dadosAtualizacao);
};

export const removerAparelhoServico = async (id: string) => {
  const aparelho = await buscarAparelhoPorId(id);

  if (!aparelho) {
    throw new ApiError(404, 'Aparelho não encontrado.');
  }

  await excluirAparelho(id);
};
