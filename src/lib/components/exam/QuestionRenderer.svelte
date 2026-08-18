<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import AudioPlayer from './AudioPlayer.svelte';
	import { QUESTION_TYPE_LABELS } from '$lib/utils/constants';
	import { mathRender } from '$lib/actions/mathRender';
	import { arabicRender } from '$lib/actions/arabicRender';
	import { pinchZoom } from '$lib/actions/pinchZoom';

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
	export let displayNumber: number | undefined = undefined;

	const dispatch = createEventDispatcher();

	let options: any = [];
	$: {
		if (question.options_json) {
			try {
				options = JSON.parse(question.options_json);
			} catch (e) {
				console.error("Invalid options_json for question", question.id, e);
				options = [];
			}
		} else {
			options = [];
		}
	}
	
	$: safeType = (question.type || '').trim().toLowerCase();
	$: matchingLeft = safeType === 'menjodohkan' && options?.left ? options.left : [];
	$: matchingRight = safeType === 'menjodohkan' && options?.right ? options.right : [];

	// Untuk menjodohkan, answer disimpan sebagai JSON string mapping
	let matchingAnswers: Record<string, string> = {};
	$: if (safeType === 'menjodohkan' && answer) {
		try {
			matchingAnswers = JSON.parse(answer);
		} catch {
			matchingAnswers = {};
		}
	}

	let complexAnswers: string[] = [];
	$: if (safeType === 'pilihan_ganda_kompleks') {
		if (answer) {
			try {
				const parsed = JSON.parse(answer);
				complexAnswers = Array.isArray(parsed) ? parsed : [];
			} catch {
				complexAnswers = [];
			}
		} else {
			complexAnswers = [];
		}
	}

	$: benarSalahStatements = (safeType === 'benar_salah' && options?.statements && Array.isArray(options.statements)) ? options.statements : [];
	let benarSalahAnswers: Record<string, string> = {};
	$: if (safeType === 'benar_salah' && answer) {
		try {
			const parsed = JSON.parse(answer);
			if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
				benarSalahAnswers = parsed;
			} else {
				benarSalahAnswers = { "0": String(answer) };
			}
		} catch {
			benarSalahAnswers = { "0": String(answer) };
		}
	} else if (safeType === 'benar_salah' && !answer) {
		benarSalahAnswers = {};
	}

	function handleAnswer(value: string) {
		dispatch('answer', { questionId: question.id, answer: value });
	}

	function handleComplexAnswer(value: string) {
		let newAnswers;
		if (complexAnswers.includes(value)) {
			newAnswers = complexAnswers.filter(a => a !== value);
		} else {
			newAnswers = [...complexAnswers, value];
		}
		complexAnswers = newAnswers;
		dispatch('answer', { questionId: question.id, answer: JSON.stringify(newAnswers) });
	}

	function handleMatchingChange(leftIndex: string, rightIndex: string) {
		matchingAnswers[leftIndex] = rightIndex;
		dispatch('answer', { questionId: question.id, answer: JSON.stringify(matchingAnswers) });
	}

	function handleBenarSalahChange(index: number, val: 'Benar' | 'Salah') {
		benarSalahAnswers[String(index)] = val;
		dispatch('answer', { questionId: question.id, answer: JSON.stringify(benarSalahAnswers) });
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

<div class="space-y-5 animate-in" on:click={handleContentClick} on:keydown={(e) => e.key === 'Enter' && handleContentClick(e as any)} role="presentation" use:mathRender={question.id} use:arabicRender={question.id}>
	<!-- Header -->
	<div class="flex items-center justify-between flex-wrap gap-2">
		<div class="flex items-center gap-3">
			<span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20">
				{displayNumber !== undefined ? displayNumber : question.question_number}
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
	<div class="text-base text-slate-800 leading-relaxed font-medium prose prose-sm max-w-none">
		{@html question.question_text}
	</div>

	<!-- Answer Area -->
	<div class="space-y-2">
		{#if safeType === 'pilihan_ganda' || safeType === 'pilihan_ganda_kompleks'}
			<!-- Multiple Choice -->
			{#each options as option, i}
				{@const isSelected = safeType === 'pilihan_ganda_kompleks' ? complexAnswers.includes(optionLetters[i]) : answer === optionLetters[i]}
				<div
					role="button"
					tabindex="0"
					class="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
						   {isSelected
							? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/10'
							: 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}"
					on:click={(e) => {
						const target = e.target;
						if (target.tagName === 'AUDIO' || target.closest('audio')) return;
						if (target.tagName === 'IMG') return; // let the lightbox handle it
						if (safeType === 'pilihan_ganda_kompleks') {
							handleComplexAnswer(optionLetters[i]);
						} else {
							handleAnswer(optionLetters[i]);
						}
					}}
					on:keydown={(e) => {
						if (e.key === 'Enter') {
							if (safeType === 'pilihan_ganda_kompleks') {
								handleComplexAnswer(optionLetters[i]);
							} else {
								handleAnswer(optionLetters[i]);
							}
						}
					}}
				>
					{#if safeType === 'pilihan_ganda_kompleks'}
						<div class="flex items-center justify-center w-6 h-6 rounded border-2 flex-shrink-0 transition-colors mr-1
							{isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-300 bg-white'}">
							{#if isSelected}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
							{/if}
						</div>
					{/if}
					<span
						class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors
							   {isSelected
								? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
								: 'bg-slate-100 text-slate-500'}"
					>
						{optionLetters[i]}
					</span>
					<div class="option-content text-sm prose prose-sm max-w-none flex-1 {isSelected ? 'text-indigo-700 font-medium' : 'text-slate-700'}">
						{@html option.replace(/^(<br\s*\/?>\s*)+/i, '')}
					</div>
				</div>
			{/each}

		{:else if safeType === 'benar_salah'}
			{#if benarSalahStatements.length > 0}
				<!-- Multi-statement True / False Table -->
				<div class="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
					<table class="w-full text-sm border-collapse text-left">
						<thead>
							<tr class="bg-slate-50 border-b border-slate-200 text-slate-700">
								<th class="py-3 px-3 w-12 text-center font-semibold">No</th>
								<th class="py-3 px-4 font-semibold">Pernyataan</th>
								<th class="py-3 px-3 w-28 text-center font-semibold text-emerald-700 bg-emerald-50/50">Benar</th>
								<th class="py-3 px-3 w-28 text-center font-semibold text-rose-700 bg-rose-50/50">Salah</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-100">
							{#each benarSalahStatements as stmt, idx}
								{@const choice = benarSalahAnswers[String(idx)]}
								<tr class="hover:bg-slate-50/70 transition-colors">
									<td class="py-3.5 px-3 text-center text-slate-500 font-semibold">{idx + 1}</td>
									<td class="py-3.5 px-4 text-slate-800 prose prose-sm max-w-none">{@html stmt}</td>
									<td class="py-3.5 px-3 text-center bg-emerald-50/20">
										<button
											type="button"
											class="w-full py-1.5 px-2 rounded-lg border-2 font-medium text-xs transition-all flex items-center justify-center gap-1.5 {choice === 'Benar' ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20' : 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50'}"
											on:click={() => handleBenarSalahChange(idx, 'Benar')}
										>
											<span class="w-3.5 h-3.5 rounded-full border flex items-center justify-center {choice === 'Benar' ? 'border-white bg-white' : 'border-slate-400'}">
												{#if choice === 'Benar'}
													<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
												{/if}
											</span>
											Benar
										</button>
									</td>
									<td class="py-3.5 px-3 text-center bg-rose-50/20">
										<button
											type="button"
											class="w-full py-1.5 px-2 rounded-lg border-2 font-medium text-xs transition-all flex items-center justify-center gap-1.5 {choice === 'Salah' ? 'bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-500/20' : 'border-slate-200 text-slate-600 hover:border-rose-300 hover:bg-rose-50/50'}"
											on:click={() => handleBenarSalahChange(idx, 'Salah')}
										>
											<span class="w-3.5 h-3.5 rounded-full border flex items-center justify-center {choice === 'Salah' ? 'border-white bg-white' : 'border-slate-400'}">
												{#if choice === 'Salah'}
													<span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
												{/if}
											</span>
											Salah
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<!-- Legacy True / False -->
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
			{/if}

		{:else if safeType === 'isian_singkat'}
			<!-- Short Answer -->
			<input
				type="search"
				name="jawaban_siswa_{question.id}_{Date.now()}"
				id="jawaban_siswa_{question.id}"
				data-lpignore="true"
				data-form-type="other"
				class="input text-base appearance-none"
				placeholder="Ketik jawaban singkat di sini..."
				value={answer}
				on:input={(e) => handleAnswer(e.currentTarget.value)}
				autocomplete="do-not-autofill"
				autocorrect="off"
				autocapitalize="off"
				spellcheck="false"
			/>

		{:else if safeType === 'essay'}
			<!-- Essay -->
			<textarea
				name="jawaban_uraian_{question.id}_{Date.now()}"
				id="jawaban_uraian_{question.id}"
				data-lpignore="true"
				data-form-type="other"
				class="input text-base min-h-[200px] resize-y appearance-none"
				placeholder="Tulis jawaban uraian di sini..."
				value={answer}
				on:input={(e) => handleAnswer(e.currentTarget.value)}
				rows="8"
				autocomplete="do-not-autofill"
				autocorrect="off"
				autocapitalize="off"
				spellcheck="false"
			></textarea>

		{:else if safeType === 'menjodohkan'}
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
			class="max-w-full max-h-[95vh] object-contain cursor-move shadow-2xl rounded-lg"
			on:click|stopPropagation
			use:pinchZoom
		/>
	</div>
{/if}

<style>
	/* Memaksa elemen media di dalam opsi untuk merentang penuh dan membuang margin tak perlu */
	.option-content :global(audio) {
		width: 100% !important;
		max-width: 100% !important;
		margin-top: 0 !important;
		margin-bottom: 0 !important;
	}
	.option-content :global(img) {
		margin-top: 0 !important;
		margin-bottom: 0 !important;
	}
</style>
