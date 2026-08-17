<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	import { enhance } from '$app/forms';
	import { ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS } from '$lib/utils/constants';
	import { exportExamResults } from '$lib/utils/excel';
	import { toasts } from '$lib/stores/toast';

	export let data;
	export let form: any;

	$: results = data.results as any[];
	$: selectedExam = data.exams.find((e: any) => String(e.id) === String(data.examFilter));
	$: isManualExamSelected = selectedExam ? selectedExam.show_score_type === 'manual' : false;
	$: showStatusColumn = Boolean(data.examFilter) && isManualExamSelected;

	$: if (form?.error) toasts.error(form.error);
	$: if (form?.released === true) toasts.success('Nilai siswa berhasil dikirim ke siswa!');
	$: if (form?.released === false) toasts.success('Kirim nilai berhasil dibatalkan!');
	$: if (form?.releaseAll) toasts.success('Nilai seluruh siswa yang sudah lengkap berhasil dikirim!');

	let isExporting = false;
	async function handleExport() {
		if (!data.examFilter) {
			toasts.error('Pilih satu ujian terlebih dahulu untuk dieksport.');
			return;
		}
		isExporting = true;
		const examTitle = (selectedExam as any)?.title || 'Ujian';
		const res = await exportExamResults(data.examFilter, examTitle);
		if (res.error) toasts.error(res.error);
		else toasts.success('Excel berhasil diunduh!');
		isExporting = false;
	}
</script>

<svelte:head>
	<title>Hasil Ujian — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Hasil Ujian</h1>
		<p class="text-sm text-slate-500 mt-1">Rekap nilai seluruh ujian</p>
	</div>

	<!-- Filter -->
	<div class="card p-4 flex flex-col md:flex-row gap-3 items-center">
		<form method="GET" class="flex flex-col md:flex-row gap-3 flex-1 w-full">
			<select name="exam_id" class="select flex-1" on:change={(e) => e.currentTarget.form?.submit()}>
				<option value="">Semua Ujian</option>
				{#each data.exams as exam}
					<option value={exam.id} selected={String(data.examFilter) === String(exam.id)}>{exam.title}</option>
				{/each}
			</select>
			<button type="submit" class="btn-secondary md:w-auto w-full">Tampilkan</button>
		</form>
		{#if data.examFilter}
			<div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
				{#if isManualExamSelected}
					<form method="POST" action="?/releaseAll" use:enhance class="w-full md:w-auto">
						<input type="hidden" name="exam_id" value={data.examFilter} />
						<button type="submit" class="btn bg-indigo-600 hover:bg-indigo-700 text-white md:w-auto w-full flex items-center justify-center gap-2 shadow-sm">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
							</svg>
							Kirim Semua
						</button>
					</form>
				{/if}
				<button type="button" class="btn-primary md:w-auto w-full flex items-center justify-center gap-2" on:click={handleExport} disabled={isExporting}>
					{#if isExporting}
						<span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
						Mengekspor...
					{:else}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
						</svg>
						Eksport Excel
					{/if}
				</button>
			</div>
		{/if}
	</div>

	<div class="card overflow-hidden">
		{#if results.length === 0}
			<div class="p-12 text-center text-slate-400">Belum ada hasil ujian.</div>
		{:else}
			<div class="table-container border-0 rounded-none">
				<table class="table">
					<thead>
						<tr>
							<th>Siswa</th>
							<th>Ujian</th>
							<th>Mapel</th>
							<th>Nilai</th>
							<th>Status Ujian</th>
							{#if showStatusColumn}
								<th class="whitespace-nowrap text-xs">Status Nilai</th>
							{/if}
							<th>Waktu Selesai</th>
							<th class="w-24 text-center">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each results as r}
							{@const isComplete = r.is_graded === 1 || r.ungraded_count === 0}
							{@const isManual = r.show_score_type === 'manual'}
							<tr>
								<td class="font-semibold text-slate-800">{r.student_name}</td>
								<td>{r.exam_title}</td>
								<td class="text-slate-500">{r.subject || '-'}</td>
								<td>
									<span class="text-lg font-bold {(r.score ?? 0) >= 70 ? 'text-emerald-600' : 'text-rose-600'}">
										{r.score != null ? r.score.toFixed(1) : '-'}
									</span>
								</td>
								<td><span class={ATTEMPT_STATUS_COLORS[r.status] || 'badge-info'}>{ATTEMPT_STATUS_LABELS[r.status]}</span></td>
								{#if showStatusColumn}
									<td class="whitespace-nowrap text-xs">
										{#if isManual}
											{#if r.is_score_released === 1}
												<span class="badge-success text-[11px] whitespace-nowrap px-2 py-0.5 font-medium">🟢 Terkirim</span>
											{:else}
												<span class="badge-error text-[11px] whitespace-nowrap px-2 py-0.5 font-medium">🔴 Belum Terkirim</span>
											{/if}
										{:else}
											<span class="text-slate-400 text-xs">-</span>
										{/if}
									</td>
								{/if}
								<td class="text-xs text-slate-500">{r.submit_time ? parseDate(r.submit_time).toLocaleString('id-ID') : '-'}</td>
								<td class="text-center">
									<div class="flex items-center justify-center gap-1.5">
										{#if showStatusColumn && isManual}
											<form method="POST" action="?/toggleRelease" use:enhance class="inline-block">
												<input type="hidden" name="attempt_id" value={r.id} />
												{#if r.is_score_released === 1}
													<button 
														type="submit" 
														class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors bg-emerald-50/50" 
														title="Nilai sudah dikirim ke siswa (Klik untuk batalkan)"
													>
														<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
															<path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
														</svg>
													</button>
												{:else if isComplete}
													<button 
														type="submit" 
														class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
														title="Kirim nilai ke hasil ujian siswa"
													>
														<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
															<path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
														</svg>
													</button>
												{:else}
													<button 
														type="button" 
														disabled 
														class="p-1.5 text-slate-300 cursor-not-allowed rounded-lg" 
														title="Nilai belum lengkap (penilaian essay/isian belum selesai)"
													>
														<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
															<path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
														</svg>
													</button>
												{/if}
											</form>
										{/if}
										<a href="/guru/results/{r.id}" class="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="Lihat Detail Ujian">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										</a>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
