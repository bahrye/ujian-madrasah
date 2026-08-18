import * as XLSX from 'xlsx';
import { ATTEMPT_STATUS_LABELS } from './constants';
import { parseDate } from './date';

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

		const stripHtml = (html: string) => {
			if (!html) return '';
			return html.replace(/<img[^>]*src="([^"]+)"[^>]*>/gi, '[Gambar]').replace(/<[^>]*>?/gm, '').trim();
		};

		// ==========================================
		// SHEET 1: REKAP NILAI
		// ==========================================
		const header1 = [
			'Nama Lengkap Siswa',
			'NISN',
			'Nomor Peserta',
			'Status Pengerjaan',
			'Waktu Mulai',
			'Waktu Selesai',
			'Sisa Waktu',
			'Nilai/100'
		];
		
		// Add question columns for points
		let totalExamPoints = 0;
		questions.forEach((q: any) => {
			header1.push(`No.${q.question_number}`);
			totalExamPoints += q.points || 0;
		});

		const rows1 = participants.map((p: any) => {
			let startTime = p.start_time ? parseDate(p.start_time).toLocaleString('id-ID') : '-';
			let endTime = p.submit_time ? parseDate(p.submit_time).toLocaleString('id-ID') : '-';
			
			let remainingTime = '-';
			if (p.start_time) {
				const startMs = parseDate(p.start_time).getTime();
				const endMs = p.submit_time ? parseDate(p.submit_time).getTime() : Date.now();
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
				p.nisn || '-',
				p.nomor_peserta || '-',
				ATTEMPT_STATUS_LABELS[p.status] || p.status,
				startTime,
				endTime,
				remainingTime,
				p.score != null ? p.score : 0
			];

			questions.forEach((q: any) => {
				const ans = p.answers[q.id];
				let convertedScore = 0;
				if (ans && totalExamPoints > 0) {
					convertedScore = (ans.score_given / totalExamPoints) * 100;
				}
				row.push(convertedScore > 0 ? parseFloat(convertedScore.toFixed(2)) : 0);
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
			let soalText = stripHtml(q.question_text);

			if (q.type === 'menjodohkan') {
				let opts: any = { left: [], right: [] };
				try { opts = JSON.parse(q.options_json); } catch(e) {}
				
				if (opts.left && opts.left.length > 0) {
					const leftTexts = opts.left.map((l: string) => stripHtml(l));
					soalText += ' { ' + leftTexts.join(' | ') + ' }';
				}

				if (q.correct_answer_json && opts.right) {
					try {
						const mapping = JSON.parse(q.correct_answer_json);
						const kunciParts = [];
						for (let i = 0; i < (opts.left ? opts.left.length : 0); i++) {
							const rightIdx = mapping[String(i)];
							const rightVal = opts.right[parseInt(rightIdx)];
							kunciParts.push(rightVal ? stripHtml(rightVal) : '-');
						}
						kunci = kunciParts.join(' | ');
					} catch(e) {
						kunci = q.correct_answer_json;
					}
				}
			} else if (q.correct_answer_json) {
				try {
					const correct = JSON.parse(q.correct_answer_json);
					if (q.type === 'pilihan_ganda') {
						kunci = typeof correct === 'object' && correct !== null && 'answer' in correct ? correct.answer : String(correct);
					} else if (q.type === 'benar_salah') {
						if (typeof correct === 'object' && correct !== null && !Array.isArray(correct)) {
							kunci = Object.entries(correct).map(([k, v]) => `${Number(k) + 1}: ${v}`).join(', ');
						} else {
							kunci = typeof correct === 'object' && correct !== null && 'answer' in correct ? (correct.answer ? 'Benar' : 'Salah') : String(correct);
						}
					} else if (q.type === 'pilihan_ganda_kompleks' && Array.isArray(correct)) {
						kunci = correct.join(', ');
					} else {
						kunci = Array.isArray(correct) ? correct.join(', ') : (typeof correct === 'object' && correct !== null ? JSON.stringify(correct) : String(correct));
					}
				} catch(e) {
					kunci = q.correct_answer_json;
				}
			}

			return [
				q.question_number,
				soalText,
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
		const header3 = ['Nama Siswa', 'No Soal', 'Soal', 'Jawaban Siswa', 'Poin Didapat', 'Nilai Ujian', 'Nilai Akhir'];
		const rows3: any[] = [];
		
		participants.forEach((p: any) => {
			questions.forEach((q: any, index: number) => {
				const ans = p.answers[q.id];
				let ansText = '-';
				let soalText = stripHtml(q.question_text).substring(0, 50) + '...';

				if (q.type === 'menjodohkan') {
					let opts: any = { left: [], right: [] };
					try { opts = JSON.parse(q.options_json); } catch(e) {}
					
					if (opts.left && opts.left.length > 0) {
						const leftTexts = opts.left.map((l: string) => stripHtml(l));
						soalText = stripHtml(q.question_text) + ' { ' + leftTexts.join(' | ') + ' }';
					}

					if (ans && ans.answer_given && opts.right) {
						try {
							const mapping = JSON.parse(ans.answer_given);
							const ansParts = [];
							for (let i = 0; i < (opts.left ? opts.left.length : 0); i++) {
								const rightIdx = mapping[String(i)];
								const rightVal = opts.right[parseInt(rightIdx)];
								ansParts.push(rightVal ? stripHtml(rightVal) : '-');
							}
							ansText = ansParts.join(' | ');
						} catch(e) {
							ansText = ans.answer_given;
						}
					}
				} else if (ans && ans.answer_given) {
					try {
						const parsed = JSON.parse(ans.answer_given);
						if (parsed.answer !== undefined) {
							ansText = parsed.answer.toString();
						} else if (Array.isArray(parsed)) {
							ansText = parsed.join(', ');
						} else {
							ansText = ans.answer_given;
						}
					} catch(e) {
						ansText = ans.answer_given;
					}
				}

				let convertedScore = 0;
				if (ans && totalExamPoints > 0) {
					convertedScore = (ans.score_given / totalExamPoints) * 100;
				}
				
				let finalScore: number | string = '';
				if (index === 0) {
					finalScore = p.score != null ? p.score : 0;
				}

				rows3.push([
					p.student_name,
					q.question_number,
					soalText,
					ansText,
					ans ? ans.score_given : 0,
					convertedScore > 0 ? parseFloat(convertedScore.toFixed(2)) : 0,
					finalScore
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

export async function exportAllExamTypeResults(typeId: number, classId?: number, fileTitle?: string) {
	try {
		let url = `/api/export-results/type/${typeId}`;
		if (classId) url += `?class_id=${classId}`;

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Gagal mengambil data rekap nilai untuk export Excel.');
		}

		const data = (await response.json()) as any;
		const { examType, classData, students, exams } = data;

		const wb = XLSX.utils.book_new();

		// ==========================================
		// SHEET 1: REKAP SEMUA NILAI
		// ==========================================
		const header1 = ['No', 'Nama Lengkap Siswa', 'NISN', 'Nomor Peserta', 'Kelas'];
		
		exams.forEach((item: any) => {
			const label = item.exam.subject_name || item.exam.title;
			header1.push(label);
		});
		header1.push('Rata-Rata Nilai');

		const rows1 = students.map((std: any, idx: number) => {
			const row: any[] = [
				idx + 1,
				std.student_name,
				std.nisn || '-',
				std.nomor_peserta || '-',
				std.class_name || '-'
			];

			let totalScore = 0;
			let takenCount = 0;

			exams.forEach((item: any) => {
				const att = item.attemptsMap[std.id];
				if (att && att.score != null) {
					const val = typeof att.score === 'number' ? att.score : parseFloat(att.score);
					row.push(val);
					totalScore += val;
					takenCount++;
				} else {
					row.push('-');
				}
			});

			const avg = takenCount > 0 ? parseFloat((totalScore / takenCount).toFixed(2)) : '-';
			row.push(avg);

			return row;
		});

		const ws1 = XLSX.utils.aoa_to_sheet([header1, ...rows1]);
		XLSX.utils.book_append_sheet(wb, ws1, 'Rekap Nilai');

		// Export file
		const titleStr = fileTitle || `${examType?.name || 'Ujian'}_${classData?.name || ''}`;
		const safeTitle = titleStr.replace(/[^a-z0-9]/gi, '_').toLowerCase();
		XLSX.writeFile(wb, `rekap_nilai_${safeTitle}.xlsx`);

		return { success: true };
	} catch (error: any) {
		console.error(error);
		return { success: false, error: error.message };
	}
}

