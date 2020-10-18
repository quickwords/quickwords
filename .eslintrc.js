module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    es6: true,
    node: true,
    'jest/globals': true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['src/**/*.ts', '*.config.ts'],
      parser: '@typescript-eslint/parser',
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
      plugins: ['@typescript-eslint', 'jest'],
      rules: {
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'prettier/prettier': [
          'warn',
          {
            parser: 'typescript',
            printWidth: 120,
            trailingComma: 'es5',
            semi: false,
            singleQuote: true,
            arrowParens: 'always',
          },
        ],
      },
    },
  ],
  rules: {
    'array-callback-return': 'warn',
    'consistent-return': 'warn',
    'linebreak-style': ['warn', 'unix'],
    'lines-between-class-members': ['warn', 'always'],
    'no-template-curly-in-string': 'warn',
    'prettier/prettier': [
      'warn',
      {
        parser: 'typescript',
        printWidth: 120,
        trailingComma: 'es5',
        semi: false,
        singleQuote: true,
        arrowParens: 'always',
      },
    ],
  },
}
