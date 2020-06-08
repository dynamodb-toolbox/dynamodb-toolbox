module.exports = {
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '(spec|test)\\.ts$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'node',
  // setupFilesAfterEnv: ['<rootDir>/src/__test__/setupTests.ts'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  }
};
