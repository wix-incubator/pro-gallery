module.exports = {
  extends: ['./eslintConfig.js'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      plugins: ['prettier', '@typescript-eslint'],
      extends: ['./eslintConfig.js'],
    },
  ],
};
