/* eslint-disable @typescript-eslint/no-var-requires */
const { onRequest } = require('firebase-functions/v2/https');

// You do not need this. It was just an experiment to test the VPC connector.
exports.helloWorld = onRequest(
  {
    region: 'us-central1',
    vpcConnector: 'cloud-functions-connector',
    ingressSettings: 'ALLOW_INTERNAL_ONLY',
    concurrency: 80,
  },
  async (req, res) => {
    res.status(200).json({ key: 'Value' });
  },
);

exports.auth = onRequest(
  {
    region: 'us-central1',
    vpcConnector: 'cloud-functions-connector',
    egressSettings: 'ALL_TRAFFIC',
    concurrency: 80,
    vpcConnectorEgressSettings: 'ALL_TRAFFIC',
  },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');

    try {
      // const result = await fetch(
      //   'https://us-central1-fyc-app.cloudfunctions.net/helloWorld',
      // );
      // const data = await result.text();
      res.status(200).json({ authorized: true, data: 1 });
    } catch (error) {
      res.status(401).json({ authorized: false, error: error.message });
    }
  },
);
