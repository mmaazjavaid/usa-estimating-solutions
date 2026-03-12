import next from '@next/eslint-plugin-next';
import tseslint from '@typescript-eslint/eslint-plugin';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'dist/**', 'build/**'],
  },
  ...tseslint.configs['flat/recommended'],
  next.configs['core-web-vitals'],
];
