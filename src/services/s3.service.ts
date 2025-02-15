import { S3 } from '@libs/aws';

export const getSignedUrl = async (key: string, type: string): Promise<string> => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
    Expires: 60,
    ContentType: type,
  };

  return S3.getSignedUrlPromise('putObject', params);
};

export const uploadFile = async ({
  key,
  file,
  bucketName,
}: {
    key: string;
    file: Buffer;
    bucketName: string;
}): Promise<string> => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file,
  };

  const result = await S3.upload(params).promise();
  return result.Location;
};

export const deleteFile = async (key: string, bucketName: string): Promise<void> => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  await S3.deleteObject(params).promise();
};

export const getFile = async (key: string, bucketName: string): Promise<Buffer> => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const result = await S3.getObject(params).promise();
  return result.Body as Buffer;
};
