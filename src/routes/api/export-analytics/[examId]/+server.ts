import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDB } from '$lib/server/db';
import * as xlsx from 'xlsx';
import { calculateExamAnalytics } from '$lib/server/analytics';
import { formatExamTitle } from '$lib/utils/exam';

export const GET: RequestHandler = async ({ params, platform, url, locals }) => {
	if (!locals.user || !['superadmin', 'admin', 'guru', 'panitia'].includes(locals.user.role)) {
		throw error(401, 'Unauthorized');
	}

	const db = getDB(platform);
	const examId = parseInt(params.examId, 10);
	if (isNaN(examId)) throw error(400, 'Invalid Exam ID');

	const kkm = parseInt(url.searchParams.get('kkm') || '75', 10);

	// Fetch Exam
	let examQuery = `
		SELECT e.*, s.name as subject_name, et.code as exam_type_code, c.name as class_name
		FROM exams e 
		LEFT JOIN subjects s ON e.subject_id = s.id
		LEFT JOIN exam_types et ON e.exam_type_id = et.id
		LEFT JOIN classes c ON e.class_id = c.id
		WHERE e.id = ?
	`;
	const examParams: any[] = [examId];

	if (locals.user.role === 'guru') {
		examQuery += ` AND e.school_id = ? AND (e.created_by = ? OR EXISTS (SELECT 1 FROM exam_teachers et WHERE et.exam_id = e.id AND et.teacher_id = ?))`;
		examParams.push(locals.user.school_id, locals.user.id, locals.user.id);
	} else if (locals.user.role !== 'superadmin') {
		examQuery += ` AND e.school_id = ?`;
		examParams.push(locals.user.school_id);
	}

	const exam = await db.prepare(examQuery).bind(...examParams).first<any>();
	if (!exam) throw error(404, 'Ujian tidak ditemukan atau Anda tidak memiliki akses.');

	exam.display_title = formatExamTitle({
		title: exam.title,
		examTypeCode: exam.exam_type_code,
		subjectName: exam.subject_name,
		className: exam.class_name
	});

	// Fetch questions, attempts, answers, participants
	const questionsRes = await db.prepare(`
		SELECT id, question_number, type, question_text, points, options_json, correct_answer_json 
		FROM questions 
		WHERE exam_id = ? 
		ORDER BY question_number ASC, id ASC
	`).bind(examId).all<any>();

	const attemptsRes = await db.prepare(`
		SELECT sa.id, sa.student_id, sa.score, sa.total_points, sa.status, 
		       sa.start_time, sa.end_time, sa.submit_time, sa.violation_count,
		       u.name as student_name, u.username, u.nisn, u.nomor_peserta, c.name as class_name
		FROM student_attempts sa
		JOIN users u ON sa.student_id = u.id
		LEFT JOIN classes c ON u.class_id = c.id
		WHERE sa.exam_id = ?
		ORDER BY sa.score DESC, sa.id ASC
	`).bind(examId).all<any>();

	const answersRes = await db.prepare(`
		SELECT an.attempt_id, an.question_id, an.is_correct, an.answer_given, an.score_given
		FROM student_answers an
		JOIN student_attempts sa ON an.attempt_id = sa.id
		WHERE sa.exam_id = ?
	`).bind(examId).all<any>();

	const participantsRes = await db.prepare(`
		SELECT ep.student_id
		FROM exam_participants ep
		WHERE ep.exam_id = ?
	`).bind(examId).all<any>();

	const analytics = calculateExamAnalytics(
		exam,
		questionsRes.results || [],
		attemptsRes.results || [],
		answersRes.results || [],
		participantsRes.results || [],
		{ kkm }
	);

	// Create Excel Workbook
	const wb = xlsx.utils.book_new();

	// ==========================================
	// SHEET 1: REKAPITULASI NILAI SISWA
	// ==========================================
	const rosterHeaders = [
		'Peringkat',
		'Nama Siswa',
		'Nomor Peserta',
		'NISN',
		'Kelas',
		'Jumlah Benar',
		'Jumlah Salah',
		'Jumlah Kosong',
		'Nilai Akhir',
		'Status Ketuntasan (KKM: ' + kkm + ')',
		'Durasi (Menit)',
		'Waktu Selesai'
	];

	const rosterRows = analytics.studentRoster.map((r) => [
		r.rank,
		r.studentName,
		r.nomorPeserta || '-',
		r.nisn || '-',
		r.className || '-',
		r.correctCount,
		r.incorrectCount,
		r.unansweredCount,
		r.score,
		r.isPassed ? 'TUNTAS' : 'REMEDIAL',
		r.durationMinutes != null ? r.durationMinutes : '-',
		r.submitTime || '-'
	]);

	const wsRoster = xlsx.utils.aoa_to_sheet([
		['LAPORAN REKAPITULASI HASIL UJIAN'],
		[`Judul Ujian: ${exam.display_title || exam.title}`],
		[`Mata Pelajaran: ${exam.subject_name || '-'} | KKM: ${kkm}`],
		[],
		rosterHeaders,
		...rosterRows
	]);

	wsRoster['!cols'] = [
		{ wch: 10 },
		{ wch: 30 },
		{ wch: 18 },
		{ wch: 15 },
		{ wch: 15 },
		{ wch: 14 },
		{ wch: 14 },
		{ wch: 14 },
		{ wch: 12 },
		{ wch: 22 },
		{ wch: 15 },
		{ wch: 22 }
	];
	xlsx.utils.book_append_sheet(wb, wsRoster, 'Rekap Nilai');

	// ==========================================
	// SHEET 2: ANALISIS BUTIR SOAL
	// ==========================================
	const itemHeaders = [
		'No. Soal',
		'Bentuk Soal',
		'Cuplikan Soal',
		'Kunci Jawaban',
		'Bobot',
		'Jml Penjawab',
		'Jml Benar',
		'Indeks Kesukaran (P)',
		'Kategori Kesukaran',
		'Daya Beda (D)',
		'Kategori Daya Beda',
		'Rekomendasi Keputusan',
		'Opsi A (%)',
		'Opsi B (%)',
		'Opsi C (%)',
		'Opsi D (%)',
		'Opsi E (%)'
	];

	const itemRows = analytics.itemAnalysis.items.map((i) => [
		i.question_number,
		i.type.replace('_', ' ').toUpperCase(),
		i.plain_text.slice(0, 100),
		i.correct_answer,
		i.points,
		i.answeredCount,
		i.correctCount,
		i.pIndex,
		i.pCategory,
		i.dIndex,
		i.dCategory,
		i.status,
		i.distribution['A'] ? `${i.distribution['A'].percentage}%` : '0%',
		i.distribution['B'] ? `${i.distribution['B'].percentage}%` : '0%',
		i.distribution['C'] ? `${i.distribution['C'].percentage}%` : '0%',
		i.distribution['D'] ? `${i.distribution['D'].percentage}%` : '0%',
		i.distribution['E'] ? `${i.distribution['E'].percentage}%` : '0%'
	]);

	const wsItems = xlsx.utils.aoa_to_sheet([
		['ANALISIS BUTIR SOAL (ANATES PSIKOMETRI)'],
		[`Judul Ujian: ${exam.display_title || exam.title}`],
		[`Total Butir Soal: ${analytics.itemAnalysis.items.length}`],
		[],
		itemHeaders,
		...itemRows
	]);

	wsItems['!cols'] = [
		{ wch: 8 },
		{ wch: 18 },
		{ wch: 45 },
		{ wch: 15 },
		{ wch: 8 },
		{ wch: 14 },
		{ wch: 12 },
		{ wch: 18 },
		{ wch: 18 },
		{ wch: 14 },
		{ wch: 18 },
		{ wch: 20 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 12 },
		{ wch: 12 }
	];
	xlsx.utils.book_append_sheet(wb, wsItems, 'Analisis Butir Soal');

	// ==========================================
	// SHEET 3: STATISTIK & EVALUASI
	// ==========================================
	const summaryData = [
		['STATISTIK & EVALUASI PEMBELAJARAN'],
		[],
		['Parameter', 'Nilai / Keterangan'],
		['Judul Ujian', exam.display_title || exam.title],
		['Mata Pelajaran', exam.subject_name || '-'],
		['Tingkat / Rombel', exam.class_name || '-'],
		['Kriteria Ketuntasan Minimal (KKM)', kkm],
		['Total Peserta Mengikuti', analytics.summary.completedCount],
		['Peserta Tuntas (≥ KKM)', analytics.summary.passedCount],
		['Peserta Belum Tuntas (< KKM)', analytics.summary.failedCount],
		['Persentase Ketuntasan Klasikal', `${analytics.summary.passRate}%`],
		['Status Ketuntasan Klasikal', analytics.summary.isClassicalMastered ? 'TUNTAS KLASIKAL (≥ 85%)' : 'BELUM TUNTAS KLASIKAL (< 85%)'],
		[],
		['Statistik Deskriptif', ''],
		['Nilai Rata-rata (Mean)', analytics.summary.meanScore],
		['Nilai Median (Nilai Tengah)', analytics.summary.medianScore],
		['Nilai Modus', analytics.summary.modeScore.join(', ')],
		['Nilai Tertinggi (Max)', analytics.summary.maxScore],
		['Nilai Terendah (Min)', analytics.summary.minScore],
		['Rentang Nilai (Range)', analytics.summary.scoreRange],
		['Standar Deviasi (Simpangan Baku)', analytics.summary.standardDeviation],
		['Varians Skor', analytics.summary.variance],
		[],
		['Reliabilitas Instrumen Tes', ''],
		['Koefisien Reliabilitas (r11 KR-20/Alpha)', analytics.summary.cronbachAlpha],
		['Kategori Reliabilitas', analytics.summary.reliabilityCategory],
		[],
		['Kualitas Butir Soal', ''],
		['Jumlah Soal Mudah', analytics.itemAnalysis.summary.easyCount],
		['Jumlah Soal Sedang (Ideal)', analytics.itemAnalysis.summary.moderateCount],
		['Jumlah Soal Sukar', analytics.itemAnalysis.summary.hardCount],
		['Soal Diterima / Baik', analytics.itemAnalysis.summary.acceptedCount],
		['Soal Perlu Revisi', analytics.itemAnalysis.summary.reviseCount],
		['Soal Ditolak / Dibuang', analytics.itemAnalysis.summary.rejectedCount]
	];

	const wsSummary = xlsx.utils.aoa_to_sheet(summaryData);
	wsSummary['!cols'] = [{ wch: 35 }, { wch: 45 }];
	xlsx.utils.book_append_sheet(wb, wsSummary, 'Statistik & Evaluasi');

	const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
	const safeTitle = (exam.title || 'analisis').replace(/[^a-z0-9]/gi, '_').toLowerCase();

	return new Response(buf, {
		headers: {
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': `attachment; filename="Analisis_Lengkap_${safeTitle}.xlsx"`
		}
	});
};
