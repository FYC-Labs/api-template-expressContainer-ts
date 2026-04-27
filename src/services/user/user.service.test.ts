import prisma from '@src/lib/prisma';
import { create, findByEmail } from './user.service';

jest.mock('@src/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
  },
}));

const mockPrisma = jest.mocked(prisma);

describe('user.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create delegates to prisma.user.create', async () => {
    const user = { id: 1, email: 'x@y.com', firebaseUid: 'uid' } as Awaited<ReturnType<typeof create>>;

    mockPrisma.user.create.mockResolvedValue(user);

    const result = await create({ email: 'x@y.com' });

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'x@y.com',
        firebaseUid: expect.any(String),
      }),
    });
    expect(result).toBe(user);
  });

  it('findByEmail delegates to prisma.user.findUniqueOrThrow', async () => {
    const user = { id: 1, email: 'a@b.com', firebaseUid: 'uid' } as Awaited<ReturnType<typeof findByEmail>>;

    mockPrisma.user.findUniqueOrThrow.mockResolvedValue(user);

    const result = await findByEmail('a@b.com');

    expect(mockPrisma.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { email: 'a@b.com' } });
    expect(result).toBe(user);
  });
});
