<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import QuestionRenderer from '$lib/components/exam/QuestionRenderer.svelte';
	import QuestionNav from '$lib/components/exam/QuestionNav.svelte';
	import { SIMULATION_QUESTIONS, type SimulationQuestion } from '$lib/data/simulationQuestions';
	import { ICONS, QUESTION_TYPE_LABELS } from '$lib/utils/constants';

	export let data;

	// Daftar 25 soal simulasi yang diacak
	let questions: SimulationQuestion[] = [];
	let currentIndex = 0;
	let showNavDrawer = false;
	let showFinishConfirmModal = false;
	let showResultModal = false;
	let showExitConfirmModal = false;

	// State jawaban siswa
	let answers: Record<number, string> = {};
	let doubts: Record<number, boolean> = {};

	// Timer 30 menit (1800 detik)
	const INITIAL_DURATION_SEC = 30 * 60;
	let remainingSeconds = INITIAL_DURATION_SEC;
	let timerInterval: any = null;
	let isTimeUp = false;
	let timeElapsed = 0;

	// Skor hasil simulasi
	let scoreResult = {
		totalScore: 0,
		maxScore: 100,
		correctCount: 0,
		wrongCount: 0,
		unansweredCount: 0,
		answeredCount: 0
	};

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
		// Acak urutan 25 soal
		const shuffled = shuffleArray(SIMULATION_QUESTIONS).map((q, idx) => ({
			...q,
			question_number: idx + 1
		}));
		questions = shuffled;
		currentIndex = 0;
		answers = {};
		doubts = {};
		remainingSeconds = INITIAL_DURATION_SEC;
		timeElapsed = 0;
		isTimeUp = false;
		showFinishConfirmModal = false;
		showResultModal = false;
		showExitConfirmModal = false;

		startTimer();
	}

	function startTimer() {
		if (timerInterval) clearInterval(timerInterval);
		timerInterval = setInterval(() => {
			if (remainingSeconds > 0) {
				remainingSeconds--;
				timeElapsed++;
			} else {
				clearInterval(timerInterval);
				isTimeUp = true;
				finishSimulation();
			}
		}, 1000);
	}

	$: currentQuestion = questions[currentIndex] || null;

	$: formattedTime = (() => {
		const m = Math.floor(remainingSeconds / 60);
		const s = remainingSeconds % 60;
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	})();

	$: isTimeWarning = remainingSeconds <= 300 && remainingSeconds > 60;
	$: isTimeCritical = remainingSeconds <= 60;

	// Status navigasi soal
	$: navQuestions = questions.map((q, idx) => {
		const ans = answers[q.id];
		const isAnswered = ans !== undefined && ans !== null && ans !== '' && ans !== '[]' && ans !== '{}';
		return {
			id: q.id,
			question_number: idx + 1,
			answered: isAnswered,
			doubted: !!doubts[q.id]
		};
	});

	$: answeredCount = navQuestions.filter(q => q.answered).length;
	$: doubtedCount = navQuestions.filter(q => q.doubted).length;
	$: unansweredCount = questions.length - answeredCount;

	function handleAnswer(e: CustomEvent<{ questionId: number; answer: string }>) {
		answers[e.detail.questionId] = e.detail.answer;
		answers = { ...answers };
	}

	function handleDoubt(e: CustomEvent<{ questionId: number; doubted: boolean }>) {
		doubts[e.detail.questionId] = e.detail.doubted;
		doubts = { ...doubts };
	}

	function toggleCurrentDoubt() {
		if (!currentQuestion) return;
		doubts[currentQuestion.id] = !doubts[currentQuestion.id];
		doubts = { ...doubts };
	}

	function goToIndex(idx: number) {
		if (idx >= 0 && idx < questions.length) {
			currentIndex = idx;
			showNavDrawer = false;
			// Scroll ke atas soal
			if (typeof window !== 'undefined') {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}
	}

	function evaluateSimulation() {
		let correct = 0;
		let wrong = 0;
		let unans = 0;
		let score = 0;

		for (const q of questions) {
			const ans = answers[q.id];
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
						if (String(userAns[key]) !== String(correctAns[key])) {
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
				// Untuk essay simulasi mandiri, jika siswa mengisi lebih dari 15 karakter dianggap mencoba menjawab dengan baik
				isCorrect = String(ans).trim().length > 15;
			}

			if (isCorrect) {
				correct++;
				score += q.points;
			} else {
				wrong++;
			}
		}

		scoreResult = {
			totalScore: Math.min(100, Math.round((score / (questions.length * 4)) * 100)),
			maxScore: 100,
			correctCount: correct,
			wrongCount: wrong,
			unansweredCount: unans,
			answeredCount: correct + wrong
		};
	}

	function finishSimulation() {
		if (timerInterval) clearInterval(timerInterval);
		showFinishConfirmModal = false;
		evaluateSimulation();
		showResultModal = true;
	}

	function exitSimulation() {
		if (timerInterval) clearInterval(timerInterval);
		goto('/siswa');
	}

	onMount(() => {
		initSimulation();
	});

	onDestroy(() => {
		if (timerInterval) clearInterval(timerInterval);
	});
</script>

<svelte:head>
	<title>Simulasi Ujian CBT Madrasah — Ujian Online</title>
</svelte:head>

<div class="min-h-screen bg-slate-100 flex flex-col text-slate-800 select-none">
	<!-- Top Bar Exam Header -->
	<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm px-4 sm:px-6 py-2.5">
		<div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
			<!-- Left: Exam Info -->
			<div class="flex items-center gap-3 min-w-0">
				<button
					type="button"
					on:click={() => (showExitConfirmModal = true)}
					class="p-2 -ml-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
					title="Keluar dari simulasi"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
					</svg>
					<span class="hidden sm:inline">Keluar</span>
				</button>
				<div class="min-w-0">
					<div class="flex items-center gap-1.5 flex-wrap">
						<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">
							Simulasi CBT
						</span>
						<span class="text-xs font-bold text-slate-700 truncate hidden md:inline">
							{data.schoolName || 'Ujian Madrasah'}
						</span>
					</div>
					<h1 class="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
						Simulasi Mandiri 25 Soal (Semua Tipe)
					</h1>
				</div>
			</div>

			<!-- Center/Right: Timer & Drawer Trigger -->
			<div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
				<!-- Countdown Timer -->
				<div class="flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-black text-sm sm:text-base shadow-sm
					{isTimeCritical 
						? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse' 
						: isTimeWarning 
							? 'bg-amber-50 text-amber-600 border-amber-300' 
							: 'bg-slate-50 text-slate-700 border-slate-200'}">
					<svg class="w-4 h-4 sm:w-5 sm:h-5 {isTimeCritical ? 'text-rose-500' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} />
					</svg>
					<span>{formattedTime}</span>
				</div>

				<!-- Tombol Daftar Soal (Mobile & Desktop) -->
				<button
					type="button"
					on:click={() => (showNavDrawer = !showNavDrawer)}
					class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
					<span>Daftar Soal</span>
					<span class="ml-1 px-1.5 py-0.2 rounded-full bg-white/25 text-[11px] font-extrabold leading-tight">
						{answeredCount}/25
					</span>
				</button>
			</div>
		</div>
	</header>

	<!-- Main Exam Area -->
	<main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
		<!-- Question Container (Left 3 Columns on Large Screen) -->
		<div class="lg:col-span-3 space-y-4">
			{#if currentQuestion}
				<!-- Question Header Info Card -->
				<div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
					<div class="flex items-center gap-2.5">
						<div class="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold flex items-center justify-center text-sm shadow-inner">
							{currentIndex + 1}
						</div>
						<div>
							<div class="flex items-center gap-2">
								<span class="text-xs font-bold text-slate-900">
									Soal No. {currentIndex + 1}
								</span>
								<span class="text-[10px] text-slate-400">dari 25 Soal</span>
							</div>
							<p class="text-[11px] font-semibold text-indigo-600">
								{QUESTION_TYPE_LABELS[currentQuestion.type] || currentQuestion.type}
							</p>
						</div>
					</div>

					<!-- Ragu-ragu status badge -->
					{#if doubts[currentQuestion.id]}
						<span class="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-xl shadow-xs">
							⚠️ Ragu-ragu
						</span>
					{/if}
				</div>

				<!-- Question Body & Choices Card -->
				<div class="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/80 shadow-sm overflow-hidden">
					<QuestionRenderer
						question={currentQuestion}
						answer={answers[currentQuestion.id] || ''}
						isDoubted={!!doubts[currentQuestion.id]}
						displayNumber={currentIndex + 1}
						on:answer={handleAnswer}
						on:doubt={handleDoubt}
					/>
				</div>

				<!-- Navigation Footer Bar -->
				<div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
					<!-- Prev Button -->
					<button
						type="button"
						disabled={currentIndex === 0}
						on:click={() => goToIndex(currentIndex - 1)}
						class="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all
							{currentIndex === 0 
								? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
								: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-xs'}"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
						Soal Sebelumnya
					</button>

					<!-- Ragu-Ragu Checkbox Button -->
					<button
						type="button"
						on:click={toggleCurrentDoubt}
						class="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs
							{doubts[currentQuestion.id] 
								? 'bg-amber-500 text-white shadow-amber-500/20' 
								: 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100'}"
					>
						<input
							type="checkbox"
							checked={!!doubts[currentQuestion.id]}
							class="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 pointer-events-none"
						/>
						Ragu-ragu
					</button>

					<!-- Next / Finish Button -->
					{#if currentIndex < questions.length - 1}
						<button
							type="button"
							on:click={() => goToIndex(currentIndex + 1)}
							class="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all"
						>
							Soal Selanjutnya
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
							</svg>
						</button>
					{:else}
						<button
							type="button"
							on:click={() => (showFinishConfirmModal = true)}
							class="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.check} />
							</svg>
							Selesai Ujian
						</button>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Right Column: Question Grid (Persistent on Desktop) -->
		<div class="hidden lg:block lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm sticky top-20 space-y-4">
			<div class="flex items-center justify-between pb-3 border-b border-slate-100">
				<h3 class="font-extrabold text-sm text-slate-800">Nomor Soal</h3>
				<span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
					25 Soal
				</span>
			</div>

			<QuestionNav
				questions={navQuestions}
				{currentIndex}
				on:navigate={(e) => goToIndex(e.detail.index)}
			/>

			<div class="pt-3 border-t border-slate-100">
				<button
					type="button"
					on:click={() => (showFinishConfirmModal = true)}
					class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.check} />
					</svg>
					Kumpulkan Ujian
				</button>
			</div>
		</div>
	</main>
</div>

<!-- Drawer Nomor Soal untuk Mobile / Tablet -->
{#if showNavDrawer}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end"
		on:click={() => (showNavDrawer = false)}
	>
		<div
			class="w-full max-w-xs sm:max-w-sm h-full bg-white p-5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
			on:click|stopPropagation
		>
			<div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
				<div>
					<h3 class="font-extrabold text-base text-slate-800">Daftar Nomor Soal</h3>
					<p class="text-xs text-slate-500">{answeredCount} dari 25 terjawab</p>
				</div>
				<button
					type="button"
					class="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
					on:click={() => (showNavDrawer = false)}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.close} />
					</svg>
				</button>
			</div>

			<div class="flex-1 overflow-y-auto">
				<QuestionNav
					questions={navQuestions}
					{currentIndex}
					on:navigate={(e) => goToIndex(e.detail.index)}
				/>
			</div>

			<div class="pt-4 border-t border-slate-100 mt-4 space-y-2">
				<button
					type="button"
					on:click={() => {
						showNavDrawer = false;
						showFinishConfirmModal = true;
					}}
					class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.check} />
					</svg>
					Selesai Ujian
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Modal Konfirmasi Selesai Ujian -->
{#if showFinishConfirmModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
		<div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
			<div class="text-center space-y-2">
				<div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-inner">
					<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h3 class="text-lg font-extrabold text-slate-800">Selesaikan Simulasi Ujian?</h3>
				<p class="text-xs text-slate-500">
					Periksa ringkasan jawaban Anda sebelum mengakhiri simulasi ini.
				</p>
			</div>

			<!-- Ringkasan Status Jawaban -->
			<div class="grid grid-cols-3 gap-2.5 text-center">
				<div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
					<p class="text-xl font-black text-emerald-700">{answeredCount}</p>
					<p class="text-[10px] font-bold text-emerald-600 uppercase">Terjawab</p>
				</div>
				<div class="p-3 rounded-2xl bg-amber-50 border border-amber-200">
					<p class="text-xl font-black text-amber-700">{doubtedCount}</p>
					<p class="text-[10px] font-bold text-amber-600 uppercase">Ragu-ragu</p>
				</div>
				<div class="p-3 rounded-2xl bg-slate-50 border border-slate-200">
					<p class="text-xl font-black text-slate-700">{unansweredCount}</p>
					<p class="text-[10px] font-bold text-slate-500 uppercase">Kosong</p>
				</div>
			</div>

			{#if unansweredCount > 0 || doubtedCount > 0}
				<div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
					<span>⚠️</span>
					<span>Masih ada <strong>{unansweredCount} soal belum dijawab</strong> dan <strong>{doubtedCount} soal ragu-ragu</strong>. Anda yakin ingin menyelesaikan sekarang?</span>
				</div>
			{/if}

			<div class="flex gap-3 pt-2">
				<button
					type="button"
					class="btn btn-secondary flex-1 text-xs sm:text-sm py-2.5 rounded-xl"
					on:click={() => (showFinishConfirmModal = false)}
				>
					Lanjut Mengerjakan
				</button>
				<button
					type="button"
					class="btn btn-primary flex-1 text-xs sm:text-sm py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 border-none shadow-md shadow-emerald-500/20"
					on:click={finishSimulation}
				>
					Ya, Kumpulkan
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
					Waktu pengerjaan: {Math.floor(timeElapsed / 60)} menit {timeElapsed % 60} detik
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
						📚 Tetap semangat! Simulasi ini membantu Anda membiasakan diri dengan sistem ujian.
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

			<!-- Info Tipe Soal yang Diujikan -->
			<div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
				<p class="font-bold text-slate-700">Tipe Soal yang Telah Dicoba (25 Nomor):</p>
				<div class="flex flex-wrap gap-1.5">
					<span class="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 font-semibold">10 Pilihan Ganda</span>
					<span class="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800 font-semibold">4 Pilihan Ganda Kompleks</span>
					<span class="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-semibold">4 Benar/Salah</span>
					<span class="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800 font-semibold">3 Menjodohkan</span>
					<span class="px-2 py-0.5 rounded-lg bg-teal-100 text-teal-800 font-semibold">2 Isian Singkat</span>
					<span class="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 font-semibold">2 Essay / Uraian</span>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-col sm:flex-row gap-3 pt-2">
				<button
					type="button"
					on:click={initSimulation}
					class="btn btn-primary flex-1 py-3 rounded-xl gap-2 text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.refresh} />
					</svg>
					Ulangi Simulasi (Acak Soal Baru)
				</button>
				<button
					type="button"
					on:click={exitSimulation}
					class="btn btn-secondary flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold"
				>
					Kembali ke Dashboard
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Modal Konfirmasi Keluar Simulasi -->
{#if showExitConfirmModal}
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
					Progres simulasi saat ini akan dibatalkan dan Anda akan kembali ke halaman Dashboard Siswa.
				</p>
			</div>

			<div class="flex gap-2.5 pt-2">
				<button
					type="button"
					class="btn btn-secondary flex-1 text-xs py-2.5 rounded-xl"
					on:click={() => (showExitConfirmModal = false)}
				>
					Lanjut Simulasi
				</button>
				<button
					type="button"
					class="btn btn-danger flex-1 text-xs py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 border-none text-white font-bold"
					on:click={exitSimulation}
				>
					Keluar
				</button>
			</div>
		</div>
	</div>
{/if}
