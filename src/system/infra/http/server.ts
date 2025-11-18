import semver from 'semver';

import { App } from './app';

const app = new App().server;

app.listen(process.env.PORT, () => {
  console.log(
    `using Node.js ${semver.clean(process.version)} running on port ${
      process.env.PORT
    }.`,
  );
});

export { app };
