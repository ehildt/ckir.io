export default {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: false,
  reporters: ['default'],
  coverageReporters: ['clover', 'json', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  collectCoverageFrom: [
    '!**/dist/**',
    // '!**/dtos/**',
    // '!**/decorators/**',
    '!**/models/**',
    '!**/configs/**',
    '!**/modules/**',
    '!**/schemas/**',
    '!**/validations/**',
    '!**/repositories/**',
    '!**/open-api/**',
    '!**/node_modules/**',
    '!src/main.ts',
    '!src/services/app.service.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'identity-obj-proxy',
  },
  coverageDirectory: '<rootDir>/coverage',
  setupFilesAfterEnv: ['jest-extended/all'],
  moduleDirectories: ['node_modules'],
};
