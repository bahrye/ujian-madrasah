<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, beforeNavigate } from '$app/navigation';
	import Timer from '$lib/components/exam/Timer.svelte';
	import QuestionRenderer from '$lib/components/exam/QuestionRenderer.svelte';
	import QuestionNav from '$lib/components/exam/QuestionNav.svelte';
	import { ICONS } from '$lib/utils/constants';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { toasts } from '$lib/stores/toast';
	import { onMount, onDestroy } from 'svelte';

	export let data;

	$: attempt = data.attempt as any;
	$: questions = data.questions as any[];
	$: answerMap = data.answerMap as Record<number, any>;

	let currentIndex = 0;
	let showNav = false;
	let showSubmitConfirm = false;
	let submitting = false;

	// Anti-cheat state
	let warnings = 0;
	let showWarningModal = false;
	let showDisqualifiedModal = false;
	const MAX_WARNINGS = 3;
	let isUnloading = false;
	
	let titleElement: HTMLElement;
	let titleClientWidth = 0;
	let isTitleOverflowing = false;
	$: if (titleElement && titleClientWidth) {
		// adding a slight delay to allow dom updates
		setTimeout(() => {
			if (titleElement) {
				isTitleOverflowing = titleElement.scrollWidth > titleClientWidth;
			}
		}, 0);
	}

	let wakeLock: any = null;

	async function requestWakeLock() {
		try {
			if ('wakeLock' in navigator) {
				wakeLock = await (navigator as any).wakeLock.request('screen');
				wakeLock.addEventListener('release', () => {
					console.log('Screen Wake Lock released');
				});
				console.log('Screen Wake Lock acquired');
			}
		} catch (err: any) {
			console.error(`Wake Lock error: ${err.name}, ${err.message}`);
		}
	}

	onMount(() => {
		requestWakeLock();
		
		const savedWarnings = localStorage.getItem(`warnings_${attempt.id}`);
		if (savedWarnings) {
			warnings = parseInt(savedWarnings, 10);
			if (warnings > MAX_WARNINGS) {
				triggerDisqualification();
			}
		}
	});

	onDestroy(() => {
		if (wakeLock !== null) {
			wakeLock.release();
			wakeLock = null;
		}
	});

	beforeNavigate(({ cancel, willUnload }) => {
		if (!submitting) {
			if (willUnload) {
				isUnloading = true;
			} else {
				toasts.error('Anda tidak diizinkan keluar dari halaman saat ujian berlangsung!');
				cancel();
			}
		}
	});

	function triggerDisqualification() {
		isUnloading = true; // allow navigation later
		showDisqualifiedModal = true;
		submitting = true;
		saveCurrentAnswer().then(() => {
			const fd = new FormData();
			fetch('?/submit', { 
				method: 'POST', 
				body: fd,
				headers: {
					'x-sveltekit-action': 'true'
				}
			}).catch(console.error);
		});
	}

	function handleCheatWarning() {
		if (showWarningModal || showDisqualifiedModal || submitting || isUnloading) return; // Prevent multiple triggers at once
		
		warnings += 1;
		localStorage.setItem(`warnings_${attempt.id}`, warnings.toString());

		if (warnings > MAX_WARNINGS) {
			triggerDisqualification();
		} else {
			showWarningModal = true;
		}
	}

	async function handleAutoSubmit() {
		submitting = true;
		await saveCurrentAnswer();
		
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/submit';
		document.body.appendChild(form);
		form.submit();
	}

	function handleVisibilityChange() {
		if (document.visibilityState === 'hidden') {
			handleCheatWarning();
		} else if (document.visibilityState === 'visible') {
			if (wakeLock !== null && wakeLock.released) {
				requestWakeLock();
			} else if (wakeLock === null) {
				requestWakeLock();
			}
		}
	}

	function handleBlur() {
		// handleCheatWarning();
		// Note: we can optionally listen to window blur, but visibilitychange is usually more reliable
		// For stricter rules, we can uncomment the blur listener.
		handleCheatWarning();
	}

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
		handleAutoSubmit();
	}
</script>

<svelte:head><title>{attempt.exam_title} — Ujian Online Madrasah</title></svelte:head>

<svelte:window 
	on:beforeunload={() => { isUnloading = true; }}
	on:contextmenu|preventDefault 
	on:copy|preventDefault 
	on:cut|preventDefault 
	on:paste|preventDefault 
	on:blur={handleBlur} 
/>
<svelte:document on:visibilitychange={handleVisibilityChange} />

<Toast />

<div class="min-h-screen bg-slate-50 flex flex-col select-none">
	<!-- Exam Header -->
	<header class="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3">
		<div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
			<div class="flex-1 min-w-0 overflow-hidden" bind:clientWidth={titleClientWidth}>
				<h1 
					bind:this={titleElement}
					class="text-sm font-bold text-slate-800 whitespace-nowrap {isTitleOverflowing ? 'animate-[marquee_10s_linear_infinite]' : 'truncate'}"
				>
					{attempt.exam_title}
					{#if isTitleOverflowing}
						<span class="pl-8">{attempt.exam_title}</span>
					{/if}
				</h1>
				<p class="text-xs text-slate-500 truncate">{attempt.subject || ''} · Soal {currentIndex + 1}/{questions.length}</p>
			</div>
			<div class="flex items-center gap-2 sm:gap-3">
				{#if warnings > 0}
					<div class="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 bg-red-50 text-red-600 rounded-full border border-red-200 animate-in fade-in slide-in-from-right-4">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						<span class="text-xs font-bold">{warnings}/{MAX_WARNINGS}</span>
					</div>
				{/if}
				<Timer endTime={attempt.end_time} on:timeup={handleTimeUp} />
			</div>
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
					return async ({ result, update }) => { 
						if (result.type !== 'redirect') {
							submitting = false; 
						}
						await update(); 
					};
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

{#if showWarningModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
		<div class="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl animate-in fade-in zoom-in-95 duration-200">
			<div class="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
			</div>
			<h3 class="text-xl font-bold text-slate-800 mb-2">Peringatan Kecurangan!</h3>
			<p class="text-slate-600 mb-6 text-sm">Anda terdeteksi melakukan aktivitas di luar halaman ujian. Peringatan ke-{warnings} dari {MAX_WARNINGS}. Jika melebihi batas, ujian akan otomatis dihentikan.</p>
			<button class="btn-primary w-full" on:click={() => showWarningModal = false}>
				Saya Mengerti
			</button>
		</div>
	</div>
{/if}

{#if showDisqualifiedModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
		<div class="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl animate-in fade-in zoom-in-95 duration-200 border-t-4 border-rose-500">
			<div class="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
			</div>
			<h3 class="text-xl font-bold text-slate-800 mb-2">Ujian Dihentikan</h3>
			<p class="text-slate-600 mb-6 text-sm">Anda telah melanggar batas maksimal peringatan ({MAX_WARNINGS} kali). Ujian Anda diselesaikan secara otomatis.</p>
			<button class="btn-danger w-full" on:click={() => window.location.href = '/siswa'}>
				Kembali ke Dashboard
			</button>
		</div>
	</div>
{/if}
