import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.ts',

		coverage: {
			provider: 'istanbul',
			reportsDirectory: 'coverage',
			reporter: ['text', 'lcov', 'json', 'html'],
			include: [
				'src/lib/**/*.{ts,svelte}',
				'src/routes/**/*.{ts,svelte}',
				'**/*.spec.ts',
				'**/__tests__/**',
				'**/*.test.ts'
			],
			exclude: [
				'node_modules/**',
				'.svelte-kit/**',
				'build/**',
				'dist/**',
				'coverage/**',
				'vite.config.*',
				'vitest.config.*',
				'**/*.svelte'
			]
		}
	}
});
