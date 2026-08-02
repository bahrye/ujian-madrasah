<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Timer from '$lib/components/exam/Timer.svelte';
	import QuestionRenderer from '$lib/components/exam/QuestionRenderer.svelte';
	import QuestionNav from '$lib/components/exam/QuestionNav.svelte';
	import { ICONS } from '$lib/utils/constants';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { toasts } from '$lib/stores/toast';

	export let data;

	$: attempt = data.attempt as any;
	$: questions = data.questions as any[];
	$: answerMap = data.answerMap as Record<number, any>;

	let currentIndex = 0;
	let showNav = false;
	let showSubmitConfirm = false;
	let submitting = false;

	// Local answer state
	let localAnswers: Record<number, string> = {};
	let localDoubts: Record<number, boolean> = {};

	// Initialize from server data
	$: {
		for (const q of questions) {
			const ans = answerMap[q.id];
			if (ans && !(q.id in localAnswers)) {
				localAnswers[q.id] = ans.answer_given || '';
				localDoubts[q.id] = ans.is_doubted === 1;
			}
		}
	}

	$: currentQuestion = questions[currentIndex];
	$: navQuestions = questions.map((q: any, i: number) => ({
		id: q.id,
		question_number: q.question_number,
		answered: !!(localAnswers[q.id]),
		doubted: !!(localDoubts[q.id])
	}));

	$: answeredCount = questions.filter((q: any) => localAnswers[q.id]).length;
	$: doubtedCount = questions.filter((q: any) => localDoubts[q.id]).length;
	$: unansweredCount = questions.length - answeredCount;

	function goToQuestion(index: number) {
		// Save current before navigating
		saveCurrentAnswer();
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
		localAnswers = localAnswers; // trigger reactivity
	}

	function handleDoubt(e: CustomEvent<{ questionId: number; doubted: boolean }>) {
		localDoubts[e.detail.questionId] = e.detail.doubted;
		localDoubts = localDoubts;
	}

	async function saveCurrentAnswer() {
		if (!currentQuestion) return;
		const qId = currentQuestion.id;
		const form = new FormData();
		form.set('question_id', String(qId));
		form.set('answer_given', localAnswers[qId] || '');
		form.set('is_doubted', localDoubts[qId] ? '1' : '0');

		try {
			await fetch('?/saveAnswer', { method: 'POST', body: form });
		} catch (err) {
			console.error('Save error:', err);
		}
	}

	async function handleTimeUp() {
		toasts.warning('Waktu habis! Jawaban akan disubmit otomatis.');
		await saveCurrentAnswer();
		// Submit form
		const form = document.getElementById('submit-form') as HTMLFormElement;
		if (form) form.requestSubmit();
	}
</script>

<svelte:head><title>{attempt.exam_title} — Ujian Online Madrasah</title></svelte:head>

<Toast />

<div class="min-h-screen bg-slate-50 flex flex-col">
	<!-- Exam Header -->
	<header class="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3">
		<div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
			<div class="flex-1 min-w-0">
				<h1 class="text-sm font-bold text-slate-800 truncate">{attempt.exam_title}</h1>
				<p class="text-xs text-slate-500">{attempt.subject || ''} · Soal {currentIndex + 1}/{questions.length}</p>
			</div>
			<Timer endTime={attempt.end_time} on:timeup={handleTimeUp} />
		</div>
		<!-- Progress Bar -->
		<div class="max-w-4xl mx-auto mt-2">
			<div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
				<div
				class="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
				style="width: {((answeredCount) / questions.length) * 100}%"
			></div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
		{#if currentQuestion}
			<QuestionRenderer
				question={currentQuestion}
				answer={localAnswers[currentQuestion.id] || ''}
				isDoubted={localDoubts[currentQuestion.id] || false}
				on:answer={handleAnswer}
				on:doubt={handleDoubt}
			/>
		{/if}
	</main>

	<!-- Bottom Navigation -->
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
					Navigasi Soal
				</button>
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
					class="btn-ghost flex-1 justify-center"
					disabled={currentIndex === 0}
					on:click={prev}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
					</svg>
					Sebelumnya
				</button>

				{#if currentIndex < questions.length - 1}
					<button class="btn-primary flex-1 justify-center" on:click={next}>
						Selanjutnya
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronRight} />
						</svg>
					</button>
				{:else}
					<button
						class="btn-success flex-1 justify-center"
						on:click={() => { saveCurrentAnswer(); showSubmitConfirm = true; }}
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

<!-- Submit Confirmation Modal -->
{#if showSubmitConfirm}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (showSubmitConfirm = false)}>
		<div class="card p-6 w-full max-w-sm animate-bounce-in text-center" on:click|stopPropagation>
			<div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
				<svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.check} />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-slate-800 mb-2">Kumpulkan Jawaban?</h3>

			<div class="bg-slate-50 rounded-xl p-3 mb-4 text-left text-sm space-y-1">
				<p class="flex justify-between"><span class="text-slate-500">Terjawab:</span> <span class="font-semibold text-emerald-600">{answeredCount} / {questions.length}</span></p>
				<p class="flex justify-between"><span class="text-slate-500">Ragu-ragu:</span> <span class="font-semibold text-amber-600">{doubtedCount}</span></p>
				<p class="flex justify-between"><span class="text-slate-500">Belum dijawab:</span> <span class="font-semibold text-rose-600">{unansweredCount}</span></p>
			</div>

			{#if unansweredCount > 0}
				<p class="text-sm text-amber-600 mb-4 font-medium">⚠ Masih ada {unansweredCount} soal yang belum dijawab!</p>
			{/if}

			<div class="flex gap-3">
				<button type="button" class="btn-ghost flex-1" on:click={() => (showSubmitConfirm = false)}>Kembali</button>
				<form id="submit-form" method="POST" action="?/submit" use:enhance={() => {
					submitting = true;
					return async ({ update }) => { submitting = false; await update(); };
				}} class="flex-1">
					<button type="submit" disabled={submitting} class="btn-success w-full justify-center">
						{#if submitting}
							Mengirim...
						{:else}
							Ya, Kumpulkan
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
