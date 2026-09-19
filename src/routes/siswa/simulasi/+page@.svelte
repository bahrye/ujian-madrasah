<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import Timer from '$lib/components/exam/Timer.svelte';
	import QuestionRenderer from '$lib/components/exam/QuestionRenderer.svelte';
	import QuestionNav from '$lib/components/exam/QuestionNav.svelte';
	import { SIMULATION_QUESTIONS, type SimulationQuestion } from '$lib/data/simulationQuestions';
	import { ICONS } from '$lib/utils/constants';

	export let data;

	// State apakah sedang di halaman pengantar atau sedang menjalankan ujian simulasi
	let isSimulating = false;

	// Daftar soal simulasi yang diacak saat simulasi dimulai
	let questions: SimulationQuestion[] = [];
	let currentIndex = 0;
	let showNav = false;
	let showSubmitConfirm = false;
	let finishConfirmationInput = '';
	$: isFinishConfirmed = finishConfirmationInput.trim().toUpperCase() === 'SELESAI';
	let showResultModal = false;
	let showExitConfirm = false;

	// State jawaban siswa
	let localAnswers: Record<number, string> = {};
	let localDoubts: Record<number, boolean> = {};

	// Timer 30 menit (ISO datetime)
	let currentEndTime = '';
	let timeElapsedSeconds = 0;
	let elapsedInterval: any = null;

	// Metadata & Perhitungan untuk Halaman Penjelasan
	$: sourceQuestions = (data.questions && data.questions.length > 0) ? data.questions : SIMULATION_QUESTIONS;

	const SUBJECT_META: Record<string, { bg: string; text: string; border: string; icon: string }> = {
		'Matematika': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: '📐' },
		'IPA': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '🔬' },
		'IPS': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '🌍' },
		'Bahasa Indonesia': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', icon: '📖' },
		'Bahasa Arab': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', icon: '🕌' },
		'Bahasa Inggris': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', icon: '🌐' },
		"Al-Qur'an Hadis": { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: '📗' },
		'Akidah Akhlak': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: '🤲' },
		'Fikih': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: '⚖️' },
		'SKI': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: '📜' }
	};

	$: subjectDistribution = (() => {
		const map: Record<string, number> = {};
		for (const q of sourceQuestions) {
			const s = q.subject || 'Umum';
			map[s] = (map[s] || 0) + 1;
		}
		return Object.entries(map).map(([name, count]) => ({
			name,
			count,
			meta: SUBJECT_META[name] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: '📚' }
		}));
	})();

	const TYPE_METADATA: Record<string, { label: string; icon: string; badge: string; color: string; desc: string }> = {
		pilihan_ganda: {
			label: 'Pilihan Ganda',
			icon: '🔘',
			badge: 'Tunggal',
			color: 'bg-blue-100 text-blue-700 border-blue-200',
			desc: 'Memilih 1 jawaban paling tepat dari opsi yang tersedia (A, B, C, D, atau E).'
		},
		pilihan_ganda_kompleks: {
			label: 'Pilihan Ganda Kompleks',
			icon: '☑️',
			badge: 'Centang Banyak',
			color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
			desc: 'Memiliki lebih dari satu jawaban benar. Centang seluruh kotak opsi yang sesuai.'
		},
		benar_salah: {
			label: 'Benar / Salah',
			icon: '⚖️',
			badge: 'B / S',
			color: 'bg-amber-100 text-amber-700 border-amber-200',
			desc: 'Menilai kebenaran dari pernyataan tunggal atau baris tabel dengan tombol B (Benar) atau S (Salah).'
		},
		menjodohkan: {
			label: 'Menjodohkan',
			icon: '🔗',
			badge: 'Pasangan Kartu',
			color: 'bg-purple-100 text-purple-700 border-purple-200',
			desc: 'Menghubungkan kartu pertanyaan di sisi kiri dengan pasangan jawaban di sisi kanan.'
		},
		isian_singkat: {
			label: 'Isian Singkat',
			icon: '✍️',
			badge: 'Ketik Singkat',
			color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
			desc: 'Mengetik jawaban singkat langsung ke dalam kolom teks berupa kata kunci, frasa, atau angka.'
		},
		essay: {
			label: 'Uraian / Essay',
			icon: '📝',
			badge: 'Uraian Teks',
			color: 'bg-rose-100 text-rose-700 border-rose-200',
			desc: 'Menuliskan uraian, argumen, atau langkah penyelesaian secara lengkap pada kotak jawaban.'
		}
	};

	$: typeDistribution = (() => {
		const map: Record<string, number> = {};
		for (const q of sourceQuestions) {
			const t = q.type || 'pilihan_ganda';
			map[t] = (map[t] || 0) + 1;
		}
		return map;
	})();

	// Fullscreen state
	let isFullscreen = false;
	let hasRequestedFullscreen = false;

	// Header title marquee detection
	let titleElement: HTMLElement;
	let titleClientWidth = 0;
	let isTitleOverflowing = false;
	$: if (titleElement && titleClientWidth) {
		setTimeout(() => {
			if (titleElement) {
				isTitleOverflowing = titleElement.scrollWidth > titleClientWidth;
			}
		}, 0);
	}

	// Wake lock
	let wakeLock: any = null;
	async function requestWakeLock() {
		try {
			if ('wakeLock' in navigator) {
				wakeLock = await (navigator as any).wakeLock.request('screen');
			}
		} catch (err) {
			console.warn('Wake Lock error:', err);
		}
	}

	// Fullscreen handlers
	async function toggleFullscreen() {
		if (!browser) return;
		try {
			if (!document.fullscreenElement) {
				await document.documentElement.requestFullscreen();
				isFullscreen = true;
			} else {
				await document.exitFullscreen();
				isFullscreen = false;
			}
		} catch (err) {
			console.warn('Fullscreen error:', err);
		}
	}

	function handleFullscreenChange() {
		if (!browser) return;
		isFullscreen = !!document.fullscreenElement;
	}

	// Fisher-Yates Shuffle
	function shuffleArray<T>(array: T[]): T[] {
		const arr = [...array];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	function initSimulation() {
		const sourceQuestions = (data.questions && data.questions.length > 0) ? data.questions : SIMULATION_QUESTIONS;
		// Acak urutan soal yang disesuaikan dengan jenjang dan kelas siswa
		const shuffled = shuffleArray(sourceQuestions).map((q, idx) => ({
			...q,
			question_number: idx + 1
		}));
		questions = shuffled;
		currentIndex = 0;
		localAnswers = {};
		localDoubts = {};
		finishConfirmationInput = '';
		showNav = false;
		showSubmitConfirm = false;
		showResultModal = false;
		showExitConfirm = false;

		// Set waktu 30 menit dari sekarang
		const end = new Date(Date.now() + 30 * 60 * 1000);
		currentEndTime = end.toISOString();

		timeElapsedSeconds = 0;
		if (elapsedInterval) clearInterval(elapsedInterval);
		elapsedInterval = setInterval(() => {
			timeElapsedSeconds++;
		}, 1000);

		scrollToTop();
	}

	$: currentQuestion = questions[currentIndex] || null;

	$: navQuestions = questions.map((q, idx) => {
		const ans = localAnswers[q.id];
		const isAnswered = ans !== undefined && ans !== null && ans !== '' && ans !== '[]' && ans !== '{}';
		return {
			id: q.id,
			question_number: idx + 1,
			answered: isAnswered,
			doubted: !!localDoubts[q.id]
		};
	});

	$: answeredCount = navQuestions.filter(q => q.answered).length;
	$: doubtedCount = navQuestions.filter(q => q.doubted).length;
	$: unansweredCount = questions.length - answeredCount;

	function scrollToTop() {
		if (browser) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function handleAnswer(e: CustomEvent<{ questionId: number; answer: string }>) {
		localAnswers[e.detail.questionId] = e.detail.answer;
		localAnswers = { ...localAnswers };
	}

	function handleDoubt(e: CustomEvent<{ questionId: number; doubted: boolean }>) {
		localDoubts[e.detail.questionId] = e.detail.doubted;
		localDoubts = { ...localDoubts };
	}

	function next() {
		if (currentIndex < questions.length - 1) {
			currentIndex++;
			scrollToTop();
		}
	}

	function prev() {
		if (currentIndex > 0) {
			currentIndex--;
			scrollToTop();
		}
	}

	function goToQuestion(index: number) {
		if (index >= 0 && index < questions.length) {
			currentIndex = index;
			showNav = false;
			scrollToTop();
		}
	}

	function handleTimeUp() {
		evaluateAndFinish();
	}

	// Evaluasi Nilai Simulasi
	let scoreResult = {
		totalScore: 0,
		correctCount: 0,
		wrongCount: 0,
		unansweredCount: 0
	};

	function evaluateAndFinish() {
		if (elapsedInterval) clearInterval(elapsedInterval);
		showSubmitConfirm = false;

		let correct = 0;
		let wrong = 0;
		let unans = 0;
		let score = 0;

		for (const q of questions) {
			const ans = localAnswers[q.id];
			if (!ans || ans === '' || ans === '[]' || ans === '{}') {
				unans++;
				continue;
			}

			let isCorrect = false;

			if (q.type === 'pilihan_ganda') {
				isCorrect = String(ans).trim().toUpperCase() === String(q.correct_answer).trim().toUpperCase();
			} else if (q.type === 'pilihan_ganda_kompleks') {
				try {
					const userChoices: string[] = JSON.parse(ans);
					const correctChoices: string[] = JSON.parse(q.correct_answer);
					if (Array.isArray(userChoices) && Array.isArray(correctChoices)) {
						const sortedUser = [...userChoices].sort().join(',');
						const sortedCorrect = [...correctChoices].sort().join(',');
						isCorrect = sortedUser === sortedCorrect;
					}
				} catch {
					isCorrect = false;
				}
			} else if (q.type === 'benar_salah') {
				try {
					const userAns = JSON.parse(ans);
					const correctAns = JSON.parse(q.correct_answer);
					let allMatch = true;
					for (const key of Object.keys(correctAns)) {
						if (String(userAns[key] || '').toLowerCase() !== String(correctAns[key] || '').toLowerCase()) {
							allMatch = false;
							break;
						}
					}
					isCorrect = allMatch;
				} catch {
					isCorrect = false;
				}
			} else if (q.type === 'menjodohkan') {
				try {
					const userAns = JSON.parse(ans);
					const correctAns = JSON.parse(q.correct_answer);
					let allMatch = true;
					for (const key of Object.keys(correctAns)) {
						const expected = String(correctAns[key]).trim().toUpperCase();
						let actual = userAns[key] !== undefined ? String(userAns[key]).trim().toUpperCase() : undefined;
						if (actual === undefined) {
							const numKey = parseInt(key, 10);
							if (!isNaN(numKey)) {
								if (userAns[String(numKey - 1)] !== undefined) actual = String(userAns[String(numKey - 1)]).trim().toUpperCase();
								else if (userAns[String(numKey + 1)] !== undefined) actual = String(userAns[String(numKey + 1)]).trim().toUpperCase();
							}
						}
						const isMatch = actual === expected ||
							(actual !== undefined && expected.length === 1 && expected >= 'A' && expected <= 'Z' && actual === String(expected.charCodeAt(0) - 65)) ||
							(actual !== undefined && actual.length === 1 && actual >= 'A' && actual <= 'Z' && expected === String(actual.charCodeAt(0) - 65));
						if (!isMatch) {
							allMatch = false;
							break;
						}
					}
					isCorrect = allMatch;
				} catch {
					isCorrect = false;
				}
			} else if (q.type === 'isian_singkat') {
				const cleanUser = String(ans).trim().toLowerCase();
				const cleanCorrect = String(q.correct_answer).trim().toLowerCase();
				isCorrect = cleanUser === cleanCorrect || cleanCorrect.includes(cleanUser);
			} else if (q.type === 'essay') {
				isCorrect = String(ans).trim().length > 15;
			}

			if (isCorrect) {
				correct++;
				score += q.points;
			} else {
				wrong++;
			}
		}

		const totalMaxScore = questions.reduce((sum, q) => sum + (q.points || 4), 0);
		scoreResult = {
			totalScore: totalMaxScore > 0 ? Math.min(100, Math.round((score / totalMaxScore) * 100)) : 0,
			correctCount: correct,
			wrongCount: wrong,
			unansweredCount: unans
		};

		showResultModal = true;
	}

	function startSimulation() {
		isSimulating = true;
		initSimulation();
		requestWakeLock();
		if (browser && !document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch(() => {});
		}
		scrollToTop();
	}

	function backToExplanation() {
		if (elapsedInterval) clearInterval(elapsedInterval);
		if (browser && document.fullscreenElement) {
			document.exitFullscreen().catch(() => {});
		}
		showExitConfirm = false;
		showResultModal = false;
		isSimulating = false;
		scrollToTop();
	}

	function exitSimulation() {
		if (elapsedInterval) clearInterval(elapsedInterval);
		if (browser && document.fullscreenElement) {
			document.exitFullscreen().catch(() => {});
		}
		goto('/siswa');
	}

	onMount(() => {
		if (browser) {
			isFullscreen = !!document.fullscreenElement;
		}
	});

	onDestroy(() => {
		if (elapsedInterval) clearInterval(elapsedInterval);
		if (wakeLock) {
			wakeLock.release().catch(() => {});
		}
	});
</script>

<svelte:head>
	<title>{isSimulating ? '[SIMULASI] CBT' : 'Informasi & Panduan Simulasi'} — Ujian Online Madrasah</title>
</svelte:head>

<svelte:document on:fullscreenchange={handleFullscreenChange} />

{#if !isSimulating}
	<!-- Dedicated Explanation Page: "Halaman Khusus Penjelasan Soal, Jumlah Soal, Mapel, Tata Cara, & Tombol Mulai Simulasi" -->
	<div class="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased">
		<!-- Top Bar -->
		<header class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
			<div class="max-w-5xl mx-auto flex items-center justify-between gap-4">
				<a
					href="/siswa"
					class="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-100/80"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					<span>Kembali ke Beranda</span>
				</a>

				<div class="flex items-center gap-2">
					<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
						<span class="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
						Simulasi CBT Madrasah
					</span>
				</div>

				<a
					href="/siswa/tata-tertib"
					class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
				>
					<span class="hidden sm:inline">Panduan &</span> Tata Tertib
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</a>
			</div>
		</header>

		<!-- Main Content Container -->
		<main class="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
			<!-- Hero Card with Gradient & Details -->
			<div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-indigo-600/30">
				<!-- Ambient Glow Elements -->
				<div class="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
				<div class="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-purple-500/20 blur-xl pointer-events-none"></div>

				<div class="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
					<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-indigo-100 text-xs font-bold tracking-wide uppercase">
						<span>✨</span>
						<span>Latihan Mandiri & Uji Coba CBT</span>
					</div>

					<h1 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
						Simulasi Ujian Berbasis Komputer
					</h1>

					<p class="text-indigo-100/90 text-xs sm:text-sm md:text-base leading-relaxed">
						Halaman simulasi ini dirancang khusus menyerupai antarmuka ujian resmi CBT Madrasah. Pelajari seluruh penjelasan soal, rincian mata pelajaran, dan tata cara menjawab di bawah sebelum memulai ujian.
					</p>

					<!-- Student & School Badge Chips -->
					<div class="flex items-center gap-2 pt-2 flex-wrap text-xs font-semibold">
						<span class="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5">
							<span>👤</span>
							<span>{data.user?.name || 'Peserta Ujian'}</span>
						</span>
						<span class="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center gap-1.5">
							<span>🏫</span>
							<span>{data.schoolName || 'Madrasah'}</span>
						</span>
						<span class="px-3 py-1 rounded-xl bg-emerald-400/20 border border-emerald-400/40 text-emerald-200 flex items-center gap-1.5">
							<span>🎓</span>
							<span>{data.displayLevel || data.className || 'Tingkat Siswa'}</span>
						</span>
					</div>
				</div>
			</div>

			<!-- 4 Overview Metric Cards -->
			<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
				<!-- Jumlah Soal -->
				<div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2 hover:border-indigo-200 transition-colors">
					<div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
						📝
					</div>
					<div>
						<p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Jumlah Soal</p>
						<p class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{sourceQuestions.length} Nomor</p>
						<p class="text-[11px] text-slate-400 mt-0.5">Soal teracak otomatis</p>
					</div>
				</div>

				<!-- Alokasi Waktu -->
				<div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2 hover:border-amber-200 transition-colors">
					<div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
						⏱️
					</div>
					<div>
						<p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Durasi Waktu</p>
						<p class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">30 Menit</p>
						<p class="text-[11px] text-slate-400 mt-0.5">Timer hitung mundur</p>
					</div>
				</div>

				<!-- Mata Pelajaran -->
				<div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2 hover:border-emerald-200 transition-colors">
					<div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
						📚
					</div>
					<div>
						<p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Mata Pelajaran</p>
						<p class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">{subjectDistribution.length} Mapel</p>
						<p class="text-[11px] text-slate-400 mt-0.5">Kombinasi kurikulum</p>
					</div>
				</div>

				<!-- Sistem Evaluasi -->
				<div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-2 hover:border-purple-200 transition-colors">
					<div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
						🎯
					</div>
					<div>
						<p class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Hasil & Nilai</p>
						<p class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Skor Instan</p>
						<p class="text-[11px] text-slate-400 mt-0.5">Skala 0 - 100 langsung</p>
					</div>
				</div>
			</div>

			<!-- Section 1: Mapel Soal (Mata Pelajaran yang Diujikan) -->
			<div class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
				<div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
					<div>
						<div class="flex items-center gap-2">
							<span class="text-xl">📚</span>
							<h2 class="text-base sm:text-lg font-bold text-slate-800">Mata Pelajaran yang Diujikan (Mapel Soal)</h2>
						</div>
						<p class="text-xs sm:text-sm text-slate-500 mt-0.5">
							Paket simulasi ini merangkum {subjectDistribution.length} mata pelajaran pokok yang disesuaikan dengan kurikulum <strong>{data.displayLevel || 'Madrasah'}</strong>:
						</p>
					</div>
					<span class="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
						Total {sourceQuestions.length} Butir Soal
					</span>
				</div>

				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 pt-1">
					{#each subjectDistribution as sub}
						<div class="p-3 rounded-xl border {sub.meta.border} {sub.meta.bg} flex items-center justify-between gap-2 shadow-2xs">
							<div class="flex items-center gap-2 min-w-0">
								<span class="text-base sm:text-lg shrink-0">{sub.meta.icon}</span>
								<span class="text-xs font-bold {sub.meta.text} truncate" title={sub.name}>{sub.name}</span>
							</div>
							<span class="text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-md bg-white/90 border border-slate-200/80 {sub.meta.text} shrink-0">
								{sub.count} Soal
							</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Section 2: Penjelasan Soal-Soal yang Ada (Tipe Soal) -->
			<div class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
				<div class="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
					<div>
						<div class="flex items-center gap-2">
							<span class="text-xl">🧩</span>
							<h2 class="text-base sm:text-lg font-bold text-slate-800">Penjelasan Model Tipe Soal Ujian</h2>
						</div>
						<p class="text-xs sm:text-sm text-slate-500 mt-0.5">
							Terdapat 6 ragam model tipe soal yang akan diuji dalam sesi simulasi ini:
						</p>
					</div>
					<a
						href="/siswa/tata-tertib"
						class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
					>
						Coba Simulasi Interaktif
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
					{#each Object.entries(TYPE_METADATA) as [typeKey, typeInfo]}
						{@const count = typeDistribution[typeKey] || 0}
						<div class="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs transition-all space-y-2 flex flex-col justify-between">
							<div class="space-y-2">
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2">
										<span class="text-2xl">{typeInfo.icon}</span>
										<h3 class="text-sm font-bold text-slate-800">{typeInfo.label}</h3>
									</div>
									<span class="text-[10px] font-bold px-2 py-0.5 rounded-full border {typeInfo.color}">
										{typeInfo.badge}
									</span>
								</div>
								<p class="text-xs text-slate-600 leading-relaxed">
									{typeInfo.desc}
								</p>
							</div>

							<div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
								<span>Kuantitas Soal:</span>
								<span class="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
									{count} Soal
								</span>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Section 3: Tata Cara Menjawab Soal & Aturan Simulasi -->
			<div class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
				<div class="pb-3 border-b border-slate-100">
					<div class="flex items-center gap-2">
						<span class="text-xl">💡</span>
						<h2 class="text-base sm:text-lg font-bold text-slate-800">Tata Cara Menjawab Soal & Panduan Pengerjaan</h2>
					</div>
					<p class="text-xs sm:text-sm text-slate-500 mt-0.5">
						Ikuti petunjuk teknis berikut agar simulasi pengerjaan Anda berjalan lancar:
					</p>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-1">
					<!-- Step 1 -->
					<div class="flex items-start gap-3 p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100/80">
						<div class="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
							1
						</div>
						<div class="space-y-1">
							<h4 class="text-xs sm:text-sm font-bold text-slate-800">Memilih & Mengisi Jawaban</h4>
							<p class="text-xs text-slate-600 leading-relaxed">
								Klik opsi jawaban untuk pilihan ganda, centang beberapa opsi untuk pilihan ganda kompleks, klik tombol <strong>B/S</strong> untuk benar-salah, hubungkan kartu untuk menjodohkan, atau ketik langsung untuk isian dan uraian. Jawaban tersimpan otomatis secara real-time.
							</p>
						</div>
					</div>

					<!-- Step 2 -->
					<div class="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100/80">
						<div class="w-7 h-7 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
							2
						</div>
						<div class="space-y-1">
							<h4 class="text-xs sm:text-sm font-bold text-slate-800">Menggunakan Tombol Ragu-Ragu</h4>
							<p class="text-xs text-slate-600 leading-relaxed">
								Jika Anda belum yakin dengan jawaban yang dipilih, klik tombol <strong>Ragu-Ragu</strong> (kuning). Nomor soal akan berubah warna kuning pada panel Navigasi Soal sehingga Anda dapat meninjaunya kembali dengan mudah.
							</p>
						</div>
					</div>

					<!-- Step 3 -->
					<div class="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100/80">
						<div class="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
							3
						</div>
						<div class="space-y-1">
							<h4 class="text-xs sm:text-sm font-bold text-slate-800">Navigasi Antar Nomor Soal</h4>
							<p class="text-xs text-slate-600 leading-relaxed">
								Gunakan tombol <strong>Sebelumnya</strong> dan <strong>Selanjutnya</strong> di bagian bawah untuk berpindah soal. Anda juga dapat menekan tombol <strong>Navigasi Soal</strong> untuk membuka kisi-kisi seluruh nomor dan melompat ke nomor manapun.
							</p>
						</div>
					</div>

					<!-- Step 4 -->
					<div class="flex items-start gap-3 p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100/80">
						<div class="w-7 h-7 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
							4
						</div>
						<div class="space-y-1">
							<h4 class="text-xs sm:text-sm font-bold text-slate-800">Batas Waktu & Mode Layar Penuh</h4>
							<p class="text-xs text-slate-600 leading-relaxed">
								Timer 30 menit akan berjalan mundur di bagian atas layar. Anda disarankan mengaktifkan mode <strong>Layar Penuh (Fullscreen)</strong> agar tampilan lebih leluasa dan terbebas dari gangguan notifikasi lain.
							</p>
						</div>
					</div>

					<!-- Step 5 -->
					<div class="sm:col-span-2 flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80">
						<div class="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
							5
						</div>
						<div class="space-y-1">
							<h4 class="text-xs sm:text-sm font-bold text-slate-800">Menyelesaikan & Melihat Hasil Simulasi</h4>
							<p class="text-xs text-slate-600 leading-relaxed">
								Pada nomor soal terakhir, tombol hijau <strong>Selesai & Kumpulkan</strong> akan muncul. Ketikkan kata <span class="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-mono">SELESAI</span> untuk konfirmasi akhir. Nilai skor pencapaian, jumlah benar, dan jumlah salah akan langsung ditampilkan.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Big CTA Card: Tombol Mulai Simulasi -->
			<div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-700/50 relative overflow-hidden">
				<div class="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
					<div class="space-y-2 text-center md:text-left">
						<span class="inline-block px-3 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
							🚀 Siap Menguji Pemahaman Anda?
						</span>
						<h3 class="text-xl sm:text-2xl font-black">
							Mulai Ujian Simulasi Sekarang
						</h3>
						<p class="text-xs sm:text-sm text-indigo-200/90 max-w-xl">
							Tekan tombol di samping untuk langsung masuk ke antarmuka ujian CBT. Waktu pengerjaan 30 menit akan aktif setelah Anda memulai.
						</p>
					</div>

					<div class="shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col items-center gap-2.5">
						<button
							type="button"
							on:click={startSimulation}
							class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
						>
							<svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>Mulai Simulasi Ujian</span>
						</button>
						<span class="text-[11px] text-indigo-300 flex items-center gap-1">
							<span>⏱️</span> Waktu 30 menit otomatis berjalan
						</span>
					</div>
				</div>
			</div>

			<!-- Secondary Footer Links -->
			<div class="flex items-center justify-between flex-wrap gap-3 pt-2 text-xs text-slate-500 pb-8">
				<a
					href="/siswa"
					class="hover:text-indigo-600 font-semibold flex items-center gap-1.5 transition-colors"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
					</svg>
					Kembali ke Beranda Siswa
				</a>

				<a
					href="/siswa/tata-tertib"
					class="hover:text-indigo-600 font-semibold flex items-center gap-1.5 transition-colors"
				>
					<span>Pelajari Panduan & Tata Tertib Ujian</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
					</svg>
				</a>
			</div>
		</main>
	</div>
{:else}
	<div class="min-h-screen bg-slate-50 flex flex-col select-none">
	<!-- Exam Header (SAMA PERSIS DENGAN TAMPILAN UJIAN ASLI) -->
	<header class="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-2.5 shadow-xs">
		<div class="max-w-4xl mx-auto flex flex-col gap-2">
			<!-- Row 1: Nama Mapel / Judul Ujian (Satu Baris & Berjalan jika Panjang) -->
			<div 
				class="w-full overflow-hidden relative" 
				bind:clientWidth={titleClientWidth}
			>
				{#if isTitleOverflowing}
					<div class="inline-flex whitespace-nowrap gap-10 animate-marquee py-0.5">
						<span bind:this={titleElement} class="text-sm sm:text-base font-bold text-slate-800 tracking-tight shrink-0">
							[SIMULASI] CBT Madrasah — {data.displayLevel || 'Mandiri'} ({questions.length} Soal)
						</span>
						<span class="text-sm sm:text-base font-bold text-slate-800 tracking-tight shrink-0" aria-hidden="true">
							[SIMULASI] CBT Madrasah — {data.displayLevel || 'Mandiri'} ({questions.length} Soal)
						</span>
					</div>
				{:else}
					<div class="w-full flex items-center justify-between py-0.5">
						<h1 bind:this={titleElement} class="text-sm sm:text-base font-bold text-slate-800 tracking-tight truncate">
							<span class="text-indigo-600 font-extrabold">[SIMULASI]</span> CBT Madrasah — {data.displayLevel || 'Mandiri'} ({questions.length} Soal)
						</h1>
						<span class="text-xs font-semibold text-slate-400 hidden sm:inline shrink-0 ml-2">
							{data.schoolName || 'Ujian Madrasah'}
						</span>
					</div>
				{/if}
			</div>

			<!-- Row 2: Status Tersimpan, Tombol Fullscreen, & Waktu Ujian -->
			<div class="flex items-center justify-between gap-3">
				<!-- Kiri: Status Tersimpan (Ikon Keren Asli) -->
				<div class="flex items-center gap-2">
					<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs" title="Simulasi mandiri lokal aktif">
						<svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						<span class="text-[11px] font-semibold">Tersimpan</span>
					</div>

					<!-- Tombol Fullscreen -->
					<button
						type="button"
						on:click={toggleFullscreen}
						class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors
							{isFullscreen 
								? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
								: 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}"
						title={isFullscreen ? 'Keluar dari layar penuh' : 'Masuk ke layar penuh'}
					>
						{#if isFullscreen}
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 9L4 4m0 0l5 0m-5 0l0 5M15 9l5-5m0 0l-5 0m5 0l0 5M9 15l-5 5m0 0l5 0m-5 0l0-5M15 15l5 5m0 0l-5 0m5 0l0-5" />
							</svg>
							<span class="hidden sm:inline">Layar Penuh</span>
						{:else}
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
							</svg>
							<span class="hidden sm:inline">Layar Penuh</span>
						{/if}
					</button>

					<!-- Tombol Keluar Simulasi -->
					<button
						type="button"
						on:click={() => (showExitConfirm = true)}
						class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
						title="Keluar dari simulasi"
					>
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						<span class="hidden sm:inline">Keluar</span>
					</button>
				</div>

				<!-- Kanan: Waktu Ujian (30 Menit Countdown) -->
				<div class="flex items-center gap-2 sm:gap-3 shrink-0">
					{#if currentEndTime}
						<Timer endTime={currentEndTime} isPaused={false} on:timeup={handleTimeUp} />
					{/if}
				</div>
			</div>

			<!-- Progress Bar -->
			<div class="w-full">
				<div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
					<div
						class="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
						style="width: {questions && questions.length > 0 ? (answeredCount / questions.length) * 100 : 0}%"
					></div>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content (SAMA PERSIS DENGAN UJIAN ASLI) -->
	<main class="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
		{#if currentQuestion}
			{#key currentQuestion.id}
				<div class="mb-3 flex items-center justify-between">
					<div class="flex items-center gap-2">
						{#if currentQuestion.subject}
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
								{currentQuestion.subject}
							</span>
						{/if}
						<span class="text-xs font-semibold text-slate-500">
							{data.displayLevel || 'Simulasi CBT'}
						</span>
					</div>
					<span class="text-xs font-medium text-slate-400">
						Soal {currentIndex + 1} dari {questions.length}
					</span>
				</div>
				<QuestionRenderer
					autoScrollOnMount={true}
					question={currentQuestion}
					displayNumber={currentIndex + 1}
					answer={localAnswers[currentQuestion.id] || ''}
					isDoubted={localDoubts[currentQuestion.id] || false}
					on:answer={handleAnswer}
					on:doubt={handleDoubt}
				/>
			{/key}
		{/if}
	</main>

	<!-- Bottom Navigation (SAMA PERSIS DENGAN UJIAN ASLI) -->
	<footer class="sticky bottom-0 z-30 bg-white/90 backdrop-blur-xl border-t border-slate-200">
		<div class="max-w-4xl mx-auto px-4 py-3">
			<!-- Nav Toggle + Info -->
			<div class="flex items-center justify-between mb-3">
				<div class="flex items-center gap-2">
					<button
						type="button"
						class="btn-sm btn-ghost border border-slate-200"
						on:click={() => (showNav = !showNav)}
					>
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
						</svg>
						Navigasi Soal
					</button>
					<button
						type="button"
						class="btn-sm btn-ghost border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
						on:click={() => (showExitConfirm = true)}
						title="Keluar dari Simulasi"
					>
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.logout} />
						</svg>
						<span class="hidden sm:inline">Keluar</span>
					</button>
				</div>
				<div class="flex items-center gap-3 text-xs">
					<span class="text-emerald-600 font-semibold">{answeredCount} terjawab</span>
					{#if doubtedCount > 0}
						<span class="text-amber-600 font-semibold">{doubtedCount} ragu</span>
					{/if}
					<span class="text-slate-400">{unansweredCount} belum</span>
				</div>
			</div>

			<!-- Question Grid (collapsible) -->
			{#if showNav}
				<div class="mb-3 p-3 bg-slate-50 rounded-xl animate-in">
					<QuestionNav
						questions={navQuestions}
						{currentIndex}
						on:navigate={(e) => goToQuestion(e.detail.index)}
					/>
				</div>
			{/if}

			<!-- Prev / Next / Submit -->
			<div class="flex items-center gap-3">
				<button
					type="button"
					class="btn-ghost flex-1 justify-center"
					disabled={currentIndex === 0}
					on:click={prev}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
					</svg>
					Sebelumnya
				</button>

				{#if questions && currentIndex < questions.length - 1}
					<button type="button" class="btn-primary flex-1 justify-center" on:click={next}>
						Selanjutnya
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronRight} />
						</svg>
					</button>
				{:else}
					<button
						type="button"
						class="btn-success flex-1 justify-center"
						on:click={() => { finishConfirmationInput = ''; showSubmitConfirm = true; }}
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.check} />
						</svg>
						Selesai & Kumpulkan
					</button>
				{/if}
			</div>
		</div>
	</footer>
</div>

<!-- Submit Confirmation Modal (SAMA PERSIS DENGAN UJIAN ASLI DENGAN INPUT "SELESAI") -->
{#if showSubmitConfirm}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" on:click={() => { showSubmitConfirm = false; finishConfirmationInput = ''; }}>
		<div class="max-h-[92vh] overflow-y-auto card p-4 sm:p-6 w-full max-w-[380px] sm:max-w-md animate-bounce-in text-center shadow-2xl rounded-2xl my-auto" on:click|stopPropagation>
			<div class="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-600 shadow-sm shrink-0">
				<svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.check} />
				</svg>
			</div>
			<h3 class="text-base sm:text-lg font-bold text-slate-800 mb-2">Kumpulkan Jawaban?</h3>

			<div class="bg-slate-50 rounded-xl p-2.5 sm:p-3 mb-3 text-left text-xs sm:text-sm space-y-1 border border-slate-100">
				<p class="flex justify-between items-center"><span class="text-slate-500">Terjawab:</span> <span class="font-semibold text-emerald-600">{answeredCount} / {questions?.length || 0}</span></p>
				<p class="flex justify-between items-center"><span class="text-slate-500">Ragu-ragu:</span> <span class="font-semibold text-amber-600">{doubtedCount}</span></p>
				<p class="flex justify-between items-center"><span class="text-slate-500">Belum dijawab:</span> <span class="font-semibold text-rose-600">{unansweredCount}</span></p>
			</div>

			{#if unansweredCount > 0}
				<div class="p-2 sm:p-2.5 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold mb-3 flex items-center gap-1.5 text-left">
					<svg class="w-4 h-4 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					<span>Masih ada {unansweredCount} soal yang belum dijawab!</span>
				</div>
			{/if}

			<!-- Konfirmasi Kata SELESAI -->
			<div class="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 mb-4 text-left">
				<div class="flex items-start gap-2 mb-1.5">
					<svg class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p class="text-xs text-slate-700 leading-relaxed">
						Untuk mengonfirmasi pengumpulan, ketik kata <span class="font-bold text-slate-900 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 font-mono">SELESAI</span> di bawah:
					</p>
				</div>
				<div class="relative mt-2">
					<input
						id="finish-confirm-input"
						type="text"
						bind:value={finishConfirmationInput}
						placeholder='Ketik kata "SELESAI"'
						autocomplete="off"
						spellcheck="false"
						on:keydown={(e) => {
							if (e.key === 'Enter' && isFinishConfirmed) {
								e.preventDefault();
								evaluateAndFinish();
							}
						}}
						class="input w-full text-center font-bold tracking-widest text-base py-2.5 sm:py-3 pr-10 transition-all bg-white uppercase {isFinishConfirmed ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-700' : 'border-slate-300 focus:border-indigo-500'}"
					/>
					{#if isFinishConfirmed}
						<div class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-emerald-600">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						</div>
					{/if}
				</div>
				{#if !isFinishConfirmed && finishConfirmationInput.trim().length > 0}
					<p class="text-[11px] text-rose-600 mt-1.5 font-medium flex items-center gap-1">
						<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						Tuliskan kata "SELESAI" untuk mengaktifkan tombol.
					</p>
				{/if}
			</div>

			<div class="flex gap-2 sm:gap-3">
				<button type="button" class="btn-ghost flex-1 py-2 sm:py-2.5 text-xs sm:text-sm" on:click={() => { showSubmitConfirm = false; finishConfirmationInput = ''; }}>Batal</button>
				<button
					type="button"
					class="btn-success flex-1 py-2 sm:py-2.5 text-xs sm:text-sm {isFinishConfirmed ? '' : 'opacity-50 cursor-not-allowed'}"
					disabled={!isFinishConfirmed}
					on:click={evaluateAndFinish}
				>
					Kumpulkan Jawaban
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Modal Hasil & Pembahasan Simulasi -->
{#if showResultModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
		<div class="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl my-8 space-y-6 animate-in zoom-in-95 duration-200 text-slate-800">
			<!-- Header Hasil -->
			<div class="text-center space-y-2">
				<div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 text-2xl font-black">
					🎓
				</div>
				<h2 class="text-xl sm:text-2xl font-black text-slate-900">
					Hasil Simulasi Ujian Mandiri
				</h2>
				<p class="text-xs text-slate-500">
					Waktu pengerjaan: {Math.floor(timeElapsedSeconds / 60)} menit {timeElapsedSeconds % 60} detik
				</p>
			</div>

			<!-- Score Big Badge -->
			<div class="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-5 text-white text-center shadow-md relative overflow-hidden">
				<div class="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10"></div>
				<p class="text-xs uppercase font-bold tracking-widest text-white/80 mb-1">Skor Pencapaian Anda</p>
				<div class="text-4xl sm:text-5xl font-black tracking-tight drop-shadow">
					{scoreResult.totalScore}
					<span class="text-lg font-bold text-white/70">/ 100</span>
				</div>
				<p class="text-xs text-white/90 mt-2 font-medium">
					{#if scoreResult.totalScore >= 80}
						🌟 Luar Biasa! Pemahaman materi Anda sangat mantap.
					{:else if scoreResult.totalScore >= 65}
						👍 Bagus! Terus latih pemahaman pada tipe soal yang masih ragu.
					{:else}
						📚 Tetap semangat! Simulasi ini membantu Anda membiasakan diri dengan sistem ujian CBT.
					{/if}
				</p>
			</div>

			<!-- Rincian Statistik -->
			<div class="grid grid-cols-3 gap-3 text-center">
				<div class="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
					<p class="text-xl font-black text-emerald-600">{scoreResult.correctCount}</p>
					<p class="text-[11px] font-bold text-emerald-700 uppercase">Jawaban Benar</p>
				</div>
				<div class="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
					<p class="text-xl font-black text-rose-600">{scoreResult.wrongCount}</p>
					<p class="text-[11px] font-bold text-rose-700 uppercase">Jawaban Salah</p>
				</div>
				<div class="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
					<p class="text-xl font-black text-slate-600">{scoreResult.unansweredCount}</p>
					<p class="text-[11px] font-bold text-slate-700 uppercase">Tidak Dijawab</p>
				</div>
			</div>

			<!-- Info Tipe Soal & Mapel yang Diujikan -->
			<div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
				<p class="font-bold text-slate-700">Mata Pelajaran yang Telah Dicoba ({questions.length} Nomor — {data.displayLevel || 'Madrasah'}):</p>
				<div class="flex flex-wrap gap-1.5">
					{#each subjectDistribution as sub}
						<span class="px-2 py-0.5 rounded-lg {sub.meta.bg} {sub.meta.text} border {sub.meta.border} font-semibold">
							{sub.meta.icon} {sub.name} ({sub.count})
						</span>
					{/each}
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row gap-2.5 pt-2">
				<button
					type="button"
					on:click={initSimulation}
					class="btn btn-primary flex-1 py-3 rounded-xl gap-2 text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.refresh} />
					</svg>
					Ulangi Simulasi
				</button>
				<button
					type="button"
					on:click={backToExplanation}
					class="btn btn-secondary flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold"
				>
					Info & Panduan
				</button>
				<button
					type="button"
					on:click={exitSimulation}
					class="btn btn-ghost flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100"
				>
					Ke Dashboard
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Modal Konfirmasi Keluar Simulasi -->
{#if showExitConfirm}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
		<div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
			<div class="text-center space-y-2">
				<div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
					</svg>
				</div>
				<h3 class="text-base font-extrabold text-slate-800">Keluar dari Simulasi?</h3>
				<p class="text-xs text-slate-500">
					Pilih apakah Anda ingin kembali ke halaman informasi atau kembali ke Beranda Siswa.
				</p>
			</div>

			<div class="flex flex-col sm:flex-row gap-2 pt-2">
				<button
					type="button"
					class="btn btn-secondary flex-1 text-xs py-2.5 rounded-xl"
					on:click={() => (showExitConfirm = false)}
				>
					Lanjut Ujian
				</button>
				<button
					type="button"
					class="btn btn-warning flex-1 text-xs py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 border-none text-white font-bold"
					on:click={backToExplanation}
				>
					Ke Info
				</button>
				<button
					type="button"
					class="btn btn-danger flex-1 text-xs py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 border-none text-white font-bold"
					on:click={exitSimulation}
				>
					Dashboard
				</button>
			</div>
		</div>
	</div>
{/if}
{/if}
