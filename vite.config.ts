import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv, type UserConfigExport, type ConfigEnv } from 'vite';

export default ({ mode }: ConfigEnv) => {
	const env = loadEnv(mode, process.cwd(), 'VITE_');

	return defineConfig({
		plugins: [sveltekit(), devtoolsJson()],
		server: {
			proxy: {
				'/game': {
					target: env.VITE_AZURE_GAME_URL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/game/, '/')
				}
			}
		}
	}) as UserConfigExport;
};
