<script lang="ts">
	import QuestionRenderer from '$lib/components/exam/QuestionRenderer.svelte';
	import QuestionNav from '$lib/components/exam/QuestionNav.svelte';
	import { ICONS } from '$lib/utils/constants';
	import { page } from '$app/stores';

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
		<div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
			<div class="flex items-center gap-3 flex-1 min-w-0">
				<div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
					<svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
					</svg>
				</div>
				<div class="min-w-0">
					<h1 class="font-bold text-base sm:text-lg leading-tight truncate">Preview: {exam.title}</h1>
					<p class="text-xs text-indigo-200 truncate">Mode Pratinjau Admin</p>
				</div>
			</div>
			
			<a href={$page.url.searchParams.get('from') === 'bank' ? '/admin/bank-soal' : `/admin/bank-soal/${exam.id}`} class="btn-sm bg-white/10 hover:bg-white/20 text-white border-0 flex-shrink-0">
				<svg class="w-4 h-4 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.close} />
				</svg>
				<span class="hidden sm:inline">Tutup Preview</span>
			</a>
		</div>
	</header>

	<main class="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
		{#if questions.length > 0 && currentQuestion}
			{#key currentQuestion.id}
				<QuestionRenderer
					question={currentQuestion}
					answer={localAnswers[currentQuestion.id] || ''}
					isDoubted={localDoubts[currentQuestion.id] || false}
					on:answer={handleAnswer}
					on:doubt={handleDoubt}
				/>
			{/key}
		{:else}
			<div class="flex items-center justify-center h-64">
				<div class="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
					<div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.questions} />
						</svg>
					</div>
					<h3 class="text-lg font-bold text-slate-800 mb-2">Belum Ada Soal</h3>
					<p class="text-slate-500 mb-6">Ujian ini belum memiliki soal untuk dipratinjau.</p>
					<a href={$page.url.searchParams.get('from') === 'bank' ? '/admin/bank-soal' : `/admin/bank-soal/${exam.id}`} class="btn btn-primary w-full">Kembali ke Bank Soal</a>
				</div>
			</div>
		{/if}
	</main>

	{#if questions.length > 0}
		<footer class="sticky bottom-0 z-30 bg-white/90 backdrop-blur-xl border-t border-slate-200">
			<div class="max-w-4xl mx-auto px-4 py-3">
				<!-- Nav Toggle + Info -->
				<div class="flex items-center justify-between mb-3">
					<button
						class="btn-sm btn-ghost border border-slate-200"
						on:click={() => (showNav = !showNav)}
					>
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
						</svg>
						<span class="ml-1">Navigasi Soal</span>
					</button>
					<div class="flex items-center gap-3 text-xs">
						<span class="text-emerald-600 font-semibold">{answeredCount} terjawab</span>
						{#if doubtedCount > 0}
							<span class="text-amber-600 font-semibold">{doubtedCount} ragu</span>
						{/if}
						<span class="text-slate-400 hidden sm:inline">{unansweredCount} belum</span>
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

				<!-- Prev / Next -->
				<div class="flex items-center gap-3">
					<button
						class="btn-ghost flex-1 justify-center"
						disabled={currentIndex === 0}
						on:click={prev}
					>
						<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
						</svg>
						Sebelumnya
					</button>

					<button 
						class="btn-primary flex-1 justify-center" 
						on:click={next}
						disabled={currentIndex === questions.length - 1}
					>
						Selanjutnya
						<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronRight} />
						</svg>
					</button>
				</div>
			</div>
		</footer>
	{/if}
</div>
