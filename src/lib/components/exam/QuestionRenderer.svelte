<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';
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
		const raw = question?.options_json;
		if (raw) {
			if (typeof raw === 'object') {
				options = raw;
			} else if (typeof raw === 'string') {
				try {
					let parsed = JSON.parse(raw);
					if (typeof parsed === 'string') {
						try { parsed = JSON.parse(parsed); } catch {}
					}
					options = parsed || [];
				} catch (e) {
					console.error("Invalid options_json for question", question?.id, e);
					options = [];
				}
			} else {
				options = [];
			}
		} else if ((question as any)?.options) {
			options = (question as any).options;
		} else {
			options = [];
		}
	}
	
	$: safeOptions = Array.isArray(options) ? options : [];
	$: safeType = (question?.type || '').trim().toLowerCase();
	$: matchingLeft = safeType === 'menjodohkan' && options?.left ? options.left : [];
	$: matchingRight = safeType === 'menjodohkan' && options?.right ? options.right : [];

	function getOptionHtml(opt: any): string {
		if (opt == null) return '';
		if (typeof opt === 'object') {
			const str = opt.html || opt.text || opt.label || opt.content || '';
			return String(str).replace(/^(<br\s*\/?>\s*)+/i, '');
		}
		return String(opt).replace(/^(<br\s*\/?>\s*)+/i, '');
	}

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

	// Matching Color Palette & Interactive Line Logic
	const MATCH_COLORS = [
		{ border: 'border-blue-500', bg: 'bg-blue-50/90', ring: 'ring-blue-400', badge: 'bg-blue-600 text-white', stroke: '#3b82f6', hex: '#3b82f6' },
		{ border: 'border-emerald-500', bg: 'bg-emerald-50/90', ring: 'ring-emerald-400', badge: 'bg-emerald-600 text-white', stroke: '#10b981', hex: '#10b981' },
		{ border: 'border-purple-500', bg: 'bg-purple-50/90', ring: 'ring-purple-400', badge: 'bg-purple-600 text-white', stroke: '#8b5cf6', hex: '#8b5cf6' },
		{ border: 'border-amber-500', bg: 'bg-amber-50/90', ring: 'ring-amber-400', badge: 'bg-amber-600 text-white', stroke: '#f59e0b', hex: '#f59e0b' },
		{ border: 'border-rose-500', bg: 'bg-rose-50/90', ring: 'ring-rose-400', badge: 'bg-rose-600 text-white', stroke: '#f43f5e', hex: '#f43f5e' },
		{ border: 'border-cyan-500', bg: 'bg-cyan-50/90', ring: 'ring-cyan-400', badge: 'bg-cyan-600 text-white', stroke: '#06b6d4', hex: '#06b6d4' },
		{ border: 'border-indigo-500', bg: 'bg-indigo-50/90', ring: 'ring-indigo-400', badge: 'bg-indigo-600 text-white', stroke: '#6366f1', hex: '#6366f1' },
		{ border: 'border-orange-500', bg: 'bg-orange-50/90', ring: 'ring-orange-400', badge: 'bg-orange-600 text-white', stroke: '#f97316', hex: '#f97316' },
	];

	let selectedLeftIdx: number | null = null;
	let selectedRightIdx: number | null = null;
	let matchingContainerEl: HTMLDivElement | null = null;
	let connectionLines: Array<{ x1: number; y1: number; x2: number; y2: number; color: string; leftIdx: number; rightIdx: number }> = [];

	function selectLeftItem(idx: number) {
		if (selectedLeftIdx === idx) {
			selectedLeftIdx = null;
		} else {
			selectedLeftIdx = idx;
			if (selectedRightIdx !== null) {
				handleMatchingConnect(idx, selectedRightIdx);
				selectedLeftIdx = null;
				selectedRightIdx = null;
			}
		}
	}

	function selectRightItem(idx: number) {
		if (selectedRightIdx === idx) {
			selectedRightIdx = null;
		} else {
			selectedRightIdx = idx;
			if (selectedLeftIdx !== null) {
				handleMatchingConnect(selectedLeftIdx, idx);
				selectedLeftIdx = null;
				selectedRightIdx = null;
			}
		}
	}

	function handleMatchingConnect(leftIdx: number, rightIdx: number) {
		matchingAnswers[String(leftIdx)] = String(rightIdx);
		matchingAnswers = { ...matchingAnswers };
		dispatch('answer', { questionId: question.id, answer: JSON.stringify(matchingAnswers) });
		recalculateLines();
	}

	function removeMatchingPair(leftIdx: number, e?: Event) {
		if (e) e.stopPropagation();
		delete matchingAnswers[String(leftIdx)];
		matchingAnswers = { ...matchingAnswers };
		dispatch('answer', { questionId: question.id, answer: JSON.stringify(matchingAnswers) });
		recalculateLines();
	}

	function recalculateLines() {
		if (!matchingContainerEl || safeType !== 'menjodohkan') return;
		tick().then(() => {
			if (!matchingContainerEl) return;
			const containerRect = matchingContainerEl.getBoundingClientRect();
			const lines: typeof connectionLines = [];

			Object.entries(matchingAnswers).forEach(([leftKey, rightVal]) => {
				const leftI = parseInt(leftKey, 10);
				const rightI = parseInt(String(rightVal), 10);
				if (isNaN(leftI) || isNaN(rightI)) return;

				const leftPort = document.getElementById(`match-port-left-${question.id}-${leftI}`);
				const rightPort = document.getElementById(`match-port-right-${question.id}-${rightI}`);

				if (leftPort && rightPort) {
					const lRect = leftPort.getBoundingClientRect();
					const rRect = rightPort.getBoundingClientRect();
					
					const x1 = lRect.left + lRect.width / 2 - containerRect.left;
					const y1 = lRect.top + lRect.height / 2 - containerRect.top;
					const x2 = rRect.left + rRect.width / 2 - containerRect.left;
					const y2 = rRect.top + rRect.height / 2 - containerRect.top;

					const color = MATCH_COLORS[leftI % MATCH_COLORS.length].stroke;
					lines.push({ x1, y1, x2, y2, color, leftIdx: leftI, rightIdx: rightI });
				}
			});

			connectionLines = lines;
		});
	}

	$: if (safeType === 'menjodohkan' && (matchingAnswers || matchingLeft || matchingRight)) {
		recalculateLines();
	}

	onMount(() => {
		if (safeType === 'menjodohkan') {
			recalculateLines();
			const handleResize = () => recalculateLines();
			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}
	});

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
		if (rightIndex === '') {
			removeMatchingPair(Number(leftIndex));
		} else {
			handleMatchingConnect(Number(leftIndex), Number(rightIndex));
		}
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

