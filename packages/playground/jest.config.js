module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['<rootDir>/src/**/*.test.(js|jsx|ts|tsx)'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
    },
    globals: {
      'ts-jest': {
        tsconfig: '<rootDir>/tsconfig.json',
        diagnostics: false,
      },
    },
    testURL: "http://localhost/"
  };
  