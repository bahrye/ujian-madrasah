import { getDB } from '../src/lib/server/db.ts';
import dotenv from 'dotenv';

dotenv.config();

async function testExam13Page() {
	const db = getDB();
	const examId = 13;
	const schoolId = 2; // MTS TANUNTUNG

	console.log('Testing /admin/exams/13 page load queries...');

	try {
		const exam = await db
			.prepare(
				'SELECT e.*, s.name as subject_name, et.code as exam_type_code, et.name as exam_type_name, c.name as class_name FROM exams e LEFT JOIN subjects s ON e.subject_id = s.id LEFT JOIN exam_types et ON e.exam_type_id = et.id LEFT JOIN classes c ON e.class_id = c.id WHERE e.id = ? AND e.school_id = ?'
			)
			.bind(examId, schoolId)
			.first();
		console.log('1. Exam query:', exam?.title);

		const questions = await db.prepare('SELECT * FROM questions WHERE exam_id = ? ORDER BY question_number').bind(examId).all();
		console.log('2. Questions count:', questions.results.length);

		const attempts = await db
			.prepare(
				`SELECT sa.*, u.name as student_name FROM student_attempts sa JOIN users u ON sa.student_id = u.id WHERE sa.exam_id = ? ORDER BY sa.created_at DESC`
			)
			.bind(examId)
			.all();
		console.log('3. Attempts count:', attempts.results.length);

		const tokens = await db.prepare('SELECT * FROM tokens WHERE exam_id = ? ORDER BY created_at DESC').bind(examId).all();
		console.log('4. Tokens count:', tokens.results.length);

		const examSessions = await db.prepare('SELECT * FROM exam_sessions WHERE exam_id = ? ORDER BY session_number').bind(examId).all();
		console.log('5. Sessions count:', examSessions.results.length);

		const examRooms = await db.prepare('SELECT * FROM exam_rooms WHERE exam_id = ? ORDER BY name').bind(examId).all();
		console.log('6. Rooms count:', examRooms.results.length);

		const participants = await db
			.prepare(
				`SELECT p.id as participant_id, u.id as user_id, u.name as student_name, u.username as nisn, c.name as class_name, u.session_number, p.room_id
				FROM exam_participants p
				JOIN users u ON p.student_id = u.id
				LEFT JOIN classes c ON u.class_id = c.id
				WHERE p.exam_id = ?
				ORDER BY c.name, u.name`
			)
			.bind(examId)
			.all();
		console.log('7. Participants count:', participants.results.length);

		const allTeachers = await db.prepare(`SELECT id, name, username FROM users WHERE school_id = ? AND role = 'guru' ORDER BY name`).bind(schoolId).all();
		console.log('8. All teachers count:', allTeachers.results.length);

		const examTeachers = await db
			.prepare(
				`SELECT et.id as exam_teacher_id, u.id as user_id, u.name, u.username, et.room_id
				FROM exam_teachers et
				JOIN users u ON et.teacher_id = u.id
				WHERE et.exam_id = ?
				ORDER BY u.name`
			)
			.bind(examId)
			.all();
		console.log('9. Exam teachers count:', examTeachers.results.length);

		const allProctors = await db.prepare(`SELECT id, name, username, role FROM users WHERE school_id = ? AND role IN ('pengawas', 'guru') ORDER BY role ASC, name ASC`).bind(schoolId).all();
		console.log('10. All proctors count:', allProctors.results.length);

		const examProctors = await db
			.prepare(
				`SELECT ep.id as exam_proctor_id, u.id as user_id, u.name, u.username, ep.room_id, ep.sessions, COALESCE(ep.proctor_role, 'p1') as proctor_role
				FROM exam_proctors ep
				JOIN users u ON ep.proctor_id = u.id
				WHERE ep.exam_id = ?
				ORDER BY u.name`
			)
			.bind(examId)
			.all();
		console.log('11. Exam proctors count:', examProctors.results.length);

		console.log('\n🎉 ALL /admin/exams/13 QUERIES PASSED WITH ZERO ERRORS!');
	} catch (err) {
		console.error('Error on /admin/exams/13 test:', err);
		process.exit(1);
	}
}

testExam13Page();
