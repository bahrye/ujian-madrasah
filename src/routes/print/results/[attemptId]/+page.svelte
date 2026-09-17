<script lang="ts">
	import { onMount } from 'svelte';
	import { parseDate } from '$lib/utils/date';
	import { QUESTION_TYPE_LABELS, ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS, ICONS } from '$lib/utils/constants';
	import { mathRender } from '$lib/actions/mathRender';
	import { arabicRender } from '$lib/actions/arabicRender';

	export let data;
	$: school = data.school as any;
	$: attempt = data.attempt as any;
	$: answers = (data.answers || []) as any[];

	let isTwoColumn = true;

	onMount(() => {
		const timer = setTimeout(() => {
			window.print();
		}, 600);
		return () => clearTimeout(timer);
	});

	function safeParseJson(str: string | null | undefined, fallback: any = null) {
		if (!str) return fallback;
		try {
			const parsed = JSON.parse(str);
			if (typeof parsed === 'string') {
				try { return JSON.parse(parsed); } catch { return parsed; }
			}
			return parsed;
		} catch {
			return fallback;
		}
	}

	function safeParseObjectEntries(str: string | null | undefined): [string, any][] {
		const parsed = safeParseJson(str, {});
		if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
			return Object.entries(parsed);
		}
		return [];
	}

	$: locationStr = [
		school?.district ? `Kec. ${school.district}` : '',
		school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kab. ${school.city}`) : '',
		school?.province ? school.province : ''
	].filter(Boolean).join(', ');
</script>

<svelte:head>
	<title>Hasil Ujian - {attempt.student_name} - {attempt.exam_title}</title>
</svelte:head>

<!-- Control Bar (Hidden during print) -->
<div class="no-print fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur text-white px-4 py-2.5 shadow-xl flex items-center justify-between">
	<div class="flex items-center gap-3">
		<span class="font-bold text-sm">Cetak Detail Hasil Ujian</span>
		<span class="text-xs text-slate-400">({attempt.student_name} — {attempt.exam_title})</span>
	</div>
	<div class="flex items-center gap-2">
		<button 
			type="button" 
			class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
			on:click={() => isTwoColumn = !isTwoColumn}
		>
			Tampilan: {isTwoColumn ? '2 Kolom' : '1 Kolom'}
		</button>
		<button 
			type="button" 
			class="btn-primary btn-sm flex items-center gap-1.5"
			on:click={() => window.print()}
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.print} />
			</svg>
			Cetak Sekarang (PDF)
		</button>
		<button 
			type="button" 
			class="btn-ghost btn-sm text-slate-300 hover:text-white"
			on:click={() => window.close()}
		>
			Tutup
		</button>
	</div>
</div>

<!-- Print Container -->
<div class="min-h-screen bg-white text-slate-800 p-3 sm:p-5 print:p-0 print:m-0 pt-14 print:pt-0 font-serif">
	<div class="max-w-5xl mx-auto space-y-3 print:max-w-none">

		<!-- Kop Surat Resmi (Disamakan dengan Daftar Hadir) -->
		<div class="flex items-center justify-between gap-3 pb-1 relative">
			<img 
				src="/kemenag.png" 
				alt="Logo Kemenag" 
				class="w-16 h-16 object-contain shrink-0" 
				on:error={(e) => { (e.currentTarget as HTMLElement).style.visibility = 'hidden'; }}
			/>
			<div class="flex-1 text-center font-serif px-2">
				<h4 class="font-semibold text-xs uppercase tracking-wider text-black m-0 leading-tight">
					KEMENTERIAN AGAMA REPUBLIK INDONESIA
				</h4>
				<h3 class="font-bold text-lg uppercase tracking-wide text-black m-0 my-0.5">
					{school?.name || 'NAMA SEKOLAH'}
				</h3>
				{#if school?.address}
					<p class="text-[11px] italic text-black m-0 leading-tight">{school.address}</p>
				{/if}
				{#if locationStr}
					<p class="text-[11px] italic text-black m-0 leading-tight mt-0.5">{locationStr}</p>
				{/if}
			</div>
			{#if school?.logo_url}
				<img 
					src={school.logo_url} 
					alt="Logo Sekolah" 
					class="w-16 h-16 object-contain shrink-0" 
				/>
			{:else}
				<div class="w-16 h-16 shrink-0"></div>
			{/if}
		</div>

		<!-- Garis Kop Surat (Tipis atas, Agak tebal bawah) -->
		<div class="mt-1 mb-3">
			<div style="border-bottom: 1px solid #000;"></div>
			<div style="border-bottom: 2px solid #000; margin-top: 2px;"></div>
		</div>

		<!-- Info Header Box -->
		<div class="bg-slate-50 rounded-xl p-3 border border-slate-300 font-sans print:bg-slate-50 print:border-slate-300">
			<div class="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2.5">
				<h2 class="font-bold text-sm text-indigo-950 uppercase tracking-wide">Lembar Detail Hasil & Jawaban Ujian</h2>
				<span class="text-[11px] font-semibold px-2.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-md print:border print:border-indigo-200">
					{attempt.exam_title}
				</span>
			</div>

			<div class="grid grid-cols-3 gap-3 text-[11px]">
				<!-- Kolom 1: Siswa -->
				<div class="space-y-0.5">
					<div><span class="text-slate-500">Nama Siswa:</span> <strong class="text-slate-900 block font-bold text-xs">{attempt.student_name}</strong></div>
					<div><span class="text-slate-500">NISN:</span> <span class="font-semibold text-slate-800">{attempt.nisn || '-'}</span></div>
					<div><span class="text-slate-500">No. Peserta:</span> <span class="font-semibold text-slate-800">{attempt.nomor_peserta || '-'}</span></div>
					<div><span class="text-slate-500">Kelas:</span> <span class="font-semibold text-slate-800">{attempt.class_name || '-'}</span></div>
				</div>

				<!-- Kolom 2: Ujian -->
				<div class="space-y-0.5">
					<div><span class="text-slate-500">Mata Pelajaran:</span> <strong class="text-slate-900 block font-semibold">{attempt.subject_name || 'Umum'}</strong></div>
					<div><span class="text-slate-500">Waktu Selesai:</span> <span class="font-semibold text-slate-800">{attempt.submit_time ? parseDate(attempt.submit_time).toLocaleString('id-ID') : '-'}</span></div>
					<div><span class="text-slate-500">Pelanggaran:</span> <span class="font-semibold {attempt.violation_count > 0 ? 'text-rose-600' : 'text-slate-800'}">{attempt.violation_count} kali</span></div>
				</div>

				<!-- Kolom 3: Nilai -->
				<div class="flex items-center justify-end gap-2.5">
					{#if attempt.signature}
						<div class="text-center">
							<span class="text-[9px] text-slate-400 block mb-0.5">TTD Siswa</span>
							<img src={attempt.signature} alt="TTD" class="h-9 object-contain mx-auto" />
						</div>
					{/if}
					<div class="bg-white p-2 rounded-lg border-2 border-indigo-200 text-center min-w-[85px] shadow-sm print:bg-white">
						<span class="text-[9px] font-bold uppercase text-slate-400 block">Nilai Akhir</span>
						<span class="text-xl font-black {(attempt.score ?? 0) >= 70 ? 'text-emerald-600' : 'text-rose-600'}">
							{attempt.score != null ? attempt.score.toFixed(1) : '-'}
						</span>
						<span class="text-[9px] font-medium text-slate-500 block mt-0.5">Poin: {attempt.score ? Math.round((attempt.score / 100) * attempt.total_points) : 0}/{attempt.total_points}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Rincian Jawaban Soal (Clean Grid Layout) -->
		<div class="font-sans">
			<div class="flex items-center justify-between mb-2">
				<h3 class="font-bold text-xs uppercase text-slate-700 tracking-wider">Rincian Jawaban Soal ({answers.length} Soal)</h3>
			</div>

			<div class="{isTwoColumn ? 'grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2.5' : 'space-y-2.5'}" use:mathRender use:arabicRender>
				{#each answers as ans, i (ans.question_number)}
					<div class="break-inside-avoid bg-white rounded-lg border-2 p-2.5 text-[11px] shadow-sm print:shadow-none flex flex-col justify-between {ans.score_given === ans.max_points ? 'border-emerald-400 bg-emerald-50/10' : (ans.score_given > 0 ? 'border-amber-400 bg-amber-50/10' : 'border-rose-400 bg-rose-50/10')}">
						
						<!-- Question Card Top Bar -->
						<div>
							<div class="flex items-center justify-between border-b border-slate-100 pb-1 mb-1.5 gap-2">
								<div class="flex items-center gap-1.5 flex-wrap">
									<span class="font-bold text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">Soal #{ans.question_number}</span>
									<span class="text-[10px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
										{QUESTION_TYPE_LABELS[ans.type]}
									</span>
									{#if ans.is_doubted}
										<span class="text-[10px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Ragu</span>
									{/if}
								</div>
								<div class="font-bold text-xs whitespace-nowrap">
									<span class="{ans.score_given === ans.max_points ? 'text-emerald-600' : (ans.score_given > 0 ? 'text-amber-600' : 'text-rose-600')}">
										{ans.score_given ?? 0}
									</span>
									<span class="text-slate-400 font-normal">/{ans.max_points} Poin</span>
								</div>
							</div>

							<!-- Question Text -->
							<div class="prose prose-xs max-w-none text-slate-800 mb-2 bg-slate-50 p-2 rounded border border-slate-200/60 font-serif leading-snug text-[11px]">
								{@html ans.question_text}
							</div>
						</div>

						<!-- Answer & Solution -->
						<div class="space-y-1.5 mt-auto pt-0.5">
							<!-- Jawaban Siswa -->
							<div class="rounded p-1.5 border {ans.score_given === ans.max_points ? 'bg-emerald-50/50 border-emerald-200' : (ans.score_given > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-rose-50/50 border-rose-200')}">
								<div class="flex items-center justify-between mb-0.5">
									<span class="font-bold text-[10px] uppercase tracking-wider text-slate-600">Jawaban Siswa:</span>
									<span class="text-[10px] font-semibold {ans.score_given === ans.max_points ? 'text-emerald-700' : (ans.score_given > 0 ? 'text-amber-700' : 'text-rose-700')}">
										{#if ans.score_given === ans.max_points}
											Benar
										{:else if ans.score_given > 0}
											Sebagian
										{:else}
											Salah
										{/if}
									</span>
								</div>

								{#if !ans.answer_given}
									<p class="italic text-slate-400">Tidak dijawab</p>
								{:else}
									{#if ans.type === 'menjodohkan'}
										{@const opts = safeParseJson(ans.options_json, {left:[], right:[]})}
										<div class="space-y-0.5 text-[10px]">
											{#each Object.entries(safeParseJson(ans.answer_given, {})) as [key, value]}
												{@const lIdx = parseInt(key)}
												{@const rIdx = parseInt(String(value))}
												{@const rawL = opts.left?.[lIdx] || `No. ${lIdx + 1}`}
												{@const lText = typeof rawL === 'object' ? (rawL?.text || rawL?.content || rawL?.html || '') : rawL}
												{@const rLetter = !isNaN(rIdx) ? String.fromCharCode(65 + rIdx) : (typeof value === 'string' && value.length === 1 ? value : '-')}
												{@const rawR = opts.right?.[rIdx] || value}
												{@const rText = typeof rawR === 'object' ? (rawR?.text || rawR?.content || rawR?.html || '') : rawR}
												<div class="flex items-center gap-1 border-b border-slate-200/50 last:border-0 pb-0.5">
													<span class="font-bold text-slate-800">[{lIdx + 1}]</span>
													<span class="text-slate-700 truncate max-w-[45%]">{@html lText}</span>
													<span class="text-indigo-600 font-bold">➔</span>
													<span class="font-bold text-slate-900">[{rLetter}]</span>
													<span class="text-slate-800 truncate flex-1">{@html rText}</span>
												</div>
											{/each}
										</div>
									{:else if ans.type === 'pilihan_ganda'}
										<p class="font-medium text-slate-900 text-[11px]">
											{#if ans.options_json}
												{@const opts = JSON.parse(ans.options_json)}
												{@const selectedOpt = opts.find((o: any) => String(o.id) === String(ans.answer_given))}
												{selectedOpt ? selectedOpt.text : ans.answer_given}
											{:else}
												{ans.answer_given}
											{/if}
										</p>
									{:else if ans.type === 'pilihan_ganda_kompleks'}
										{@const givenArr = (typeof ans.answer_given === 'string' && ans.answer_given.startsWith('[')) ? JSON.parse(ans.answer_given) : [ans.answer_given]}
										{#if Array.isArray(givenArr)}
											<div class="flex flex-wrap gap-1">
												{#each givenArr as item}
													<span class="px-1.5 py-0.5 bg-white text-slate-800 rounded border border-slate-300 font-medium text-[10px]">{item}</span>
												{/each}
											</div>
										{:else}
											<p class="font-medium text-slate-900 text-[11px]">{ans.answer_given}</p>
										{/if}
									{:else if ans.type === 'benar_salah'}
										{@const opts = safeParseJson(ans.options_json, null)}
										{@const givenMap = safeParseJson(ans.answer_given, null)}
										{#if opts && opts.statements && Array.isArray(opts.statements)}
											<div class="space-y-0.5 text-[10px]">
												{#each opts.statements as stmt, idx}
													{@const choice = typeof givenMap === 'object' && givenMap !== null ? givenMap[String(idx)] : null}
													<div class="flex items-center justify-between border-b border-slate-200/50 last:border-0 pb-0.5 gap-1">
														<span class="text-slate-800">{idx + 1}. {@html stmt}</span>
														<span class="font-bold shrink-0 {choice === 'Benar' ? 'text-emerald-700' : (choice === 'Salah' ? 'text-rose-700' : 'text-slate-400')}">
															{choice || '-'}
														</span>
													</div>
												{/each}
											</div>
										{:else}
											<p class="font-medium text-slate-900 text-[11px]">{ans.answer_given}</p>
										{/if}
									{:else}
										<p class="font-medium text-slate-900 whitespace-pre-wrap text-[11px]">{ans.answer_given}</p>
									{/if}
								{/if}
							</div>

							<!-- Kunci Jawaban -->
							<div class="rounded p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-950">
								<span class="font-bold text-[10px] uppercase tracking-wider text-emerald-800 block mb-0.5">Kunci Jawaban:</span>
								{#if ['essay', 'isian_singkat'].includes(ans.type)}
									{#if ans.type === 'essay'}
										<p class="italic text-slate-500 text-[10px]">Penilaian manual oleh Guru</p>
									{:else}
										<p class="font-bold text-emerald-900 text-[11px]">
											{safeParseJson(ans.correct_answer_json, '-')}
										</p>
									{/if}
								{:else}
									{#if ans.correct_answer_json}
										{#if ans.type === 'menjodohkan'}
											{@const opts = safeParseJson(ans.options_json, {left:[], right:[]})}
											<div class="space-y-0.5 text-[10px]">
												{#each safeParseObjectEntries(ans.correct_answer_json) as [key, value]}
													{@const lIdx = parseInt(key)}
													{@const rIdx = parseInt(String(value))}
													{@const rawL = opts.left?.[lIdx] || `No. ${lIdx + 1}`}
													{@const lText = typeof rawL === 'object' ? (rawL?.text || rawL?.content || rawL?.html || '') : rawL}
													{@const rLetter = !isNaN(rIdx) ? String.fromCharCode(65 + rIdx) : (typeof value === 'string' && value.length === 1 ? value : '-')}
													{@const rawR = opts.right?.[rIdx] || value}
													{@const rText = typeof rawR === 'object' ? (rawR?.text || rawR?.content || rawR?.html || '') : rawR}
													<div class="flex items-center gap-1 border-b border-emerald-200/60 last:border-0 pb-0.5">
														<span class="font-bold text-emerald-900">[{lIdx + 1}]</span>
														<span class="text-emerald-800 truncate max-w-[45%]">{@html lText}</span>
														<span class="text-emerald-600 font-bold">➔</span>
														<span class="font-bold text-emerald-950">[{rLetter}]</span>
														<span class="text-emerald-900 truncate flex-1">{@html rText}</span>
													</div>
												{/each}
											</div>
										{:else if ans.type === 'pilihan_ganda'}
											<p class="font-bold text-emerald-900 text-[11px]">
												{#if ans.options_json}
													{@const opts = safeParseJson(ans.options_json, [])}
													{@const correctOptId = safeParseJson(ans.correct_answer_json, '')}
													{@const correctOpt = Array.isArray(opts) ? opts.find((o: any) => String(o.id) === String(correctOptId)) : null}
													{correctOpt ? correctOpt.text : correctOptId}
												{:else}
													{safeParseJson(ans.correct_answer_json, '-')}
												{/if}
											</p>
										{:else if ans.type === 'pilihan_ganda_kompleks'}
											{@const correctArr = safeParseJson(ans.correct_answer_json, [])}
											{#if Array.isArray(correctArr)}
												<div class="flex flex-wrap gap-1">
													{#each correctArr as item}
														<span class="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded border border-emerald-300 text-[10px]">{item}</span>
													{/each}
												</div>
											{:else}
												<p class="font-bold text-emerald-900 text-[11px]">{safeParseJson(ans.correct_answer_json, '-')}</p>
											{/if}
										{:else if ans.type === 'benar_salah'}
											{@const opts = safeParseJson(ans.options_json, null)}
											{@const correctMap = safeParseJson(ans.correct_answer_json, null)}
											{#if opts && opts.statements && Array.isArray(opts.statements)}
												<div class="space-y-0.5 text-[10px]">
													{#each opts.statements as stmt, idx}
														{@const keyVal = typeof correctMap === 'object' && correctMap !== null ? (correctMap[String(idx)] || correctMap[idx]) : 'Benar'}
														<div class="flex items-center justify-between border-b border-emerald-200/60 last:border-0 pb-0.5 gap-1">
															<span class="text-emerald-950">{idx + 1}. {@html stmt}</span>
															<span class="font-bold shrink-0 {keyVal === 'Benar' ? 'text-emerald-800' : 'text-rose-800'}">
																{keyVal || 'Benar'}
															</span>
														</div>
													{/each}
												</div>
											{:else}
												<p class="font-bold text-emerald-900 text-[11px]">{safeParseJson(ans.correct_answer_json, '-')}</p>
											{/if}
										{:else}
											<p class="font-bold text-emerald-900 text-[11px]">{safeParseJson(ans.correct_answer_json, '-')}</p>
										{/if}
									{:else}
										<p class="italic text-slate-500 text-[10px]">Tidak ada kunci jawaban</p>
									{/if}
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Footer cetak -->
		<div class="mt-3 pt-2 border-t border-slate-300 flex items-center justify-between text-[9px] text-slate-500 font-sans">
			<span>Dicetak otomatis dari Ujian Online Madrasah ({new Date().toLocaleDateString('id-ID')})</span>
			<span>Halaman Detail Hasil Jawaban — {attempt.student_name} ({attempt.exam_title})</span>
		</div>
	</div>
</div>

<style>
	:global(.prose img) {
		max-width: 100% !important;
		max-height: 180px !important;
		height: auto !important;
		object-fit: contain !important;
		border-radius: 0.375rem;
		margin: 0.25rem auto;
		display: block;
	}
	@media print {
		@page {
			size: A4 portrait;
			margin: 6mm 8mm;
		}
		:global(body) {
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
			background: white !important;
		}
		.no-print {
			display: none !important;
		}
		.break-inside-avoid {
			break-inside: avoid !important;
			page-break-inside: avoid !important;
		}
	}
</style>
