/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable no-case-declarations */
const SUPPORTED_STORAGE_PROVIDERS = [
  'dynamodb',
  'firestore',
];

const storageProvider = process.env.STORAGE_PROVIDER;

let db;
switch (storageProvider) {
  case 'dynamodb':
    const dynamodb = require('./dynamodb');
    db = dynamodb;
    break;
  case 'firestore':
    const firestore = require('./firestore');
    db = firestore;
    break;
  default:
    throw new Error(`Please set a storage provider. Supported providers: ${SUPPORTED_STORAGE_PROVIDERS.join(', ')}`);
}

module.exports = db;
