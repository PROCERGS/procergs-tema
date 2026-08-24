module.exports = {
  // Intentionally *not* `root: true`: when this repo is checked out inside
  // the sitebase-modelo monorepo (frontend/packages/procergs-tema), ESLint's
  // config cascade should still climb up and merge with the monorepo's own
  // frontend/.eslintrc.js (which wires up Volto addon import aliases etc.)
  // when linting is run from there. This config only matters on its own
  // when linting this repo standalone (e.g. in its own CI), where there is
  // no ancestor config to merge with anyway.
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  globals: {
    // Defined at build time by Razzle/webpack (Volto's build tooling).
    __SERVER__: 'readonly',
    __CLIENT__: 'readonly',
    __DEVELOPMENT__: 'readonly',
  },
  settings: {
    react: { version: '18.2' },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    // This repo is linted standalone, without the Volto core checkout that
    // resolves `@plone/volto/*` imports, so unresolved-import checking isn't
    // enabled here.
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
