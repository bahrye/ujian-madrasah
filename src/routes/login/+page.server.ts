import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { verifyPassword, verifyQrLoginToken, createToken, COOKIE_NAME } from '$lib/server/auth';
import { recordActivityLog, getClientIp } from '$lib/server/activity-log';
import { ROLE_LABELS } from '$lib/utils/constants';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		const redirectRoute = locals.user.role === 'panitia' ? '/admin' : `/${locals.user.role}`;
		throw redirect(302, redirectRoute);
	}
};

export const actions: Actions = {
	default: async ({ request, platform, cookies, getClientAddress }) => {
		const formData = await request.formData();
		const qrUsername = formData.get('qr_username')?.toString().trim();
		const qrPassword = formData.get('qr_password')?.toString();
		const username = qrUsername || formData.get('username')?.toString().trim();
		const password = qrPassword || formData.get('password')?.toString();
		const qrToken = formData.get('qr_token')?.toString().trim();
		const loginPin = formData.get('login_pin')?.toString().trim();

		if (!username || (!password && !qrToken)) {
			return fail(400, { error: 'Username dan kata sandi wajib diisi.' });
		}

		try {
			const db = getDB(platform);

			const user = await db.prepare('SELECT * FROM users WHERE username = ? AND is_active = 1')
				.bind(username)
				.first<{
					id: number;
					school_id: number | null;
					class_id: number | null;
					username: string;
					password_hash: string;
					name: string;
					role: string;
					photo: string | null;
					login_pin?: string | null;
					is_logged_in?: number;
					session_token?: string | null;
					last_active_at?: string | null;
				}>();

			if (!user) {
				return fail(401, { error: 'Username atau kata sandi salah.' });
			}

			let valid = false;
			if (qrToken) {
				// Validasi Angka Rahasia (PIN 5 Digit) KHUSUS login via QR Code untuk Guru / Pengawas / Panitia
				if (user.role !== 'siswa' && user.login_pin && user.login_pin.trim().length > 0) {
					if (!loginPin || loginPin !== user.login_pin.trim()) {
						return fail(401, { error: 'Angka rahasia 5-digit tidak valid atau belum dimasukkan. Silakan minta angka rahasia kepada Admin.' });
					}
				}

				valid = await verifyQrLoginToken(user.id, user.username, user.password_hash, qrToken);
				if (!valid) {
					return fail(401, { error: 'Kode QR login tidak valid atau sudah kadaluarsa.' });
				}
			} else if (password) {
				// Login biasa menggunakan username & password dapat langsung masuk tanpa PIN
				valid = await verifyPassword(password, user.password_hash);
				if (!valid) {
					return fail(401, { error: 'Username atau kata sandi salah.' });
				}
			}

			let sessionToken: string | null = null;

			// Proteksi Login Siswa Multi-Perangkat (dengan toleransi 3 menit tidak ada aktivitas)
			if (user.role === 'siswa') {
				if (user.is_logged_in === 1 && user.last_active_at) {
					let inactiveSec = 9999;
					let lastActiveStr = String(user.last_active_at).trim();
					if (!lastActiveStr.includes('T')) {
						lastActiveStr = lastActiveStr.replace(' ', 'T') + 'Z';
					}
					const lastActiveMs = new Date(lastActiveStr).getTime();
					if (!isNaN(lastActiveMs)) {
						inactiveSec = Math.floor((Date.now() - lastActiveMs) / 1000);
					}

					// Jika aktivitas terakhir kurang dari 180 detik (3 menit)
					if (inactiveSec < 180) {
						const remainingSec = 180 - Math.max(0, inactiveSec);
						const remMin = Math.floor(remainingSec / 60);
						const remSec = remainingSec % 60;
						const timeStr = remMin > 0 ? `${remMin} menit ${remSec} detik` : `${remSec} detik`;

						return fail(400, {
							error: `Siswa atas nama "${user.name}" terdeteksi masih aktif di perangkat lain. Login di perangkat ini dapat diakses setelah 3 menit tidak ada aktivitas pada perangkat sebelumnya (${timeStr} lagi) atau silakan minta Pengawas Ruang untuk me-reset login.`
						});
					}
				}

				sessionToken = crypto.randomUUID();
				const userAgent = request.headers.get('user-agent') || 'Browser';
				const cleanDevice = userAgent.length > 120 ? userAgent.substring(0, 120) + '...' : userAgent;

				await db.prepare(`
					UPDATE users 
					SET is_logged_in = 1, session_token = ?, last_active_at = datetime('now'), login_device = ? 
					WHERE id = ?
				`).bind(sessionToken, cleanDevice, user.id).run();
			}

			const token = await createToken({
				id: user.id,
				school_id: user.school_id,
				class_id: user.class_id,
				username: user.username,
				name: user.name,
				role: user.role as 'superadmin' | 'admin' | 'guru' | 'pengawas' | 'siswa',
				photo: user.photo,
				session_token: sessionToken
			});

			cookies.set(COOKIE_NAME, token, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 8 // 8 jam
			});

			const ip = getClientIp(request, getClientAddress);
			const roleLabel = ROLE_LABELS[user.role] || user.role;
			await recordActivityLog(db, {
				schoolId: user.school_id,
				userId: user.id,
				userName: user.name,
				userRole: user.role,
				action: 'login',
				detail: `Masuk aplikasi sebagai ${roleLabel}`,
				ipAddress: ip
			});

			const redirectRoute = user.role === 'panitia' ? '/admin' : `/${user.role}`;
			throw redirect(302, redirectRoute);
		} catch (e) {
			if (e && typeof e === 'object' && 'status' in e && (e as { status: number }).status === 302) {
				throw e;
			}
			console.error('Login error:', e);
			return fail(500, { error: 'Terjadi kesalahan server. Silakan coba lagi.' });
		}
	}
};

