import prisma from '../lib/prisma';

export async function create() {
  return prisma.user.create({ data: { name: 'John Doe' } });
}
