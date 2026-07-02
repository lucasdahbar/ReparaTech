import { mkdir, appendFile } from 'fs/promises';
import path from 'path';

import { prisma } from '../../lib/prisma';
import { ApiError } from '../../shared/api-error';

const caminhoLogWhatsapp = path.resolve(process.cwd(), 'logs', 'whatsapp-mock.jsonl');

export const notificarClienteWhatsapp = async (ordemId: string) => {
  const ordem = await prisma.ordemServico.findUnique({
    where: {
      id: ordemId
    },
    include: {
      cliente: true,
      aparelho: true
    }
  });

  if (!ordem) {
    throw new ApiError(404, 'Ordem de serviço não encontrada para notificação.');
  }

  const telefone = ordem.cliente.telefone ?? 'telefone-não-informado';
  const mensagem = `Olá ${ordem.cliente.nome}, sua OS ${ordem.numero} (${ordem.aparelho.marca} ${ordem.aparelho.modelo}) está pronta para retirada.`;
  const tentativa = {
    ordemServicoId: ordem.id,
    protocolo: ordem.numero,
    telefone,
    mensagem,
    statusEnvio: telefone === 'telefone-não-informado' ? 'FALHA_MOCK' : 'ENVIADO_MOCK',
    erro: telefone === 'telefone-não-informado' ? 'Cliente sem telefone cadastrado.' : null,
    dataEnvio: new Date().toISOString()
  };

  try {
    await mkdir(path.dirname(caminhoLogWhatsapp), { recursive: true });
    await appendFile(caminhoLogWhatsapp, `${JSON.stringify(tentativa)}\n`, 'utf8');
  } catch (erro) {
    console.error('Falha ao registrar mock de WhatsApp:', erro);
  }

  return tentativa;
};
