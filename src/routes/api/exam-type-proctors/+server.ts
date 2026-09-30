import { json } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, platform, locals }) => {
	if (!locals.user || !['admin', 'panitia', 'guru', 'pengawas', 'superadmin'].includes(locals.user.role)) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	const db = getDB(platform);

	const examTypeIdStr = url.searchParams.get('exam_type_id');
	const examTypeId = parseInt(examTypeIdStr || '', 10);
	if (isNaN(examTypeId)) return json({ error: 'Invalid ID' }, { status: 400 });

	if (locals.user.role !== 'superadmin') {
		const typeCheck = await db.prepare('SELECT id FROM exam_types WHERE id = ? AND school_id = ?')
			.bind(examTypeId, locals.user.school_id)
			.first();
		if (!typeCheck) {
			return json({ proctors: [] });
		}
	}

	const proctors = await db.prepare(`
		SELECT etp.id, etp.exam_type_id, etp.proctor_id, COALESCE(etp.proctor_role, 'pt') as proctor_role, u.name, u.nip, u.role as user_role
		FROM exam_type_proctors etp
		JOIN users u ON etp.proctor_id = u.id
		WHERE etp.exam_type_id = ?
		ORDER BY etp.id ASC
	`).bind(examTypeId).all();

	return json({ proctors: proctors.results || [] });
};
