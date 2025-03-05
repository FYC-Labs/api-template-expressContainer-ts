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
const fs = require('fs');

const { PROJECT_ID } = process.env;
const TF_SA_NAME = 'terraform-sa';
const TF_SA_KEY_PATH = './terraform-sa-key.json';
const TF_SA_EMAIL = `${TF_SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com`;

function createOrUpdateServiceAccountPermissions() {
  // 🧑‍💻 Create or Update Service Account Permissions
  try {
    const saExists = execSync(`gcloud iam service-accounts list --filter="email:${TF_SA_EMAIL}" --format="value(email)"`).toString().trim();
    if (saExists) {
      console.log('✅ Service account already exists. Checking permissions...');
    } else {
      console.log('🆕 Creating new service account...');
      execSync(`gcloud iam service-accounts create ${TF_SA_NAME} \
        --description="Terraform Service Account" \
        --display-name="Terraform SA"`, { stdio: 'inherit' });
    }
    console.log('🔑 Ensuring service account has the correct permissions...');
    execSync(`gcloud projects add-iam-policy-binding ${PROJECT_ID} \
      --condition="None" \
      --member="serviceAccount:${TF_SA_EMAIL}" \
      --role="roles/owner"`, { stdio: 'inherit' });
    execSync(`gcloud projects add-iam-policy-binding ${PROJECT_ID} \
      --condition="None" \
      --member="serviceAccount:${TF_SA_EMAIL}" \
      --role="roles/resourcemanager.projectIamAdmin"`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Error managing service account permissions:', error);
    process.exit(1);
  }
  console.log('🔑 Checking for existing Terraform service account key...');
  if (fs.existsSync(TF_SA_KEY_PATH)) {
    console.log(`✅ Service account key already exists at ${TF_SA_KEY_PATH}. Skipping key creation.`);
  } else {
    console.log('🟡 No service account key found. Creating a new one...');
    try {
      execSync(`gcloud iam service-accounts keys create "${TF_SA_KEY_PATH}" \
      --iam-account="${TF_SA_EMAIL}"`, { stdio: 'inherit' });
      console.log(`✅ New service account key created and saved to ${TF_SA_KEY_PATH}.`);
    } catch (error) {
      console.error('❌ Error creating service account key:', error.message);
    }
  }
}

module.exports = createOrUpdateServiceAccountPermissions;
