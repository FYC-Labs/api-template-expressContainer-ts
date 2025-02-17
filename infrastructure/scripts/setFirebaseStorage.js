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

function setFirebaseStorage() {
  console.log('🚀 Checking if Firebase Storage is enabled...');
  try {
    const bucketList = execSync(`gcloud storage buckets list --project="${PROJECT_ID}"`).toString();
    if (bucketList.includes(`${PROJECT_ID}.firebasestorage.app`)) {
      console.log(`✅ Firebase Storage bucket found: ${PROJECT_ID}.firebasestorage.app`);
    } else {
      console.log('-----------------------------------------------');
      console.log('👋👋👋👋👋👋 HEY! Please enable Firebase Storage via the Firebase Console manually and rerun script.👋👋👋👋👋👋');
      console.log('-----------------------------------------------');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error checking Firebase Storage:', error.message);
  }

  console.log('🔗 Verifying Firebase Storage association...');
  try {
    execSync(`firebase hosting:sites:list --project=${PROJECT_ID}`, { stdio: 'inherit' });
    console.log('✅ Hosting is already associated with Firebase.');
  } catch (verificationError) {
    console.error('❌ Error verifying Firebase bucket association:', verificationError.message);
  }
}

module.exports = setFirebaseStorage;
