import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const targetUrl = url.searchParams.get('url');
	if (!targetUrl) {
		throw error(400, 'Missing url parameter');
	}

	try {
		const parsedUrl = new URL(targetUrl);
		if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
			throw error(400, 'Invalid protocol');
		}

		// Whitelist trusted media domains to prevent open proxy exploitation
		const hostname = parsedUrl.hostname.toLowerCase();
		const isCloudinary = hostname === 'res.cloudinary.com' || hostname.endsWith('.cloudinary.com');
		
		if (!isCloudinary) {
			// Cegah SSRF terhadap private / internal network dan batasi domain
			if (
				hostname === 'localhost' ||
				hostname === '127.0.0.1' ||
				hostname === '::1' ||
				hostname.startsWith('10.') ||
				hostname.startsWith('192.168.') ||
				hostname.startsWith('172.') ||
				hostname.startsWith('169.254.') ||
				hostname.endsWith('.internal') ||
				hostname.endsWith('.local')
			) {
				throw error(403, 'Access to internal network is forbidden');
			}

			// Hanya izinkan domain HTTPS publik
			if (parsedUrl.protocol !== 'https:') {
				throw error(403, 'Only HTTPS media proxying is supported');
			}
		}
		// Fetch target URL. Cloudflare fetch follows redirects automatically up to a limit.
		const response = await fetch(targetUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
			}
		});

		if (!response.ok) {
			const text = await response.text();
			return new Response(`Upstream error: ${response.status} ${response.statusText}\n\n${text}`, {
				status: response.status,
				headers: { 'Content-Type': 'text/plain' }
			});
		}

		// Create clean headers to bypass CORP/CORS issues from the origin
		const headers = new Headers();
		headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
		headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
		headers.set('Access-Control-Allow-Origin', '*');
		headers.set('Cross-Origin-Resource-Policy', 'cross-origin'); // Explicitly allow cross-origin

		const contentLength = response.headers.get('Content-Length');
		if (contentLength) {
			headers.set('Content-Length', contentLength);
		}

		// Return the stream directly
		return new Response(response.body, {
			status: 200,
			headers
		});
	} catch (err: any) {
		console.error('Proxy Error:', err);
		return new Response(`Proxy Error: ${err.message}`, { status: 500 });
	}
};
