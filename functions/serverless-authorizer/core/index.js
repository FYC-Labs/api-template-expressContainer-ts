/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-case-declarations */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-var-requires */

const crypto = require('crypto');
const identity = require('./identity');
const db = require('./db');

function parseAccessTokenFromHeaders(headers) {
  if (!headers.authorization && !headers.Authorization) {
    throw new Error('Did not find authorization header');
  }

  const authorizationHeader = headers.authorization || headers.Authorization || '';
  const accessToken = authorizationHeader.split('Bearer ')[1];

  if (!accessToken) {
    throw new Error('Did not find access token');
  }

  return accessToken;
}

async function fetchApiKeyFromDatastore(unhashedApiKey) {
  const secretKey = process.env.AUTH_HASH_SECRET_DEV
    || process.env.AUTH_HASH_SECRET_QA
    || process.env.AUTH_HASH_SECRET;

  if (!secretKey) {
    throw new Error('Cannot continue due to missing configuration');
  }

  const uid = crypto.createHmac('sha256', secretKey).update(unhashedApiKey).digest('hex');
  const apiKey = await db.fetchDocument('api_keys', uid);

  if (!apiKey) {
    throw new Error('API key not found');
  }

  return apiKey;
}

async function fetchUserFromDatastore(uid) {
  const user = await db.fetchDocument('users', uid);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

async function fetchDependenciesFromStorage() {
  const [models, roles] = await Promise.all(['models', 'roles'].map((tableName) => db.fetchCollection(tableName)));

  return {
    models: models.map((m) => m.name),
    roles,
  };
}

// const {
  // ENDPOINT_PREFIX,
// } = process.env;
//
const ENDPOINT_PREFIX = '';

function pathToRegex(path) {
  const pathWithSubstitutions = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\/:([a-zA-Z]+)/g, '/([^/]+)');
  return new RegExp(`^${pathWithSubstitutions}$`);
}

async function fetchEndpointFromDatastore(fullpath) {
  // the uid is the base64 encoded path
  const path = ENDPOINT_PREFIX ? fullpath.split(ENDPOINT_PREFIX)[1] : fullpath;
  const uid = Buffer.from(path, 'utf-8').toString('base64');
  const endpointMatchingPrimaryKey = await db.fetchDocument('endpoints', uid);

  let endpoint;

  if (endpointMatchingPrimaryKey) {
    endpoint = endpointMatchingPrimaryKey;
  } else {
    const endpointCollection = await db.fetchCollection('endpoints');

    const endpointPaths = endpointCollection.map((e) => e.path);
    endpointPaths.sort().reverse();

    const sortedEndpointCollection = endpointPaths
      .map((p) => endpointCollection.find((e) => e.path === p));
    const endpointAsRegexes = sortedEndpointCollection.map((e) => pathToRegex(e.path));

    const index = endpointAsRegexes.findIndex((regex) => path.match(regex));
    if (index === -1) {
      throw new Error('Route does not exist as endpoint key. Did you forget to add it to the auth collection?');
    }

    endpoint = sortedEndpointCollection[index];
  }

  if (!endpoint) {
    throw new Error('Did not find endpoint');
  }

  return endpoint;
}

function grabOrganizationUids(headers) {
  const organizationUidsHeaderEntry = headers['x-organization-uids'];
  if (!organizationUidsHeaderEntry) {
    throw new Error('x-organization-uids header must be defined');
  }

  const organizationUids = organizationUidsHeaderEntry.split(',');

  if (organizationUids.length === 0) {
    throw new Error('At least one organization uid is required. Alternativately pass in: all');
  }

  if (organizationUids.includes('all') && organizationUids.length !== 1) {
    throw new Error('When passing all, no other values can be passed in');
  }

  return organizationUids;
}

const ACTIONS = [
  'read',
  'create',
  'update',
  'delete',
];

