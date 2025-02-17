/* eslint-disable @typescript-eslint/no-var-requires */

// FYC Terraform Automation Script (Node.js)
// Requires: Google Cloud SDK, dotenv package
// Prerequisite: Create a .env file with PROJECT_ID

require('dotenv').config();
const { execSync } = require('child_process');
const readline = require('readline/promises');

const { PROJECT_ID } = process.env;
const TF_SA_KEY_PATH = './terraform-sa-key.json';
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function isResourceInState(resource) {
  try {
    execSync(`terraform state show ${resource}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function hasResourceChanged(resource) {
  try {
    execSync(`terraform plan -target=${resource} -detailed-exitcode`, { stdio: 'pipe' });
    return false; // Exit code 0 means no changes
  } catch (error) {
    return error.status === 2; // Exit code 2 means changes are present
  }
}

async function intializeTerraform() {
  // ⚙️ Initialize Terraform
  process.env.GOOGLE_APPLICATION_CREDENTIALS = TF_SA_KEY_PATH;
  execSync('terraform init', { stdio: 'inherit' });

  const answerImport = await rl.question('⚠️ Do you want to import the remote state before you proceed with terraform? (yes/no): ');
  if (answerImport.toLowerCase() === 'yes') {
    console.log('🚀 Importing GCP resources into Terraform state from main.tf...');
    const imports = [
      // GCP APIs
      { resource: 'google_project_service.cloud_sql', id: `${PROJECT_ID}/sqladmin.googleapis.com` },
      { resource: 'google_project_service.firebase', id: `${PROJECT_ID}/firebase.googleapis.com` },
      { resource: 'google_project_service.identity_platform', id: `${PROJECT_ID}/identitytoolkit.googleapis.com` },
      { resource: 'google_project_service.cloud_functions', id: `${PROJECT_ID}/cloudfunctions.googleapis.com` },
      { resource: 'google_project_service.cloud_storage', id: `${PROJECT_ID}/storage.googleapis.com` },

      // Cloud SQL Instances
      { resource: 'google_sql_database_instance.sql-prod', id: `projects/${PROJECT_ID}/instances/sql-prod` },
      { resource: 'google_sql_database_instance.sql-qa', id: `projects/${PROJECT_ID}/instances/sql-qa` },

      // Firebase Authentication
      { resource: 'google_identity_platform_config.auth', id: `${PROJECT_ID}` },

      // Firebase Hosting Sites
      { resource: 'google_firebase_hosting_site.prod', id: `projects/${PROJECT_ID}/sites/${PROJECT_ID}-prod` },
      { resource: 'google_firebase_hosting_site.qa', id: `projects/${PROJECT_ID}/sites/${PROJECT_ID}-qa` },

      // Firebase Storage Bucket
      { resource: 'google_storage_bucket.firebase_storage', id: `${PROJECT_ID}.firebasestorage.app` },
    ];

    imports.forEach(({ resource, id }) => {
      if (isResourceInState(resource)) {
        if (hasResourceChanged(resource)) {
          console.log(`⚠️ ${resource} has changes. Re-importing...`);
        } else {
          console.log(`✅ ${resource} is up-to-date. Skipping import.`);
          return;
        }
      }

      try {
        console.log(`🔄 Importing ${resource} with ID ${id}...`);
        execSync(`terraform import ${resource} "${id}"`, { stdio: 'inherit' });
        console.log(`✅ Successfully imported ${resource}`);
      } catch (error) {
        console.error(`❌ Failed to import ${resource}:`, error.message);
      }
    });
  } else {
    console.log('Skipping import of remote state');
  }

  execSync('terraform refresh', { stdio: 'inherit' });
  execSync('terraform fmt', { stdio: 'inherit' });
  execSync('terraform validate', { stdio: 'inherit' });

  // 📂 Create and Review Plan
  execSync('terraform plan --out=tfplan', { stdio: 'inherit' });
  console.log('✅ Plan created. Please review the changes carefully.');
}

module.exports = intializeTerraform;
