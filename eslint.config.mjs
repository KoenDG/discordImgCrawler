import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	...compat.extends('eslint:all', 'prettier'),
	{
		plugins: {
			prettier,
		},

		languageOptions: {
			globals: {
				...globals.node,
				Atomics: 'readonly',
				SharedArrayBuffer: 'readonly',
				document: 'readonly',
				window: 'readonly',
				navigator: 'readonly',
				location: 'readonly',
			},

			ecmaVersion: 2024,
			sourceType: 'module',
		},

		rules: {
			'arrow-body-style': ['error', 'always'],
			camelcase: 'off',
			'capitalized-comments': 'off',
			eqeqeq: ['error', 'always'],
			'id-length': 'off',
			'init-declarations': 'off',

			indent: [
				'error',
				'tab',
				{
					SwitchCase: 1,
				},
			],

			'line-comment-position': 'off',
			'linebreak-style': ['error', 'unix'],
			'max-depth': ['error', 6],
			'max-lines-per-function': 'off',
			'max-lines': 'off',
			'max-params': 'off',
			'max-statements': 'off',
			'multiline-comment-style': ['error', 'starred-block'],
			'no-await-in-loop': 'off',
			'no-console': 'off',
			'no-continue': 'off',
			'no-constant-binary-expression': 'error',
			'no-else-return': 'off',
			'no-empty-function': 'off',
			'no-inline-comments': 'off',
			'no-magic-numbers': 'off',
			'no-lonely-if': 'off',
			'no-ternary': 'off',
			'no-underscore-dangle': 'off',
			'no-useless-escape': 'off',
			'one-var': 'off',

			'prefer-destructuring': [
				'error',
				{
					object: true,
					array: false,
				},
			],

			'prefer-named-capture-group': 'off',

			'prettier/prettier': 'error',
			quotes: ['error', 'single'],
			'require-await': 'off',
			semi: ['error', 'always'],
			'sort-keys': 'off',
			'sort-imports': 'off',
		},
	},
];
