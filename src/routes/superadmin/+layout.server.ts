import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Guard: Hanya bisa diakses oleh superadmin
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	if (locals.user.role !== 'superadmin') {
		// Arahkan ke dashboard sesuai role jika bukan superadmin
		const redirectRoute = locals.user.role === 'panitia' ? '/admin' : `/${locals.user.role}`;
		throw redirect(302, redirectRoute);
	}
	return {
		user: locals.user
	};
};
