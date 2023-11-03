import { PrismaClient } from '@prisma/client';

interface DatabaseInterface extends Global {
  prisma: PrismaClient;
}

declare const global: DatabaseInterface;

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export { prisma };
