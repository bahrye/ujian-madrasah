import cloudflare from '@sveltejs/adapter-cloudflare';
import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import fs from 'node:fs';
import path from 'node:path';

// Toleransi untuk Windows local build:
// Pada Windows tanpa Developer Mode, fs.symlinkSync melempar EPERM.
// Kita coba buat junction absolut, atau fallback aman. Di Vercel production (Linux) berjalan native.
if (process.platform === 'win32') {
	const origSymlinkSync = fs.symlinkSync;
	fs.symlinkSync = function (target, dest, type) {
		try {
			return origSymlinkSync.call(fs, target, dest, type);
		} catch (err) {
			if (err && (err.code === 'EPERM' || err.code === 'EINVAL')) {
				try {
					const absTarget = path.isAbsolute(target) ? target : path.resolve(path.dirname(dest), target);
					return origSymlinkSync.call(fs, absTarget, dest, 'junction');
				} catch (err2) {
					// Abaikan symlink observability jika di Windows lokal, catchall func tetap menangani route
					return;
				}
			}
			throw err;
		}
	};
}

// Deteksi target deployment:
// Vercel secara otomatis menyetel process.env.VERCEL="1" saat build di cloud.
// Atau dapat ditentukan secara lokal via skrip build (ADAPTER=vercel).
const isVercel = Boolean(process.env.VERCEL || process.env.ADAPTER === 'vercel');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: isVercel
			? vercel({
					runtime: 'nodejs20.x',
					regions: ['sin1'],
					split: false,
					maxDuration: 15
			  })
			: cloudflare({
					routes: {
						include: ['/*'],
						exclude: ['<all>']
					}
			  })
	}
};

export default config;
