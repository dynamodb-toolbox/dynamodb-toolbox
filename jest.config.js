module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(unit.test).+(ts|tsx|js)'],
  testPathIgnorePatterns: ['/__tests__/entities/*', '/__tests__/tables/*'],
  coveragePathIgnorePatterns: ['/__tests__/*'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '^v1/(.*)$': '<rootDir>/src/v1/$1'
  }
}
