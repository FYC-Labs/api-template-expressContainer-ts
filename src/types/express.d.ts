import { Prisma } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: Prisma.User.$inferSelect;
    }
  }
}

export { };
