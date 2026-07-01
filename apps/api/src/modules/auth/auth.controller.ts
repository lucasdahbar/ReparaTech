import type { Request, Response } from 'express';

import { asyncHandler } from '../../shared/async-handler';
import { autenticarUsuario } from './auth.service';

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const sessao = await autenticarUsuario(req.body);

  res.json({
    mensagem: 'Login realizado com sucesso.',
    ...sessao
  });
});
