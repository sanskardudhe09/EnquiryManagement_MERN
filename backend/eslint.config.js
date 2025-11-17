// backend/eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '**/*.d.ts',
      '*.config.js',
      'jest.config.js',
      'coverage/**',
      '**/__tests__/**',
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
  },

  // JavaScript/TypeScript base configuration
  {
    files: ['**/*.js', '**/*.ts'],
    ignores: [
      '**/*.config.js',
      'jest.config.js',
      '**/__tests__/**',
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-var': 'error',
    },
  },

  // TypeScript specific configuration
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    ignores: [
      '**/*.config.js',
      'jest.config.js',
      '**/__tests__/**',
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/__tests__/**', '**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-var': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];
