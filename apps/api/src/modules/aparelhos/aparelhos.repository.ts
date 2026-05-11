import { Prisma } from '@prisma/client';

import { prisma } from '../../lib/prisma';

export const listarAparelhos = async () => {
  return prisma.aparelho.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      cliente: true
    }
  });
};

export const buscarAparelhoPorId = async (id: string) => {
  return prisma.aparelho.findUnique({
    where: { id },
    include: {
      cliente: true
    }
  });
};

export const criarAparelho = async (dados: Prisma.AparelhoCreateInput) => {
  return prisma.aparelho.create({
    data: dados,
    include: {
      cliente: true
    }
  });
};

export const atualizarAparelho = async (id: string, dados: Prisma.AparelhoUpdateInput) => {
  return prisma.aparelho.update({
    where: { id },
    data: dados,
    include: {
      cliente: true
    }
  });
};

export const excluirAparelho = async (id: string) => {
  return prisma.aparelho.delete({
    where: { id }
  });
};
