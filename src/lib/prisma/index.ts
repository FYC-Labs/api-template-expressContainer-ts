import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';
import { ENV } from 'config';

const connectionString = `${ENV.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export default prisma;
