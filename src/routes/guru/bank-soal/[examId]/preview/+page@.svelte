<script lang="ts">
	import QuestionRenderer from '$lib/components/exam/QuestionRenderer.svelte';
	import QuestionNav from '$lib/components/exam/QuestionNav.svelte';
	import { ICONS } from '$lib/utils/constants';

	export let data;

	$: exam = data.exam;
	$: questions = data.questions as any[];

	let currentIndex = 0;
	let showNav = false;

	// Local answer state (hanya statis untuk preview)
	let localAnswers: Record<number, string> = {};
	let localDoubts: Record<number, boolean> = {};

	$: currentQuestion = questions[currentIndex];
	$: navQuestions = questions.map((q: any) => ({
		id: q.id,
		question_number: q.question_number,
		answered: !!(localAnswers[q.id]),
		doubted: !!(localDoubts[q.id])
	}));

	$: answeredCount = questions.filter((q: any) => localAnswers[q.id]).length;
	$: doubtedCount = questions.filter((q: any) => localDoubts[q.id]).length;
	$: unansweredCount = questions.length - answeredCount;

	function goToQuestion(index: number) {
		currentIndex = index;
		showNav = false;
	}

	function prev() {
		if (currentIndex > 0) goToQuestion(currentIndex - 1);
	}

	function next() {
		if (currentIndex < questions.length - 1) goToQuestion(currentIndex + 1);
	}

	function handleAnswer(e: CustomEvent<{ questionId: number; answer: string }>) {
		localAnswers[e.detail.questionId] = e.detail.answer;
		localAnswers = localAnswers;
	}

	function handleDoubt(e: CustomEvent<{ questionId: number; doubted: boolean }>) {
		localDoubts[e.detail.questionId] = e.detail.doubted;
		localDoubts = localDoubts;
	}
</script>

<svelte:head><title>Preview Ujian — Ujian Online Madrasah</title></svelte:head>

<div class="min-h-screen bg-slate-50 flex flex-col font-sans">
	<header class="bg-indigo-700 text-white shadow-md z-30 sticky top-0">
		<div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
			<div class="flex items-center gap-4 flex-1 min-w-0">
				<div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
					<svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
				</div>
				<div class="min-w-0 relative">
					<h1 class="font-bold text-lg leading-tight truncate pr-8" title="Preview: {exam.title}">Preview: {exam.title}</h1>
					<p class="text-xs text-indigo-200 truncate" title="Mode Pratinjau Guru/Admin">Mode Pratinjau Guru/Admin</p>
				</div>
			</div>
			
			<div class="flex items-center gap-3 flex-shrink-0">
				<a href="/guru/bank-soal/{exam.id}" class="btn-sm bg-white/10 hover:bg-white/20 text-white border-0">
					<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.close} />
					</svg>
					Tutup Preview
				</a>
				<button class="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" on:click={() => showNav = true}>
					<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
				</button>
			</div>
		</div>
	</header>

	<main class="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row relative">
		{#if questions.length > 0}
			<div class="flex-1 flex flex-col min-h-0 relative">
				<div class="flex-1 overflow-y-auto p-4 md:p-8">
					<div class="max-w-3xl mx-auto w-full">
						<QuestionRenderer
							question={currentQuestion}
							answer={localAnswers[currentQuestion.id] || ''}
							isDoubted={localDoubts[currentQuestion.id] || false}
							on:answer={handleAnswer}
							on:doubt={handleDoubt}
						/>
					</div>
				</div>

				<div class="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
					<div class="max-w-3xl mx-auto flex items-center justify-between gap-4">
						<button class="btn btn-secondary flex-1 sm:flex-none" on:click={prev} disabled={currentIndex === 0}>
							<svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} /></svg>
							<span class="hidden sm:inline">Sebelumnya</span>
							<span class="sm:hidden">Prev</span>
						</button>
						
						<div class="text-sm font-medium text-slate-500 hidden sm:block">
							Soal <span class="text-slate-900 font-bold">{currentIndex + 1}</span> dari {questions.length}
						</div>
						
						<button class="btn btn-primary flex-1 sm:flex-none" on:click={next} disabled={currentIndex === questions.length - 1}>
							<span class="hidden sm:inline">Selanjutnya</span>
							<span class="sm:hidden">Next</span>
							<svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronRight} /></svg>
						</button>
					</div>
				</div>
			</div>

			<QuestionNav
				{navQuestions}
				{answeredCount}
				{doubtedCount}
				{unansweredCount}
				{currentIndex}
				bind:showNav
				on:select={(e) => goToQuestion(e.detail)}
			/>
		{:else}
			<div class="flex-1 flex items-center justify-center p-8">
				<div class="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
					<div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.questions} />
						</svg>
					</div>
					<h3 class="text-lg font-bold text-slate-800 mb-2">Belum Ada Soal</h3>
					<p class="text-slate-500 mb-6">Ujian ini belum memiliki soal untuk dipratinjau.</p>
					<a href="/guru/bank-soal/{exam.id}" class="btn btn-primary w-full">Kembali ke Bank Soal</a>
				</div>
			</div>
		{/if}
	</main>
</div>
