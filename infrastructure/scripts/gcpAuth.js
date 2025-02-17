/* eslint-disable no-unsafe-finally */
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
const readline = require('readline/promises');

const { PROJECT_ID } = process.env;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let currentAccount;

async function gcpAuth() {
  console.log('🔐 Checking GCP authentication...');
  try {
    currentAccount = execSync('gcloud auth list --filter=status:ACTIVE --format="value(account)"').toString().trim();
    console.log(`✅ Currently logged in as: ${currentAccount}`);

    if (currentAccount) {
      const answer = await rl.question(`🔐 Proceed with this account (${currentAccount})? (yes/no): `);

      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Authentication aborted. Please log in with the desired account.');
        process.exit(1);
      }

      console.log('✅ Setting GCP project to provided PROJECT_ID...');
      execSync(`gcloud config set project ${PROJECT_ID}`, { stdio: 'inherit' });
      console.log(`🌟 GCP default project switched to ${PROJECT_ID}`);
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('🔐 No active login found. Proceeding to authenticate...');
    execSync('gcloud auth application-default login', { stdio: 'inherit' });
    console.log('✅ Setting GCP project to provided PROJECT_ID...');
    execSync(`gcloud config set project ${PROJECT_ID}`, { stdio: 'inherit' });
    console.log(`🌟 GCP default project switched to ${PROJECT_ID}`);
  } finally {
    return currentAccount;
  }
}

module.exports = gcpAuth;
