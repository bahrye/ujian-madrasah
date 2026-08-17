import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';
import * as xlsx from 'xlsx';
import { formatExamTitle } from '$lib/utils/exam';

export const GET: RequestHandler = async ({ params, platform, locals }) => {
	if (!locals.user || !['superadmin', 'admin', 'guru', 'panitia'].includes(locals.user.role)) {
		throw error(401, 'Unauthorized');
	}

	const db = getDB(platform);
	const examId = parseInt(params.examId, 10);
	if (isNaN(examId)) throw error(400, 'ID Ujian tidak valid');

	// Verify exam
	let exam: any = null;
	if (locals.user.role === 'superadmin') {
		exam = await db.prepare(`
			SELECT e.*, s.name as subject_name, et.code as exam_type_code, c.name as class_name, c.level as class_level,
			       sch.name as school_name, u.name as teacher_name
			FROM exams e
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			LEFT JOIN classes c ON e.class_id = c.id
			LEFT JOIN schools sch ON e.school_id = sch.id
			LEFT JOIN users u ON e.created_by = u.id
			WHERE e.id = ?
		`).bind(examId).first<any>();
	} else {
		exam = await db.prepare(`
			SELECT e.*, s.name as subject_name, et.code as exam_type_code, c.name as class_name, c.level as class_level,
			       sch.name as school_name, u.name as teacher_name
			FROM exams e
			LEFT JOIN subjects s ON e.subject_id = s.id
			LEFT JOIN exam_types et ON e.exam_type_id = et.id
			LEFT JOIN classes c ON e.class_id = c.id
			LEFT JOIN schools sch ON e.school_id = sch.id
			LEFT JOIN users u ON e.created_by = u.id
			WHERE e.id = ? AND e.school_id = ?
		`).bind(examId, locals.user.school_id).first<any>();
	}

	if (!exam) throw error(404, 'Ujian tidak ditemukan');

	exam.display_title = formatExamTitle({
		title: exam.title,
		examTypeCode: exam.exam_type_code,
		subjectName: exam.subject_name,
		className: exam.class_name,
		classLevel: exam.class_level
	});

	// Fetch questions, attempts, and answers
	const questionsRes = await db.prepare(`
		SELECT id, question_number, type, question_text, points, options_json, correct_answer_json 
		FROM questions 
		WHERE exam_id = ? 
		ORDER BY question_number ASC, id ASC
	`).bind(examId).all<any>();

	const attemptsRes = await db.prepare(`
		SELECT sa.id, sa.student_id, sa.score, sa.total_points, sa.status, sa.created_at, sa.submit_time,
		       u.name as student_name, u.username, u.nisn, u.nomor_peserta, u.class_id, c.name as class_name
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE sa.exam_id = ? AND sa.status IN ('selesai', 'waktu_habis')
		ORDER BY sa.score DESC, c.name ASC, u.name ASC
	`).bind(examId).all<any>();

	const answersRes = await db.prepare(`
		SELECT sa.attempt_id, sa.question_id, sa.is_correct, sa.answer_given, sa.score_given
		FROM student_answers sa
		JOIN student_attempts a ON sa.attempt_id = a.id
		WHERE a.exam_id = ?
	`).bind(examId).all<any>();

	const questions = questionsRes.results || [];
	const attempts = attemptsRes.results || [];
	const answers = answersRes.results || [];
	const totalAttempts = attempts.length;

	// Clean text helper
	const cleanHtml = (html: string | null) => {
		if (!html) return '';
		return html.replace(/<[^>]*>?/gm, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
	};

	// Map answers
	const answerMatrixMap: Record<string, any> = {};
	const answersByQuestion: Record<number, any[]> = {};
	for (const ans of answers) {
		answerMatrixMap[`${ans.attempt_id}_${ans.question_id}`] = ans;
		if (!answersByQuestion[ans.question_id]) {
			answersByQuestion[ans.question_id] = [];
		}
		answersByQuestion[ans.question_id].push(ans);
	}

	// Compute question stats
	const questionDiagnostics = questions.map((q, idx) => {
		const qAnswers = answersByQuestion[q.id] || [];
		let correctCount = 0;
		let wrongCount = 0;
		let emptyCount = totalAttempts - qAnswers.length;

		const distribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
		const wrongDistribution: Record<string, number> = {};

		let cleanCorrectKey = '-';
		try {
			if (q.correct_answer_json) {
				const parsed = JSON.parse(q.correct_answer_json);
				cleanCorrectKey = typeof parsed === 'string' ? parsed.trim().toUpperCase() : JSON.stringify(parsed);
			}
		} catch {
			cleanCorrectKey = (q.correct_answer_json || '-').trim().toUpperCase();
		}

		for (const att of attempts) {
			const ans = answerMatrixMap[`${att.id}_${q.id}`];
			if (!ans || ans.answer_given == null || ans.answer_given === '') {
				emptyCount++;
			} else if (ans.is_correct === 1 || ans.is_correct === true) {
				correctCount++;
				const given = (ans.answer_given || '').trim().toUpperCase();
				if (distribution[given] !== undefined) distribution[given]++;
			} else {
				wrongCount++;
				const given = (ans.answer_given || '').trim().toUpperCase();
				if (distribution[given] !== undefined) distribution[given]++;
				if (given) {
					wrongDistribution[given] = (wrongDistribution[given] || 0) + 1;
				}
			}
		}

		let dominantDistractor = '-';
		let dominantDistractorCount = 0;
		for (const [opt, count] of Object.entries(wrongDistribution)) {
			if (count > dominantDistractorCount) {
				dominantDistractorCount = count;
				dominantDistractor = opt;
			}
		}

		const wrongPercentage = totalAttempts > 0 ? Math.round(((wrongCount + emptyCount) / totalAttempts) * 100) : 0;
		const correctPercentage = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

		return {
			no: idx + 1,
			id: q.id,
			question_number: q.question_number,
			type: q.type,
			text: cleanHtml(q.question_text),
			points: q.points || 1,
			correctKey: cleanCorrectKey,
			correctCount,
			wrongCount,
			emptyCount,
			correctPercentage,
			wrongPercentage,
			dominantDistractor: dominantDistractorCount > 0 ? dominantDistractor : '-',
			dominantDistractorCount,
			dominantDistractorPct: totalAttempts > 0 ? Math.round((dominantDistractorCount / totalAttempts) * 100) : 0,
			distribution
		};
	});

	// Create Workbook
	const wb = xlsx.utils.book_new();

	// ==========================================
	// SHEET 1: MATRIKS JAWABAN SISWA
	// ==========================================
	const sheet1Data: any[][] = [
		['LAPORAN ANALISIS JAWABAN SISWA & POLA KESALAHAN'],
		[`Madrasah: ${exam.school_name || '-'}`],
		[`Nama Ujian: ${exam.display_title || exam.title}`],
		[`Mata Pelajaran: ${exam.subject_name || 'Umum'} | Kelas: ${exam.class_name || (exam.class_level ? `Kelas ${exam.class_level}` : 'Semua Kelas')}`],
		[`Guru Pengampu: ${exam.teacher_name || '-'} | Total Peserta: ${totalAttempts} Siswa`],
		['Tanggal Cetak: ' + new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
		[]
	];

	// Table Header
	const s1Header = ['No', 'Nama Siswa', 'NISN / Username', 'Kelas', 'Nilai', 'Status'];
	questions.forEach((q, idx) => {
		s1Header.push(`S${q.question_number || idx + 1}`);
	});
	sheet1Data.push(s1Header);

	// Student Rows (sorted by class and name for neat matrix)
	const sortedAttempts = [...attempts].sort((a, b) => (a.class_name || '').localeCompare(b.class_name || '') || a.student_name.localeCompare(b.student_name));
	sortedAttempts.forEach((att, idx) => {
		const row: any[] = [
			idx + 1,
			att.student_name,
			att.nisn || att.username,
			att.class_name || '-',
			att.score != null ? att.score : 0,
			(att.score || 0) >= 75 ? 'Tuntas' : 'Remedial'
		];

		questions.forEach(q => {
			const ans = answerMatrixMap[`${att.id}_${q.id}`];
			if (!ans || ans.answer_given == null || ans.answer_given === '') {
				row.push('-');
			} else if (ans.is_correct === 1 || ans.is_correct === true) {
				row.push(ans.answer_given || '✓');
			} else {
				row.push(`[${ans.answer_given || 'X'}]`);
			}
		});

		sheet1Data.push(row);
	});

	// Bottom Summary Rows
	sheet1Data.push([]);
	const keyRow: any[] = ['', '', '', 'KUNCI JAWABAN RESMI', '', ''];
	questions.forEach(q => {
		const diag = questionDiagnostics.find(d => d.id === q.id);
		keyRow.push(diag?.correctKey || '-');
	});
	sheet1Data.push(keyRow);

	const correctSumRow: any[] = ['', '', '', 'JUMLAH SISWA BENAR', '', ''];
	questions.forEach(q => {
		const diag = questionDiagnostics.find(d => d.id === q.id);
		correctSumRow.push(diag?.correctCount ?? 0);
	});
	sheet1Data.push(correctSumRow);

	const wrongSumRow: any[] = ['', '', '', 'JUMLAH SISWA SALAH', '', ''];
	questions.forEach(q => {
		const diag = questionDiagnostics.find(d => d.id === q.id);
		wrongSumRow.push((diag?.wrongCount ?? 0) + (diag?.emptyCount ?? 0));
	});
	sheet1Data.push(wrongSumRow);

	const wrongPctRow: any[] = ['', '', '', 'TINGKAT KESALAHAN (%)', '', ''];
	questions.forEach(q => {
		const diag = questionDiagnostics.find(d => d.id === q.id);
		wrongPctRow.push(`${diag?.wrongPercentage ?? 0}%`);
	});
	sheet1Data.push(wrongPctRow);

	const ws1 = xlsx.utils.aoa_to_sheet(sheet1Data);
	ws1['!cols'] = [
		{ wch: 6 },
		{ wch: 28 },
		{ wch: 18 },
		{ wch: 14 },
		{ wch: 10 },
		{ wch: 12 },
		...questions.map(() => ({ wch: 7 }))
	];
	xlsx.utils.book_append_sheet(wb, ws1, 'Matriks Jawaban Siswa');

	// ==========================================
	// SHEET 2: DIAGNOSA POLA KESALAHAN PER SOAL
	// ==========================================
	const sheet2Data: any[][] = [
		['DIAGNOSA POLA KESALAHAN & JEBAKAN MISKONSEPSI PER BUTIR SOAL'],
		[`Nama Ujian: ${exam.display_title || exam.title}`],
		[`Mata Pelajaran: ${exam.subject_name || 'Umum'} | Total Peserta: ${totalAttempts} Siswa`],
		[],
		[
			'No',
			'Nomor Soal',
			'Tipe Soal',
			'Kunci Resmi',
			'Pengecoh Dominan (Jebakan)',
			'% Pengecoh Terpilih',
			'Tingkat Kesalahan (%)',
			'Tingkat Akurasi (%)',
			'Jml Benar',
			'Jml Salah',
			'Jml Kosong',
			'Opsi A',
			'Opsi B',
			'Opsi C',
			'Opsi D',
			'Opsi E',
			'Teks Soal'
		]
	];

	// Sorted by error percentage descending
	const sortedDiagnostics = [...questionDiagnostics].sort((a, b) => b.wrongPercentage - a.wrongPercentage);
	sortedDiagnostics.forEach((d, idx) => {
		sheet2Data.push([
			idx + 1,
			`Soal #${d.question_number}`,
			d.type,
			d.correctKey,
			d.dominantDistractor !== '-' ? `Opsi ${d.dominantDistractor}` : '-',
			d.dominantDistractor !== '-' ? `${d.dominantDistractorPct}%` : '0%',
			`${d.wrongPercentage}%`,
			`${d.correctPercentage}%`,
			d.correctCount,
			d.wrongCount,
			d.emptyCount,
			d.distribution['A'] || 0,
			d.distribution['B'] || 0,
			d.distribution['C'] || 0,
			d.distribution['D'] || 0,
			d.distribution['E'] || 0,
			d.text
		]);
	});

	const ws2 = xlsx.utils.aoa_to_sheet(sheet2Data);
	ws2['!cols'] = [
		{ wch: 6 },
		{ wch: 14 },
		{ wch: 16 },
		{ wch: 14 },
		{ wch: 26 },
		{ wch: 20 },
		{ wch: 20 },
		{ wch: 18 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 8 },
		{ wch: 8 },
		{ wch: 8 },
		{ wch: 8 },
		{ wch: 8 },
		{ wch: 60 }
	];
	xlsx.utils.book_append_sheet(wb, ws2, 'Diagnosa Pola Kesalahan');

	// ==========================================
	// SHEET 3: REKAPITULASI NILAI & KETUNTASAN
	// ==========================================
	const sheet3Data: any[][] = [
		['REKAPITULASI NILAI & KETUNTASAN SISWA'],
		[`Nama Ujian: ${exam.display_title || exam.title}`],
		[`Mata Pelajaran: ${exam.subject_name || 'Umum'}`],
		[],
		['Peringkat', 'Nama Siswa', 'NISN / Username', 'Kelas', 'Nilai Ujian', 'Status Ketuntasan']
	];

	attempts.forEach((att, idx) => {
		sheet3Data.push([
			idx + 1,
			att.student_name,
			att.nisn || att.username,
			att.class_name || '-',
			att.score != null ? att.score : 0,
			(att.score || 0) >= 75 ? 'TUNTAS' : 'REMEDIAL'
		]);
	});

	const ws3 = xlsx.utils.aoa_to_sheet(sheet3Data);
	ws3['!cols'] = [
		{ wch: 10 },
		{ wch: 28 },
		{ wch: 18 },
		{ wch: 14 },
		{ wch: 14 },
		{ wch: 18 }
	];
	xlsx.utils.book_append_sheet(wb, ws3, 'Rekapitulasi Nilai');

	// Write buffer
	const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
	const safeFilename = (exam.display_title || exam.title || 'Analisis_Jawaban_Siswa')
		.replace(/[^a-zA-Z0-9_-]/g, '_')
		.substring(0, 50);

	return new Response(buf, {
		status: 200,
		headers: {
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': `attachment; filename="Analisis_Jawaban_Siswa_${safeFilename}.xlsx"`
		}
	});
};
