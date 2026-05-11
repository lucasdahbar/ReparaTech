import { z } from 'zod';

const textoOpcional = (schema: z.ZodString) =>
  z.preprocess((valor) => {
    if (typeof valor !== 'string') {
      return valor;
    }

    const texto = valor.trim();
    return texto.length > 0 ? texto : undefined;
  }, schema.optional());

export const clienteCreateSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  documento: textoOpcional(
    z.string().trim().min(5, 'O documento deve ter pelo menos 5 caracteres.').max(20, 'O documento deve ter no máximo 20 caracteres.')
  ),
  telefone: textoOpcional(
    z.string().trim().min(8, 'O telefone deve ter pelo menos 8 caracteres.').max(20, 'O telefone deve ter no máximo 20 caracteres.')
  ),
  email: textoOpcional(z.string().trim().email('Informe um e-mail válido.')),
  endereco: textoOpcional(z.string().trim().max(255, 'O endereço deve ter no máximo 255 caracteres.'))
});

export const clienteUpdateSchema = clienteCreateSchema.partial();

export const clienteIdSchema = z.object({
  id: z.string().cuid('O ID do cliente é inválido.')
});
