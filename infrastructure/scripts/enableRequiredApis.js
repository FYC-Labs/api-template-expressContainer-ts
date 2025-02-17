/* eslint-disable no-inner-declarations */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable global-require */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-var-requires */

// FYC Terraform Automation Script (Node.js)
// Requires: Google Cloud SDK, dotenv package
// Prerequisite: Create a .env file with PROJECT_ID

require('dotenv').config();
const { execSync } = require('child_process');

const { PROJECT_ID } = process.env;

function enableRequiredApis() {
  // 🚀 Enable Required GCP APIs (including Cloud Resource Manager)
  const requiredApis = [
    'cloudresourcemanager.googleapis.com',
    'sqladmin.googleapis.com',
    'firebase.googleapis.com',
    'identitytoolkit.googleapis.com',
    'cloudfunctions.googleapis.com',
    'run.googleapis.com',
    'cloudbuild.googleapis.com',
    'storage.googleapis.com',
    'logging.googleapis.com',
    'monitoring.googleapis.com',
  ];

  console.log('🔧 Checking and enabling necessary GCP APIs...');
  requiredApis.forEach((api) => {
    try {
      const apiStatus = execSync(`gcloud services list --enabled --filter="config.name:${api}" --format="value(config.name)" --project=${PROJECT_ID}`).toString().trim();
      if (!apiStatus) {
        console.log(`🟡 Enabling API: ${api}`);
        execSync(`gcloud services enable ${api} --project=${PROJECT_ID}`, { stdio: 'inherit' });
      } else {
        console.log(`✅ API already enabled: ${api}`);
      }
    } catch (error) {
      console.error(`❌ Error enabling API: ${api}`, error);
    }
  });
}

module.exports = enableRequiredApis;
