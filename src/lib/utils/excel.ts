import * as XLSX from 'xlsx';
import { ATTEMPT_STATUS_LABELS } from './constants';

export async function exportExamResults(examId: string, examTitle: string) {
	try {
		const response = await fetch(`/api/export-results/${examId}`);
		if (!response.ok) {
			throw new Error('Gagal mengambil data untuk export Excel.');
		}
		
		const data = await response.json() as any;
		const { exam, questions, participants } = data;

		// Initialize Workbook
		const wb = XLSX.utils.book_new();

		// ==========================================
		// SHEET 1: REKAP NILAI
		// ==========================================
		const header1 = [
			'Nama Lengkap Siswa',
			'NISN',
			'Status Pengerjaan',
			'Waktu Mulai',
			'Waktu Selesai',
			'Sisa Waktu',
			'Nilai/100'
		];
		
		// Add question columns for points
		questions.forEach((q: any) => {
			header1.push(`No.${q.question_number}`);
		});

		const rows1 = participants.map((p: any) => {
			let startTime = p.start_time ? new Date(p.start_time + 'Z').toLocaleString('id-ID') : '-';
			let endTime = p.submit_time ? new Date(p.submit_time + 'Z').toLocaleString('id-ID') : '-';
			
			let remainingTime = '-';
			if (p.start_time) {
				const startMs = new Date(p.start_time + 'Z').getTime();
				const endMs = p.submit_time ? new Date(p.submit_time + 'Z').getTime() : Date.now();
				const examEndMs = startMs + (exam.duration_minutes * 60 * 1000);
				const leftMs = examEndMs - endMs;
				if (leftMs > 0) {
					const totalM = Math.floor(leftMs / 60000);
					remainingTime = `${Math.floor(totalM / 60)}j ${totalM % 60}m`;
				} else {
					remainingTime = 'Habis';
				}
			}

			const row = [
				p.student_name,
				p.nisn,
				ATTEMPT_STATUS_LABELS[p.status] || p.status,
				startTime,
				endTime,
				remainingTime,
				p.score != null ? p.score : 0
			];

			questions.forEach((q: any) => {
				const ans = p.answers[q.id];
				row.push(ans ? ans.score_given : 0);
			});

			return row;
		});

		const ws1 = XLSX.utils.aoa_to_sheet([header1, ...rows1]);
		XLSX.utils.book_append_sheet(wb, ws1, 'Rekap Nilai');


		// ==========================================
		// SHEET 2: DAFTAR SOAL & KUNCI
		// ==========================================
		const header2 = ['No', 'Soal', 'Tipe', 'Kunci Jawaban', 'Poin'];
		const rows2 = questions.map((q: any) => {
			let kunci = '';
			if (q.correct_answer_json) {
				try {
					const correct = JSON.parse(q.correct_answer_json);
					if (q.type === 'pilihan_ganda') {
						kunci = correct.answer;
					} else if (q.type === 'benar_salah') {
						kunci = correct.answer ? 'Benar' : 'Salah';
					} else {
						kunci = JSON.stringify(correct);
					}
				} catch(e) {
					kunci = q.correct_answer_json;
				}
			}

			return [
				q.question_number,
				q.question_text.replace(/<[^>]*>?/gm, ''), // Strip HTML
				q.type,
				kunci,
				q.points
			];
		});

		const ws2 = XLSX.utils.aoa_to_sheet([header2, ...rows2]);
		XLSX.utils.book_append_sheet(wb, ws2, 'Daftar Soal');


		// ==========================================
		// SHEET 3: DETAIL JAWABAN
		// ==========================================
		const header3 = ['Nama Siswa', 'No Soal', 'Soal', 'Jawaban Siswa', 'Poin Didapat'];
		const rows3: any[] = [];
		
		participants.forEach((p: any) => {
			questions.forEach((q: any) => {
				const ans = p.answers[q.id];
				let ansText = '-';
				if (ans && ans.answer_given) {
					try {
						const parsed = JSON.parse(ans.answer_given);
						if (parsed.answer !== undefined) {
							ansText = parsed.answer.toString();
						} else {
							ansText = ans.answer_given;
						}
					} catch(e) {
						ansText = ans.answer_given;
					}
				}

				rows3.push([
					p.student_name,
					q.question_number,
					q.question_text.replace(/<[^>]*>?/gm, '').substring(0, 50) + '...', // snippet
					ansText,
					ans ? ans.score_given : 0
				]);
			});
		});

		const ws3 = XLSX.utils.aoa_to_sheet([header3, ...rows3]);
		XLSX.utils.book_append_sheet(wb, ws3, 'Detail Jawaban');

		// Export
		const safeTitle = examTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
		XLSX.writeFile(wb, `hasil_ujian_${safeTitle}.xlsx`);

		return { success: true };
	} catch (error: any) {
		console.error(error);
		return { success: false, error: error.message };
	}
}
