<script lang="ts">
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
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
