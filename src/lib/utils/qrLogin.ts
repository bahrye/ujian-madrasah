/**
 * Helper to generate and parse QR code data for student and staff exam login.
 */

export interface QrLoginPayload {
	app?: string;
	u: string;
	p?: string;
	token?: string;
}

export interface ParsedQrLogin {
	username: string;
	password?: string;
	qrToken?: string;
}

/**
 * Generate standardized QR payload string for a user (student or staff)
 */
export function generateStudentQrData(username: string, password?: string | null, qrToken?: string | null): string {
	const payload: QrLoginPayload = {
		app: 'ujian_madrasah',
		u: username ? String(username).trim() : ''
	};
	if (qrToken && String(qrToken).trim()) {
		payload.token = String(qrToken).trim();
	}
	if (password && String(password).trim()) {
		payload.p = String(password).trim();
	}
	return JSON.stringify(payload);
}

/**
 * Generate standard QR image URL using api.qrserver.com
 */
export function getQrCodeImageUrl(data: string, size = 150): string {
	return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

/**
 * Parse scanned QR text from various possible formats into username, password, and/or qrToken
 */
export function parseQrLoginData(rawText: string): ParsedQrLogin | null {
	if (!rawText || typeof rawText !== 'string') return null;
	const trimmed = rawText.trim();
	if (!trimmed) return null;

	// 1. Try parsing JSON format
	try {
		const parsed = JSON.parse(trimmed);
		if (parsed && typeof parsed === 'object') {
			const u = parsed.u || parsed.username || parsed.user || parsed.no_peserta || parsed.nomor_peserta;
			const p = parsed.p || parsed.password || parsed.pass || parsed.nisn;
			const token = parsed.token || parsed.qr_token || parsed.qrl;

			if (u) {
				const result: ParsedQrLogin = {
					username: String(u).trim()
				};
				if (token) result.qrToken = String(token).trim();
				if (p) result.password = String(p).trim();
				if (!p && !token) result.password = String(u).trim();
				return result;
			}
		}
	} catch {
		// Not JSON, continue to other formats
	}

	// 2. Try URL format (e.g. https://domain.com/login?u=xxx&token=yyy or &p=zzz)
	if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.includes('?')) {
		try {
			const url = new URL(trimmed.startsWith('http') ? trimmed : `https://dummy.local/${trimmed}`);
			const u = url.searchParams.get('u') || url.searchParams.get('username') || url.searchParams.get('user');
			const p = url.searchParams.get('p') || url.searchParams.get('password') || url.searchParams.get('pass') || url.searchParams.get('nisn');
			const token = url.searchParams.get('token') || url.searchParams.get('qr_token');

			if (u) {
				const result: ParsedQrLogin = {
					username: u.trim()
				};
				if (token) result.qrToken = token.trim();
				if (p) result.password = p.trim();
				if (!p && !token) result.password = u.trim();
				return result;
			}
		} catch {
			// URL parsing failed
		}
	}

	// 3. Try QRL token directly: "QRL_123_abc..." or "username:QRL_..."
	if (trimmed.startsWith('QRL_')) {
		const parts = trimmed.split('_');
		if (parts.length >= 3) {
			return {
				username: '', // Needs lookup by token or username
				qrToken: trimmed
			};
		}
	}

	// 4. Try delimited formats: "UM:username:token_or_password" or "username:password" or "username|password"
	if (trimmed.startsWith('UM:') || trimmed.startsWith('um:')) {
		const parts = trimmed.substring(3).split(':');
		if (parts.length >= 2 && parts[0].trim()) {
			const sec = parts.slice(1).join(':').trim();
			if (sec.startsWith('QRL_')) {
				return { username: parts[0].trim(), qrToken: sec };
			}
			return { username: parts[0].trim(), password: sec };
		}
	}

	// 5. Try multi-line key-value format (from old/printed cards)
	if (trimmed.includes('\n') || trimmed.includes('\r')) {
		const lines = trimmed.split(/\r?\n/);
		let foundUser = '';
		let foundPass = '';
		let foundToken = '';

		for (const line of lines) {
			const lower = line.toLowerCase();
			if (lower.startsWith('username:') || lower.startsWith('user:')) {
				foundUser = line.split(':')[1]?.trim() || '';
			} else if (lower.startsWith('token:') || lower.startsWith('qr_token:')) {
				foundToken = line.split(':')[1]?.trim() || '';
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
			const result: ParsedQrLogin = { username: foundUser };
			if (foundToken) result.qrToken = foundToken;
			if (foundPass) result.password = foundPass;
			if (!foundPass && !foundToken) result.password = foundUser;
			return result;
		}
	}

	// 6. Try single pipe "username|password"
	if (trimmed.includes('|')) {
		const parts = trimmed.split('|');
		if (parts.length === 2 && parts[0].trim()) {
			const sec = parts[1].trim();
			if (sec.startsWith('QRL_')) {
				return { username: parts[0].trim(), qrToken: sec };
			}
			return { username: parts[0].trim(), password: sec };
		}
	}

	return null;
}
