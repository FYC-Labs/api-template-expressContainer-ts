import { PrismaClient } from '@prisma/client';

// Util import
import { executeAction } from '../../../../../util/executeAction';

const logEnabled = process.env.DATABASE_LOGGER_ENABLED === 'true';

const PrismaDatabaseProvider = new PrismaClient({
  log: logEnabled
    ? [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ]
    : [],
});

if (logEnabled)
  PrismaDatabaseProvider.$on('query', e => {
    console.log(`Query: ${e.query}`);
    console.log(`Params: ${e.params}`);
    console.log(`Duration: ${e.duration}ms`);
  });

const prismaDatabaseConnection = executeAction({
  action: () => PrismaDatabaseProvider.$connect(),
  actionName: 'Database connection',
});

export { PrismaDatabaseProvider, prismaDatabaseConnection };
