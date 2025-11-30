import { User } from 'generated/prisma/client';
import prisma from '../lib/prisma';

export async function create() {
  return prisma.user.create({
    data: {
      firebaseUid: new Date().getTime().toString(),
      email: `user-${new Date().getTime()}@fyclabs.com`,
    }
  });
}

export async function findByEmail(email: User['email']) {
  return prisma.user.findUniqueOrThrow({
    where: { email }
  });
}
