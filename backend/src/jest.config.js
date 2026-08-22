/**
 * Jest configuration.
 *
 * Tests live in the sibling `test/` folder while the application code lives in
 * `src/`, so rootDir points one level up to the project root and we run tests
 * from there. mongodb-memory-server needs a longer timeout on first download.
 */
module.exports = {
    rootDir: '..',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/test/**/*.test.js'],
    globalSetup: '<rootDir>/test/globalSetup.js',
    globalTeardown: '<rootDir>/test/globalTeardown.js',
    setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
    testTimeout: 60000,
    // node_modules live under src/, so let Jest resolve deps from there
    moduleDirectories: ['<rootDir>/src/node_modules', 'node_modules'],
    collectCoverageFrom: [
        'src/service/**/*.js',
        'src/repository/**/*.js',
        'src/controller/**/*.js',
        'src/middlewares/**/*.js',
        'src/utils/**/*.js',
    ],
    coveragePathIgnorePatterns: ['/node_modules/'],
    // Silence the app's console logging during tests
    silent: false,
    verbose: true,
};
