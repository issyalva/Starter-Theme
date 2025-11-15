import js from '@eslint/js';

export default [
  // Apply recommended rules to JavaScript files
  js.configs.recommended,

  {
    // Define which files to lint
    files: ['**/*.js', '**/*.liquid'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        fetch: 'readonly',

        // Shopify globals
        Shopify: 'readonly',
        theme: 'readonly',
        CartJS: 'readonly',
      },
    },

    rules: {
      // Customize rules here
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': 'off', // Allow console in themes
      'no-undef': 'error',
      'prefer-const': 'warn',
      'no-var': 'warn',
    },
  },

  {
    // Ignore patterns
    ignores: [
      'node_modules/**',
      '.shopify/**',
      'config/**',
      'locales/**',
      'templates/**/*.json',
      '*.config.js',
    ],
  },
];
