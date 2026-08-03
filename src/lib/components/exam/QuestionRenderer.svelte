<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import AudioPlayer from './AudioPlayer.svelte';
	import { QUESTION_TYPE_LABELS } from '$lib/utils/constants';

	export let question: {
		id: number;
		type: string;
		question_text: string;
		question_number: number;
		media_type: string | null;
		media_url: string | null;
		audio_max_plays: number;
		options_json: string | null;
		points: number;
	};
	export let answer: string = '';
	export let isDoubted: boolean = false;

	const dispatch = createEventDispatcher();

	$: options = question.options_json ? JSON.parse(question.options_json) : [];
	$: matchingLeft = question.type === 'menjodohkan' && options?.left ? options.left : [];
	$: matchingRight = question.type === 'menjodohkan' && options?.right ? options.right : [];

	// Untuk menjodohkan, answer disimpan sebagai JSON string mapping
	let matchingAnswers: Record<string, string> = {};
	$: if (question.type === 'menjodohkan' && answer) {
		try {
			matchingAnswers = JSON.parse(answer);
		} catch {
			matchingAnswers = {};
		}
	}

	function handleAnswer(value: string) {
		dispatch('answer', { questionId: question.id, answer: value });
	}

	function handleMatchingChange(leftIndex: string, rightIndex: string) {
		matchingAnswers[leftIndex] = rightIndex;
		dispatch('answer', { questionId: question.id, answer: JSON.stringify(matchingAnswers) });
	}

	function toggleDoubt() {
		dispatch('doubt', { questionId: question.id, doubted: !isDoubted });
	}

	const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

	function getDirectUrl(url: string | null): string {
		if (!url) return '';
		if (question.media_type === 'audio') return url; // Let AudioPlayer handle audio URLs
		if (url.includes('drive.google.com/file/d/')) {
			const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
			if (match && match[1]) {
				const id = match[1];
				let directLink = `https://drive.google.com/uc?export=download&id=${id}`;
				try {
					const urlObj = new URL(url);
					const resourceKey = urlObj.searchParams.get('resourcekey');
					if (resourceKey) {
						directLink += `&resourcekey=${resourceKey}`;
					}
				} catch (e) {}
				return directLink;
			}
		}
		return url;
	}

	$: directMediaUrl = getDirectUrl(question.media_url);

	// Image Lightbox
	let lightboxImage: string | null = null;
	function handleContentClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.tagName === 'IMG') {
			lightboxImage = (target as HTMLImageElement).src;
		}
	}
</script>

