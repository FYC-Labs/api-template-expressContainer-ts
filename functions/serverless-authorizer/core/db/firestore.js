/* eslint-disable @typescript-eslint/no-var-requires */
const firebaseAdmin = require('firebase-admin');

const firestore = firebaseAdmin.firestore();

function getCollectionPrefix() {
  const target = process.env.FUNCTION_TARGET || '';
  if (target.endsWith('_dev')) {
    return 'dev_';
  } if (target.endsWith('_qa')) {
    return 'qa_';
  } if (!target.endsWith('_qa') && !target.endsWith('_dev')) {
    return 'prod_';
  }
  return 'dev_';
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
