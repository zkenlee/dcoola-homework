module.exports = {
    testEnvironment: 'node',
    testTimeout: 30000,
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    setupFilesAfterEnv: ['./tests/prod.setup.js']
};