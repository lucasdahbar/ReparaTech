import { Prisma } from '@prisma/client';

import { prisma } from '../../lib/prisma';

export const listarClientes = async () => {
  return prisma.cliente.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const buscarClientePorId = async (id: string) => {
  return prisma.cliente.findUnique({
    where: { id }
  });
};

export const buscarClientePorDocumento = async (documento: string) => {
  return prisma.cliente.findUnique({
    where: { documento }
  });
};

export const buscarClientePorEmail = async (email: string) => {
  return prisma.cliente.findUnique({
    where: { email }
  });
};

export const criarCliente = async (dados: Prisma.ClienteCreateInput) => {
  return prisma.cliente.create({
    data: dados
  });
};

export const atualizarCliente = async (id: string, dados: Prisma.ClienteUpdateInput) => {
  return prisma.cliente.update({
    where: { id },
    data: dados
  });
};

export const excluirCliente = async (id: string) => {
  return prisma.cliente.delete({
    where: { id }
  });
};
