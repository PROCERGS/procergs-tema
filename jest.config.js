module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  // Pure-logic unit tests run standalone, without the full Volto core
  // checkout. Volto's own URL helpers rely on app-wide config (apiPath,
  // externalRoutes, etc.) which isn't available here, so they're mapped to a
  // small, deterministic stand-in used only for tests.
  moduleNameMapper: {
    '^@plone/volto/helpers/Url/Url$':
      '<rootDir>/src/testing/mocks/ploneVoltoUrl.js',
  },
};
