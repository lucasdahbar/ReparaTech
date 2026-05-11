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

export const pecaCreateSchema = z.object({
  nome: z.string().trim().min(3, 'O nome da peça deve ter pelo menos 3 caracteres.'),
  sku: z.string().trim().min(2, 'O SKU deve ter pelo menos 2 caracteres.'),
  descricao: textoOpcional(z.string().trim().max(255, 'A descrição deve ter no máximo 255 caracteres.')),
  quantidade: z.coerce.number().int().min(0, 'A quantidade não pode ser negativa.').default(0),
  custoUnitario: z.coerce.number().positive('O custo unitário deve ser maior que zero.'),
  precoVenda: numeroOpcional
});

export const pecaUpdateSchema = z.object({
  nome: z.string().trim().min(3, 'O nome da peça deve ter pelo menos 3 caracteres.').optional(),
  sku: z.string().trim().min(2, 'O SKU deve ter pelo menos 2 caracteres.').optional(),
  descricao: textoOpcional(z.string().trim().max(255, 'A descrição deve ter no máximo 255 caracteres.')),
  quantidade: z.coerce.number().int().min(0, 'A quantidade não pode ser negativa.').optional(),
  custoUnitario: z.coerce.number().positive('O custo unitário deve ser maior que zero.').optional(),
  precoVenda: numeroOpcional
});

export const pecaIdSchema = z.object({
  id: z.string().cuid('O ID da peça é inválido.')
});
