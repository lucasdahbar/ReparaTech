import { z } from 'zod';

export const consultaStatusSchema = z.object({
  protocolo: z.string().trim().min(1, 'Informe o protocolo da OS.'),
  cpf: z.string().trim().min(1, 'Informe o CPF do cliente.')
});

