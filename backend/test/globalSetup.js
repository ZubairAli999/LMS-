/**
 * Jest globalSetup — runs ONCE before the whole test run.
 *
 * Boots a single in-memory MongoDB and exposes its URI via an env var so every
 * test suite connects to the same server. This avoids the per-suite startup
 * cost (and the intermittent 10s startup timeout that happens when many suites
 * each spin up their own mongod).
 */
// globalSetup runs outside Jest's module resolver, so point directly at the
// dependency under src/node_modules where the project's packages are installed.
const { MongoMemoryServer } = require('../src/node_modules/mongodb-memory-server');

module.exports = async () => {
    const mongoServer = await MongoMemoryServer.create();
    global.__MONGO_SERVER__ = mongoServer;
    process.env.MONGO_TEST_URI = mongoServer.getUri();
    // Stash on globalThis so globalTeardown can stop it
    globalThis.__MONGO_SERVER__ = mongoServer;
};
