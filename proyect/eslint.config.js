import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    // Archivos ya convertidos a TypeScript: los cubre tsc en modo estricto
    // y aqui las reglas de React y las de TS.
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // El chequeo de variables sin usar lo hace tsc con noUnusedLocals.
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // El entrypoint monta la app sin exportar componentes: react-refresh no aplica.
    files: ['src/Client/main.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    // Scripts y tests corren en Node, no en el navegador.
    files: ['scripts/**/*.{js,mjs}', 'vitest.config.js', 'src/test/**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
