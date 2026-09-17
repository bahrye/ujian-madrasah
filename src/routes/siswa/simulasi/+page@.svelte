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

	// Daftar 25 soal simulasi yang diacak
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
		// Acak urutan 25 soal
		const shuffled = shuffleArray(SIMULATION_QUESTIONS).map((q, idx) => ({
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
			correctCount: correct,
			wrongCount: wrong,
			unansweredCount: unans
		};

		showResultModal = true;
	}

	function exitSimulation() {
		if (elapsedInterval) clearInterval(elapsedInterval);
		if (browser && document.fullscreenElement) {
			document.exitFullscreen().catch(() => {});
		}
		goto('/siswa');
	}

	onMount(() => {
		initSimulation();
		requestWakeLock();
		if (browser) {
			isFullscreen = !!document.fullscreenElement;
			// Coba minta fullscreen jika pengguna berinteraksi
			const handleFirstInteraction = () => {
				if (!hasRequestedFullscreen && !document.fullscreenElement) {
					hasRequestedFullscreen = true;
					document.documentElement.requestFullscreen().catch(() => {});
				}
				window.removeEventListener('click', handleFirstInteraction);
			};
			window.addEventListener('click', handleFirstInteraction, { once: true });
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
	<title>Simulasi Ujian CBT Madrasah — Ujian Online Madrasah</title>
</svelte:head>

<svelte:document on:fullscreenchange={handleFullscreenChange} />

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
							[SIMULASI] Simulasi Mandiri CBT Madrasah (25 Soal - Semua Tipe)
						</span>
						<span class="text-sm sm:text-base font-bold text-slate-800 tracking-tight shrink-0" aria-hidden="true">
							[SIMULASI] Simulasi Mandiri CBT Madrasah (25 Soal - Semua Tipe)
						</span>
					</div>
				{:else}
					<div class="w-full flex items-center justify-between py-0.5">
						<h1 bind:this={titleElement} class="text-sm sm:text-base font-bold text-slate-800 tracking-tight truncate">
							<span class="text-indigo-600 font-extrabold">[SIMULASI]</span> Simulasi Mandiri CBT Madrasah (25 Soal - Semua Tipe)
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
				<QuestionRenderer
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
					Progres simulasi saat ini akan dibatalkan dan Anda akan kembali ke halaman Dashboard Siswa.
				</p>
			</div>

			<div class="flex gap-2.5 pt-2">
				<button
					type="button"
					class="btn btn-secondary flex-1 text-xs py-2.5 rounded-xl"
					on:click={() => (showExitConfirm = false)}
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
