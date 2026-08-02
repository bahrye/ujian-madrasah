<script lang="ts">
	import { enhance } from '$app/forms';
	import { ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS } from '$lib/utils/constants';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';

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
									<ConfirmForm 
										action="?/delete"
										confirmTitle="Hapus Hasil Ujian"
										confirmMessage="Yakin ingin menghapus hasil ujian ini? Ini akan menghapus permanen jawaban siswa!"
										buttonClass="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors"
										buttonTitle="Hapus Ujian"
									>
										<svelte:fragment slot="inputs">
											<input type="hidden" name="attempt_id" value={r.id} />
										</svelte:fragment>
										<svelte:fragment slot="buttonContent">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</svelte:fragment>
									</ConfirmForm>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
