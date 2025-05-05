// jest.config.js
export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.jsx?$'
  : 'babel-jest',
    },
    moduleFileExtensions: ['js', 'json'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    testTimeout: 20000,
    setupFilesAfterEnv: ['./jest.setup.js'],
  };