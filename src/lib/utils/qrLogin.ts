/**
 * Helper to generate and parse QR code data for student exam login.
 */

export interface QrLoginPayload {
	app?: string;
	u: string;
	p: string;
}

/**
 * Generate standardized QR payload string for a student
 */
export function generateStudentQrData(username: string, password?: string | null): string {
	const payload: QrLoginPayload = {
		app: 'ujian_madrasah',
		u: username ? String(username).trim() : '',
		p: password ? String(password).trim() : (username ? String(username).trim() : '')
	};
	return JSON.stringify(payload);
}

/**
 * Generate standard QR image URL using api.qrserver.com
 */
export function getQrCodeImageUrl(data: string, size = 150): string {
	return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

/**
 * Parse scanned QR text from various possible formats into username and password
 */
export function parseQrLoginData(rawText: string): { username: string; password: string } | null {
	if (!rawText || typeof rawText !== 'string') return null;
	const trimmed = rawText.trim();
	if (!trimmed) return null;

	// 1. Try parsing JSON format
	try {
		const parsed = JSON.parse(trimmed);
		if (parsed && typeof parsed === 'object') {
			const u = parsed.u || parsed.username || parsed.user || parsed.no_peserta || parsed.nomor_peserta;
			const p = parsed.p || parsed.password || parsed.pass || parsed.nisn;
			if (u) {
				return {
					username: String(u).trim(),
					password: p ? String(p).trim() : String(u).trim()
				};
			}
		}
	} catch {
		// Not JSON, continue to other formats
	}

	// 2. Try URL format (e.g. https://domain.com/login?u=xxx&p=yyy)
	if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.includes('?')) {
		try {
			const url = new URL(trimmed.startsWith('http') ? trimmed : `https://dummy.local/${trimmed}`);
			const u = url.searchParams.get('u') || url.searchParams.get('username') || url.searchParams.get('user');
			const p = url.searchParams.get('p') || url.searchParams.get('password') || url.searchParams.get('pass') || url.searchParams.get('nisn');
			if (u) {
				return {
					username: u.trim(),
					password: (p || u).trim()
				};
			}
		} catch {
			// URL parsing failed
		}
	}

	// 3. Try delimited formats: "UM:username:password" or "username:password" or "username|password"
	if (trimmed.startsWith('UM:') || trimmed.startsWith('um:')) {
		const parts = trimmed.substring(3).split(':');
		if (parts.length >= 2 && parts[0].trim()) {
			return {
				username: parts[0].trim(),
				password: parts.slice(1).join(':').trim()
			};
		}
	}

	// 4. Try multi-line key-value format (from old/printed cards)
	if (trimmed.includes('\n') || trimmed.includes('\r')) {
		const lines = trimmed.split(/\r?\n/);
		let foundUser = '';
		let foundPass = '';

		for (const line of lines) {
			const lower = line.toLowerCase();
			if (lower.startsWith('username:') || lower.startsWith('user:')) {
				foundUser = line.split(':')[1]?.trim() || '';
			} else if (lower.startsWith('password:') || lower.startsWith('pass:')) {
				foundPass = line.split(':')[1]?.trim() || '';
			} else if (lower.startsWith('no. peserta:') || lower.startsWith('nomor peserta:')) {
				if (!foundUser) foundUser = line.split(':')[1]?.trim() || '';
			} else if (lower.startsWith('nisn:')) {
				if (!foundPass) foundPass = line.split(':')[1]?.trim() || '';
				if (!foundUser && !foundPass) foundUser = foundPass;
			}
		}

		if (foundUser) {
			return {
				username: foundUser,
				password: foundPass || foundUser
			};
		}
	}

	// 5. Try single pipe "username|password"
	if (trimmed.includes('|')) {
		const parts = trimmed.split('|');
		if (parts.length === 2 && parts[0].trim()) {
			return {
				username: parts[0].trim(),
				password: parts[1].trim()
			};
		}
	}

	return null;
}
