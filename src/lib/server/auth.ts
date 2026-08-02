import { SignJWT, jwtVerify } from 'jose';

// Secret key untuk JWT — di production, gunakan environment variable
const JWT_SECRET = new TextEncoder().encode('ujian-madrasah-jwt-secret-2024-ganti-di-production');

export const COOKIE_NAME = 'ujian_auth_token';

export interface UserPayload {
	id: number;
	school_id: number | null;
	username: string;
	name: string;
	role: 'superadmin' | 'admin' | 'guru' | 'pengawas' | 'siswa';
}

/**
 * Hash password menggunakan PBKDF2 (Web Crypto API — tersedia di Cloudflare Workers)
 */
export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const encoder = new TextEncoder();

	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	);

	const hash = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		keyMaterial,
		256
	);

	const saltHex = Array.from(salt)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	const hashHex = Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	return `${saltHex}:${hashHex}`;
}

/**
 * Verifikasi password terhadap hash yang tersimpan
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
	const [saltHex, expectedHashHex] = storedHash.split(':');
	if (!saltHex || !expectedHashHex) return false;

	const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)));
	const encoder = new TextEncoder();

	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		'PBKDF2',
		false,
		['deriveBits']
	);

	const hash = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		keyMaterial,
		256
	);

	const computedHex = Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	return computedHex === expectedHashHex;
}

/**
 * Buat JWT token untuk user yang sudah login
 */
export async function createToken(user: UserPayload): Promise<string> {
	return new SignJWT({ ...user })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('8h')
		.sign(JWT_SECRET);
}

/**
 * Verifikasi dan decode JWT token
 */
export async function verifyToken(token: string): Promise<UserPayload | null> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return {
			id: payload.id as number,
			school_id: payload.school_id as number | null,
			username: payload.username as string,
			name: payload.name as string,
			role: payload.role as UserPayload['role']
		};
	} catch {
		return null;
	}
}

/**
 * Generate random token code (untuk token ujian)
 */
export function generateTokenCode(length: number = 6): string {
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // tanpa O/0/1/I untuk menghindari kebingungan
	let result = '';
	const randomValues = crypto.getRandomValues(new Uint8Array(length));
	for (let i = 0; i < length; i++) {
		result += chars[randomValues[i] % chars.length];
	}
	return result;
}
