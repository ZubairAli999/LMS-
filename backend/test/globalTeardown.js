/**
 * Jest globalTeardown — runs ONCE after the whole test run.
 * Stops the shared in-memory MongoDB started in globalSetup.
 */
module.exports = async () => {
    const mongoServer = globalThis.__MONGO_SERVER__;
    if (mongoServer) {
        await mongoServer.stop();
    }
};
