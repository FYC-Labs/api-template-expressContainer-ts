/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable no-case-declarations */
const IDENTITY_PROVIDER = process.env.IDENTITY_PROVIDER || '';
const firebaseAdmin = require('firebase-admin');

async function main(accessToken) {
  try {
    const user = await firebaseAdmin.auth().verifyIdToken(accessToken);
    return { user, uid: user.sub };
  } catch (error) {
    console.error('Error validating token:', error);
    throw new Error('Invalid token');
  }
}

module.exports = {
  verify: main,
};
