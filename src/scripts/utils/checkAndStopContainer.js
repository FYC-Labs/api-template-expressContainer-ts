/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require('child_process');

function checkAndStopContainer(containerName) {
  const checkCommand = `docker ps --filter "name=${containerName}" --format "{{.Names}}"`;

  exec(checkCommand, (error, stdout, stderr) => {
    console.log('stdout', stdout);

    if (error) {
      console.error(`Error checking container: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    // If stdout is not empty, the container is running
    if (stdout.trim()) {
      console.log(
        `Container "${containerName}" is running. Stopping and removing it...`,
      );

      // Docker command to stop and remove the container
      const removeCommand = `docker stop ${containerName} && docker rm ${containerName}`;
      exec(removeCommand, (removeError, removeStdout, removeStderr) => {
        if (removeError) {
          console.error(`Error removing container: ${removeError.message}`);
          return;
        }

        if (removeStderr) {
          console.error(`stderr: ${removeStderr}`);
          return;
        }

        console.log(`Container "${containerName}" stopped and removed.`);
      });
    } else {
      console.log(`Container "${containerName}" is not running.`);
    }
  });
}

module.exports = checkAndStopContainer;
