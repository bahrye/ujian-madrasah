<script lang="ts">
	import { QUESTION_TYPE_LABELS, ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS, ICONS } from '$lib/utils/constants';

	export let data;
	$: attempt = data.attempt as any;
	$: answers = data.answers as any[];

</script>

<svelte:head>
	<title>Detail Hasil Ujian — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex items-center gap-3">
		<a href="/guru/results" class="btn-ghost btn-sm">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
			</svg>
			Kembali
		</a>
	</div>

	<!-- Header Detail -->
	<div class="card p-6 border-t-4 border-indigo-500">
		<div class="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
			<div>
				<h1 class="text-2xl font-bold text-slate-800 mb-1">{attempt.student_name}</h1>
				<p class="text-sm text-slate-500 mb-2">{attempt.nisn} • {attempt.class_name}</p>
				<div class="flex gap-2">
					<span class="badge-primary">{attempt.exam_title}</span>
					<span class="badge bg-slate-100 text-slate-600">{attempt.subject_name || 'Umum'}</span>
				</div>
			</div>
			
			<div class="flex gap-4">
				<div class="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center min-w-[100px]">
					<p class="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Nilai Akhir</p>
					<p class="text-3xl font-black {(attempt.score ?? 0) >= 70 ? 'text-emerald-500' : 'text-rose-500'}">
						{attempt.score != null ? attempt.score.toFixed(1) : '-'}
					</p>
				</div>
			</div>
		</div>
		
		<div class="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
			<div>
				<p class="text-slate-500 mb-1">Status</p>
				<p class="font-medium">
					<span class={ATTEMPT_STATUS_COLORS[attempt.status]}>{ATTEMPT_STATUS_LABELS[attempt.status]}</span>
				</p>
			</div>
			<div>
				<p class="text-slate-500 mb-1">Total Poin Didapat</p>
				<p class="font-medium text-slate-800">{attempt.score ? Math.round((attempt.score / 100) * attempt.total_points) : 0} / {attempt.total_points}</p>
			</div>
			<div>
				<p class="text-slate-500 mb-1">Waktu Selesai</p>
				<p class="font-medium text-slate-800">{attempt.submit_time ? new Date(String(attempt.submit_time).replace(' ', 'T') + (String(attempt.submit_time).includes('Z') ? '' : 'Z')).toLocaleString('id-ID') : '-'}</p>
			</div>
			<div>
				<p class="text-slate-500 mb-1">Pelanggaran</p>
				<p class="font-medium {attempt.violation_count > 0 ? 'text-rose-600' : 'text-slate-800'}">
					{attempt.violation_count} kali
				</p>
			</div>
		</div>
	</div>

	<!-- Detail Soal dan Jawaban -->
	<div>
		<h2 class="text-lg font-bold text-slate-800 mb-4">Rincian Jawaban Siswa</h2>
		<div class="space-y-4">
			{#each answers as ans, i}
				<div class="card p-5 border-l-4 {ans.score_given === ans.max_points ? 'border-emerald-400' : (ans.score_given > 0 ? 'border-amber-400' : 'border-rose-400')}">
					<div class="flex items-start justify-between gap-4 mb-3">
						<div class="flex flex-wrap items-center gap-2">
							<span class="badge bg-slate-100 text-slate-700">Soal #{ans.question_number}</span>
							<span class="badge-info">{QUESTION_TYPE_LABELS[ans.type]}</span>
							{#if ans.is_doubted}
								<span class="badge-warning">Ragu-ragu</span>
							{/if}
						</div>
						<div class="text-right">
							<span class="text-lg font-bold {ans.score_given === ans.max_points ? 'text-emerald-600' : (ans.score_given > 0 ? 'text-amber-600' : 'text-rose-600')}">
								{ans.score_given ?? 0}
							</span>
							<span class="text-sm font-medium text-slate-400">/ {ans.max_points} poin</span>
						</div>
					</div>

					<div class="prose prose-sm max-w-none text-slate-700 mb-4 bg-slate-50 p-3 rounded border border-slate-100">
						{@html ans.question_text}
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<!-- Jawaban Siswa -->
						<div>
							<p class="text-xs font-semibold text-slate-500 mb-1">Jawaban Siswa:</p>
							{#if !ans.answer_given}
								<p class="text-sm italic text-slate-400">Tidak dijawab</p>
							{:else}
								{#if ans.type === 'menjodohkan'}
									<div class="space-y-2 text-sm bg-white p-2 rounded border border-slate-200">
										{#each Object.entries(JSON.parse(ans.answer_given)) as [key, value]}
											<div class="flex border-b border-slate-100 last:border-0 pb-1 last:pb-0">
												<span class="font-medium text-slate-600 w-1/2">{key}</span>
												<span class="text-slate-800 w-1/2">-> {value}</span>
											</div>
										{/each}
									</div>
								{:else if ans.type === 'pilihan_ganda'}
									<p class="text-sm text-slate-800 bg-white p-2 rounded border border-slate-200">
										{#if ans.options_json}
											{@const opts = JSON.parse(ans.options_json)}
											{@const selectedOpt = opts.find((o: any) => String(o.id) === String(ans.answer_given))}
											{selectedOpt ? selectedOpt.text : ans.answer_given}
										{:else}
											{ans.answer_given}
										{/if}
									</p>
								{:else}
									<p class="text-sm text-slate-800 bg-white p-2 rounded border border-slate-200 whitespace-pre-wrap">{ans.answer_given}</p>
								{/if}
							{/if}
						</div>

						<!-- Kunci Jawaban -->
						<div>
							<p class="text-xs font-semibold text-slate-500 mb-1">Kunci Jawaban:</p>
							{#if ['essay', 'isian_singkat'].includes(ans.type)}
								{#if ans.type === 'essay'}
									<p class="text-sm italic text-slate-400">Dinilai manual oleh guru</p>
								{:else}
									<p class="text-sm text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-100">
										{ans.correct_answer_json ? JSON.parse(ans.correct_answer_json) : 'Tidak ada'}
									</p>
								{/if}
							{:else}
								{#if ans.correct_answer_json}
									{#if ans.type === 'menjodohkan'}
										<div class="space-y-2 text-sm bg-emerald-50 p-2 rounded border border-emerald-100">
											{#each Object.entries(typeof JSON.parse(ans.correct_answer_json) === 'string' ? JSON.parse(JSON.parse(ans.correct_answer_json)) : JSON.parse(ans.correct_answer_json)) as [key, value]}
												<div class="flex border-b border-emerald-200/50 last:border-0 pb-1 last:pb-0">
													<span class="font-medium text-emerald-800 w-1/2">{key}</span>
													<span class="text-emerald-900 w-1/2">-> {value}</span>
												</div>
											{/each}
										</div>
									{:else if ans.type === 'pilihan_ganda'}
										<p class="text-sm text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100">
											{#if ans.options_json}
												{@const opts = JSON.parse(ans.options_json)}
												{@const correctOptId = JSON.parse(ans.correct_answer_json)}
												{@const correctOpt = opts.find((o: any) => String(o.id) === String(correctOptId))}
												{correctOpt ? correctOpt.text : correctOptId}
											{:else}
												{JSON.parse(ans.correct_answer_json)}
											{/if}
										</p>
									{:else}
										<p class="text-sm text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100">{JSON.parse(ans.correct_answer_json)}</p>
									{/if}
								{:else}
									<p class="text-sm italic text-slate-400">Tidak ada kunci jawaban</p>
								{/if}
							{/if}
						</div>
					</div>
					
					{#if ['essay', 'isian_singkat'].includes(ans.type) && ans.score_given == null}
						<div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
							<span class="text-xs text-rose-500 font-medium">⚠️ Jawaban ini belum dinilai oleh Guru</span>
							<!-- Note: Admin might not have access to /guru, so we just inform them -->
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
