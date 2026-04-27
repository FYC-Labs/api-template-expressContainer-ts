import { User, Prisma } from 'generated/prisma/client';
import prisma from '../lib/prisma';

export async function create(data: Prisma.PostCreateManyInput) {
  return prisma.post.create({
    data,
  });
}

export async function findByEmail(email: User['email']) {
  return prisma.user.findUniqueOrThrow({
    where: { email }
  });
}
