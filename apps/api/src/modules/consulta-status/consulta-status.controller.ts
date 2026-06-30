import type { Request, Response } from 'express';

import { asyncHandler } from '../../shared/async-handler';
import { consultarStatusPublico } from './consulta-status.service';

export const consultarStatusPublicoController = asyncHandler(async (req: Request, res: Response) => {
  const consulta = await consultarStatusPublico(req.query);
  res.json(consulta);
});

