import semver from 'semver';
import 'reflect-metadata';

// Tsconfig paths
// eslint-disable-next-line import/no-extraneous-dependencies

// Environment import
import './environment';

// Service import
import { Bootstrap } from './bootstrap';

// Server import
import { App } from './app';

// Start server
const app = new App().server;

// Start listen
Bootstrap.then(() => app.listen(process.env.APP_PORT, () => {
  console.log(
    `using Node.js ${semver.clean(process.version)} running at port ${
      process.env.APP_PORT
    }.`,
  );
}));

export { app };
