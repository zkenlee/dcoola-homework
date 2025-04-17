module.exports = {
    testEnvironment: 'node',
    testTimeout: 30000,
    transform: {
        '^.+\\.(js|ts)$': 'babel-jest'
    },
    transformIgnorePatterns: [
        'node_modules/(?!(mongodb|mongoose)/)'
    ],
    moduleFileExtensions: ['js', 'json', 'ts'],
    testPathIgnorePatterns: ['/node_modules/'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['./tests/setup.js']
};