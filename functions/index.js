/* eslint-disable global-require */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */
const { onRequest } = require('firebase-functions/v2/https');
const fetch = require('node-fetch');

exports.auth = onRequest(
  {
    region: 'us-central1',
    vpcConnector: 'cloud-functions-connector',
    egressSettings: 'ALL_TRAFFIC',
    vpcConnectorEgressSettings: 'ALL_TRAFFIC',
  },
  async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
      return res.status(204).send('');
    }

    try {
      // Determine the target base URL
      const baseUrl = process.env.TARGET_URL;
      const entryPath = process.env.ENTRY_PATH;

      if (!baseUrl) {
        throw new Error('Target URL is not configured');
      }

      // Construct the full URL (preserve path and query params, but remove the entry path)
      const fullUrl = `${baseUrl}${req.originalUrl.replace(entryPath, '')}`;

      console.log('req.body', req.body);

      // // Proxy the request to the target URL
      const response = await fetch(fullUrl, {
        method: req.method,
        headers: {
          ...req.headers,
          host: new URL(baseUrl).host, // Ensure correct host header
        },
        body:
          req.method !== 'GET' && req.method !== 'HEAD'
            ? JSON.stringify(req.body)
            : undefined,
      });

      // Determine response content type
      const contentType = response.headers.get('content-type');

      let responseData;
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        res.status(response.status).json(responseData);
      } else {
        responseData = await response.text();
        res.status(response.status).send(responseData);
      }
    } catch (error) {
      res.status(500).json({ authorized: false, error: error.message });
    }
  },
);
