// Prerequisites
import { DatabaseProviderInitialization } from '../../container/providers/DatabaseProvider';
// Todo: Bring redis back
// import { InMemoryDatabaseProviderInitialization }
// from '../../container/providers/InMemoryDatabaseProvider';

// Bootstrap step import

// Boostrap prerequisites
const prerequisites = [
  DatabaseProviderInitialization,
  // InMemoryDatabaseProviderInitialization,
];

const Bootstrap = (async () => {
  try {
    console.clear();

    // Await prerequisites
    await prerequisites.reduce((promise, prerequisite) => {
      return promise
        .then(() => prerequisite)
        .catch((err) => {
          throw err;
        });
    }, Promise.resolve());

    // Sequence of bootstraping
    // await Condition;
  } catch (err: any) {
    console.log('❌ Bootstrap failed. Shutting down.');
    console.log(`${err?.message}`);
    process.exit(1);
  }
})();

export { Bootstrap };
