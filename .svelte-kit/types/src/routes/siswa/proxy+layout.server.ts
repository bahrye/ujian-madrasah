// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
	if (!locals.user || locals.user.role !== 'siswa') throw redirect(302, '/login');
	return { user: locals.user };
};
