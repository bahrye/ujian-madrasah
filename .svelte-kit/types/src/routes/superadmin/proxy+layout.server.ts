// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
	// Guard: Hanya bisa diakses oleh superadmin
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	if (locals.user.role !== 'superadmin') {
		// Arahkan ke dashboard sesuai role jika bukan superadmin
		throw redirect(302, `/${locals.user.role}`);
	}
	return {
		user: locals.user
	};
};