<div class="space-y-5 animate-in" on:click={handleContentClick} on:keydown={(e) => e.key === 'Enter' && handleContentClick(e as any)} role="presentation">
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
	<div class="text-base text-slate-800 leading-relaxed font-medium prose prose-sm max-w-none" use:mathRender={question.question_text} use:arabicRender={question.question_text}>
		{@html question.question_text}
	</div>

	<!-- Answer Area -->
	<div class="space-y-2">
		{#if safeType === 'pilihan_ganda' || safeType === 'pilihan_ganda_kompleks'}
			<!-- Multiple Choice -->
			{#each safeOptions as option, i}
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
						{@html getOptionHtml(option)}
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
			<!-- Interactive Matching Table with Connecting Lines -->
			<div class="relative space-y-3" bind:this={matchingContainerEl}>
				<!-- Guidance Banner -->
				<div class="flex items-center justify-between p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-800">
					<div class="flex items-center gap-2">
						<span class="text-base">🔗</span>
						<span><b>Petunjuk Menjodohkan:</b> Klik pernyataan di kiri lalu klik jawaban pasangannya di kanan untuk menghubungkan.</span>
					</div>
					{#if Object.keys(matchingAnswers).length > 0}
						<span class="font-semibold px-2 py-0.5 bg-indigo-200/70 rounded-full text-indigo-900 text-[11px] shrink-0">
							{Object.keys(matchingAnswers).length} dari {matchingLeft.length} terhubung
						</span>
					{/if}
				</div>

				<!-- SVG Line Overlay (Mobile & Desktop) -->
				<svg class="absolute inset-0 w-full h-full pointer-events-none z-20 block">
					{#each connectionLines as line}
						{@const dx = (line.x2 - line.x1) * 0.5}
						<!-- Glow background path -->
						<path
							d="M {line.x1} {line.y1} C {line.x1 + dx} {line.y1}, {line.x2 - dx} {line.y2}, {line.x2} {line.y2}"
							fill="none"
							stroke={line.color}
							stroke-width="6"
							stroke-opacity="0.25"
							stroke-linecap="round"
						/>
						<!-- Solid line -->
						<path
							d="M {line.x1} {line.y1} C {line.x1 + dx} {line.y1}, {line.x2 - dx} {line.y2}, {line.x2} {line.y2}"
							fill="none"
							stroke={line.color}
							stroke-width="2.5"
							stroke-linecap="round"
						/>
						<circle cx={line.x1} cy={line.y1} r="4.5" fill={line.color} stroke="#ffffff" stroke-width="1.5" />
						<circle cx={line.x2} cy={line.y2} r="4.5" fill={line.color} stroke="#ffffff" stroke-width="1.5" />
					{/each}
				</svg>

				<!-- Matching Columns Grid (Always 2 Columns) -->
				<div class="grid grid-cols-2 gap-2 sm:gap-4 relative z-10">
					<!-- Left Column: Pernyataan -->
					<div class="space-y-2 sm:space-y-3">
						<div class="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Kolom Kiri (Pernyataan)</div>
						{#each matchingLeft as leftItem, leftIdx}
							{@const hasMatch = matchingAnswers[String(leftIdx)] !== undefined}
							{@const matchedRightIdx = hasMatch ? Number(matchingAnswers[String(leftIdx)]) : null}
							{@const pairColor = hasMatch ? MATCH_COLORS[leftIdx % MATCH_COLORS.length] : null}
							{@const isSelected = selectedLeftIdx === leftIdx}
							
							<div 
								role="button"
								tabindex="0"
								class="relative flex items-center justify-between gap-1.5 sm:gap-3 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none text-left
									{hasMatch ? `${pairColor.bg} ${pairColor.border} shadow-xs` : (isSelected ? 'border-indigo-600 bg-indigo-50/70 ring-2 sm:ring-4 ring-indigo-500/20 shadow-sm' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/70')}"
								on:click={() => selectLeftItem(leftIdx)}
								on:keydown={(e) => e.key === 'Enter' && selectLeftItem(leftIdx)}
							>
								<div class="flex items-start gap-1.5 sm:gap-2.5 flex-1 min-w-0">
									<span class="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 transition-colors
										{hasMatch ? pairColor.badge : (isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600')}">
										{leftIdx + 1}
									</span>
									<div class="flex-1 min-w-0">
										<div class="text-xs sm:text-sm font-medium {hasMatch ? 'text-slate-900 font-semibold' : 'text-slate-700'} prose prose-sm max-w-none break-words">
											{@html leftItem}
										</div>
										{#if hasMatch && matchedRightIdx !== null}
											<div class="flex items-center gap-1 mt-1 sm:mt-2 flex-wrap">
												<span class="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-bold {pairColor.badge} shadow-xs">
													➔ [{String.fromCharCode(65 + matchedRightIdx)}]
												</span>
												<button 
													type="button" 
													class="px-1 py-0.5 rounded text-[9px] sm:text-[11px] bg-white/80 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 transition-colors"
													on:click={(e) => removeMatchingPair(leftIdx, e)}
													title="Hapus Sambungan"
												>
													✕
												</button>
											</div>
										{/if}
									</div>
								</div>

								<!-- Connector Port Right -->
								<div 
									id="match-port-left-{question.id}-{leftIdx}"
									class="w-4 h-4 sm:w-6 sm:h-6 rounded-full border sm:border-2 flex items-center justify-center shrink-0 transition-all ml-0.5 sm:ml-1
										{hasMatch ? `${pairColor.border} bg-white shadow-xs ring-1 sm:ring-2 ${pairColor.ring}` : (isSelected ? 'border-indigo-600 bg-indigo-600 ring-2 sm:ring-4 ring-indigo-500/30' : 'border-slate-300 bg-slate-100')}"
								>
									{#if hasMatch}
										<div class="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full" style="background-color: {pairColor.hex};"></div>
									{:else if isSelected}
										<div class="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-white animate-ping"></div>
									{/if}
								</div>
							</div>
						{/each}
					</div>

					<!-- Right Column: Pilihan Jawaban -->
					<div class="space-y-2 sm:space-y-3">
						<div class="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Kolom Kanan (Pilihan Jawaban)</div>
						{#each matchingRight as rightItem, rightIdx}
							{@const matchedLeftKeys = Object.keys(matchingAnswers).filter(k => matchingAnswers[k] === String(rightIdx))}
							{@const isMatched = matchedLeftKeys.length > 0}
							{@const primaryLeftIdx = isMatched ? Number(matchedLeftKeys[0]) : null}
							{@const pairColor = isMatched && primaryLeftIdx !== null ? MATCH_COLORS[primaryLeftIdx % MATCH_COLORS.length] : null}
							{@const isSelected = selectedRightIdx === rightIdx}
							
							<div 
								role="button"
								tabindex="0"
								class="relative flex items-center justify-between gap-1.5 sm:gap-3 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none text-left
									{isMatched ? `${pairColor.bg} ${pairColor.border} shadow-xs` : (isSelected ? 'border-indigo-600 bg-indigo-50/70 ring-2 sm:ring-4 ring-indigo-500/20 shadow-sm' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/70')}"
								on:click={() => selectRightItem(rightIdx)}
								on:keydown={(e) => e.key === 'Enter' && selectRightItem(rightIdx)}
							>
								<!-- Connector Port Left -->
								<div 
									id="match-port-right-{question.id}-{rightIdx}"
									class="w-4 h-4 sm:w-6 sm:h-6 rounded-full border sm:border-2 flex items-center justify-center shrink-0 transition-all mr-0.5 sm:mr-1
										{isMatched ? `${pairColor.border} bg-white shadow-xs ring-1 sm:ring-2 ${pairColor.ring}` : (isSelected ? 'border-indigo-600 bg-indigo-600 ring-2 sm:ring-4 ring-indigo-500/30' : 'border-slate-300 bg-slate-100')}"
								>
									{#if isMatched}
										<div class="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full" style="background-color: {pairColor.hex};"></div>
									{:else if isSelected}
										<div class="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-white animate-ping"></div>
									{/if}
								</div>

								<div class="flex items-start gap-1.5 sm:gap-2.5 flex-1 min-w-0">
									<span class="w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 transition-colors
										{isMatched ? pairColor.badge : (isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600')}">
										{String.fromCharCode(65 + rightIdx)}
									</span>
									<div class="flex-1 min-w-0">
										<div class="text-xs sm:text-sm font-medium {isMatched ? 'text-slate-900 font-semibold' : 'text-slate-700'} prose prose-sm max-w-none break-words">
											{@html rightItem}
										</div>
										{#if isMatched}
											<div class="flex items-center gap-1 mt-1 sm:mt-2 flex-wrap">
												{#each matchedLeftKeys as lKey}
													<span class="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-bold {MATCH_COLORS[Number(lKey) % MATCH_COLORS.length].badge} shadow-xs">
														No. {Number(lKey) + 1}
													</span>
												{/each}
											</div>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
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
