import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatório.'),
  CORS_ORIGIN: z.string().default('http://localhost:5173')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Variáveis de ambiente inválidas para o ReparaTech.');
  console.error(parsedEnv.error.flatten().fieldErrors);
  throw new Error('Falha ao carregar as variáveis de ambiente.');
}

export const env = parsedEnv.data;
