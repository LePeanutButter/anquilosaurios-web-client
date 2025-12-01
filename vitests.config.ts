import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',

		coverage: {
			provider: 'istanbul',
			reportsDirectory: 'coverage',
			reporter: ['lcov', 'json', 'text', 'html'],

			exclude: [
				'node_modules/**',
				'.svelte-kit/**',
				'build/**',
				'dist/**',
				'coverage/**',
				'vite.config.*',
				'vitest.config.*'
			]
		}
	}
});
