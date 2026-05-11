import { Prisma, StatusOrdemServico } from '@prisma/client';
import type { z } from 'zod';

import { prisma } from '../../lib/prisma';
import { ApiError } from '../../shared/api-error';
import { ordemServicoCreateSchema, ordemServicoStatusUpdateSchema, ordemServicoUpdateSchema, vincularPecaSchema } from './ordens-servico.schemas';

type OrdemServicoCreateInput = z.infer<typeof ordemServicoCreateSchema>;
type OrdemServicoUpdateInput = z.infer<typeof ordemServicoUpdateSchema>;
type VincularPecaInput = z.infer<typeof vincularPecaSchema>;

const transicoesPermitidas: Record<StatusOrdemServico, StatusOrdemServico[]> = {
  ABERTA: ['EM_ORCAMENTO'],
  EM_ORCAMENTO: ['AGUARDANDO_PECAS', 'EM_MANUTENCAO'],
  AGUARDANDO_PECAS: ['EM_MANUTENCAO'],
  EM_MANUTENCAO: ['PRONTA_PARA_RETIRADA'],
  PRONTA_PARA_RETIRADA: ['FINALIZADA'],
  FINALIZADA: []
};

const gerarNumeroOrdemServico = async () => {
  for (let tentativa = 0; tentativa < 5; tentativa += 1) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const sufixo = Math.random().toString(36).slice(2, 6).toUpperCase();
    const numero = `OS-${timestamp}-${sufixo}`;

    const existente = await prisma.ordemServico.findUnique({
      where: { numero }
    });

    if (!existente) {
      return numero;
    }
  }

  throw new ApiError(500, 'Não foi possível gerar o número da ordem de serviço.');
};

const validarTransicaoStatus = (atual: StatusOrdemServico, novo: StatusOrdemServico) => {
  if (atual === novo) {
    return;
  }

  if (!transicoesPermitidas[atual].includes(novo)) {
    throw new ApiError(409, `Não é possível alterar o status de ${atual} para ${novo}.`);
  }
};

const converterDecimal = (valor?: number | null) => {
  if (valor === undefined || valor === null) {
    return undefined;
  }

  return new Prisma.Decimal(valor);
};

const incluirRelacionamentos = {
  cliente: true,
  aparelho: true,
  pecas: {
    include: {
      peca: true
    }
  }
} as const;

export const listarOrdensServico = async () => {
  return prisma.ordemServico.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    include: incluirRelacionamentos
  });
};

export const obterOrdemServico = async (id: string) => {
  const ordem = await prisma.ordemServico.findUnique({
    where: { id },
    include: incluirRelacionamentos
  });

  if (!ordem) {
    throw new ApiError(404, 'Ordem de serviço não encontrada.');
  }

  return ordem;
};

export const cadastrarOrdemServico = async (dados: unknown) => {
  const resultado = ordemServicoCreateSchema.safeParse(dados);

  if (!resultado.success) {
    throw new ApiError(400, 'Os dados da ordem de serviço estão inválidos.', resultado.error.flatten());
  }

  const cliente = await prisma.cliente.findUnique({
    where: {
      id: resultado.data.clienteId
    }
  });

  if (!cliente) {
    throw new ApiError(404, 'Cliente não encontrado.');
  }

  const aparelho = await prisma.aparelho.findFirst({
    where: {
      id: resultado.data.aparelhoId,
      clienteId: resultado.data.clienteId
    }
  });

  if (!aparelho) {
    throw new ApiError(404, 'Aparelho não encontrado para este cliente.');
  }

  const numero = resultado.data.numero ?? (await gerarNumeroOrdemServico());

  return prisma.ordemServico.create({
    data: {
      numero,
      clienteId: resultado.data.clienteId,
      aparelhoId: resultado.data.aparelhoId,
      status: 'ABERTA',
      descricaoEntrada: resultado.data.descricaoEntrada,
      observacaoTecnica: resultado.data.observacaoTecnica,
      valorOrcamento: converterDecimal(resultado.data.valorOrcamento),
      valorMaoDeObra: converterDecimal(resultado.data.valorMaoDeObra),
      retiradaAutorizada: resultado.data.retiradaAutorizada
    },
    include: incluirRelacionamentos
  });
};

export const atualizarOrdemServico = async (id: string, dados: unknown) => {
  const resultado = ordemServicoUpdateSchema.safeParse(dados);

  if (!resultado.success) {
    throw new ApiError(400, 'Os dados enviados para atualização da OS estão inválidos.', resultado.error.flatten());
  }

  if (Object.keys(resultado.data).length === 0) {
    throw new ApiError(400, 'Informe ao menos um campo para atualizar a ordem de serviço.');
  }

  const ordemExistente = await prisma.ordemServico.findUnique({
    where: { id }
  });

  if (!ordemExistente) {
    throw new ApiError(404, 'Ordem de serviço não encontrada.');
  }

  const dadosAtualizacao: Prisma.OrdemServicoUpdateInput = {};

  if (resultado.data.descricaoEntrada !== undefined) {
    dadosAtualizacao.descricaoEntrada = resultado.data.descricaoEntrada;
  }

  if (resultado.data.observacaoTecnica !== undefined) {
    dadosAtualizacao.observacaoTecnica = resultado.data.observacaoTecnica;
  }

  if (resultado.data.valorOrcamento !== undefined) {
    dadosAtualizacao.valorOrcamento = converterDecimal(resultado.data.valorOrcamento);
  }

  if (resultado.data.valorMaoDeObra !== undefined) {
    dadosAtualizacao.valorMaoDeObra = converterDecimal(resultado.data.valorMaoDeObra);
  }

  if (resultado.data.retiradaAutorizada !== undefined) {
    dadosAtualizacao.retiradaAutorizada = resultado.data.retiradaAutorizada;
  }

  return prisma.ordemServico.update({
    where: { id },
    data: dadosAtualizacao,
    include: incluirRelacionamentos
  });
};

