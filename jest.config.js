module.exports = {
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '<rootDir>/__tests__/*.unit.test.js',
      ],
    },
    {
      displayName: 'dynalite',
      testMatch: [
        '<rootDir>/__tests__/*.dynalite.test.js',
      ],
      setupFiles: ['jest-date-mock'],
      globalSetup: '<rootDir>/__tests__/config/dynalite-global-setup.js',
      globalTeardown: '<rootDir>/__tests__/config/dynalite-global-teardown.js',
    },
  ],
}
