import { Prisma } from '@prisma/client';
import type { z } from 'zod';

import { prisma } from '../../lib/prisma';
import { ApiError } from '../../shared/api-error';
import { pecaCreateSchema, pecaUpdateSchema } from './pecas.schemas';

type PecaCreateInput = z.infer<typeof pecaCreateSchema>;
type PecaUpdateInput = z.infer<typeof pecaUpdateSchema>;

const validarSkuUnico = async (sku: string, pecaId?: string) => {
  const existente = await prisma.pecaEstoque.findUnique({
    where: { sku }
  });

  if (existente && existente.id !== pecaId) {
    throw new ApiError(409, 'Já existe uma peça cadastrada com este SKU.');
  }
};

const montarDadosDecimal = (dados: Pick<PecaCreateInput, 'custoUnitario' | 'precoVenda'>) => ({
  custoUnitario: new Prisma.Decimal(dados.custoUnitario),
  precoVenda: dados.precoVenda !== undefined ? new Prisma.Decimal(dados.precoVenda) : undefined
});

export const listarPecas = async () => {
  return prisma.pecaEstoque.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const obterPeca = async (id: string) => {
  const peca = await prisma.pecaEstoque.findUnique({
    where: { id }
  });

  if (!peca) {
    throw new ApiError(404, 'Peça não encontrada.');
  }

  return peca;
};

export const cadastrarPeca = async (dados: unknown) => {
  const resultado = pecaCreateSchema.safeParse(dados);

  if (!resultado.success) {
    throw new ApiError(400, 'Os dados da peça estão inválidos.', resultado.error.flatten());
  }

  await validarSkuUnico(resultado.data.sku);

  return prisma.pecaEstoque.create({
    data: {
      nome: resultado.data.nome,
      sku: resultado.data.sku,
      descricao: resultado.data.descricao,
      quantidade: resultado.data.quantidade,
      ...montarDadosDecimal(resultado.data)
    }
  });
};

export const atualizarPeca = async (id: string, dados: unknown) => {
  const resultado = pecaUpdateSchema.safeParse(dados);

  if (!resultado.success) {
    throw new ApiError(400, 'Os dados enviados para atualização estão inválidos.', resultado.error.flatten());
  }

  if (Object.keys(resultado.data).length === 0) {
    throw new ApiError(400, 'Informe ao menos um campo para atualizar a peça.');
  }

  const pecaExistente = await prisma.pecaEstoque.findUnique({
    where: { id }
  });

  if (!pecaExistente) {
    throw new ApiError(404, 'Peça não encontrada.');
  }

  if (resultado.data.sku) {
    await validarSkuUnico(resultado.data.sku, id);
  }

  const dadosAtualizacao: Prisma.PecaEstoqueUpdateInput = {};

  if (resultado.data.nome !== undefined) {
    dadosAtualizacao.nome = resultado.data.nome;
  }

  if (resultado.data.sku !== undefined) {
    dadosAtualizacao.sku = resultado.data.sku;
  }

  if (resultado.data.descricao !== undefined) {
    dadosAtualizacao.descricao = resultado.data.descricao;
  }

  if (resultado.data.quantidade !== undefined) {
    dadosAtualizacao.quantidade = resultado.data.quantidade;
  }

  if (resultado.data.custoUnitario !== undefined) {
    dadosAtualizacao.custoUnitario = new Prisma.Decimal(resultado.data.custoUnitario);
  }

  if (resultado.data.precoVenda !== undefined) {
    dadosAtualizacao.precoVenda = new Prisma.Decimal(resultado.data.precoVenda);
  }

  return prisma.pecaEstoque.update({
    where: { id },
    data: dadosAtualizacao
  });
};

export const removerPeca = async (id: string) => {
  const pecaExistente = await prisma.pecaEstoque.findUnique({
    where: { id }
  });

  if (!pecaExistente) {
    throw new ApiError(404, 'Peça não encontrada.');
  }

  await prisma.pecaEstoque.delete({
    where: { id }
  });
};
