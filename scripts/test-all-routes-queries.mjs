import { getDB } from '../src/lib/server/db.ts';
import dotenv from 'dotenv';

dotenv.config();
const db = getDB();

async function runFullComprehensiveAudit() {
	console.log('=== FULL COMPREHENSIVE REPOSITORY AUDIT (ALL ROLES) ===\n');
	let totalPassed = 0;
	let totalFailed = 0;

	const schoolId = 2; // MTS TANUNTUNG
	const studentId = 36;
	const teacherId = 2;
	const proctorId = 3;
	const examId = 13;
	const typeId = 5;
	const classId = 5;

	const testCases = [
		// --- SUPERADMIN ---
		{
			name: '[Superadmin] Dashboard Schools',
			run: () => db.prepare('SELECT s.*, (SELECT COUNT(*) FROM users WHERE school_id = s.id) as user_count, (SELECT COUNT(*) FROM exams WHERE school_id = s.id) as exam_count FROM schools s ORDER BY s.created_at DESC').all()
		},
		{
			name: '[Superadmin] Admins List',
			run: () => db.prepare(`SELECT u.*, s.name as school_name FROM users u LEFT JOIN schools s ON u.school_id = s.id WHERE u.role = 'admin' ORDER BY u.created_at DESC`).all()
		},
		{
			name: '[Superadmin] Accounts List',
			run: () => db.prepare(`SELECT * FROM users WHERE role = 'superadmin' ORDER BY created_at DESC`).all()
		},

		// --- ADMIN ---
		{
			name: '[Admin] Dashboard Stats',
			run: () => Promise.all([
				db.prepare(`SELECT role, COUNT(*) as count FROM users WHERE school_id = ? GROUP BY role`).bind(schoolId).all(),
				db.prepare(`SELECT COUNT(*) as total, SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active FROM exams WHERE school_id = ?`).bind(schoolId).first(),
				db.prepare(`SELECT COUNT(*) as total, SUM(CASE WHEN status = 'mengerjakan' THEN 1 ELSE 0 END) as sedang_mengerjakan, SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai FROM student_attempts sa JOIN exams e ON sa.exam_id = e.id WHERE e.school_id = ?`).bind(schoolId).first()
			])
		},
		{
			name: '[Admin] /admin/exams (Types List)',
			run: () => db.prepare(`
				SELECT et.*, 
					(SELECT COUNT(*) FROM exams WHERE exam_type_id = et.id) as exam_count,
					(SELECT COUNT(u.id) FROM users u JOIN exam_type_classes etc ON etc.class_id = u.class_id WHERE etc.exam_type_id = et.id AND u.role = 'siswa' AND u.is_active = 1) as participant_count,
					(SELECT COUNT(*) FROM exam_type_proctors WHERE exam_type_id = et.id) as proctor_count,
					(SELECT GROUP_CONCAT(name, ', ') FROM (SELECT c.name FROM classes c JOIN exam_type_classes etc ON etc.class_id = c.id WHERE etc.exam_type_id = et.id ORDER BY c.name)) as class_names
				FROM exam_types et WHERE et.school_id = ? ORDER BY et.created_at DESC
			`).bind(schoolId).all()
		},
		{
			name: '[Admin] /admin/exams/type/[typeId] (Class Cards)',
			run: () => db.prepare(`
				SELECT c.id, c.name,
					(SELECT COUNT(*) FROM users WHERE class_id = c.id AND role = 'siswa' AND is_active = 1) as student_count,
					(SELECT COUNT(*) FROM exams e WHERE e.exam_type_id = ? AND e.school_id = ? AND (e.class_id = c.id OR (e.class_id IS NULL AND EXISTS (SELECT 1 FROM exam_participants ep JOIN users u ON ep.student_id = u.id WHERE ep.exam_id = e.id AND u.class_id = c.id)))) as exam_count
				FROM classes c
				INNER JOIN exam_type_classes etc ON etc.class_id = c.id
				WHERE etc.exam_type_id = ? AND c.school_id = ? ORDER BY c.name
			`).bind(typeId, schoolId, typeId, schoolId).all()
		},
		{
			name: '[Admin] /admin/exams/type/[typeId]/class/[classId]',
			run: () => db.prepare(`
				SELECT e.*, u.name as creator_name, s.name as subject_name, c.name as class_name, et.code as exam_type_code,
					(SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count,
					(SELECT COUNT(*) FROM exam_participants WHERE exam_id = e.id) as participant_count,
					(SELECT COUNT(*) FROM exam_teachers WHERE exam_id = e.id) as teacher_count,
					(SELECT COUNT(*) FROM exam_proctors WHERE exam_id = e.id) as proctor_count,
					(SELECT GROUP_CONCAT(u2.name, '||') FROM exam_proctors epr JOIN users u2 ON epr.proctor_id = u2.id WHERE epr.exam_id = e.id) as proctors
				FROM exams e
				LEFT JOIN users u ON e.created_by = u.id
				LEFT JOIN subjects s ON e.subject_id = s.id
				LEFT JOIN classes c ON e.class_id = c.id
				LEFT JOIN exam_types et ON e.exam_type_id = et.id
				WHERE e.school_id = ? AND e.exam_type_id = ? AND (e.class_id = ? OR e.class_id IS NULL)
				ORDER BY e.created_at DESC
			`).bind(schoolId, typeId, classId).all()
		},
		{
			name: '[Admin] /admin/exams/[id] (Detail & Settings)',
			run: () => Promise.all([
				db.prepare('SELECT e.*, s.name as subject_name, et.code as exam_type_code, et.name as exam_type_name, c.name as class_name FROM exams e LEFT JOIN subjects s ON e.subject_id = s.id LEFT JOIN exam_types et ON e.exam_type_id = et.id LEFT JOIN classes c ON e.class_id = c.id WHERE e.id = ? AND e.school_id = ?').bind(examId, schoolId).first(),
				db.prepare('SELECT * FROM questions WHERE exam_id = ? ORDER BY question_number').bind(examId).all(),
				db.prepare('SELECT * FROM exam_rooms WHERE exam_id = ? ORDER BY name').bind(examId).all(),
				db.prepare(`SELECT et.id as exam_teacher_id, u.id as user_id, u.name, u.username, et.room_id FROM exam_teachers et JOIN users u ON et.teacher_id = u.id WHERE et.exam_id = ? ORDER BY u.name`).bind(examId).all(),
				db.prepare(`SELECT ep.id as exam_proctor_id, u.id as user_id, u.name, u.username, ep.room_id, ep.sessions, COALESCE(ep.proctor_role, 'p1') as proctor_role FROM exam_proctors ep JOIN users u ON ep.proctor_id = u.id WHERE ep.exam_id = ? ORDER BY u.name`).bind(examId).all()
			])
		},
		{
			name: '[Admin] /admin/exams/[id]/analisis',
			run: () => db.prepare(`SELECT id, student_id, score FROM student_attempts WHERE exam_id = ? AND status IN ('selesai', 'waktu_habis') ORDER BY score DESC, id ASC`).bind(examId).all()
		},
		{
			name: '[Admin] /admin/tokens',
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
				WHERE t.school_id = ? ORDER BY t.created_at DESC
			`).bind(schoolId).all()
		},
		{
			name: '[Admin] /admin/users',
			run: () => db.prepare(`SELECT id, username, password_hash, name, nip, role, is_active, created_at, photo, login_pin FROM users WHERE school_id = ? AND role != 'siswa' AND role != 'superadmin' AND role != 'admin' ORDER BY created_at DESC`).bind(schoolId).all()
		},
		{
			name: '[Admin] /admin/students',
			run: () => db.prepare(`SELECT u.*, c.name as class_name FROM users u LEFT JOIN classes c ON u.class_id = c.id WHERE u.school_id = ? AND u.role = 'siswa' ORDER BY c.name ASC, u.name ASC`).bind(schoolId).all()
		},
		{
			name: '[Admin] /admin/bank-soal',
			run: () => db.prepare(`SELECT e.*, s.name as subject_name, et.code as exam_type_code, c.name as class_name, (SELECT COUNT(*) FROM questions WHERE exam_id = e.id) as question_count FROM exams e LEFT JOIN subjects s ON e.subject_id = s.id LEFT JOIN exam_types et ON e.exam_type_id = et.id LEFT JOIN classes c ON e.class_id = c.id WHERE e.school_id = ? ORDER BY e.created_at DESC`).bind(schoolId).all()
		},

		// --- GURU ---
		{
			name: '[Guru] Dashboard Stats',
			run: () => Promise.all([
				db.prepare('SELECT COUNT(*) as c FROM exams e WHERE e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))').bind(schoolId, teacherId, teacherId).first(),
				db.prepare('SELECT COUNT(*) as c FROM questions q JOIN exams e ON q.exam_id = e.id WHERE e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))').bind(schoolId, teacherId, teacherId).first()
			])
		},
		{
			name: '[Guru] /guru/bank-soal/[examId]/analisis',
			run: () => db.prepare(`SELECT id, student_id, score FROM student_attempts WHERE exam_id = ? AND status IN ('selesai', 'waktu_habis') ORDER BY score DESC, id ASC`).bind(examId).all()
		},

		// --- PENGAWAS ---
		{
			name: '[Pengawas] Dashboard',
			run: () => Promise.all([
				db.prepare('SELECT COUNT(*) as c FROM exams JOIN exam_types ON exams.exam_type_id = exam_types.id WHERE exams.is_active = 1 AND exam_types.is_active = 1 AND exams.school_id = ?').bind(schoolId).first(),
				db.prepare('SELECT COUNT(*) as c FROM tokens WHERE school_id = ?').bind(schoolId).first(),
				db.prepare("SELECT COUNT(*) as c FROM student_attempts sa JOIN exams e ON sa.exam_id = e.id WHERE sa.status = 'mengerjakan' AND e.school_id = ?").bind(schoolId).first()
			])
		},
		{
			name: '[Pengawas] /pengawas/tokens',
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
				WHERE e.school_id = ? ORDER BY t.created_at DESC
			`).bind(schoolId).all()
		},

		// --- SISWA ---
		{
			name: '[Siswa] /siswa/ujian (Daftar Ujian Siswa)',
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
			name: '[Siswa] /siswa/jadwal',
			run: () => db.prepare(`
				SELECT e.*, s.name as subject_name,
				(SELECT GROUP_CONCAT(u.name, '||') FROM exam_teachers et2 JOIN users u ON et2.teacher_id = u.id WHERE et2.exam_id = e.id) as teachers
				FROM exams e
				LEFT JOIN subjects s ON e.subject_id = s.id
				WHERE e.school_id = ?
			`).bind(schoolId).all()
		},

		// --- PRINT & EXPORT ---
		{
			name: '[Print] /print/kartu/[exam_id]',
			run: () => db.prepare(`SELECT u.*, c.name as class_name, e.title as exam_title, s.name as school_name FROM exam_participants ep JOIN users u ON ep.student_id = u.id LEFT JOIN classes c ON u.class_id = c.id JOIN exams e ON ep.exam_id = e.id JOIN schools s ON u.school_id = s.id WHERE ep.exam_id = ?`).bind(examId).all()
		},
		{
			name: '[Print] /print/kehadiran/[exam_id]',
			run: () => db.prepare(`SELECT ep.*, u.name as student_name, u.username, u.nisn, u.nomor_peserta, c.name as class_name FROM exam_participants ep JOIN users u ON ep.student_id = u.id LEFT JOIN classes c ON u.class_id = c.id WHERE ep.exam_id = ? ORDER BY u.name ASC`).bind(examId).all()
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
	console.log(`Audit Summary: ${totalPassed} PASSED, ${totalFailed} FAILED`);
	console.log(`================================`);

	if (totalFailed > 0) {
		process.exit(1);
	}
}

runFullComprehensiveAudit();
