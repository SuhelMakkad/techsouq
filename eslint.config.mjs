import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import astro from 'eslint-plugin-astro';

import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/**', '.astro/**', 'node_modules/**', 'coverage/**']),
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.{ts,mts,cts,astro}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },

  // Restore Astro's parser after TypeScript's presets, including client scripts.
  astro.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: {
      'no-undef': 'off',
    },
  },

  prettier,
);
