export default {
  collectCoverage: process.env.ENABLE_TEST_COVERAGE === 'true',
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts', 'node'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: process.env.ENABLE_TEST_VERBOSE === 'true',
  reporters: ['default'],
  coverageReporters: ['text', 'json', 'lcov', 'clover', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 25,
      functions: 25,
      lines: 25,
      statements: 25,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'identity-obj-proxy',
  },
  coverageDirectory: '<rootDir>/coverage',
  setupFilesAfterEnv: ['jest-extended/all'],
  moduleDirectories: ['node_modules'],
};
