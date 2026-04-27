import prisma from '../../lib/prisma';
import { create, findByEmail } from './post.service';

jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUniqueOrThrow: jest.fn(),
    },
    post: {
      create: jest.fn(),
    },
  },
}));

const mockPrisma = jest.mocked(prisma);

describe('post.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create delegates to prisma.post.create', async () => {
    const post = { id: 1, title: 't', description: 'd', authorId: 1 } as Awaited<ReturnType<typeof create>>;

    mockPrisma.post.create.mockResolvedValue(post);

    const data = { title: 't', description: 'd', authorId: 1 };
    const result = await create(data);

    expect(mockPrisma.post.create).toHaveBeenCalledWith({ data });
    expect(result).toBe(post);
  });

  it('findByEmail delegates to prisma.user.findUniqueOrThrow', async () => {
    const user = { id: 1, email: 'a@b.com', firebaseUid: 'uid' } as Awaited<ReturnType<typeof findByEmail>>;

    mockPrisma.user.findUniqueOrThrow.mockResolvedValue(user);

    const result = await findByEmail('a@b.com');

    expect(mockPrisma.user.findUniqueOrThrow).toHaveBeenCalledWith({ where: { email: 'a@b.com' } });
    expect(result).toBe(user);
  });
});
