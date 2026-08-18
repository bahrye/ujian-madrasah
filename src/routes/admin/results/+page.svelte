<script lang="ts">
	import { parseDate } from '$lib/utils/date';

	import { enhance } from '$app/forms';
	import { ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS } from '$lib/utils/constants';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';
	import { exportExamResults } from '$lib/utils/excel';
	import { toasts } from '$lib/stores/toast';
	import { onMount, onDestroy } from 'svelte';

	export let data;
	export let form: any;

	$: results = data.results as any[];
	$: selectedExam = data.exams.find((e: any) => String(e.id) === String(data.examFilter));
	$: isManualExamSelected = selectedExam ? selectedExam.show_score_type === 'manual' : false;

	let currentTime = new Date();
	let timer: any;
	let previewSignature: { name: string; url: string } | null = null;

	onMount(() => {
		timer = setInterval(() => {
			currentTime = new Date();
		}, 1000);
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});

	function isAttemptScoreReleased(r: any, now: Date) {
		const type = r.show_score_type || 'after_submit';
		if (type === 'manual') return r.is_score_released === 1;
		if (type === 'after_submit' || type === 'objective_only') return true;
		if (type === 'after_end_time') {
			if (!r.exam_end_time) return false;
			const str = String(r.exam_end_time).replace(' ', 'T');
			const end = new Date(str + (str.includes('T') && !str.includes('Z') ? 'Z' : '')).getTime();
			return now.getTime() >= end;
		}
		if (type === 'after_type_end_time') {
			if (!r.exam_type_end_time) return false;
			const str = String(r.exam_type_end_time).replace(' ', 'T');
			const end = new Date(str + (str.includes('T') && !str.includes('Z') ? 'Z' : '')).getTime();
			return now.getTime() >= end;
		}
		return true;
	}

	$: if (form?.error) toasts.error(form.error);
	$: if (form?.released === true) toasts.success('Nilai siswa berhasil dikirim ke siswa!');
	$: if (form?.released === false) toasts.success('Kirim nilai berhasil dibatalkan!');
	$: if (form?.releaseAll) toasts.success('Nilai seluruh siswa yang sudah lengkap berhasil dikirim!');
	$: if (form?.success && !form?.released && !form?.releaseAll) toasts.success('Hasil ujian berhasil dihapus!');

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
							<th class="whitespace-nowrap">No. Peserta / NISN</th>
							<th class="w-20 text-center">TTD</th>
							<th>Ujian</th>
							<th>Nilai</th>
							<th class="whitespace-nowrap text-xs">Status Nilai</th>
							<th>Waktu Selesai</th>
							<th class="w-28 text-center">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each results as r}
							{@const isComplete = r.is_graded === 1 || r.ungraded_count === 0}
							{@const isManual = r.show_score_type === 'manual'}
							{@const released = isAttemptScoreReleased(r, currentTime)}
							<tr>
								<td class="font-semibold text-slate-800">{r.student_name}</td>
								<td class="text-xs">
									<div class="font-mono font-semibold text-slate-800">{r.nomor_peserta || '-'}</div>
									<div class="font-mono text-[11px] text-slate-400">{r.nisn || (r.username !== r.nomor_peserta ? `@${r.username}` : '') || '-'}</div>
								</td>
								<td class="text-center">
									{#if r.signature}
										<button
											type="button"
											class="group relative inline-flex items-center justify-center p-1 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
											on:click={() => previewSignature = { name: r.student_name, url: r.signature }}
											title="Klik untuk memperbesar tanda tangan"
										>
											<img src={r.signature} alt="TTD {r.student_name}" class="h-7 max-w-[55px] object-contain" />
											<span class="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
												🔍
											</span>
										</button>
									{:else}
										<span class="text-slate-300 text-xs">-</span>
									{/if}
								</td>
								<td>{r.exam_title}</td>
								<td>
									<span class="text-lg font-bold {(r.score ?? 0) >= 70 ? 'text-emerald-600' : 'text-rose-600'}">
										{r.score != null ? r.score.toFixed(1) : '-'}
									</span>
								</td>
								<td class="whitespace-nowrap text-xs">
									{#if released}
										<span class="badge-success text-[11px] whitespace-nowrap px-2 py-0.5 font-medium">🟢 Terkirim</span>
									{:else}
										<span class="badge-error text-[11px] whitespace-nowrap px-2 py-0.5 font-medium">🔴 Belum Terkirim</span>
									{/if}
								</td>
								<td class="text-xs text-slate-500">{r.submit_time ? parseDate(r.submit_time).toLocaleString('id-ID') : '-'}</td>
								<td class="text-center">
									<div class="flex items-center justify-center gap-1.5">
										{#if isManual}
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
										<a href="/admin/results/{r.id}" class="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="Lihat Detail Ujian">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
										</a>
										<ConfirmForm 
											action="?/delete"
											confirmTitle="Hapus Hasil Ujian"
											confirmMessage="Yakin ingin menghapus hasil ujian ini? Ini akan menghapus permanen jawaban siswa!"
											buttonClass="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
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

<!-- Signature Preview Modal -->
{#if previewSignature}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
		on:click={() => (previewSignature = null)}
	>
		<div
			class="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative animate-scale-up border border-slate-100"
			on:click|stopPropagation
		>
			<button
				type="button"
				class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
				on:click={() => (previewSignature = null)}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
				</svg>
			</div>

			<h3 class="text-base font-bold text-slate-800">Tanda Tangan Siswa</h3>
			<p class="text-xs text-slate-500 mt-0.5 mb-4">{previewSignature.name}</p>

			<div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-center min-h-[160px]">
				<img
					src={previewSignature.url}
					alt="Tanda Tangan {previewSignature.name}"
					class="max-h-40 max-w-full object-contain mix-blend-multiply"
				/>
			</div>

			<button
				type="button"
				class="btn btn-secondary w-full text-xs mt-5 py-2.5"
				on:click={() => (previewSignature = null)}
			>
				Tutup
			</button>
		</div>
	</div>
{/if}
