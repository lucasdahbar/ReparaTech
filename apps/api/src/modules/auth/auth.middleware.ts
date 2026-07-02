import type { PerfilUsuario } from '@prisma/client';
import type { RequestHandler } from 'express';

import { ApiError } from '../../shared/api-error';
import { verificarToken } from './auth.service';

type PerfilInterno = Exclude<PerfilUsuario, 'CLIENTE'>;

export const exigirAutenticacao = (perfisPermitidos: PerfilInterno[] = ['ADMIN', 'ATENDENTE', 'TECNICO']): RequestHandler => {
  return (req, _res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;

    if (!token) {
      return next(new ApiError(401, 'Login obrigatorio para acessar esta area.'));
    }

    const usuario = verificarToken(token);

    if (usuario.perfil === 'CLIENTE' || !perfisPermitidos.includes(usuario.perfil)) {
      return next(new ApiError(403, 'Perfil sem permissao para acessar esta area.'));
    }

    return next();
  };
};