export const atualizarStatusOrdemServico = async (id: string, dados: unknown) => {
  const resultado = ordemServicoStatusUpdateSchema.safeParse(dados);

  if (!resultado.success) {
    throw new ApiError(400, 'O status enviado para a ordem de serviço é inválido.', resultado.error.flatten());
  }

  const ordemExistente = await prisma.ordemServico.findUnique({
    where: { id }
  });

  if (!ordemExistente) {
    throw new ApiError(404, 'Ordem de serviço não encontrada.');
  }

  validarTransicaoStatus(ordemExistente.status, resultado.data.status);

  const dadosAtualizacao: Prisma.OrdemServicoUpdateInput = {
    status: resultado.data.status
  };

  if (resultado.data.status === 'FINALIZADA') {
    dadosAtualizacao.retiradaAutorizada = true;
    dadosAtualizacao.dataFechamento = new Date();
  }

  return prisma.ordemServico.update({
    where: { id },
    data: dadosAtualizacao,
    include: incluirRelacionamentos
  });
};

export const vincularPecaNaOrdemServico = async (ordemId: string, dados: unknown) => {
  const resultado = vincularPecaSchema.safeParse(dados);

  if (!resultado.success) {
    throw new ApiError(400, 'Os dados para vincular a peça estão inválidos.', resultado.error.flatten());
  }

  const ordemExistente = await prisma.ordemServico.findUnique({
    where: { id: ordemId }
  });

  if (!ordemExistente) {
    throw new ApiError(404, 'Ordem de serviço não encontrada.');
  }

  const peca = await prisma.pecaEstoque.findUnique({
    where: { id: resultado.data.pecaId }
  });

  if (!peca) {
    throw new ApiError(404, 'Peça não encontrada.');
  }

  if (peca.quantidade < resultado.data.quantidade) {
    throw new ApiError(409, 'Estoque insuficiente para vincular essa quantidade de peças.');
  }

  const valorUnitario = resultado.data.valorUnitario !== undefined
    ? new Prisma.Decimal(resultado.data.valorUnitario)
    : peca.precoVenda ?? peca.custoUnitario;

  const ordemAtualizada = await prisma.$transaction(async (transacao) => {
    const itemExistente = await transacao.ordemServicoPeca.findUnique({
      where: {
        ordemServicoId_pecaId: {
          ordemServicoId: ordemId,
          pecaId: peca.id
        }
      }
    });

    if (itemExistente) {
      await transacao.ordemServicoPeca.update({
        where: {
          id: itemExistente.id
        },
        data: {
          quantidade: {
            increment: resultado.data.quantidade
          },
          valorUnitario
        }
      });
    } else {
      await transacao.ordemServicoPeca.create({
        data: {
          ordemServicoId: ordemId,
          pecaId: peca.id,
          quantidade: resultado.data.quantidade,
          valorUnitario
        }
      });
    }

    await transacao.pecaEstoque.update({
      where: {
        id: peca.id
      },
      data: {
        quantidade: {
          decrement: resultado.data.quantidade
        }
      }
    });

    await transacao.movimentoEstoque.create({
      data: {
        pecaId: peca.id,
        ordemServicoId: ordemId,
        tipo: 'SAIDA',
        quantidade: resultado.data.quantidade,
        motivo: 'Baixa automática ao vincular peça à OS.'
      }
    });

    return transacao.ordemServico.findUnique({
      where: {
        id: ordemId
      },
      include: incluirRelacionamentos
    });
  });

  if (!ordemAtualizada) {
    throw new ApiError(404, 'Ordem de serviço não encontrada após a vinculação da peça.');
  }

  return ordemAtualizada;
};

export const removerOrdemServico = async (id: string) => {
  const ordemExistente = await prisma.ordemServico.findUnique({
    where: { id },
    include: {
      pecas: true
    }
  });

  if (!ordemExistente) {
    throw new ApiError(404, 'Ordem de serviço não encontrada.');
  }

  await prisma.$transaction(async (transacao) => {
    for (const item of ordemExistente.pecas) {
      await transacao.pecaEstoque.update({
        where: {
          id: item.pecaId
        },
        data: {
          quantidade: {
            increment: item.quantidade
          }
        }
      });

      await transacao.movimentoEstoque.create({
        data: {
          pecaId: item.pecaId,
          ordemServicoId: id,
          tipo: 'ENTRADA',
          quantidade: item.quantidade,
          motivo: 'Restituição automática após exclusão da OS.'
        }
      });
    }

    await transacao.ordemServico.delete({
      where: { id }
    });
  });
};
