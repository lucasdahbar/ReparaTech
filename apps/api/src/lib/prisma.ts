import { Prisma, PrismaClient } from '@prisma/client';

import { env } from './env';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const logLevels: Prisma.LogLevel[] = env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'];

export const prisma = global.prisma ?? new PrismaClient({ log: logLevels });

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
