import { z } from 'zod';

const textoOpcional = (schema: z.ZodString) =>
  z.preprocess((valor) => {
    if (typeof valor !== 'string') {
      return valor;
    }

    const texto = valor.trim();
    return texto.length > 0 ? texto : undefined;
  }, schema.optional());

export const aparelhoCreateSchema = z.object({
  clienteId: z.string().cuid('O ID do cliente é inválido.'),
  marca: z.string().trim().min(2, 'A marca deve ter pelo menos 2 caracteres.'),
  modelo: z.string().trim().min(2, 'O modelo deve ter pelo menos 2 caracteres.'),
  numeroSerie: textoOpcional(z.string().trim().min(2, 'O número de série deve ter pelo menos 2 caracteres.')),
  imei: textoOpcional(z.string().trim().min(5, 'O IMEI deve ter pelo menos 5 caracteres.')),
  defeitoRelatado: textoOpcional(z.string().trim().max(500, 'O defeito relatado deve ter no máximo 500 caracteres.'))
});

export const aparelhoUpdateSchema = aparelhoCreateSchema.omit({ clienteId: true }).partial().extend({
  clienteId: z.string().cuid('O ID do cliente é inválido.').optional()
});

export const aparelhoIdSchema = z.object({
  id: z.string().cuid('O ID do aparelho é inválido.')
});
