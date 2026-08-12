import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['leetcode/**/*.test.js'],
        exclude: ['**/node_modules/**'],
        onStackTrace: (_error, { file }) => !file.includes('_harness.js'),
    },
});
