import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['node_modules/**', 'dist/**', '.astro/**', '**/*.astro']
    },
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ['**/*.{ts,js,mjs}'],
        rules: {
            semi: ['error', 'always']
        }
    }
);
