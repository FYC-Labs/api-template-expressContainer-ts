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

const { PROJECT_ID, ORG_ID } = process.env;

function gcpIAMRoles(currentAccount) {
  console.log('🚀 Granting IAM roles to user: ', currentAccount);
  const requiredRoles = [
    {
      role: 'roles/owner',
      level: 'projects',
    },
    {
      role: 'roles/firebase.admin',
      level: 'projects',
    },
    {
      role: 'roles/iam.serviceAccountAdmin',
      level: 'projects',
    },
  ];

  requiredRoles.forEach((role) => {
    let ID = '';
    console.log('🔑 Assigning role:', role.role);

    if (role.level === 'organizations') {
      ID = ORG_ID;
    }
    if (role.level === 'projects') {
      ID = PROJECT_ID;
    }

    try {
      console.log(`🔑 Assigning ${role.role} to ${currentAccount}...`);
      execSync(`gcloud ${role.level} add-iam-policy-binding "${ID}" \
        --member="user:${currentAccount}" \
        --role="${role.role}"`, { stdio: 'inherit' });
      console.log(`✅ Successfully granted ${role.role} to ${currentAccount}`);
    } catch (error) {
      console.error(`❌ Failed to assign ${role.role} to ${currentAccount}:`, error.message);
    }
  });
}
module.exports = gcpIAMRoles;
