export interface QuestionOption {
	label: string;
	text: string;
	is_correct?: boolean;
}

export interface QuestionData {
	id: number;
	question_number: number;
	type: string;
	question_text: string;
	points: number;
	options_json?: string | null;
	correct_answer_json?: string | null;
}

export interface StudentAttemptData {
	id: number;
	student_id: number;
	student_name: string;
	username?: string;
	nisn?: string;
	nomor_peserta?: string;
	class_name?: string;
	score: number | null;
	total_points?: number | null;
	status: string;
	start_time?: string | null;
	end_time?: string | null;
	submit_time?: string | null;
	violation_count?: number;
}

export interface StudentAnswerData {
	attempt_id: number;
	question_id: number;
	is_correct: number | boolean | null;
	answer_given: string | null;
	score_given: number | null;
}

export interface ItemAnalysisResult {
	id: number;
	question_number: number;
	type: string;
	question_text: string;
	plain_text: string;
	points: number;
	correct_answer: string;
	options: { key: string; text: string; isCorrect: boolean }[];
	answeredCount: number;
	correctCount: number;
	incorrectCount: number;
	pIndex: number; // Difficulty Index
	pCategory: 'Sukar' | 'Sedang' | 'Mudah';
	pColor: string;
	dIndex: number; // Discrimination Index
	dCategory: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Buruk' | 'Negatif';
	dColor: string;
	status: 'Diterima' | 'Revisi' | 'Ditolak';
	statusColor: string;
	upperCorrect: number;
	lowerCorrect: number;
	distribution: Record<string, { total: number; upper: number; lower: number; percentage: number }>;
	nonFunctioningDistractors: string[];
}

export interface ExamAnalytics {
	exam: {
		id: number;
		title: string;
		display_title?: string;
		subject_name?: string;
		class_name?: string;
		exam_type_code?: string;
		duration_minutes: number;
		start_time?: string | null;
		end_time?: string | null;
	};
	kkm: number;
	summary: {
		totalParticipants: number;
		completedCount: number;
		inProgressCount: number;
		notStartedCount: number;
		attendanceRate: number;
		meanScore: number;
		medianScore: number;
		modeScore: number[];
		maxScore: number;
		minScore: number;
		scoreRange: number;
		variance: number;
		standardDeviation: number;
		passedCount: number;
		failedCount: number;
		passRate: number;
		isClassicalMastered: boolean;
		cronbachAlpha: number;
		reliabilityCategory: string;
		reliabilityDescription: string;
	};
	frequencyDistribution: {
		label: string;
		range: string;
		min: number;
		max: number;
		count: number;
		percentage: number;
		color: string;
		category: string;
	}[];
	itemAnalysis: {
		items: ItemAnalysisResult[];
		summary: {
			totalQuestions: number;
			easyCount: number;
			moderateCount: number;
			hardCount: number;
			veryGoodD: number;
			goodD: number;
			fairD: number;
			poorD: number;
			acceptedCount: number;
			reviseCount: number;
			rejectedCount: number;
			mostDifficult: { number: number; p: number; text: string }[];
			bestDiscriminators: { number: number; d: number; text: string }[];
		};
	};
	typeBreakdown: {
		type: string;
		label: string;
		questionCount: number;
		totalPoints: number;
		averageScorePercentage: number;
	}[];
	classComparison: {
		className: string;
		studentCount: number;
		meanScore: number;
		maxScore: number;
		minScore: number;
		passCount: number;
		passRate: number;
	}[];
	remedialEnrichment: {
		remedialStudents: {
			rank: number;
			id: number;
			studentId: number;
			studentName: string;
			className: string;
			score: number;
			gap: number;
			wrongQuestionNumbers: number[];
		}[];
		enrichmentStudents: {
			rank: number;
			id: number;
			studentId: number;
			studentName: string;
			className: string;
			score: number;
		}[];
		priorityRemedialQuestions: {
			questionNumber: number;
			wrongCount: number;
			wrongPercentage: number;
			type: string;
			plainText: string;
		}[];
	};
	studentRoster: {
		rank: number;
		attemptId: number;
		studentId: number;
		studentName: string;
		username: string;
		nisn: string;
		nomorPeserta: string;
		className: string;
		score: number;
		status: string;
		correctCount: number;
		incorrectCount: number;
		unansweredCount: number;
		isPassed: boolean;
		durationMinutes: number | null;
		submitTime: string | null;
		violationCount: number;
	}[];
}

