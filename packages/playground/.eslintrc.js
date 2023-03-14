module.exports = {
  env: {
    browser: true,
    node: true,
    mocha: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  
  // ! ADD THIS BACK AFTER MERGING YARN 3
  // plugins: ['@typescript-eslint'],
  // extends: [
  //   'eslint:recommended',
  //   'plugin:prettier/recommended',
  //   'plugin:react/recommended',
  //   'plugin:import/recommended',
  //   'plugin:jsx-a11y/recommended',
  //   'eslint-config-prettier',
  // ],
  ignorePatterns: ['versionLogger.js', 'standaloneValidateCode.js'],
  rules: {
    'prop-types': 'off',
  },
};
