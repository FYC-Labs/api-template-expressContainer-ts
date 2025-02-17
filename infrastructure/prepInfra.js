/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

// FYC Terraform Automation Script (Node.js)
// Requires: Google Cloud SDK, dotenv package
// Prerequisite: Create a .env file with PROJECT_ID

require('dotenv').config();
const path = require('path');

const gcpAuth = require('./scripts/gcpAuth.js');
const gcpRoles = require('./scripts/gcpRoles.js');
const enableRequiredApis = require('./scripts/enableRequiredApis.js');
const createOrUpdateServiceAccountPermissions = require('./scripts/createOrUpdateServiceAccountPermissions.js');
const setFirebaseStorage = require('./scripts/setFirebaseStorage.js');
const intializeTerraform = require('./scripts/intializeTerraform.js');
const applyTerraformChanges = require('./scripts/applyTerraformChanges.js');

const { PROJECT_ID } = process.env;

async function init() {
  if (!PROJECT_ID) {
    console.error('Error: PROJECT_ID environment variable is not set. Ensure a .env file is present.');
    process.exit(1);
  }
  const currentAccount = await gcpAuth();
  gcpRoles(currentAccount);
  enableRequiredApis();
  createOrUpdateServiceAccountPermissions();
  setFirebaseStorage();
  await intializeTerraform();
  await applyTerraformChanges();
}

init();