<div class="space-y-5 animate-in" on:click={handleContentClick} on:keydown={(e) => e.key === 'Enter' && handleContentClick(e as any)} role="presentation">
	<!-- Header -->
	<div class="flex items-center justify-between flex-wrap gap-2">
		<div class="flex items-center gap-3">
			<span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20">
				{question.question_number}
			</span>
			<div>
				<span class="badge-primary text-[10px]">{QUESTION_TYPE_LABELS[question.type] || question.type}</span>
				<span class="text-xs text-slate-400 ml-2">{question.points} poin</span>
			</div>
		</div>
		<button
			class="btn-sm {isDoubted ? 'bg-amber-100 text-amber-700 border-2 border-amber-400' : 'btn-ghost border border-slate-200'}"
			on:click={toggleDoubt}
		>
			<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
			</svg>
			{isDoubted ? 'Diragu-ragukan' : 'Ragu-ragu'}
		</button>
	</div>

	<!-- Media -->
	{#if question.media_type === 'image' && directMediaUrl}
		<div class="rounded-xl overflow-hidden border border-slate-200 bg-white">
			<img
				src={directMediaUrl}
				alt="Media soal {question.question_number}"
				class="max-w-full h-auto max-h-80 mx-auto object-contain"
				loading="lazy"
			/>
		</div>
	{/if}

	{#if question.media_type === 'audio' && directMediaUrl}
		<AudioPlayer src={directMediaUrl} maxPlays={question.audio_max_plays || 3} />
	{/if}

	<!-- Question Text -->
	<div class="text-base text-slate-800 leading-relaxed font-medium">
		{@html question.question_text}
	</div>

	<!-- Answer Area -->
	<div class="space-y-2">
		{#if question.type === 'pilihan_ganda'}
			<!-- Multiple Choice -->
			{#each options as option, i}
				<div
					role="button"
					tabindex="0"
					class="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
						   {answer === optionLetters[i]
							? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/10'
							: 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}"
					on:click={(e) => {
						const target = e.target;
						if (target.tagName === 'AUDIO' || target.closest('audio')) return;
						if (target.tagName === 'IMG') return; // let the lightbox handle it
						handleAnswer(optionLetters[i]);
					}}
					on:keydown={(e) => e.key === 'Enter' && handleAnswer(optionLetters[i])}
				>
					<span
						class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors
							   {answer === optionLetters[i]
								? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
								: 'bg-slate-100 text-slate-500'}"
					>
						{optionLetters[i]}
					</span>
					<div class="text-sm prose prose-sm max-w-none flex-1 {answer === optionLetters[i] ? 'text-indigo-700 font-medium' : 'text-slate-700'}">{@html option}</div>
				</div>
			{/each}

		{:else if question.type === 'benar_salah'}
			<!-- True / False -->
			<div class="grid grid-cols-2 gap-3">
				{#each ['Benar', 'Salah'] as opt}
					<button
						class="p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200
							   {answer === opt
								? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-500/10'
								: 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'}"
						on:click={() => handleAnswer(opt)}
					>
						{opt}
					</button>
				{/each}
			</div>

		{:else if question.type === 'isian_singkat'}
			<!-- Short Answer -->
			<input
				type="text"
				class="input text-base"
				placeholder="Ketik jawaban singkat di sini..."
				value={answer}
				on:input={(e) => handleAnswer(e.currentTarget.value)}
			/>

		{:else if question.type === 'essay'}
			<!-- Essay -->
			<textarea
				class="input text-base min-h-[200px] resize-y"
				placeholder="Tulis jawaban uraian di sini..."
				value={answer}
				on:input={(e) => handleAnswer(e.currentTarget.value)}
				rows="8"
			></textarea>

		{:else if question.type === 'menjodohkan'}
			<!-- Matching -->
			<div class="space-y-3">
				{#each matchingLeft as leftItem, leftIdx}
					<div class="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200">
						<span class="flex-1 text-sm font-medium text-slate-700 prose prose-sm max-w-none">{@html leftItem}</span>
						<svg class="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
						<select
							class="select max-w-[200px]"
							value={matchingAnswers[String(leftIdx)] ?? ''}
							on:change={(e) => handleMatchingChange(String(leftIdx), e.currentTarget.value)}
						>
							<option value="">-- Pilih --</option>
							{#each matchingRight as rightItem, rightIdx}
								<option value={String(rightIdx)}>{rightItem}</option>
							{/each}
						</select>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Fullscreen Image Lightbox -->
{#if lightboxImage}
	<div 
		class="fixed inset-0 z-[99999] bg-slate-900/95 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300"
		on:click={() => lightboxImage = null}
		on:keydown={(e) => e.key === 'Escape' && (lightboxImage = null)}
		tabindex="-1"
		role="dialog"
	>
		<button type="button" class="absolute top-4 right-4 md:top-6 md:right-6 text-white/50 hover:text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all z-10" on:click={() => lightboxImage = null} title="Tutup">
			<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
		</button>
		<img 
			src={lightboxImage} 
			alt="Gambar Layar Penuh" 
			class="max-w-full max-h-[95vh] object-contain cursor-zoom-out shadow-2xl rounded-lg transform transition-transform"
			on:click|stopPropagation={() => lightboxImage = null}
		/>
	</div>
{/if}
