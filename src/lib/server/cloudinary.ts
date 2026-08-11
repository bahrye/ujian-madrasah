export async function deleteFromCloudinary(url: string | null, env: Record<string, string | undefined> | any): Promise<{success: boolean, error?: string}> {
	if (!url || !url.includes('res.cloudinary.com')) return { success: false, error: 'Bukan URL Cloudinary valid' };

	const cloudName = (env.PUBLIC_CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME || 'dfhtjgwcz').trim();
	const apiKey = env.CLOUDINARY_API_KEY?.trim();
	const apiSecret = env.CLOUDINARY_API_SECRET?.trim();

	if (!apiKey || !apiSecret) {
		console.warn('Cloudinary API credentials missing. Skipping automatic deletion.');
		return { success: false, error: 'API Key atau Secret Cloudinary belum diatur di Cloudflare Pages (Environment Variables)' };
	}

	try {
		// Extract public_id correctly handling versions (v123456789) and folders
		const uploadSplit = url.split('/upload/');
		if (uploadSplit.length < 2) return { success: false, error: 'Format URL tidak dikenali' };
		
		let afterUpload = uploadSplit[1];
		// Remove version prefix if exists (e.g. v1722666666/)
		if (afterUpload.match(/^v\d+\//)) {
			afterUpload = afterUpload.replace(/^v\d+\//, '');
		}
		
		// Remove extension to get public_id
		const lastDotIndex = afterUpload.lastIndexOf('.');
		const publicId = lastDotIndex !== -1 ? afterUpload.substring(0, lastDotIndex) : afterUpload;

		// Cloudinary treats audio files as 'video' resource type for their API
		const resourceType = url.includes('/video/') ? 'video' : 'image';

		const timestamp = Math.round(new Date().getTime() / 1000).toString();
		const strToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;

		// Web Crypto API for SHA-1 (Compatible with Cloudflare Workers)
		const encoder = new TextEncoder();
		const data = encoder.encode(strToSign);
		const hashBuffer = await crypto.subtle.digest('SHA-1', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

		const formData = new FormData();
		formData.append('public_id', publicId);
		formData.append('api_key', apiKey);
		formData.append('timestamp', timestamp);
		formData.append('signature', signature);

		const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
			method: 'POST',
			body: formData
		});
		
		const result = (await res.json()) as any;
		console.log('Cloudinary Destroy Result:', result);
		
		if (result.result === 'ok' || result.result === 'not found') {
			return { success: true };
		} else {
			return { success: false, error: result.error?.message || result.result || 'Unknown error' };
		}
	} catch (err: any) {
		console.error('Failed to delete from Cloudinary:', err);
		return { success: false, error: err.message || 'Kesalahan koneksi ke Cloudinary API' };
	}
}

export async function uploadToCloudinary(base64Image: string, env: Record<string, string | undefined> | any): Promise<{success: boolean, url?: string, error?: string}> {
	const cloudName = (env.PUBLIC_CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME || 'dfhtjgwcz').trim();
	const apiKey = env.CLOUDINARY_API_KEY?.trim();
	const apiSecret = env.CLOUDINARY_API_SECRET?.trim();

	if (!cloudName || !apiKey || !apiSecret) {
		const missing = [];
		if (!cloudName) missing.push('CLOUD_NAME');
		if (!apiKey) missing.push('API_KEY');
		if (!apiSecret) missing.push('API_SECRET');
		return { success: false, error: `Kredensial Cloudinary belum lengkap: ${missing.join(', ')}` };
	}

	try {
		const timestamp = Math.round(new Date().getTime() / 1000).toString();
		const folder = 'ujian_signatures';
		
		const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
		const encoder = new TextEncoder();
		const data = encoder.encode(strToSign);
		const hashBuffer = await crypto.subtle.digest('SHA-1', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

		const formData = new FormData();
		formData.append('file', base64Image);
		formData.append('api_key', apiKey);
		formData.append('timestamp', timestamp);
		formData.append('signature', signature);
		formData.append('folder', folder);

		const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
			method: 'POST',
			body: formData
		});

		const result = await res.json() as any;
		if (result.secure_url) {
			return { success: true, url: result.secure_url };
		} else {
			return { success: false, error: result.error?.message || 'Upload failed' };
		}
	} catch (e: any) {
		return { success: false, error: e.message };
	}
}
