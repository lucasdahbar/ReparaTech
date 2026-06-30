import { prisma } from '../../lib/prisma';
import { ApiError } from '../../shared/api-error';
import { consultaStatusSchema } from './consulta-status.schemas';

const MENSAGEM_NAO_LOCALIZADO = 'Protocolo ou CPF não localizado. Verifique os dados digitados.';

const statusPublico: Record<string, string> = {
  ABERTA: 'Aberta',
  EM_ORCAMENTO: 'Em Orçamento',
  AGUARDANDO_PECAS: 'Aguardando Peças',
  EM_MANUTENCAO: 'Em Manutenção',
  PRONTA_PARA_RETIRADA: 'Pronta',
  FINALIZADA: 'Entregue'
};

const normalizarCpf = (valor: string) => valor.replace(/\D/g, '');

export const consultarStatusPublico = async (query: unknown) => {
  const resultado = consultaStatusSchema.safeParse(query);

  if (!resultado.success) {
    throw new ApiError(404, MENSAGEM_NAO_LOCALIZADO);
  }

  const ordem = await prisma.ordemServico.findUnique({
    where: {
      numero: resultado.data.protocolo
    },
    select: {
      numero: true,
      status: true,
      dataAbertura: true,
      cliente: {
        select: {
          documento: true
        }
      },
      aparelho: {
        select: {
          marca: true,
          modelo: true
        }
      }
    }
  });

  const cpfInformado = normalizarCpf(resultado.data.cpf);
  const cpfCadastrado = ordem?.cliente.documento ? normalizarCpf(ordem.cliente.documento) : '';

  if (!ordem || cpfInformado !== cpfCadastrado) {
    throw new ApiError(404, MENSAGEM_NAO_LOCALIZADO);
  }

  return {
    protocolo: ordem.numero,
    status: statusPublico[ordem.status] ?? ordem.status,
    aparelho: ordem.aparelho,
    dataEntrada: ordem.dataAbertura
  };
};
