import { z } from 'zod';

const textoOpcional = (schema: z.ZodString) =>
  z.preprocess((valor) => {
    if (typeof valor !== 'string') {
      return valor;
    }

    const texto = valor.trim();
    return texto.length > 0 ? texto : undefined;
  }, schema.optional());

const numeroOpcional = z.preprocess((valor) => {
  if (valor === '' || valor === null || valor === undefined) {
    return undefined;
  }

  return valor;
}, z.coerce.number().nonnegative().optional());

export const statusOrdemServicoSchema = z.enum([
  'ABERTA',
  'EM_ORCAMENTO',
  'AGUARDANDO_PECAS',
  'EM_MANUTENCAO',
  'PRONTA_PARA_RETIRADA',
  'FINALIZADA'
]);

export const ordemServicoCreateSchema = z.object({
  clienteId: z.string().cuid('O ID do cliente é inválido.'),
  aparelhoId: z.string().cuid('O ID do aparelho é inválido.'),
  numero: textoOpcional(z.string().trim().min(3, 'O número da OS deve ter pelo menos 3 caracteres.').max(40, 'O número da OS deve ter no máximo 40 caracteres.')),
  descricaoEntrada: z.string().trim().min(5, 'A descrição de entrada deve ter pelo menos 5 caracteres.'),
  observacaoTecnica: textoOpcional(z.string().trim().max(500, 'A observação técnica deve ter no máximo 500 caracteres.')),
  valorOrcamento: numeroOpcional,
  valorMaoDeObra: numeroOpcional,
  retiradaAutorizada: z.boolean().optional().default(false)
});

export const ordemServicoUpdateSchema = z.object({
  descricaoEntrada: z.string().trim().min(5, 'A descrição de entrada deve ter pelo menos 5 caracteres.').optional(),
  observacaoTecnica: textoOpcional(z.string().trim().max(500, 'A observação técnica deve ter no máximo 500 caracteres.')),
  valorOrcamento: numeroOpcional,
  valorMaoDeObra: numeroOpcional,
  retiradaAutorizada: z.boolean().optional()
});

export const ordemServicoStatusUpdateSchema = z.object({
  status: statusOrdemServicoSchema
});

export const vincularPecaSchema = z.object({
  pecaId: z.string().cuid('O ID da peça é inválido.'),
  quantidade: z.coerce.number().int().positive('A quantidade deve ser maior que zero.'),
  valorUnitario: numeroOpcional
});

export const ordemServicoIdSchema = z.object({
  id: z.string().cuid('O ID da ordem de serviço é inválido.')
});
