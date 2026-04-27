process.env.STORAGE_BUCKET = 'test-bucket';

const fileEntity = {
  save: jest.fn().mockResolvedValue(undefined),
  getSignedUrl: jest.fn().mockResolvedValue(['https://example.com/signed']),
  download: jest.fn().mockResolvedValue([Buffer.from('hello')]),
  delete: jest.fn().mockResolvedValue(undefined),
};

const mockBucket = {
  file: jest.fn(() => fileEntity),
  getFiles: jest.fn().mockResolvedValue([
    [
      { name: 'uploads/one.txt' },
      { name: 'uploads/two.txt' },
    ],
    {},
  ]),
};

jest.mock('@src/lib/firebase', () => ({
  storage: jest.fn(() => ({
    bucket: jest.fn(() => mockBucket),
  })),
}));

import { listFiles, read, upload } from './file.service';

describe('file.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('upload saves content to a bucket file', async () => {
    await upload({ filePath: 'a/b.txt', fileContent: 'x' });
    expect(mockBucket.file).toHaveBeenCalledWith('a/b.txt');
    expect(fileEntity.save).toHaveBeenCalledWith('x');
  });

  it('listFiles returns file names for the path prefix', async () => {
    const names = await listFiles({ path: 'uploads/' });
    expect(names).toEqual(['uploads/one.txt', 'uploads/two.txt']);
  });

  it('read returns string content from the downloaded buffer', async () => {
    const text = await read({ filePath: 'a/b.txt' });
    expect(text).toBe('hello');
  });
});
