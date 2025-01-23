/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({ path: './.env' });
const { exec } = require('child_process');
// Function to spin up a new Image

function buildImage() {
  const dockerCommand = `docker build -t ${process.env.PROJECT_NAME} -f Dockerfile.dev .`;
  console.log('building new image from: ', dockerCommand);

  exec(dockerCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error building new image: ${error.message}`);
      process.exit();
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      process.exit();
      return;
    }

    console.log(`New image built: ${stdout}`);
    process.exit();
  });
}

// Execute the script
buildImage();