function mergePermissions(...ps) {
  const mergedPermissions = {};
  const models = [...new Set(ps.reduce((acc, permissions) => acc.concat(Object.keys(permissions)), []))];

  for (const model of models) {
    mergedPermissions[model] = {
      read: 'deny',
      create: 'deny',
      update: 'deny',
      delete: 'deny',
    };

    for (const permissions of ps) {
      for (const action of ACTIONS) {
        if (!permissions[model]) {
          continue;
        }

        if (action !== 'create') {
          if (permissions[model][action] === 'all' && mergedPermissions[model][action] !== 'all') {
            mergedPermissions[model][action] = permissions[model][action];
            // we only overwrite permissions if value is deny
            // mine is left unchanged
            // should not overwrite all
          } else if (permissions[model][action] === 'mine' && mergedPermissions[model][action] === 'deny') {
            mergedPermissions[model][action] = permissions[model][action];
          }
        } else if (permissions[model][action] === true && mergedPermissions[model][action] !== true) {
          mergedPermissions[model][action] = permissions[model][action];
        }
      }
    }
  }

  return mergedPermissions;
}

async function lambdaAuthorizer({ headers, path, method }) {
  if (method === 'OPTIONS') {
    return { isAuthorized: true, message: 'OK' };
  }

  try {
    const endpoint = await fetchEndpointFromDatastore(path);
    if (endpoint.mode === 'public') {
      return { isAuthorized: true, message: 'OK' };
    }

    const { roles: roleCollection } = await fetchDependenciesFromStorage();

    const apiKeyInHeader = headers['x-api-key'];
    let schema;

    if (apiKeyInHeader) {
      schema = await fetchApiKeyFromDatastore(apiKeyInHeader);
    } else {
      const { uid: userUid } = await identity.verify(parseAccessTokenFromHeaders(headers));
      schema = await fetchUserFromDatastore(userUid);
    }

    let organizationUids;
    switch (endpoint.mode) {
      case 'permissions':
        if (!endpoint[method]) {
          throw new Error(`Method ${method} not defined in ${path}`);
        }

        const endpointRequiredPermissions = endpoint[method].permissions;
        if (endpointRequiredPermissions === null || endpointRequiredPermissions === undefined) {
          throw new Error(`Permissions not configured for endpoint: ${method} ${path}`);
        }

        organizationUids = grabOrganizationUids(headers);

        for (const organizationUid of organizationUids) {
          const organizationObject = schema.dimensions?.organizations[organizationUid] || {};
          const organizationPermissions = organizationObject.permissions || {};
          const organizationRoles = organizationObject.roles || [];
          const mergedPermissions = mergePermissions(
            ...[organizationPermissions, ...organizationRoles.map((roleName) => {
              const matchingRole = roleCollection.find((role) => role.name === roleName);
              return matchingRole?.permissions || {};
            })],
          );

          for (const model of Object.keys(endpointRequiredPermissions)) {
            for (const action of ACTIONS) {
              if (endpointRequiredPermissions[model][action] === true) {
                if (!mergedPermissions[model]) {
                  throw new Error(`Did not find required model: ${model} in permissions`);
                }

                if (action !== 'create') {
                  if ((mergedPermissions[model][action] !== 'mine' && mergedPermissions[model][action] !== 'all')) {
                    throw new Error(`Not enough privileges for model ${model} and action ${action}`);
                  }
                } else if (mergedPermissions[model][action] !== true) {
                  throw new Error(`Not enough privileges for model ${model} and action ${action}`);
                }
              }
            }
          }
        }

        break;

      case 'roles':
        if (!endpoint[method]) {
          throw new Error(`Method ${method} not defined in ${path}`);
        }

        const endpointRequiredRoles = endpoint[method].roles;
        if (!endpointRequiredRoles || endpointRequiredRoles.length === 0) {
          throw new Error(`Endpoint ${method} ${path} needs at least one role to be set up.`);
        }

        organizationUids = grabOrganizationUids(headers);

        for (const organizationUid of organizationUids) {
          const organizationObject = schema.dimensions?.organizations[organizationUid] || {};
          const organizationRoles = organizationObject.roles || [];

          if (!organizationRoles.some((role) => endpointRequiredRoles.includes(role))) {
            throw new Error('No valid role has been given to access endpoint. Aborting.');
          }
        }

        break;

      case 'bypass':
        break;

      case 'public':
        break;

      default:
        throw new Error('Endpoint mode misconfigured or not set. Aborting.');
    }

    return { isAuthorized: true, message: 'OK' };
  } catch (error) {
    console.error(error.message);
    console.error(error.stack);
    return {
      isAuthorized: false,
      message: error.message,
      stack: error.stack,
    };
  }
}

module.exports = lambdaAuthorizer;
