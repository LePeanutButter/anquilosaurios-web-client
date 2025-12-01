import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.ts',

		coverage: {
			provider: 'istanbul',
			reportsDirectory: 'coverage',
			reporter: ['text', 'lcov', 'json', 'html'],
			include: ['src/lib/**/*.{ts,svelte}', 'src/routes/**/*.{ts,svelte}'],
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
