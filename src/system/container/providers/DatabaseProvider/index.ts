import { container } from 'tsyringe';

// Interface import
import { IDatabaseProvider } from './models/IDatabaseProvider';

// Provider import
import {
  PrismaDatabaseProvider,
  prismaDatabaseConnection,
} from './implementations/PrismaDatabaseProvider';

const providers = {
  prisma: PrismaDatabaseProvider,
};

const DatabaseProvider = providers.prisma;
const DatabaseProviderInitialization = prismaDatabaseConnection;

container.registerInstance<IDatabaseProvider>(
  'DatabaseProvider',
  DatabaseProvider,
);

export { DatabaseProvider, DatabaseProviderInitialization };
