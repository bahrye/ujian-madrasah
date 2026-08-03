export async function deleteFromCloudinary(url: string | null, env: Record<string, string | undefined> | any): Promise<boolean> {
	if (!url || !url.includes('res.cloudinary.com')) return false;

	const cloudName = env.PUBLIC_CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME || 'dfhtjgwcz';
	const apiKey = env.CLOUDINARY_API_KEY;
	const apiSecret = env.CLOUDINARY_API_SECRET;

	if (!apiKey || !apiSecret) {
		console.warn('Cloudinary API credentials missing. Skipping automatic deletion.');
		return false;
	}

	try {
		// Extract public_id correctly handling versions (v123456789) and folders
		const uploadSplit = url.split('/upload/');
		if (uploadSplit.length < 2) return false;
		
		let afterUpload = uploadSplit[1];
		// Remove version prefix if exists (e.g. v1722666666/)
		if (afterUpload.match(/^v\d+\//)) {
			afterUpload = afterUpload.replace(/^v\d+\//, '');
		}
		
		// Remove extension to get public_id
		const lastDotIndex = afterUpload.lastIndexOf('.');
		const publicId = lastDotIndex !== -1 ? afterUpload.substring(0, lastDotIndex) : afterUpload;

		// Cloudinary treats audio files as 'video' resource type for their API
		const resourceType = url.match(/\.(mp3|wav|ogg|m4a)$/i) ? 'video' : 'image';

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
		
		const result = (await res.json()) as { result: string };
		console.log('Cloudinary Destroy Result:', result);
		return result.result === 'ok' || result.result === 'not found';
	} catch (err) {
		console.error('Failed to delete from Cloudinary:', err);
		return false;
	}
}
