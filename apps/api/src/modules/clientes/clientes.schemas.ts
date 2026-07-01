import { z } from 'zod';

const textoOpcional = (schema: z.ZodString) =>
  z.preprocess((valor) => {
    if (typeof valor !== 'string') {
      return valor;
    }

    const texto = valor.trim();
    return texto.length > 0 ? texto : undefined;
  }, schema.optional());

const textoObrigatorio = (schema: z.ZodString) =>
  z.preprocess((valor) => {
    if (typeof valor !== 'string') {
      return valor;
    }

    return valor.trim();
  }, schema);

const normalizarCpf = (valor: string) => valor.replace(/\D/g, '');

const cpfValido = (cpf: string) => {
  if (!/^\d{11}$/.test(cpf)) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const digitos = cpf.split('').map(Number);

  const calcularDigito = (comprimento: number) => {
    const soma = digitos.slice(0, comprimento).reduce((total, digito, indice) => total + digito * (comprimento + 1 - indice), 0);
    const resto = (soma * 10) % 11;

    return resto === 10 ? 0 : resto;
  };

  return calcularDigito(9) === digitos[9] && calcularDigito(10) === digitos[10];
};

const cpfSchema = z.preprocess((valor) => {
  if (typeof valor !== 'string') {
    return valor;
  }

  return normalizarCpf(valor);
}, z.string().length(11, 'O CPF deve conter 11 dígitos.').refine(cpfValido, 'O CPF informado é inválido.'));

export const clienteCreateSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  documento: cpfSchema,
  telefone: textoObrigatorio(
    z.string().min(8, 'O telefone deve ter pelo menos 8 caracteres.').max(20, 'O telefone deve ter no máximo 20 caracteres.')
  ),
  email: textoOpcional(z.string().trim().email('Informe um e-mail válido.')),
  endereco: textoObrigatorio(z.string().min(5, 'O endereço deve ter pelo menos 5 caracteres.').max(255, 'O endereço deve ter no máximo 255 caracteres.'))
});

export const clienteUpdateSchema = clienteCreateSchema.partial();

export const clienteIdSchema = z.object({
  id: z.string().cuid('O ID do cliente é inválido.')
});
