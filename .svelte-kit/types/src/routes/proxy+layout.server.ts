// @ts-nocheck
import type { LayoutServerLoad } from './$types';
import { getDB } from '$lib/server/db';

export const load = async ({ locals, platform }: Parameters<LayoutServerLoad>[0]) => {
	let userInfo = null;
	
	if (locals.user && platform) {
		const db = getDB(platform);
		if (locals.user.role === 'admin' && locals.user.school_id) {
			const school = await db.prepare('SELECT name FROM schools WHERE id = ?').bind(locals.user.school_id).first<{ name: string }>();
			userInfo = { school_name: school?.name };
		} else if (locals.user.role === 'siswa') {
			const student = await db.prepare('SELECT place_of_birth, date_of_birth FROM users WHERE id = ?').bind(locals.user.id).first<{ place_of_birth: string, date_of_birth: string }>();
			userInfo = { place_of_birth: student?.place_of_birth, date_of_birth: student?.date_of_birth };
		}
	}

	return {
		user: locals.user,
		userInfo
	};
};
