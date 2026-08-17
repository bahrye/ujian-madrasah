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
		SELECT sa.id, sa.student_id, sa.score, sa.total_points, sa.status, sa.created_at,
		       u.name as student_name, u.username, u.nisn, u.nomor_peserta, c.name as class_name
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE sa.exam_id = ? AND sa.status IN ('selesai', 'waktu_habis')
		ORDER BY sa.score DESC, sa.id ASC
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
	let groupSize = Math.ceil(totalAttempts * 0.27);
	if (totalAttempts > 0 && groupSize === 0) groupSize = 1;
	if (groupSize > Math.floor(totalAttempts / 2)) {
		groupSize = Math.floor(totalAttempts / 2);
	}

	const upperAttemptsList = attempts.slice(0, groupSize);
	const lowerAttemptsList = attempts.slice(-groupSize);
	const upperAttemptsSet = new Set(upperAttemptsList.map(a => a.id));
	const lowerAttemptsSet = new Set(lowerAttemptsList.map(a => a.id));

	// Group answers by question and by attempt
	const answersByQuestion: Record<number, any[]> = {};
	const answersByAttemptAndQuestion: Record<string, any> = {};

	for (const ans of answers) {
		if (!answersByQuestion[ans.question_id]) {
			answersByQuestion[ans.question_id] = [];
		}
		answersByQuestion[ans.question_id].push(ans);
		answersByAttemptAndQuestion[`${ans.attempt_id}_${ans.question_id}`] = ans;
	}

	// Helper to extract clean text from HTML
	const cleanHtml = (html: string | null) => {
		if (!html) return '';
		return html.replace(/<[^>]*>?/gm, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
	};

	// Compute item analysis per question
	const questionAnalysis = questions.map((q, idx) => {
		const qAnswers = answersByQuestion[q.id] || [];
		let correctCount = 0;
		let upperCorrect = 0;
		let lowerCorrect = 0;

		const distribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };

		for (const ans of qAnswers) {
			if (ans.is_correct === 1 || ans.is_correct === true) {
				correctCount++;
				if (upperAttemptsSet.has(ans.attempt_id)) upperCorrect++;
				if (lowerAttemptsSet.has(ans.attempt_id)) lowerCorrect++;
			}

			if (q.type === 'pilihan_ganda' || q.type === 'pilihan_ganda_kompleks') {
				const given = (ans.answer_given || '').trim().toUpperCase();
				if (distribution[given] !== undefined) {
					distribution[given]++;
				} else if (given) {
					distribution[given] = (distribution[given] || 0) + 1;
				}
			}
		}

		const p = totalAttempts > 0 ? correctCount / totalAttempts : 0;
		let pCategory = 'Sedang';
		if (p < 0.3) pCategory = 'Sukar';
		else if (p > 0.7) pCategory = 'Mudah';

		const d = groupSize > 0 ? (upperCorrect - lowerCorrect) / groupSize : 0;
		let dCategory = 'Cukup';
		let status = 'Gunakan';

		if (d >= 0.4) {
			dCategory = 'Sangat Baik';
			status = 'Gunakan';
		} else if (d >= 0.3) {
			dCategory = 'Baik';
			status = 'Gunakan';
		} else if (d >= 0.2) {
			dCategory = 'Cukup';
			status = 'Revisi';
		} else {
			dCategory = 'Buruk';
			status = 'Buang / Revisi Total';
		}

		let cleanCorrectKey = '-';
		try {
			if (q.correct_answer_json) {
				const parsed = JSON.parse(q.correct_answer_json);
				cleanCorrectKey = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
			}
		} catch {
			cleanCorrectKey = q.correct_answer_json || '-';
		}

		return {
			no: idx + 1,
			originalNumber: q.question_number,
			id: q.id,
			type: q.type,
			text: cleanHtml(q.question_text),
			points: q.points || 1,
			correctKey: cleanCorrectKey,
			correctCount,
			pIndex: parseFloat(p.toFixed(2)),
			pCategory,
			upperCorrect,
			lowerCorrect,
			dIndex: parseFloat(d.toFixed(2)),
			dCategory,
			status,
			distribution
		};
	});

	// Create Workbook
	const wb = xlsx.utils.book_new();

	// -------------------------------------------------------------
	// SHEET 1: Ringkasan & Analisis Butir
	// -------------------------------------------------------------
	const sheet1Data: any[][] = [
		['LAPORAN ANALISIS BUTIR SOAL & DAYA PEMBEDA'],
		[exam.school_name ? exam.school_name.toUpperCase() : 'UJIAN MADRASAH'],
		[],
		['Judul Ujian', exam.display_title || exam.title],
		['Mata Pelajaran', exam.subject_name || 'Umum'],
		['Kelas / Tingkat', exam.class_name || (exam.class_level ? `Kelas ${exam.class_level}` : 'Semua')],
		['Guru Pengampu', exam.teacher_name || '-'],
		['Total Peserta Selesai', totalAttempts],
		['Sampel Kelompok (27%)', `${groupSize} Siswa Atas / ${groupSize} Siswa Bawah`],
		[],
		['REKAPITULASI STATUS SOAL'],
		['Status Butir', 'Jumlah Soal', 'Persentase', 'Kategori Kesukaran', 'Jumlah Soal', 'Persentase'],
		[
			'Gunakan (D Baik)',
			questionAnalysis.filter(q => q.status === 'Gunakan').length,
			`${questions.length > 0 ? Math.round((questionAnalysis.filter(q => q.status === 'Gunakan').length / questions.length) * 100) : 0}%`,
			'Mudah (P > 0.70)',
			questionAnalysis.filter(q => q.pCategory === 'Mudah').length,
			`${questions.length > 0 ? Math.round((questionAnalysis.filter(q => q.pCategory === 'Mudah').length / questions.length) * 100) : 0}%`
		],
		[
			'Revisi (D Cukup)',
			questionAnalysis.filter(q => q.status === 'Revisi').length,
			`${questions.length > 0 ? Math.round((questionAnalysis.filter(q => q.status === 'Revisi').length / questions.length) * 100) : 0}%`,
			'Sedang (0.30 - 0.70)',
			questionAnalysis.filter(q => q.pCategory === 'Sedang').length,
			`${questions.length > 0 ? Math.round((questionAnalysis.filter(q => q.pCategory === 'Sedang').length / questions.length) * 100) : 0}%`
		],
		[
			'Buang/Rombak (D Buruk)',
			questionAnalysis.filter(q => q.status.startsWith('Buang')).length,
			`${questions.length > 0 ? Math.round((questionAnalysis.filter(q => q.status.startsWith('Buang')).length / questions.length) * 100) : 0}%`,
			'Sukar (P < 0.30)',
			questionAnalysis.filter(q => q.pCategory === 'Sukar').length,
			`${questions.length > 0 ? Math.round((questionAnalysis.filter(q => q.pCategory === 'Sukar').length / questions.length) * 100) : 0}%`
		],
		[],
		['TABEL ANALISIS BUTIR SOAL LENGKAP'],
		[
			'No.',
			'Teks Soal',
			'Tipe Soal',
			'Kunci',
			'Poin',
			'Jml Benar',
			'Tingkat Kesukaran (P)',
			'Kategori Kesukaran',
			'Benar Kel. Atas (U)',
			'Benar Kel. Bawah (L)',
			'Daya Pembeda (D)',
			'Kategori Daya Pembeda',
			'Rekomendasi Butir',
			'Pemilih A',
			'Pemilih B',
			'Pemilih C',
			'Pemilih D',
			'Pemilih E'
		]
	];

	for (const q of questionAnalysis) {
		sheet1Data.push([
			q.no,
			q.text,
			q.type,
			q.correctKey,
			q.points,
			q.correctCount,
			q.pIndex,
			q.pCategory,
			q.upperCorrect,
			q.lowerCorrect,
			q.dIndex,
			q.dCategory,
			q.status,
			q.distribution['A'] || 0,
			q.distribution['B'] || 0,
			q.distribution['C'] || 0,
			q.distribution['D'] || 0,
			q.distribution['E'] || 0
		]);
	}

	const ws1 = xlsx.utils.aoa_to_sheet(sheet1Data);
	ws1['!cols'] = [
		{ wch: 6 },   // No
		{ wch: 45 },  // Teks Soal
		{ wch: 18 },  // Tipe
		{ wch: 10 },  // Kunci
		{ wch: 8 },   // Poin
		{ wch: 12 },  // Jml Benar
		{ wch: 22 },  // P
		{ wch: 18 },  // Kategori P
		{ wch: 18 },  // U
		{ wch: 18 },  // L
		{ wch: 18 },  // D
		{ wch: 22 },  // Kategori D
		{ wch: 22 },  // Rekomendasi
		{ wch: 10 },  // A
		{ wch: 10 },  // B
		{ wch: 10 },  // C
		{ wch: 10 },  // D
		{ wch: 10 }   // E
	];
	xlsx.utils.book_append_sheet(wb, ws1, 'Analisis Butir Soal');

	// -------------------------------------------------------------
	// SHEET 2: Matriks Jawaban Siswa
	// -------------------------------------------------------------
	const matrixHeader = ['No', 'NISN / Username', 'Nama Siswa', 'Kelas', 'Total Skor'];
	questions.forEach((q, i) => {
		matrixHeader.push(`S${i + 1} (${q.points}p)`);
	});

	const sheet2Data: any[][] = [
		['MATRIKS SKOR DAN JAWABAN SISWA PER BUTIR SOAL'],
		[`Ujian: ${exam.display_title || exam.title}`],
		[],
		matrixHeader
	];

	attempts.forEach((att, idx) => {
		const row = [
			idx + 1,
			att.nisn || att.username,
			att.student_name,
			att.class_name || '-',
			att.score != null ? att.score : 0
		];

		questions.forEach((q) => {
			const ans = answersByAttemptAndQuestion[`${att.id}_${q.id}`];
			if (!ans) {
				row.push(0);
			} else {
				// Nilai 1/0 untuk pilihan objektif atau skor mentah
				row.push(ans.is_correct ? 1 : 0);
			}
		});

		sheet2Data.push(row);
	});

	// Baris Ringkasan di Bawah Matriks
	const totalCorrectRow = ['', '', 'TOTAL SISWA MENJAWAB BENAR', '', ''];
	const difficultyRow = ['', '', 'TINGKAT KESUKARAN (P)', '', ''];
	const discriminationRow = ['', '', 'DAYA PEMBEDA (D)', '', ''];

	questions.forEach((q) => {
		const qAnal = questionAnalysis.find(item => item.id === q.id);
		totalCorrectRow.push(qAnal ? qAnal.correctCount : 0);
		difficultyRow.push(qAnal ? qAnal.pIndex : 0);
		discriminationRow.push(qAnal ? qAnal.dIndex : 0);
	});

	sheet2Data.push([]);
	sheet2Data.push(totalCorrectRow);
	sheet2Data.push(difficultyRow);
	sheet2Data.push(discriminationRow);

	const ws2 = xlsx.utils.aoa_to_sheet(sheet2Data);
	ws2['!cols'] = [
		{ wch: 5 },
		{ wch: 18 },
		{ wch: 30 },
		{ wch: 12 },
		{ wch: 12 },
		...questions.map(() => ({ wch: 10 }))
	];
	xlsx.utils.book_append_sheet(wb, ws2, 'Matriks Jawaban Siswa');

	// -------------------------------------------------------------
	// SHEET 3: Kelompok 27% Atas & Bawah
	// -------------------------------------------------------------
	const sheet3Data: any[][] = [
		['DATA SAMPEL KELOMPOK ATAS & BAWAH (27%)'],
		[`Total Sampel: ${groupSize} Siswa Teratas dan ${groupSize} Siswa Terbawah dari Total ${totalAttempts} Siswa`],
		[],
		['KELOMPOK ATAS (UPPER GROUP 27%)'],
		['No.', 'Peringkat', 'NISN / Username', 'Nama Siswa', 'Kelas', 'Skor Akhir']
	];

	upperAttemptsList.forEach((att, idx) => {
		sheet3Data.push([
			idx + 1,
			`Peringkat ${idx + 1}`,
			att.nisn || att.username,
			att.student_name,
			att.class_name || '-',
			att.score != null ? att.score : 0
		]);
	});

	sheet3Data.push([]);
	sheet3Data.push(['KELOMPOK BAWAH (LOWER GROUP 27%)']);
	sheet3Data.push(['No.', 'Peringkat dari Bawah', 'NISN / Username', 'Nama Siswa', 'Kelas', 'Skor Akhir']);

	lowerAttemptsList.forEach((att, idx) => {
		sheet3Data.push([
			idx + 1,
			`Peringkat ${totalAttempts - lowerAttemptsList.length + idx + 1}`,
			att.nisn || att.username,
			att.student_name,
			att.class_name || '-',
			att.score != null ? att.score : 0
		]);
	});

	const ws3 = xlsx.utils.aoa_to_sheet(sheet3Data);
	ws3['!cols'] = [
		{ wch: 6 },
		{ wch: 24 },
		{ wch: 18 },
		{ wch: 32 },
		{ wch: 15 },
		{ wch: 14 }
	];
	xlsx.utils.book_append_sheet(wb, ws3, 'Kelompok Atas & Bawah');

	// Generate output buffer
	const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
	const safeTitle = (exam.title || 'Ujian').replace(/[^a-z0-9]/gi, '_').toLowerCase();
	const filename = `Analisis_Butir_Soal_${safeTitle}.xlsx`;

	return new Response(buf, {
		headers: {
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};
