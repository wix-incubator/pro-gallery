const tsJest = ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }];
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$':
      '<rootDir>/tests/drivers/mocks/stylesImportMock.js',
  },
  reporters: ['default', '<rootDir>/tests/drivers/customReporter.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/dist',
    '<rootDir>/target',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/drivers/mocks/jest-setup.js'],
  transform: {
    '^.+\\.tsx?$': tsJest,
    '^.+\\.jsx?$': tsJest,
  },
  testTimeout: 30 * 1000,
};
