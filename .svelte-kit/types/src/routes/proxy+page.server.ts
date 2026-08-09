// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	if (locals.user) {
		const redirectRoute = locals.user.role === 'panitia' ? '/admin' : `/${locals.user.role}`;
		throw redirect(302, redirectRoute);
	}
	throw redirect(302, '/login');
};
