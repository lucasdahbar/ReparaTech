import { createHmac, createHash, timingSafeEqual } from 'crypto';
import type { PerfilUsuario } from '@prisma/client';
import type { z } from 'zod';

import { env } from '../../lib/env';
import { prisma } from '../../lib/prisma';
import { ApiError } from '../../shared/api-error';
import { loginSchema } from './auth.schemas';

type LoginInput = z.infer<typeof loginSchema>;

export type UsuarioAutenticado = {
  id: string;
  nome: string;
  email: string;
  perfil: Exclude<PerfilUsuario, 'CLIENTE'>;
};

const usuariosDemo: Array<UsuarioAutenticado & { senha: string }> = [
  {
    id: 'demo-admin',
    nome: 'Administrador',
    email: 'admin@repairatech.local',
    senha: 'admin123',
    perfil: 'ADMIN'
  },
  {
    id: 'demo-atendente',
    nome: 'Atendente',
    email: 'atendente@repairatech.local',
    senha: 'atendente123',
    perfil: 'ATENDENTE'
  },
  {
    id: 'demo-tecnico',
    nome: 'Tecnico',
    email: 'tecnico@repairatech.local',
    senha: 'tecnico123',
    perfil: 'TECNICO'
  }
];

const base64Url = (valor: string | Buffer) =>
  Buffer.from(valor)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const compararSeguro = (valorA: string, valorB: string) => {
  const bufferA = Buffer.from(valorA);
  const bufferB = Buffer.from(valorB);

  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
};

const hashSenha = (senha: string) => createHash('sha256').update(senha).digest('hex');

const validarSenha = (senha: string, senhaHash: string) => {
  if (senhaHash.startsWith('sha256:')) {
    return compararSeguro(`sha256:${hashSenha(senha)}`, senhaHash);
  }

  return compararSeguro(senha, senhaHash);
};

const assinarToken = (payload: UsuarioAutenticado) => {
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64Url(
    JSON.stringify({
      sub: payload.id,
      nome: payload.nome,
      email: payload.email,
      perfil: payload.perfil,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8
    })
  );
  const assinatura = base64Url(createHmac('sha256', env.AUTH_SECRET).update(`${header}.${body}`).digest());

  return `${header}.${body}.${assinatura}`;
};

export const verificarToken = (token: string): UsuarioAutenticado => {
  const partes = token.split('.');

  if (partes.length !== 3) {
    throw new ApiError(401, 'Sessao invalida.');
  }

  const [header, body, assinatura] = partes;
  const assinaturaEsperada = base64Url(createHmac('sha256', env.AUTH_SECRET).update(`${header}.${body}`).digest());

  if (!compararSeguro(assinatura, assinaturaEsperada)) {
    throw new ApiError(401, 'Sessao invalida.');
  }

  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as UsuarioAutenticado & { exp: number; sub: string };

  if (payload.exp < Math.floor(Date.now() / 1000)) {
    throw new ApiError(401, 'Sessao expirada.');
  }

  if (payload.perfil === 'CLIENTE') {
    throw new ApiError(403, 'Cliente nao possui acesso interno.');
  }

  return {
    id: payload.sub,
    nome: payload.nome,
    email: payload.email,
    perfil: payload.perfil
  };
};

export const autenticarUsuario = async (dados: unknown) => {
  const resultado = loginSchema.safeParse(dados);

  if (!resultado.success) {
    throw new ApiError(400, 'Dados de login invalidos.', resultado.error.flatten());
  }

  const login = resultado.data as LoginInput;
  const email = login.email.toLowerCase();
  const usuarioBanco = await prisma.usuario.findUnique({
    where: {
      email
    }
  });

  if (usuarioBanco) {
    if (!usuarioBanco.ativo || usuarioBanco.perfil === 'CLIENTE' || !validarSenha(login.senha, usuarioBanco.senhaHash)) {
      throw new ApiError(401, 'Usuario ou senha invalidos.');
    }

    const usuario: UsuarioAutenticado = {
      id: usuarioBanco.id,
      nome: usuarioBanco.nome,
      email: usuarioBanco.email,
      perfil: usuarioBanco.perfil
    };

    return {
      usuario,
      token: assinarToken(usuario)
    };
  }

  const usuarioDemo = usuariosDemo.find((usuario) => usuario.email === email && usuario.senha === login.senha);

  if (!usuarioDemo) {
    throw new ApiError(401, 'Usuario ou senha invalidos.');
  }

  const { senha: _senha, ...usuario } = usuarioDemo;

  return {
    usuario,
    token: assinarToken(usuario)
  };
};
