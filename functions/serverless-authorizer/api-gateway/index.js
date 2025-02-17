/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

fs.readFileSync('.env').toString().split('\n').map((l) => l.trim())
  .forEach((line) => {
    if (line === '' || line.startsWith('#')) {
      return;
    }

    const [key, value] = line.split('=');

    process.env[key] = value;
  });

const firebase = require('firebase-admin');

firebase.initializeApp({
  credential: firebase.credential.cert(JSON.parse(process.env.FUNCTIONS_SERVICE_ACCOUNT || {})),
});

const http = require('http');
const serverlessAuthorizer = require('../core');

http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, x-organization-uids, organizationId, Content-Transfer-Encoding, baggage, sentry-trace');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.writeHead(204);
    res.end();
    return;
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    const serverlessMiddlewareBody = {
      headers: req.headers,
      method: req.method,
      path: req.url.split('?')[0],
    };

    const authorizerResult = await serverlessAuthorizer(serverlessMiddlewareBody);
    if (!authorizerResult.isAuthorized) {
      res.writeHead(401);
      return res.end(authorizerResult.message);
    }

    const backendOptions = {
      hostname: '127.0.0.1',
      port: 3333,
      method: req.method,
      headers: req.headers,
      // path: `/wcapp-18d8a/us-central1/api_dev${req.url}`,
      path: req.url,
    };

    const backend = http.request(backendOptions, (backendRes) => {
      res.writeHead(backendRes.statusCode, backendRes.headers);
      backendRes.pipe(res, { end: true });
    });

    backend.on('error', (err) => {
      console.error(`Error while proxying request to backend: ${err.message}`);
      res.writeHead(500);
      res.end('Internal Server Error');
    });

    backend.write(body);
    backend.end();

    return undefined;
  });

  req.on('error', (err) => {
    console.error(`Error receiving request: ${err.message}`);
    res.writeHead(400);
    res.end('Bad Request');
  });
}).listen(8080, () => {
  console.log('Server is listening on port 8080');
});
