/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
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

const authorizeAndForwardRequest = (baseUrl) => {
  return async (req, res) => {
    try {
      const { path } = req;
      if (path === '/_echo') {
        return res.send({ message: 'OK' });
      }

      const { method } = req;
      const headers = { ...req.headers };

      delete headers.forwarded;
      delete headers['x-forwarded-for'];
      delete headers['x-forwarded-proto'];
      delete headers['x-cloud-trace-context'];
      delete headers['x-client-data'];
      delete headers.traceparent;
      delete headers.host;

      const authorizationResult = await serverlessAuthorizer({ path, method, headers });
      if (authorizationResult.isAuthorized) {
        const backendUrl = `${baseUrl}${req.url}`;
        let response;
        if (method === 'GET' || method === 'DELETE') {
          response = await forwarder[method.toLowerCase()](backendUrl, { headers });
        } else {
          response = await forwarder[method.toLowerCase()](backendUrl, req.rawBody, { headers });
        }

        return res.status(response.status).send(response.data);
      }
      return res.status(401).send({ message: authorizationResult.message });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: error.message });
    }
  };
}

// upon first deployment
// manually create a revision
// and set the authorizer to the default vpc
// and to the default subnet
// firebase functions does not support
// direct egress at the moment
// which is what allows us to save money
// by not using a vpc-connector

exports.authorizer = functions.https.onRequest(
  {
    memory: '2GiB',
    secrets: ['BACKEND_URL', 'AUTH_HASH_SECRET'],
    // cors: [],
  },
  authorizeAndForwardRequest(process.env.BACKEND_URL),
);

exports.authorizer_qa = functions.https.onRequest(
  {
    memory: '512MiB',
    secrets: ['BACKEND_URL_QA', 'AUTH_HASH_SECRET_QA'],
    // cors: [],
  },
  authorizeAndForwardRequest(process.env.BACKEND_URL_QA),
);

exports.authorizer_dev = functions.https.onRequest(
  {
    memory: '2GiB',
    secrets: ['BACKEND_URL', 'AUTH_HASH_SECRET'],
    // cors: [],
  },
  authorizeAndForwardRequest('http://localhost:3001'),
);
