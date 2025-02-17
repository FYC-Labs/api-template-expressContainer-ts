/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');
const readline = require('readline/promises');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function applyTerraformChanges() {
  // Prompt user for confirmation before applying
  const answer = await rl.question('⚠️ Do you want to proceed with applying these changes? (yes/no): ');
  rl.close();
  if (answer.toLowerCase() === 'yes') {
    console.log('🚀 Applying changes...');
    execSync('terraform apply "tfplan"', { stdio: 'inherit' });
    console.log('✅ Changes applied successfully.');
  } else {
    console.log('❌ Operation cancelled by user.');
  }
}

module.exports = applyTerraformChanges;
