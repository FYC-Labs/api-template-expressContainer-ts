import { Prisma } from '@prisma/client';
import type { DecodedIdToken } from 'firebase-admin/auth';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: Prisma.User.$inferSelect;
      /** Set by `requireFirebaseAuth` after Firebase ID token verification. */
      firebaseUser?: DecodedIdToken;
    }
  }
}

export { };
