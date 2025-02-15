import AWS, { Config } from 'aws-sdk';

const awsConfig: Partial<Config> = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
};

AWS.config.update(awsConfig);

const S3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const cognitoISP = new AWS.CognitoIdentityServiceProvider();

const lambda = new AWS.Lambda();

export {
  S3,
  dynamoDB,
  cognitoISP,
  lambda,
};
