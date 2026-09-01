import { getDB } from '../src/lib/server/db.ts';
import dotenv from 'dotenv';

dotenv.config();
const db = getDB();

async function runComprehensiveTests() {
	console.log('=== COMPREHENSIVE REPO QUERY AUDIT ===\n');
	let totalPassed = 0;
	let totalFailed = 0;

	const schoolId = 1;
	const userId = 1;
	const examId = 13;
	const typeId = 1;
	const classId = 1;
	const attemptId = 1;

	const testCases = [
		{
			name: '1. /admin/exams',
			run: () => db.prepare(`
				SELECT et.*, 
					(SELECT COUNT(*) FROM exams WHERE exam_type_id = et.id) as exam_count,
					(SELECT COUNT(u.id) FROM users u JOIN exam_type_classes etc ON etc.class_id = u.class_id WHERE etc.exam_type_id = et.id AND u.role = 'siswa' AND u.is_active = 1) as participant_count,
					(SELECT COUNT(*) FROM exam_type_proctors WHERE exam_type_id = et.id) as proctor_count,
					(SELECT GROUP_CONCAT(name, ', ') FROM (SELECT c.name FROM classes c JOIN exam_type_classes etc ON etc.class_id = c.id WHERE etc.exam_type_id = et.id ORDER BY c.name)) as class_names,
					(SELECT GROUP_CONCAT(u.name, ', ') FROM exam_type_proctors etp JOIN users u ON etp.proctor_id = u.id WHERE etp.exam_type_id = et.id AND etp.proctor_role = 'pt') as proctor_names,
					(SELECT GROUP_CONCAT(u.name, ', ') FROM exam_type_proctors etp JOIN users u ON etp.proctor_id = u.id WHERE etp.exam_type_id = et.id AND etp.proctor_role = 'cm') as committee_names,
					(SELECT GROUP_CONCAT(u.name, ', ') FROM exam_type_proctors etp JOIN users u ON etp.proctor_id = u.id WHERE etp.exam_type_id = et.id AND etp.proctor_role IN ('p1', 'p2')) as supervisor_names
				FROM exam_types et
				WHERE et.school_id = ?
				ORDER BY et.created_at DESC
			`).bind(schoolId).all()
		},
		{
			name: '2. /admin/tokens',
			run: () => db.prepare(`
				SELECT t.*, e.title as exam_title, s.name as subject_name, et.code as exam_type_code, c.name as class_name,
				COALESCE((
					SELECT json_group_array(
						json_object(
							'id', u.id, 
							'name', u.name, 
							'username', u.username, 
							'start_time', sa.start_time
						)
					)
					FROM student_attempts sa
					JOIN users u ON sa.student_id = u.id
					WHERE sa.token_id = t.id
				), '[]') as used_by_students_json
				FROM tokens t 
				JOIN exams e ON t.exam_id = e.id
				LEFT JOIN subjects s ON e.subject_id = s.id
				LEFT JOIN exam_types et ON e.exam_type_id = et.id
				LEFT JOIN classes c ON e.class_id = c.id
				WHERE t.school_id = ?
				ORDER BY t.created_at DESC
			`).bind(schoolId).all()
		},
		{
			name: '3. /pengawas/tokens',
			run: () => db.prepare(`
				SELECT t.*, e.title as exam_title, s.name as subject_name, et.code as exam_type_code, c.name as class_name,
				COALESCE((
					SELECT json_group_array(
						json_object(
							'id', u.id, 
							'name', u.name, 
							'username', u.username, 
							'start_time', sa.start_time
						)
					)
					FROM student_attempts sa
					JOIN users u ON sa.student_id = u.id
					WHERE sa.token_id = t.id AND sa.status = 'mengerjakan'
				), '[]') as active_students_json
				FROM tokens t 
				JOIN exams e ON t.exam_id = e.id
				LEFT JOIN subjects s ON e.subject_id = s.id
				LEFT JOIN exam_types et ON e.exam_type_id = et.id
				LEFT JOIN classes c ON e.class_id = c.id
				WHERE e.school_id = ?
				ORDER BY t.created_at DESC
			`).bind(schoolId).all()
		},
		{
			name: '4. /admin/students',
			run: () => db.prepare(`
				SELECT u.*, c.name as class_name 
				FROM users u 
				LEFT JOIN classes c ON u.class_id = c.id 
				WHERE u.school_id = ? AND u.role = 'siswa'
				ORDER BY c.name ASC, u.name ASC
			`).bind(schoolId).all()
		},
		{
			name: '5. /admin/users',
			run: () => db.prepare(`
				SELECT id, username, password_hash, name, nip, role, is_active, created_at, photo, login_pin 
				FROM users 
				WHERE school_id = ? AND role != 'siswa' AND role != 'superadmin' AND role != 'admin'
				ORDER BY created_at DESC
			`).bind(schoolId).all()
		},
		{
			name: '6. /admin/classes',
			run: () => db.prepare(`
				SELECT c.*, COUNT(u.id) as student_count 
				FROM classes c 
				LEFT JOIN users u ON c.id = u.class_id 
				WHERE c.school_id = ? 
				GROUP BY c.id
			`).bind(schoolId).all()
		},
		{
			name: '7. /admin/subjects',
			run: () => db.prepare(`
				SELECT * FROM subjects WHERE school_id = ? ORDER BY name ASC
			`).bind(schoolId).all()
		},
		{
			name: '8. /admin/school-profile',
			run: () => db.prepare(`
				SELECT * FROM schools WHERE id = ?
			`).bind(schoolId).first()
		},
		{
			name: '9. /admin/monitor',
			run: () => db.prepare(`
				SELECT sa.*, u.name as student_name, u.username as student_username, 
				c.name as class_name, e.title as exam_title, e.duration_minutes
				FROM student_attempts sa
				JOIN users u ON sa.student_id = u.id
				LEFT JOIN classes c ON u.class_id = c.id
				JOIN exams e ON sa.exam_id = e.id
				WHERE u.school_id = ? AND sa.status = 'mengerjakan'
			`).bind(schoolId).all()
		},
		{
			name: '10. /admin/results',
			run: () => db.prepare(`
				SELECT sa.*, u.name as student_name, u.username as student_username,
				c.name as class_name, e.title as exam_title
				FROM student_attempts sa
				JOIN users u ON sa.student_id = u.id
				LEFT JOIN classes c ON u.class_id = c.id
				JOIN exams e ON sa.exam_id = e.id
				WHERE u.school_id = ? AND sa.status != 'mengerjakan'
				ORDER BY sa.created_at DESC
			`).bind(schoolId).all()
		},
		{
			name: '11. /guru/bank-soal',
			run: () => db.prepare(`
				SELECT e.*, s.name as subject_name, et.name as exam_type_name,
				(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count
				FROM exams e
				LEFT JOIN subjects s ON e.subject_id = s.id
				LEFT JOIN exam_types et ON e.exam_type_id = et.id
				WHERE e.school_id = ?
				ORDER BY e.created_at DESC
			`).bind(schoolId).all()
		},
		{
			name: '12. /guru/results',
			run: () => db.prepare(`
				SELECT sa.*, u.name as student_name, u.username as student_username,
				c.name as class_name, e.title as exam_title
				FROM student_attempts sa
				JOIN users u ON sa.student_id = u.id
				LEFT JOIN classes c ON u.class_id = c.id
				JOIN exams e ON sa.exam_id = e.id
				WHERE e.school_id = ?
			`).bind(schoolId).all()
		},
		{
			name: '13. /guru/penilaian',
			run: () => db.prepare(`
				SELECT sa.*, u.name as student_name, e.title as exam_title
				FROM student_attempts sa
				JOIN users u ON sa.student_id = u.id
				JOIN exams e ON sa.exam_id = e.id
				WHERE e.school_id = ?
			`).bind(schoolId).all()
		},
		{
			name: '14. /siswa/ujian',
			run: () => db.prepare(`
				SELECT e.*, s.name as subject_name, et.name as exam_type_name,
				(SELECT GROUP_CONCAT(u.name, '||') FROM exam_teachers et2 JOIN users u ON et2.teacher_id = u.id WHERE et2.exam_id = e.id) as teachers
				FROM exams e
				LEFT JOIN subjects s ON e.subject_id = s.id
				LEFT JOIN exam_types et ON e.exam_type_id = et.id
				WHERE e.school_id = ? AND e.is_active = 1
			`).bind(schoolId).all()
		},
		{
			name: '15. /siswa/jadwal',
			run: () => db.prepare(`
				SELECT e.*, s.name as subject_name,
				(SELECT GROUP_CONCAT(u.name, '||') FROM exam_teachers et2 JOIN users u ON et2.teacher_id = u.id WHERE et2.exam_id = e.id) as teachers
				FROM exams e
				LEFT JOIN subjects s ON e.subject_id = s.id
				WHERE e.school_id = ?
			`).bind(schoolId).all()
		},
		{
			name: '16. /siswa/papan-peringkat',
			run: () => db.prepare(`
				SELECT e.id, e.title, s.name as subject_name,
				COUNT(sa.id) as total_participants,
				AVG(sa.score) as avg_score
				FROM exams e
				LEFT JOIN subjects s ON e.subject_id = s.id
				LEFT JOIN student_attempts sa ON e.id = sa.exam_id AND sa.status != 'mengerjakan'
				WHERE e.school_id = ?
				GROUP BY e.id, s.name
			`).bind(schoolId).all()
		},
		{
			name: '17. /pengawas/jadwal/semua',
			run: () => db.prepare(`
				SELECT e.*, s.name as subject_name,
				(SELECT GROUP_CONCAT(u2.name, ', ') FROM exam_teachers et JOIN users u2 ON et.teacher_id = u2.id WHERE et.exam_id = e.id) as teacher_names,
				(SELECT GROUP_CONCAT(DISTINCT c2.name) FROM exam_type_classes etc JOIN classes c2 ON etc.class_id = c2.id WHERE etc.exam_type_id = e.exam_type_id) as class_names
				FROM exams e
				LEFT JOIN subjects s ON e.subject_id = s.id
				WHERE e.school_id = ?
			`).bind(schoolId).all()
		},
		{
			name: '18. /superadmin/schools',
			run: () => db.prepare(`
				SELECT s.*, 
				(SELECT COUNT(*) FROM users WHERE school_id = s.id) as user_count,
				(SELECT COUNT(*) FROM exams WHERE school_id = s.id) as exam_count
				FROM schools s
				ORDER BY s.created_at DESC
			`).all()
		},
		{
			name: '19. /superadmin/admins',
			run: () => db.prepare(`
				SELECT u.*, s.name as school_name 
				FROM users u 
				LEFT JOIN schools s ON u.school_id = s.id 
				WHERE u.role = 'admin'
				ORDER BY u.created_at DESC
			`).all()
		},
		{
			name: '20. /superadmin/accounts',
			run: () => db.prepare(`
				SELECT * FROM users WHERE role = 'superadmin' ORDER BY created_at DESC
			`).all()
		},
		{
			name: '21. /print/kartu/[exam_id]',
			run: () => db.prepare(`
				SELECT u.*, c.name as class_name, e.title as exam_title, s.name as school_name,
				(SELECT GROUP_CONCAT(u2.name, '||') FROM exam_teachers et JOIN users u2 ON et.teacher_id = u2.id WHERE et.exam_id = e.id) as teachers
				FROM exam_participants ep
				JOIN users u ON ep.student_id = u.id
				LEFT JOIN classes c ON u.class_id = c.id
				JOIN exams e ON ep.exam_id = e.id
				JOIN schools s ON u.school_id = s.id
				WHERE ep.exam_id = ?
			`).bind(examId).all()
		},
		{
			name: '22. /print/kehadiran/[exam_id]',
			run: () => db.prepare(`
				SELECT ep.*, u.name as student_name, u.username, u.nisn, u.nomor_peserta, c.name as class_name
				FROM exam_participants ep
				JOIN users u ON ep.student_id = u.id
				LEFT JOIN classes c ON u.class_id = c.id
				WHERE ep.exam_id = ?
				ORDER BY u.name ASC
			`).bind(examId).all()
		},
		{
			name: '23. /print/berita-acara/[exam_id]',
			run: () => db.prepare(`
				SELECT e.*, s.name as subject_name, sc.name as school_name
				FROM exams e
				LEFT JOIN subjects s ON e.subject_id = s.id
				JOIN schools sc ON e.school_id = sc.id
				WHERE e.id = ?
			`).bind(examId).first()
		},
		{
			name: '24. /print/jadwal-rekap/type/[typeId]',
			run: () => db.prepare(`
				SELECT e.*, s.name as subject_name,
				(SELECT GROUP_CONCAT(u2.name, '||') FROM exam_teachers et JOIN users u2 ON et.teacher_id = u2.id WHERE et.exam_id = e.id) as teachers
				FROM exams e
				LEFT JOIN subjects s ON e.subject_id = s.id
				WHERE e.exam_type_id = ?
			`).bind(typeId).all()
		},
		{
			name: '25. /api/monitor-live',
			run: () => db.prepare(`
				SELECT sa.id, sa.status, sa.start_time, sa.score, sa.violation_count,
				u.name as student_name, u.username, e.title as exam_title
				FROM student_attempts sa
				JOIN users u ON sa.student_id = u.id
				JOIN exams e ON sa.exam_id = e.id
				WHERE u.school_id = ? AND sa.status = 'mengerjakan'
			`).bind(schoolId).all()
		}
	];

	for (const tc of testCases) {
		try {
			await tc.run();
			console.log(`✓ PASS: ${tc.name}`);
			totalPassed++;
		} catch (err) {
			console.error(`✗ FAIL: ${tc.name}\n  Error: ${err.message}\n`);
			totalFailed++;
		}
	}

	console.log(`\n================================`);
	console.log(`Summary: ${totalPassed} PASSED, ${totalFailed} FAILED`);
	console.log(`================================`);

	if (totalFailed > 0) {
		process.exit(1);
	}
}

runComprehensiveTests();
