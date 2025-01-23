/* eslint-disable @typescript-eslint/no-namespace */
import { PrismaClient } from '@prisma/client';

let prisma;

export function getPrismaClient(): PrismaClient {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;

  return prisma;
}

export const prismaClient = { getPrismaClient };
