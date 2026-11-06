import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      '@stylistic': stylistic,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...stylistic.configs.customize({
        quotes: 'single',
        semi: false,
        jsx: true,
        indent: 2,
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
        arrowParens: true,
      }).rules,
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/max-len': ['error', {
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      '@stylistic/operator-linebreak': ['error', 'after', {
        overrides: { '?': 'before', ':': 'before', '|': 'before' },
      }],
      // От порядка CSS зависит каскад: базовые стили первыми, стили компонентов последними
      'simple-import-sort/imports': ['error', {
        groups: [
          ['^\\u0000.*/index\\.css$'],
          ['^\\u0000(?!.*\\.css$)'],
          ['^@?\\w'],
          ['^\\.'],
          ['^\\u0000.*\\.css$'],
        ],
      }],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', {
        allowAny: false,
        allowBoolean: false,
        allowNever: false,
        allowNullish: false,
        allowNumber: true,
        allowRegExp: false,
      }],
      eqeqeq: 'error',
      'no-console': 'error',
    },
  },
])
