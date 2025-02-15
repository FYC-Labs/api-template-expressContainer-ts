/* eslint-disable prefer-const */
// import { getPrismaClient } from '../../prisma/prismaClient';
// import { getPrismaClient } from '../../prisma/prismaClient';
import { PrismaClient } from '@prisma/client';

function getPrismaClient(): PrismaClient {
  let prisma;
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;

  return prisma;
}

// Test commit
export async function getDbConnection() {
  const prisma = getPrismaClient();
  console.info('db connection', await prisma.$connect);
  await prisma.$connect();
}
