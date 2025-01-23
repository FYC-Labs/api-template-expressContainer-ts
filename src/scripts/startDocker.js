/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({ path: './.env' });
const { exec } = require('child_process');
const checkAndStopContainer = require('./utils/checkAndStopContainer.js');

// Function to spin up a new container
function spinUpContainer() {
  try {
    checkAndStopContainer(`/${process.env.PROJECT_NAME}-container`);
  } catch (error) {
    console.error('unable to stop container');
    process.exit();
  }

  const dockerCommand = `docker run -p 3001:3001 --name ${process.env.PROJECT_NAME}-container ${process.env.PROJECT_NAME}`;

  console.log('Spinning up a new container...');
  exec(dockerCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting new container: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`New container started: ${stdout}`);
  });
}

// Execute the script
spinUpContainer();
