import { SignJWT, jwtVerify } from 'jose';
import { env } from '$env/dynamic/private';

// Secret key untuk JWT — gunakan environment variable JWT_SECRET jika tersedia
export function getJwtSecret(): Uint8Array {
	const secret = env.JWT_SECRET || (typeof process !== 'undefined' ? process.env?.JWT_SECRET : undefined);
	if (!secret) {
		if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
			throw new Error('JWT_SECRET environment variable is required in production!');
		}
		return new TextEncoder().encode('ujian-madrasah-dev-secret-only-change-in-production');
	}
	return new TextEncoder().encode(secret);
}

export const COOKIE_NAME = 'ujian_auth_token';

export interface UserPayload {
	id: number;
	school_id: number | null;
	username: string;
	name: string;
	role: 'superadmin' | 'admin' | 'guru' | 'pengawas' | 'siswa' | 'panitia';
	class_id?: number | null;
	photo?: string | null;
	session_token?: string | null;
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
		.sign(getJwtSecret());
}

/**
 * Verifikasi dan decode JWT token
 */
export async function verifyToken(token: string): Promise<UserPayload | null> {
	try {
		const { payload } = await jwtVerify(token, getJwtSecret());
		return {
			id: payload.id as number,
			school_id: payload.school_id as number | null,
			username: payload.username as string,
			name: payload.name as string,
			role: payload.role as UserPayload['role'],
			class_id: payload.class_id as number | null | undefined,
			photo: payload.photo as string | null | undefined,
			session_token: payload.session_token as string | null | undefined
		};
	} catch {
		return null;
	}
}

/**
 * Tanda tangani cookie verifikasi token ujian untuk mencegah bypass manual dari konsol browser
 */
export async function signExamToken(attemptId: number | string, studentId: number): Promise<string> {
	const data = new TextEncoder().encode(`exam_attempt_${attemptId}_student_${studentId}`);
	const key = await crypto.subtle.importKey('raw', getJwtSecret() as any, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	const signature = await crypto.subtle.sign('HMAC', key, data as any);
	const sigHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
	return `${attemptId}:${sigHex}`;
}

export async function verifyExamTokenSignature(signedValue: string | undefined, attemptId: number | string, studentId: number): Promise<boolean> {
	if (!signedValue) return false;
	const expected = await signExamToken(attemptId, studentId);
	return signedValue === expected;
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

/**
 * Buat QR Login Secret Token berbasis HMAC SHA-256 yang aman.
 * Token ini hanya bisa digunakan untuk login via Scan QR dan otomatis ditolak jika diketik di kotak kata sandi biasa.
 */
export async function createQrLoginToken(userId: number, username: string, passwordHash: string): Promise<string> {
	const data = new TextEncoder().encode(`qr_login_user_${userId}_${username}_${passwordHash}`);
	const key = await crypto.subtle.importKey('raw', getJwtSecret() as any, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	const signature = await crypto.subtle.sign('HMAC', key, data as any);
	const sigHex = Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, '0')).join('');
	return `QRL_${userId}_${sigHex.slice(0, 32)}`;
}

/**
 * Verifikasi QR Login Token
 */
export async function verifyQrLoginToken(userId: number, username: string, passwordHash: string, qrToken: string): Promise<boolean> {
	if (!qrToken || typeof qrToken !== 'string' || !qrToken.startsWith('QRL_')) return false;
	const expected = await createQrLoginToken(userId, username, passwordHash);
	return qrToken === expected;
}

/**
 * Generate random 5-digit PIN untuk keamanan akun guru/pengawas/panitia
 */
export function generate5DigitPin(): string {
	const val = Math.floor(10000 + Math.random() * 90000);
	return String(val);
}


