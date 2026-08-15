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

	function formatAddress(school: any) {
		if (!school) return '';
		const parts = [
			school.address,
			school.village ? `Desa/Kel. ${school.village}` : '',
			school.district ? `Kec. ${school.district}` : '',
			school.city ? (String(school.city).toLowerCase().startsWith('kab') || String(school.city).toLowerCase().startsWith('kota') ? school.city : `Kab. ${school.city}`) : '',
			school.province ? school.province : ''
		].filter(Boolean);
		return parts.join(', ');
	}
</script>

<svelte:head>
	<title>Hasil Ujian - {attempt.student_name} - {attempt.exam_title}</title>
</svelte:head>

<!-- Toolbar Controls (Hidden during print) -->
<div class="no-print fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur text-white px-4 py-3 shadow-xl flex items-center justify-between">
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
<div class="min-h-screen bg-white text-slate-800 p-4 sm:p-6 print:p-0 print:m-0 pt-16 print:pt-0">
	<div class="max-w-5xl mx-auto space-y-4 print:max-w-none">

		<!-- Kop Sekolah / Madrasah -->
		<div class="border-b-2 border-slate-900 pb-3 flex items-center gap-4">
			{#if school?.logo_url}
				<img src={school.logo_url} alt="Logo" class="w-16 h-16 object-contain flex-shrink-0" />
			{/if}
			<div class="flex-1 text-center">
				<h1 class="text-xl font-black uppercase tracking-wide text-slate-900">{school?.name || 'MADRASAH'}</h1>
				{#if formatAddress(school)}
					<p class="text-xs text-slate-600 mt-0.5">{formatAddress(school)}</p>
				{/if}
				<div class="mt-1 flex justify-center gap-4 text-[11px] text-slate-500 font-medium">
					{#if school?.npsn}<span>NPSN: {school.npsn}</span>{/if}
					{#if school?.nsm}<span>NSM: {school.nsm}</span>{/if}
				</div>
			</div>
		</div>

		<!-- Judul & Info Peserta Header -->
		<div class="bg-slate-50 rounded-xl p-4 border border-slate-200 print:bg-slate-50 print:border-slate-300">
			<div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
				<h2 class="font-bold text-base text-indigo-950 uppercase tracking-wide">Lembar Detail Hasil & Jawaban Ujian</h2>
				<span class="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-md print:border print:border-indigo-200">
					{attempt.exam_title}
				</span>
			</div>

			<div class="grid grid-cols-3 gap-4 text-xs">
				<!-- Kolom 1: Siswa -->
				<div class="space-y-1">
					<div><span class="text-slate-500">Nama Siswa:</span> <strong class="text-slate-900 block font-bold text-sm">{attempt.student_name}</strong></div>
					<div><span class="text-slate-500">NISN / No. Peserta:</span> <span class="font-semibold text-slate-800">{attempt.nomor_peserta || attempt.nisn}</span></div>
					<div><span class="text-slate-500">Kelas:</span> <span class="font-semibold text-slate-800">{attempt.class_name || '-'}</span></div>
				</div>

				<!-- Kolom 2: Ujian -->
				<div class="space-y-1">
					<div><span class="text-slate-500">Mata Pelajaran:</span> <strong class="text-slate-900 block font-semibold">{attempt.subject_name || 'Umum'}</strong></div>
					<div><span class="text-slate-500">Waktu Selesai:</span> <span class="font-semibold text-slate-800">{attempt.submit_time ? parseDate(attempt.submit_time).toLocaleString('id-ID') : '-'}</span></div>
					<div><span class="text-slate-500">Pelanggaran:</span> <span class="font-semibold {attempt.violation_count > 0 ? 'text-rose-600' : 'text-slate-800'}">{attempt.violation_count} kali</span></div>
				</div>

				<!-- Kolom 3: Nilai -->
				<div class="flex items-center justify-end gap-3">
					{#if attempt.signature}
						<div class="text-center">
							<span class="text-[10px] text-slate-400 block mb-0.5">TTD Siswa</span>
							<img src={attempt.signature} alt="TTD" class="h-10 object-contain mx-auto" />
						</div>
					{/if}
					<div class="bg-white p-3 rounded-lg border-2 border-indigo-200 text-center min-w-[90px] shadow-sm print:bg-white">
						<span class="text-[10px] font-bold uppercase text-slate-400 block">Nilai Akhir</span>
						<span class="text-2xl font-black {(attempt.score ?? 0) >= 70 ? 'text-emerald-600' : 'text-rose-600'}">
							{attempt.score != null ? attempt.score.toFixed(1) : '-'}
						</span>
						<span class="text-[10px] font-medium text-slate-500 block mt-0.5">Poin: {attempt.score ? Math.round((attempt.score / 100) * attempt.total_points) : 0}/{attempt.total_points}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Daftar Soal & Jawaban (2 Kolom / 1 Kolom Grid) -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="font-bold text-xs uppercase text-slate-700 tracking-wider">Rincian Jawaban Soal ({answers.length} Soal)</h3>
			</div>

			<div class="{isTwoColumn ? 'grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-2.5 print:gap-2.5' : 'space-y-3'}" use:mathRender use:arabicRender>
				{#each answers as ans, i (ans.question_number)}
					<div class="break-inside-avoid bg-white rounded-lg border-2 p-3 text-xs flex flex-col justify-between shadow-sm print:shadow-none {ans.score_given === ans.max_points ? 'border-emerald-400 bg-emerald-50/10' : (ans.score_given > 0 ? 'border-amber-400 bg-amber-50/10' : 'border-rose-400 bg-rose-50/10')}">
						
						<!-- Question Card Top Bar -->
						<div>
							<div class="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2 gap-2">
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
							<div class="prose prose-xs max-w-none text-slate-800 mb-2.5 bg-slate-50 p-2 rounded border border-slate-200/60 font-serif leading-relaxed">
								{@html ans.question_text}
							</div>
						</div>

						<!-- Answer & Solution -->
						<div class="space-y-2 mt-auto pt-1">
							<!-- Jawaban Siswa -->
							<div class="rounded p-2 border {ans.score_given === ans.max_points ? 'bg-emerald-50/50 border-emerald-200' : (ans.score_given > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-rose-50/50 border-rose-200')}">
								<div class="flex items-center justify-between mb-1">
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
										<div class="space-y-1 text-[11px]">
											{#each Object.entries(JSON.parse(ans.answer_given)) as [key, value]}
												<div class="flex border-b border-slate-200/50 last:border-0 pb-0.5">
													<span class="font-medium text-slate-700 w-1/2">{key}</span>
													<span class="text-slate-900 w-1/2">➔ {value}</span>
												</div>
											{/each}
										</div>
									{:else if ans.type === 'pilihan_ganda'}
										<p class="font-medium text-slate-900">
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
													<span class="px-1.5 py-0.5 bg-white text-slate-800 rounded border border-slate-300 font-medium">{item}</span>
												{/each}
											</div>
										{:else}
											<p class="font-medium text-slate-900">{ans.answer_given}</p>
										{/if}
									{:else}
										<p class="font-medium text-slate-900 whitespace-pre-wrap">{ans.answer_given}</p>
									{/if}
								{/if}
							</div>

							<!-- Kunci Jawaban -->
							<div class="rounded p-2 bg-emerald-50 border border-emerald-200 text-emerald-950">
								<span class="font-bold text-[10px] uppercase tracking-wider text-emerald-800 block mb-1">Kunci Jawaban:</span>
								{#if ['essay', 'isian_singkat'].includes(ans.type)}
									{#if ans.type === 'essay'}
										<p class="italic text-slate-500 text-[11px]">Penilaian manual oleh Guru</p>
									{:else}
										<p class="font-bold text-emerald-900">
											{ans.correct_answer_json ? JSON.parse(ans.correct_answer_json) : '-'}
										</p>
									{/if}
								{:else}
									{#if ans.correct_answer_json}
										{#if ans.type === 'menjodohkan'}
											<div class="space-y-1 text-[11px]">
												{#each Object.entries(typeof JSON.parse(ans.correct_answer_json) === 'string' ? JSON.parse(JSON.parse(ans.correct_answer_json)) : JSON.parse(ans.correct_answer_json)) as [key, value]}
													<div class="flex border-b border-emerald-200/60 last:border-0 pb-0.5">
														<span class="font-medium text-emerald-900 w-1/2">{key}</span>
														<span class="text-emerald-950 font-bold w-1/2">➔ {value}</span>
													</div>
												{/each}
											</div>
										{:else if ans.type === 'pilihan_ganda'}
											<p class="font-bold text-emerald-900">
												{#if ans.options_json}
													{@const opts = JSON.parse(ans.options_json)}
													{@const correctOptId = JSON.parse(ans.correct_answer_json)}
													{@const correctOpt = opts.find((o: any) => String(o.id) === String(correctOptId))}
													{correctOpt ? correctOpt.text : correctOptId}
												{:else}
													{JSON.parse(ans.correct_answer_json)}
												{/if}
											</p>
										{:else if ans.type === 'pilihan_ganda_kompleks'}
											{@const correctArr = typeof ans.correct_answer_json === 'string' ? JSON.parse(ans.correct_answer_json) : ans.correct_answer_json}
											{#if Array.isArray(correctArr)}
												<div class="flex flex-wrap gap-1">
													{#each correctArr as item}
														<span class="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded border border-emerald-300">{item}</span>
													{/each}
												</div>
											{:else}
												<p class="font-bold text-emerald-900">{JSON.parse(ans.correct_answer_json)}</p>
											{/if}
										{:else}
											<p class="font-bold text-emerald-900">{JSON.parse(ans.correct_answer_json)}</p>
										{/if}
									{:else}
										<p class="italic text-slate-500">Tidak ada kunci jawaban</p>
									{/if}
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Footer cetak -->
		<div class="mt-6 pt-3 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
			<span>Dicetak otomatis dari Ujian Online Madrasah ({new Date().toLocaleDateString('id-ID')})</span>
			<span>Halaman Detail Hasil Jawaban — {attempt.student_name} ({attempt.exam_title})</span>
		</div>
	</div>
</div>

<style>
	@media print {
		@page {
			size: A4 portrait;
			margin: 8mm;
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
