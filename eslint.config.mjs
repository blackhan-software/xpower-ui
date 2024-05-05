import react from 'eslint-plugin-react/configs/recommended.js';
import typescript from 'typescript-eslint';

export default [
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': ['off'],
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
  },
  react, ...typescript.configs.recommended
];
