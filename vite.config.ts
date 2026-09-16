import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		sourcemap: false
	},
	ssr: {
		external: ['html5-qrcode', 'katex']
	}
});
