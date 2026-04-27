import { User } from '@prisma/client';
import prisma from '@src/lib/prisma';

export async function create({ email }: { email: User['email'] }) {
  return prisma.user.create({
    data: {
      firebaseUid: crypto.randomUUID(),
      email,
    }
  });
}

export async function findByEmail(email: User['email']) {
  return prisma.user.findUniqueOrThrow({
    where: { email }
  });
}
