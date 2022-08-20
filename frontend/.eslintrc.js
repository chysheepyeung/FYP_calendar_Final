module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'unused-imports', // Auto remove unused imports
    'sort-imports-es6-autofix', // Auto sort the import order
  ],
  settings: {
    react: {
      pragma: 'React',
      version: '17.0.1',
    },
  },
  rules: {
    // Conflict with unused-imports plugin
    'no-unused-vars': 'off',
    // Example setting of unused-imports plugin
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    // Conflict with sort-imports-es6 plugin
    'import/order': 'off',
    // Example setting of sort-imports-es6 plugin
    'sort-imports-es6-autofix/sort-imports-es6': [
      'warn',
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    // Suppress errors for missing 'import React' in files
    'react/react-in-jsx-scope': 'off',
    // Allow jsx syntax in js files (for next.js project)
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        shorthandLast: false,
        ignoreCase: false,
        noSortAlphabetically: false,
        reservedFirst: true,
      },
    ],
  },
};
