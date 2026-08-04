import { json } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { hashPassword, createToken, COOKIE_NAME } from '$lib/server/auth';

export const POST = async ({ request, platform, locals, cookies }: any) => {
	// Only allow admin
	if (!locals.user || locals.user.role !== 'admin') {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const db = getDB(platform);
	let data;
	try {
		data = await request.json();
	} catch (e) {
		return json({ error: 'Invalid JSON payload' }, { status: 400 });
	}

	const { name, username, password } = data;
	const id = locals.user.id;
	const schoolId = locals.user.school_id;

	if (!name || !username) {
		return json({ error: 'Nama dan Username wajib diisi.' }, { status: 400 });
	}

	// Check if username is already taken by someone else
	const existing = await db.prepare('SELECT id FROM users WHERE username = ? AND id != ?').bind(username, id).first();
	if (existing) {
		return json({ error: 'Username sudah digunakan oleh pengguna lain.' }, { status: 400 });
	}

	try {
		if (password && password.trim() !== '') {
			const passwordHash = await hashPassword(password);
			await db.prepare('UPDATE users SET name = ?, username = ?, password_hash = ?, updated_at = datetime(\'now\') WHERE id = ? AND school_id = ?')
				.bind(name, username, passwordHash, id, schoolId)
				.run();
		} else {
			await db.prepare('UPDATE users SET name = ?, username = ?, updated_at = datetime(\'now\') WHERE id = ? AND school_id = ?')
				.bind(name, username, id, schoolId)
				.run();
		}

		// Re-sign the JWT token with the new name and username
		const updatedUser = {
			...locals.user,
			name,
			username
		};
		const token = await createToken(updatedUser);
		cookies.set(COOKIE_NAME, token, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 60 * 60 * 8 // 8 hours
		});

		return json({ success: true, message: 'Profil berhasil diperbarui.' });
	} catch (e: any) {
		console.error('Update profile error:', e);
		return json({ error: 'Terjadi kesalahan saat memperbarui profil.' }, { status: 500 });
	}
};
