/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-var-requires */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const { COLLECTION_PREFIX } = process.env;

function getPrefixedCollection(name) {
  const prefix = COLLECTION_PREFIX || '';
  return `${prefix}${name}`;
}

const dynamoDBClient = new DynamoDBClient({
  region: 'us-east-1',
  ...(process.env.DYNAMODB_ENDPOINT ? { endpoint: process.env.DYNAMODB_ENDPOINT } : { }),
});

const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient);

async function fetchCollection(tableName) {
  const collection = await dynamoDBDocumentClient.send(
    new ScanCommand({ TableName: getPrefixedCollection(tableName) }),
  );

  return collection.Items;
}

async function fetchDocument(tableName, uid) {
  return (await dynamoDBDocumentClient.send(new GetCommand({
    TableName: getPrefixedCollection(tableName),
    Key: { uid },
  }))).Item;
}

module.exports.fetchCollection = fetchCollection;
module.exports.fetchDocument = fetchDocument;
