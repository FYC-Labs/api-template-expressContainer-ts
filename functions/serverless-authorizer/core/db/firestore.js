/* eslint-disable @typescript-eslint/no-var-requires */
const firebaseAdmin = require('firebase-admin');

const firestore = firebaseAdmin.firestore();

const ALLOWED_COLLECTION_PREFIXES = ['prod_', 'qa_', 'dev_'];

function getCollectionPrefix() {
  const FUNCTIONS_TARGET = process.env.FUNCTION_TARGET;
  let collectionPrefix;
  switch (FUNCTIONS_TARGET) {
    case 'authorizer':
      if (process.env.FUNCTIONS_EMULATOR === 'true' || !process.env.K_SERVICE) {
        throw new Error('This function can only be used in the cloud environment. Please use authorizer_dev for local development');
      }

      collectionPrefix = 'prod_';
      break;

    case 'authorizer_qa':
      if (process.env.FUNCTIONS_EMULATOR === 'true' || !process.env.K_SERVICE) {
        throw new Error('This function can only be used in the cloud environment. Please use authorizer_dev for local development');
      }

      collectionPrefix = 'qa_';
      break;

    case 'authorizer_dev':
      collectionPrefix = 'dev_';
      break;

    default:
      collectionPrefix = 'dev_';
      break;
  }

  if (ALLOWED_COLLECTION_PREFIXES.includes(collectionPrefix)) {
    return collectionPrefix;
  }

  throw new Error(`Collection prefix must be one of: ${ALLOWED_COLLECTION_PREFIXES.join(', ')}`);
}

function buildCollectionRef(collectionName) {
  const collectionPrefix = getCollectionPrefix();
  return firestore.collection(`${collectionPrefix}${collectionName}`);
}

function buildDocumentRef(collectionName, id) {
  return buildCollectionRef(collectionName).doc(id);
}

function normalizeDocument(document) {
  const data = document.data();
  return {
    ...data,
    uid: document.id,
    createdAt: data.createdAt ? data.createdAt.toDate() : undefined,
    updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
  };
}

async function fetchCollection(collectionName) {
  const collectionRef = buildCollectionRef(collectionName);
  const collectionSnapshot = await collectionRef.get();

  const items = [];
  collectionSnapshot.forEach((doc) => items.push(doc));
  return items.map(normalizeDocument);
}
async function fetchDocument(collectionName, uid) {
  const documentRef = buildDocumentRef(collectionName, uid);
  const documentSnapshot = await documentRef.get();

  if (documentSnapshot.exists) {
    return normalizeDocument(documentSnapshot);
  }
  return null;
}

module.exports.fetchCollection = fetchCollection;
module.exports.fetchDocument = fetchDocument;