function cleanHtml(html: string | null | undefined): string {
	if (!html) return '';
	return html
		.replace(/<img[^>]*src="([^"]+)"[^>]*>/gi, '[Gambar]')
		.replace(/<[^>]*>?/gm, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/\s+/g, ' ')
		.trim();
}

const QUESTION_TYPE_LABELS: Record<string, string> = {
	pilihan_ganda: 'Pilihan Ganda',
	pilihan_ganda_kompleks: 'PG Kompleks',
	isian_singkat: 'Isian Singkat',
	essay: 'Uraian / Essay',
	benar_salah: 'Benar / Salah',
	menjodohkan: 'Menjodohkan'
};

export function calculateExamAnalytics(
	exam: any,
	questions: QuestionData[],
	attempts: StudentAttemptData[],
	answers: StudentAnswerData[],
	participants: any[] = [],
	options: { kkm?: number } = {}
): ExamAnalytics {
	const kkm = options.kkm ?? 75;

	// 1. Group answers by attempt and question
	const answersByAttempt: Record<number, Record<number, StudentAnswerData>> = {};
	const answersByQuestion: Record<number, StudentAnswerData[]> = {};

	for (const ans of answers) {
		if (!answersByAttempt[ans.attempt_id]) {
			answersByAttempt[ans.attempt_id] = {};
		}
		answersByAttempt[ans.attempt_id][ans.question_id] = ans;

		if (!answersByQuestion[ans.question_id]) {
			answersByQuestion[ans.question_id] = [];
		}
		answersByQuestion[ans.question_id].push(ans);
	}

	// 2. Filter completed/evaluated attempts
	const validAttempts = attempts.filter(
		(a) => a.score != null && (a.status === 'selesai' || a.status === 'waktu_habis')
	);

	// Sort attempts by score descending
	const sortedAttempts = [...validAttempts].sort((a, b) => (b.score || 0) - (a.score || 0));
	const totalParticipantsCount = Math.max(participants.length, attempts.length);

	const scores = sortedAttempts.map((a) => a.score || 0);
	const count = scores.length;

	// 3. Descriptive Score Statistics
	let meanScore = 0;
	let medianScore = 0;
	let modeScore: number[] = [];
	let minScore = 0;
	let maxScore = 0;
	let scoreRange = 0;
	let variance = 0;
	let standardDeviation = 0;

	if (count > 0) {
		const sum = scores.reduce((acc, val) => acc + val, 0);
		meanScore = Math.round((sum / count) * 100) / 100;
		minScore = Math.round(scores[count - 1] * 100) / 100;
		maxScore = Math.round(scores[0] * 100) / 100;
		scoreRange = Math.round((maxScore - minScore) * 100) / 100;

		// Median
		const mid = Math.floor(count / 2);
		medianScore =
			count % 2 !== 0 ? scores[mid] : Math.round(((scores[mid - 1] + scores[mid]) / 2) * 100) / 100;

		// Mode
		const freqMap: Record<number, number> = {};
		let maxFreq = 0;
		for (const s of scores) {
			freqMap[s] = (freqMap[s] || 0) + 1;
			if (freqMap[s] > maxFreq) maxFreq = freqMap[s];
		}
		if (maxFreq > 1) {
			modeScore = Object.keys(freqMap)
				.map(Number)
				.filter((s) => freqMap[s] === maxFreq)
				.sort((a, b) => b - a);
		} else {
			modeScore = [meanScore];
		}

		// Variance & SD (Sample variance)
		const sqDiffSum = scores.reduce((acc, val) => acc + Math.pow(val - meanScore, 2), 0);
		variance = count > 1 ? Math.round((sqDiffSum / (count - 1)) * 100) / 100 : 0;
		standardDeviation = Math.round(Math.sqrt(variance) * 100) / 100;
	}

	const passedCount = scores.filter((s) => s >= kkm).length;
	const failedCount = count - passedCount;
	const passRate = count > 0 ? Math.round((passedCount / count) * 1000) / 10 : 0;
	const isClassicalMastered = passRate >= 85;

	// Attendance & Status breakdown
	const completedCount = count;
	const inProgressCount = attempts.filter((a) => a.status === 'mengerjakan').length;
	const notStartedCount = Math.max(0, totalParticipantsCount - attempts.length);
	const attendanceRate =
		totalParticipantsCount > 0
			? Math.round(((completedCount + inProgressCount) / totalParticipantsCount) * 1000) / 10
			: 100;

	// 4. Frequency Distribution Histogram
	const distRanges = [
		{ label: '0 - 20', range: '0-20', min: 0, max: 20, color: '#f43f5e', category: 'Sangat Rendah' },
		{ label: '21 - 40', range: '21-40', min: 21, max: 40, color: '#f97316', category: 'Rendah' },
		{ label: '41 - 60', range: '41-60', min: 41, max: 60, color: '#eab308', category: 'Cukup' },
		{ label: '61 - 75', range: '61-75', min: 61, max: 75, color: '#06b6d4', category: 'Sedang' },
		{ label: '76 - 85', range: '76-85', min: 76, max: 85, color: '#3b82f6', category: 'Tinggi' },
		{ label: '86 - 100', range: '86-100', min: 86, max: 100, color: '#10b981', category: 'Sangat Tinggi' }
	];

	const frequencyDistribution = distRanges.map((dr) => {
		const rangeCount = scores.filter((s) => s >= dr.min && (dr.max === 100 ? s <= 100 : s <= dr.max)).length;
		const percentage = count > 0 ? Math.round((rangeCount / count) * 1000) / 10 : 0;
		return {
			...dr,
			count: rangeCount,
			percentage
		};
	});

	// 5. Item Analysis (Analisis Butir Soal)
	// Upper 27% and Lower 27%
	let groupSize = Math.ceil(count * 0.27);
	if (count > 0 && groupSize === 0) groupSize = 1;
	if (groupSize > Math.floor(count / 2)) {
		groupSize = Math.max(1, Math.floor(count / 2));
	}

	const upperAttempts = sortedAttempts.slice(0, groupSize);
	const lowerAttempts = sortedAttempts.slice(Math.max(0, count - groupSize));
	const upperIds = new Set(upperAttempts.map((a) => a.id));
	const lowerIds = new Set(lowerAttempts.map((a) => a.id));

	const itemAnalysisList: ItemAnalysisResult[] = questions.map((q) => {
		const qAnswers = answersByQuestion[q.id] || [];
		const maxPoints = q.points || 1;

		let correctCount = 0;
		let upperCorrect = 0;
		let lowerCorrect = 0;
		let totalScoreEarned = 0;
		let upperScoreEarned = 0;
		let lowerScoreEarned = 0;

		const distribution: Record<string, { total: number; upper: number; lower: number; percentage: number }> = {
			A: { total: 0, upper: 0, lower: 0, percentage: 0 },
			B: { total: 0, upper: 0, lower: 0, percentage: 0 },
			C: { total: 0, upper: 0, lower: 0, percentage: 0 },
			D: { total: 0, upper: 0, lower: 0, percentage: 0 },
			E: { total: 0, upper: 0, lower: 0, percentage: 0 }
		};

		for (const ans of qAnswers) {
			const isCorr = ans.is_correct === 1 || ans.is_correct === true;
			const scoreG = ans.score_given != null ? Number(ans.score_given) : isCorr ? maxPoints : 0;

			if (isCorr) {
				correctCount++;
				if (upperIds.has(ans.attempt_id)) upperCorrect++;
				if (lowerIds.has(ans.attempt_id)) lowerCorrect++;
			}

			totalScoreEarned += scoreG;
			if (upperIds.has(ans.attempt_id)) upperScoreEarned += scoreG;
			if (lowerIds.has(ans.attempt_id)) lowerScoreEarned += scoreG;

			// Check option distribution for multiple-choice
			if (q.type === 'pilihan_ganda' || q.type === 'pilihan_ganda_kompleks') {
				const rawGiven = (ans.answer_given || '').trim().toUpperCase();
				// Could be single option like "A" or array/json
				let optionsGiven = [rawGiven];
				try {
					const parsed = JSON.parse(ans.answer_given || '');
					if (Array.isArray(parsed)) {
						optionsGiven = parsed.map((x) => String(x).trim().toUpperCase());
					}
				} catch {
					// Single string
				}

				for (const optKey of optionsGiven) {
					if (!optKey) continue;
					if (!distribution[optKey]) {
						distribution[optKey] = { total: 0, upper: 0, lower: 0, percentage: 0 };
					}
					distribution[optKey].total++;
					if (upperIds.has(ans.attempt_id)) distribution[optKey].upper++;
					if (lowerIds.has(ans.attempt_id)) distribution[optKey].lower++;
				}
			}
		}

		// Calculate distribution percentage
		const totalAnsCount = qAnswers.length;
		for (const key of Object.keys(distribution)) {
			distribution[key].percentage =
				totalAnsCount > 0 ? Math.round((distribution[key].total / totalAnsCount) * 1000) / 10 : 0;
		}

		// Parse correct answer
		let cleanCorrectKey = '-';
		try {
			if (q.correct_answer_json) {
				const parsed = JSON.parse(q.correct_answer_json);
				cleanCorrectKey = typeof parsed === 'string' ? parsed : Array.isArray(parsed) ? parsed.join(', ') : JSON.stringify(parsed);
			}
		} catch {
			cleanCorrectKey = q.correct_answer_json || '-';
		}

		// Parse question options
		let parsedOptions: { key: string; text: string; isCorrect: boolean }[] = [];
		try {
			if (q.options_json) {
				const parsed = JSON.parse(q.options_json);
				if (Array.isArray(parsed)) {
					parsedOptions = parsed.map((opt: any, idx: number) => {
						const key = opt.key || String.fromCharCode(65 + idx);
						const optText = opt.text || opt.label || String(opt);
						const isCorr = cleanCorrectKey.split(',').map((x) => x.trim().toUpperCase()).includes(key.toUpperCase());
						return { key, text: cleanHtml(optText), isCorrect: isCorr };
					});
				}
			}
		} catch {
			parsedOptions = [];
		}

		// 1. Difficulty Index (P)
		const maxPossibleScore = (totalAnsCount || count || 1) * maxPoints;
		const p = maxPossibleScore > 0 ? Math.round((totalScoreEarned / maxPossibleScore) * 100) / 100 : 0;
		let pCategory: 'Sukar' | 'Sedang' | 'Mudah' = 'Sedang';
		let pColor = 'text-amber-600 bg-amber-50 border-amber-200';

		if (p < 0.3) {
			pCategory = 'Sukar';
			pColor = 'text-rose-600 bg-rose-50 border-rose-200';
		} else if (p > 0.7) {
			pCategory = 'Mudah';
			pColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
		}

		// 2. Discrimination Index (D)
		let d = 0;
		if (groupSize > 0 && maxPoints > 0) {
			const upperMean = upperScoreEarned / groupSize;
			const lowerMean = lowerScoreEarned / groupSize;
			d = Math.round(((upperMean - lowerMean) / maxPoints) * 100) / 100;
		}

		let dCategory: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Buruk' | 'Negatif' = 'Cukup';
		let dColor = 'text-sky-600 bg-sky-50 border-sky-200';

		if (d >= 0.4) {
			dCategory = 'Sangat Baik';
			dColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
		} else if (d >= 0.3) {
			dCategory = 'Baik';
			dColor = 'text-teal-600 bg-teal-50 border-teal-200';
		} else if (d >= 0.2) {
			dCategory = 'Cukup';
			dColor = 'text-amber-600 bg-amber-50 border-amber-200';
		} else if (d >= 0) {
			dCategory = 'Buruk';
			dColor = 'text-rose-600 bg-rose-50 border-rose-200';
		} else {
			dCategory = 'Negatif';
			dColor = 'text-purple-600 bg-purple-50 border-purple-200';
		}

		// 3. Status Recommendation
		let status: 'Diterima' | 'Revisi' | 'Ditolak' = 'Diterima';
		let statusColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';

		if (d < 0.2 || d < 0) {
			status = 'Ditolak';
			statusColor = 'bg-rose-100 text-rose-800 border-rose-300';
		} else if (d < 0.3 || pCategory === 'Sukar' || pCategory === 'Mudah') {
			status = 'Revisi';
			statusColor = 'bg-amber-100 text-amber-800 border-amber-300';
		}

		// 4. Distractor Efficiency (< 5% test takers chose = non-functioning)
		const nonFunctioningDistractors: string[] = [];
		if (q.type === 'pilihan_ganda') {
			const correctKeys = cleanCorrectKey.split(',').map((x) => x.trim().toUpperCase());
			for (const optKey of ['A', 'B', 'C', 'D', 'E']) {
				if (!correctKeys.includes(optKey) && distribution[optKey] && distribution[optKey].percentage < 5.0) {
					nonFunctioningDistractors.push(optKey);
				}
			}
		}

		return {
			id: q.id,
			question_number: q.question_number,
			type: q.type,
			question_text: q.question_text,
			plain_text: cleanHtml(q.question_text),
			points: maxPoints,
			correct_answer: cleanCorrectKey,
			options: parsedOptions,
			answeredCount: totalAnsCount,
			correctCount,
			incorrectCount: totalAnsCount - correctCount,
			pIndex: p,
			pCategory,
			pColor,
			dIndex: d,
			dCategory,
			dColor,
			status,
			statusColor,
			upperCorrect,
			lowerCorrect,
			distribution,
			nonFunctioningDistractors
		};
	});

	// Item Analysis Summary
	const easyCount = itemAnalysisList.filter((i) => i.pCategory === 'Mudah').length;
	const moderateCount = itemAnalysisList.filter((i) => i.pCategory === 'Sedang').length;
	const hardCount = itemAnalysisList.filter((i) => i.pCategory === 'Sukar').length;

	const veryGoodD = itemAnalysisList.filter((i) => i.dCategory === 'Sangat Baik').length;
	const goodD = itemAnalysisList.filter((i) => i.dCategory === 'Baik').length;
	const fairD = itemAnalysisList.filter((i) => i.dCategory === 'Cukup').length;
	const poorD = itemAnalysisList.filter((i) => i.dCategory === 'Buruk' || i.dCategory === 'Negatif').length;

	const acceptedCount = itemAnalysisList.filter((i) => i.status === 'Diterima').length;
	const reviseCount = itemAnalysisList.filter((i) => i.status === 'Revisi').length;
	const rejectedCount = itemAnalysisList.filter((i) => i.status === 'Ditolak').length;

	const mostDifficult = [...itemAnalysisList]
		.sort((a, b) => a.pIndex - b.pIndex)
		.slice(0, 5)
		.map((i) => ({ number: i.question_number, p: i.pIndex, text: i.plain_text.slice(0, 60) }));

	const bestDiscriminators = [...itemAnalysisList]
		.sort((a, b) => b.dIndex - a.dIndex)
		.slice(0, 5)
		.map((i) => ({ number: i.question_number, d: i.dIndex, text: i.plain_text.slice(0, 60) }));

	// 6. Test Reliability (Cronbach's Alpha / KR-20)
	const k = questions.length;
	let cronbachAlpha = 0;
	let reliabilityCategory = 'Belum Cukup Data';
	let reliabilityDescription = 'Perlu minimal 2 siswa dan 2 soal untuk menghitung koefisien reliabilitas.';

	if (k > 1 && count > 1 && variance > 0) {
		// Calculate sum of item variances
		let sumItemVariances = 0;
		for (const q of questions) {
			const qAnswers = answersByQuestion[q.id] || [];
			const maxP = q.points || 1;
			const itemScores: number[] = [];

			for (const att of sortedAttempts) {
				const ans = answersByAttempt[att.id]?.[q.id];
				const sc = ans ? (ans.score_given != null ? Number(ans.score_given) : (ans.is_correct ? maxP : 0)) : 0;
				itemScores.push(sc);
			}

			if (itemScores.length > 1) {
				const itemMean = itemScores.reduce((a, b) => a + b, 0) / itemScores.length;
				const itemVar =
					itemScores.reduce((acc, val) => acc + Math.pow(val - itemMean, 2), 0) / (itemScores.length - 1);
				sumItemVariances += itemVar;
			}
		}

		// Alpha formula: (k / (k - 1)) * (1 - sumItemVariances / totalVariance)
		// Note: score scale is out of 100, so we convert student scores variance to point scale variance if needed
		const totalExamPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
		const rawStudentScores = sortedAttempts.map((a) => {
			let rawPoints = 0;
			for (const q of questions) {
				const ans = answersByAttempt[a.id]?.[q.id];
				if (ans) {
					rawPoints += ans.score_given != null ? Number(ans.score_given) : (ans.is_correct ? (q.points || 1) : 0);
				}
			}
			return rawPoints;
		});

		const rawMean = rawStudentScores.reduce((a, b) => a + b, 0) / rawStudentScores.length;
		const rawVariance =
			rawStudentScores.reduce((acc, val) => acc + Math.pow(val - rawMean, 2), 0) / (rawStudentScores.length - 1);

		if (rawVariance > 0) {
			const alphaRaw = (k / (k - 1)) * (1 - sumItemVariances / rawVariance);
			cronbachAlpha = Math.round(Math.max(-1, Math.min(1, alphaRaw)) * 100) / 100;
		}

		if (cronbachAlpha >= 0.8) {
			reliabilityCategory = 'Sangat Tinggi (Sangat Konsisten)';
			reliabilityDescription = 'Alat evaluasi memiliki tingkat keandalan yang sangat tinggi. Hasil tes sangat dapat dipercaya untuk pengambilan keputusan evaluasi.';
		} else if (cronbachAlpha >= 0.6) {
			reliabilityCategory = 'Tinggi (Konsisten)';
			reliabilityDescription = 'Alat evaluasi memiliki konsistensi yang baik dan layak digunakan sebagai instrumen asesmen formal.';
		} else if (cronbachAlpha >= 0.4) {
			reliabilityCategory = 'Cukup';
			reliabilityDescription = 'Tingkat konsistensi memadai, namun beberapa butir soal dianjurkan untuk direvisi guna meningkatkan ketepatan pengukuran.';
		} else {
			reliabilityCategory = 'Rendah (Perlu Perbaikan)';
			reliabilityDescription = 'Instrumen belum cukup stabil mengukur kompetensi. Direkomendasikan evaluasi menyeluruh terhadap daya beda soal.';
		}
	}

	// 7. Performance by Question Type
	const typeMap: Record<string, { count: number; totalPoints: number; earnedPoints: number }> = {};
	for (const q of questions) {
		const qType = q.type || 'pilihan_ganda';
		if (!typeMap[qType]) {
			typeMap[qType] = { count: 0, totalPoints: 0, earnedPoints: 0 };
		}
		typeMap[qType].count++;
		typeMap[qType].totalPoints += (q.points || 1) * (count || 1);

		const qAnswers = answersByQuestion[q.id] || [];
		for (const ans of qAnswers) {
			typeMap[qType].earnedPoints +=
				ans.score_given != null ? Number(ans.score_given) : (ans.is_correct ? (q.points || 1) : 0);
		}
	}

	const typeBreakdown = Object.keys(typeMap).map((typeKey) => {
		const tm = typeMap[typeKey];
		const pct = tm.totalPoints > 0 ? Math.round((tm.earnedPoints / tm.totalPoints) * 1000) / 10 : 0;
		return {
			type: typeKey,
			label: QUESTION_TYPE_LABELS[typeKey] || typeKey,
			questionCount: tm.count,
			totalPoints: tm.totalPoints / (count || 1),
			averageScorePercentage: pct
		};
	});

	// 8. Cross-Class Comparison
	const classMap: Record<
		string,
		{ count: number; sumScore: number; maxScore: number; minScore: number; passCount: number }
	> = {};

	for (const att of sortedAttempts) {
		const cName = att.class_name || 'Tanpa Kelas';
		if (!classMap[cName]) {
			classMap[cName] = { count: 0, sumScore: 0, maxScore: -1, minScore: 999, passCount: 0 };
		}
		const sc = att.score || 0;
		classMap[cName].count++;
		classMap[cName].sumScore += sc;
		if (sc > classMap[cName].maxScore) classMap[cName].maxScore = sc;
		if (sc < classMap[cName].minScore) classMap[cName].minScore = sc;
		if (sc >= kkm) classMap[cName].passCount++;
	}

	const classComparison = Object.keys(classMap).map((cName) => {
		const cm = classMap[cName];
		return {
			className: cName,
			studentCount: cm.count,
			meanScore: cm.count > 0 ? Math.round((cm.sumScore / cm.count) * 100) / 100 : 0,
			maxScore: cm.maxScore === -1 ? 0 : cm.maxScore,
			minScore: cm.minScore === 999 ? 0 : cm.minScore,
			passCount: cm.passCount,
			passRate: cm.count > 0 ? Math.round((cm.passCount / cm.count) * 1000) / 10 : 0
		};
	});

	// 9. Remedial & Enrichment Lists
	const remedialStudents: ExamAnalytics['remedialEnrichment']['remedialStudents'] = [];
	const enrichmentStudents: ExamAnalytics['remedialEnrichment']['enrichmentStudents'] = [];

	sortedAttempts.forEach((att, idx) => {
		const sc = att.score || 0;
		if (sc < kkm) {
			const wrongQNums: number[] = [];
			for (const q of questions) {
				const ans = answersByAttempt[att.id]?.[q.id];
				const isCorr = ans?.is_correct === 1 || ans?.is_correct === true;
				if (!isCorr) {
					wrongQNums.push(q.question_number);
				}
			}
			remedialStudents.push({
				rank: idx + 1,
				id: att.id,
				studentId: att.student_id,
				studentName: att.student_name,
				className: att.class_name || '-',
				score: sc,
				gap: Math.round((kkm - sc) * 10) / 10,
				wrongQuestionNumbers: wrongQNums
			});
		} else {
			enrichmentStudents.push({
				rank: idx + 1,
				id: att.id,
				studentId: att.student_id,
				studentName: att.student_name,
				className: att.class_name || '-',
				score: sc
			});
		}
	});

	// Priority remedial questions (questions failed by most remedial students)
	const questionWrongCounts: Record<number, number> = {};
	for (const rem of remedialStudents) {
		for (const qNum of rem.wrongQuestionNumbers) {
			questionWrongCounts[qNum] = (questionWrongCounts[qNum] || 0) + 1;
		}
	}

	const priorityRemedialQuestions = Object.keys(questionWrongCounts)
		.map((qNumStr) => {
			const qNum = Number(qNumStr);
			const qObj = questions.find((q) => q.question_number === qNum);
			const wrongC = questionWrongCounts[qNum];
			const wrongPct =
				remedialStudents.length > 0 ? Math.round((wrongC / remedialStudents.length) * 1000) / 10 : 0;
			return {
				questionNumber: qNum,
				wrongCount: wrongC,
				wrongPercentage: wrongPct,
				type: qObj?.type || 'pilihan_ganda',
				plainText: cleanHtml(qObj?.question_text || '')
			};
		})
		.sort((a, b) => b.wrongPercentage - a.wrongPercentage)
		.slice(0, 5);

	// 10. Student Roster (Rekapitulasi Lengkap)
	const studentRoster = sortedAttempts.map((att, idx) => {
		let correctC = 0;
		let incorrectC = 0;
		let unansweredC = 0;

		for (const q of questions) {
			const ans = answersByAttempt[att.id]?.[q.id];
			if (!ans || ans.answer_given == null || ans.answer_given === '') {
				unansweredC++;
			} else if (ans.is_correct === 1 || ans.is_correct === true) {
				correctC++;
			} else {
				incorrectC++;
			}
		}

		let durationMin: number | null = null;
		if (att.start_time && att.submit_time) {
			const st = new Date(att.start_time.replace(' ', 'T')).getTime();
			const en = new Date(att.submit_time.replace(' ', 'T')).getTime();
			if (!isNaN(st) && !isNaN(en) && en >= st) {
				durationMin = Math.round((en - st) / 60000);
			}
		}

		return {
			rank: idx + 1,
			attemptId: att.id,
			studentId: att.student_id,
			studentName: att.student_name,
			username: att.username || '',
			nisn: att.nisn || '',
			nomorPeserta: att.nomor_peserta || '',
			className: att.class_name || '-',
			score: att.score || 0,
			status: att.status,
			correctCount: correctC,
			incorrectCount: incorrectC,
			unansweredCount: unansweredC,
			isPassed: (att.score || 0) >= kkm,
			durationMinutes: durationMin,
			submitTime: att.submit_time || null,
			violationCount: att.violation_count || 0
		};
	});

	return {
		exam: {
			id: exam.id,
			title: exam.title,
			display_title: exam.display_title || exam.title,
			subject_name: exam.subject_name || '-',
			class_name: exam.class_name || '-',
			exam_type_code: exam.exam_type_code || '',
			duration_minutes: exam.duration_minutes || 60,
			start_time: exam.start_time,
			end_time: exam.end_time
		},
		kkm,
		summary: {
			totalParticipants: totalParticipantsCount,
			completedCount,
			inProgressCount,
			notStartedCount,
			attendanceRate,
			meanScore,
			medianScore,
			modeScore,
			maxScore,
			minScore,
			scoreRange,
			variance,
			standardDeviation,
			passedCount,
			failedCount,
			passRate,
			isClassicalMastered,
			cronbachAlpha,
			reliabilityCategory,
			reliabilityDescription
		},
		frequencyDistribution,
		itemAnalysis: {
			items: itemAnalysisList,
			summary: {
				totalQuestions: itemAnalysisList.length,
				easyCount,
				moderateCount,
				hardCount,
				veryGoodD,
				goodD,
				fairD,
				poorD,
				acceptedCount,
				reviseCount,
				rejectedCount,
				mostDifficult,
				bestDiscriminators
			}
		},
		typeBreakdown,
		classComparison,
		remedialEnrichment: {
			remedialStudents,
			enrichmentStudents,
			priorityRemedialQuestions
		},
		studentRoster
	};
}
