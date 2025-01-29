/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const { exec } = require('child_process');

const dockerCommand = `
docker run --name postgres-local \
  -e POSTGRES_USER=${process.env.POSTGRES_USER} \
  -e POSTGRES_DB=${process.env.POSTGRES_DB} \
  -p 5433:5432 \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  -d postgres:latest
`;

exec(dockerCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
