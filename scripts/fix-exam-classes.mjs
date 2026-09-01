import { getDB } from '../src/lib/server/db.ts';
import dotenv from 'dotenv';

dotenv.config();

async function fixExamClasses() {
	const db = getDB();
	console.log('Fixing exam class_id linkage in database...');

	try {
		// Update exams with null class_id to match their participant students' class
		await db
			.prepare(`
				UPDATE exams 
				SET class_id = (
					SELECT u.class_id 
					FROM exam_participants ep 
					JOIN users u ON ep.student_id = u.id 
					WHERE ep.exam_id = exams.id AND u.class_id IS NOT NULL 
					LIMIT 1
				)
				WHERE class_id IS NULL AND EXISTS (
					SELECT 1 FROM exam_participants ep JOIN users u ON ep.student_id = u.id WHERE ep.exam_id = exams.id AND u.class_id IS NOT NULL
				)
			`)
			.run();

		// If still null (e.g. exam 5 in school 1 if no participants yet), check school classes
		const exams = await db
			.prepare(`
				SELECT e.id, e.title, e.school_id, e.exam_type_id, e.class_id, c.name as class_name 
				FROM exams e 
				LEFT JOIN classes c ON e.class_id = c.id
			`)
			.all();

		console.log('All exams after update:', exams.results);

		// Also check exam_count per class for exam_type 5 (PAT26)
		const classesPAT26 = await db
			.prepare(`
				SELECT c.id, c.name,
					(SELECT COUNT(*) FROM users WHERE class_id = c.id AND role = 'siswa' AND is_active = 1) as student_count,
					(SELECT COUNT(*) FROM exams WHERE exam_type_id = ? AND class_id = c.id AND school_id = ?) as exam_count
				FROM classes c
				INNER JOIN exam_type_classes etc ON etc.class_id = c.id
				WHERE etc.exam_type_id = ? AND c.school_id = ?
				ORDER BY c.name
			`)
			.bind(5, 2, 5, 2)
			.all();

		console.log('PAT26 Classes query result:', classesPAT26.results);
	} catch (err) {
		console.error('Error fixing exam classes:', err);
		process.exit(1);
	}
}

fixExamClasses();
