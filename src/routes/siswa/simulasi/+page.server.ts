import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDB } from '$lib/server/db';
import { parseGradeAndJenjang, getSimulationQuestionsForStudent } from '$lib/data/simulationQuestions';

export const load: PageServerLoad = async ({ locals, platform }) => {
	if (!locals.user || locals.user.role !== 'siswa') {
		throw redirect(302, '/login');
	}

	let schoolName = '';
	let schoolJenjang: string | null = null;
	let className = '';
	let classLevel: string | null = null;

	try {
		const db = getDB(platform);
		const studentInfo = await db
			.prepare(
				`SELECT u.id, u.name, u.school_id, u.class_id,
				        c.name as class_name, c.level as class_level,
				        s.name as school_name, s.jenjang as school_jenjang, s.level as school_level
				 FROM users u
				 LEFT JOIN classes c ON u.class_id = c.id
				 LEFT JOIN schools s ON u.school_id = s.id
				 WHERE u.id = ?`
			)
			.bind(locals.user.id)
			.first<{
				id: number;
				name: string;
				school_id: number | null;
				class_id: number | null;
				class_name: string | null;
				class_level: string | null;
				school_name: string | null;
				school_jenjang: string | null;
				school_level: string | null;
			}>();

		if (studentInfo) {
			schoolName = studentInfo.school_name || '';
			schoolJenjang = studentInfo.school_jenjang || studentInfo.school_level || null;
			className = studentInfo.class_name || '';
			classLevel = studentInfo.class_level || null;
		}
	} catch (e) {
		console.warn('Failed to load student simulation info:', e);
	}

	const target = parseGradeAndJenjang(schoolJenjang, schoolName, classLevel, className);
	// Dapatkan bank soal khusus jenjang dan kelas siswa tersebut (misal: siswa kelas 7 tidak mendapat soal kelas 8/9)
	const questions = getSimulationQuestionsForStudent(target.jenjang, target.grade);

	return {
		user: locals.user,
		schoolName,
		schoolJenjang: target.jenjang,
		classGrade: target.grade,
		className: className || target.displayGrade,
		displayLevel: `${target.jenjang} ${target.displayGrade}`,
		questions
	};
};
