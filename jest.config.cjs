module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(unit.test).+(ts|tsx|js)'],
  testPathIgnorePatterns: ['/__tests__/entities/*', '/__tests__/tables/*'],
  coveragePathIgnorePatterns: ['/__tests__/*'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^v1/(.*)\\.js$$': '<rootDir>/src/v1/$1',
    v1: '<rootDir>/src/v1'
  },
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { useESM: true }]
  }
}
