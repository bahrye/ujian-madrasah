<script lang="ts">
	import { enhance } from '$app/forms';
	import { ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS } from '$lib/utils/constants';

	export let data;
	$: results = data.results as any[];
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
	<div class="card p-4">
		<form method="GET" class="flex flex-col md:flex-row gap-3">
			<select name="exam_id" class="select flex-1" on:change={(e) => e.currentTarget.form?.submit()}>
				<option value="">Semua Ujian</option>
				{#each data.exams as exam}
					<option value={exam.id} selected={data.examFilter === String(exam.id)}>{exam.title}</option>
				{/each}
			</select>
			<button type="submit" class="btn-secondary md:w-auto w-full">Tampilkan</button>
		</form>
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
							<th>Status</th>
							<th>Waktu Selesai</th>
							<th class="w-16 text-center">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each results as r}
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
								<td class="text-xs text-slate-500">{r.submit_time ? new Date(r.submit_time).toLocaleString('id-ID') : '-'}</td>
								<td class="text-center">
									<div class="flex items-center justify-center gap-2">
										<a href="/guru/results/{r.id}" class="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded transition-colors" title="Lihat Detail Ujian">
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
