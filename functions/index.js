/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

try {
  fs.readFileSync('./.env').toString().split('\n').map((l) => l.trim())
    .forEach((line) => {
      if (line === '' || line.startsWith('#')) {
        return;
      }

      const equalAtIndex = line.indexOf('=');
      if (equalAtIndex) {
        const key = line.slice(0, equalAtIndex);
        const value = line.slice(equalAtIndex + 1);

        process.env[key] = value;
      }
    });
} catch (error) {
  console.error(`Could not load env vars: ${error.message}`);
}

process.env.STORAGE_PROVIDER = 'firestore';
process.env.IDENTITY_PROVIDER = 'firebase';

const firebase = require('firebase-admin');
const functions = require('firebase-functions/v2');
const axios = require('axios');

const forwarder = axios.create({
  validateStatus() {
    return true;
  },
});

firebase.initializeApp({
  credential: firebase.credential.cert(JSON.parse(process.env.FUNCTIONS_SERVICE_ACCOUNT || '{}')),
});

const serverlessAuthorizer = require('./serverless-authorizer/core');

const authorizeAndForwardRequest = (baseUrl) => async (req, res) => {
  try {
    const { path } = req;
    if (path === '/_echo') {
      return res.send({ message: 'OK' });
    }

    const { method } = req;
    const { headers } = req;
    const authorizationResult = await serverlessAuthorizer({ path, method, headers });
    if (authorizationResult.isAuthorized) {
      const backendUrl = `${baseUrl}${req.url}`;
      const args = method === 'GET' || method === 'DELETE' ? [backendUrl, { headers }] : [backendUrl, req.rawBody, { headers }];
      const response = await forwarder[method.toLowerCase()](...args);
      return res.status(response.status).send(response.data);
    }
    return res.status(401).send({ message: authorizationResult.message });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: error.message });
  }
};

const BASE_SETTINGS = {
  vpcConnector: 'cloud-functions-connector',
  vpcConnectorEgressSettings: 'ALL_TRAFFIC',
};

exports.authorizer = functions.https.onRequest(
  {
    ...BASE_SETTINGS,
    memory: '2GiB',
    secrets: ['BACKEND_URL', 'AUTH_HASH_SECRET'],
    // cors: [],
  },
  authorizeAndForwardRequest(process.env.BACKEND_URL),
);

exports.authorizer_qa = functions.https.onRequest(
  {
    ...BASE_SETTINGS,
    memory: '512MiB',
    secrets: ['BACKEND_URL_QA', 'AUTH_HASH_SECRET_QA'],
    // cors: [],
  },
  authorizeAndForwardRequest(process.env.BACKEND_URL_QA),
);
