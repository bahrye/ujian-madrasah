<script lang="ts">
	import { enhance } from '$app/forms';
	import { ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS, ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';
	import { onMount, onDestroy } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	export let data;
	export let form: any;

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
	$: attempts = data.attempts as any[];

	let statusFilter = 'semua';
	$: filteredAttempts = statusFilter === 'semua' ? attempts : attempts.filter(a => a.status === statusFilter);

	let resetConfirm: string | null = null;
	let selectedLogs: { time: number, type: string }[] | null = null;
	let currentTime = Date.now();
	let interval: any;

	onMount(() => {
		interval = setInterval(() => {
			currentTime = Date.now();
			invalidateAll();
		}, 10000); // 10 seconds is good for monitoring
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<svelte:head><title>Monitoring Ujian — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Monitoring Ujian</h1>
		<p class="text-sm text-slate-500 mt-1">Pantau seluruh siswa yang terdaftar dalam ujian</p>
	</div>

	<!-- Filter -->
	<div class="card p-4">
		<form method="GET" class="flex flex-wrap gap-3 mb-4">
			<select name="exam_id" class="select flex-1 min-w-[200px]" required>
				<option value="">-- Pilih Ujian --</option>
				{#each data.exams as exam}
					<option value={exam.id} selected={data.examFilter === String(exam.id)}>{exam.title}</option>
				{/each}
			</select>
			<button type="submit" class="btn-secondary btn-sm">Tampilkan</button>
		</form>
		
		{#if data.examFilter}
			<div class="flex gap-2 overflow-x-auto p-1.5 -m-1.5 mb-1 mt-2">
				<button class="btn-sm {statusFilter === 'semua' ? 'btn-primary' : 'btn-ghost border border-slate-200'}" on:click={() => statusFilter = 'semua'}>Semua</button>
				<button class="btn-sm {statusFilter === 'mengerjakan' ? 'btn-warning' : 'btn-ghost border border-slate-200 text-slate-600'}" on:click={() => statusFilter = 'mengerjakan'}>Sedang Mengerjakan</button>
				<button class="btn-sm {statusFilter === 'selesai' ? 'btn-success' : 'btn-ghost border border-slate-200 text-slate-600'}" on:click={() => statusFilter = 'selesai'}>Selesai</button>
				<button class="btn-sm {statusFilter === 'belum_mengerjakan' ? 'bg-slate-500 text-white' : 'btn-ghost border border-slate-200 text-slate-600'}" on:click={() => statusFilter = 'belum_mengerjakan'}>Belum Mengerjakan</button>
			</div>
		{/if}
	</div>

	<!-- Monitor Table -->
	<div class="card overflow-hidden">
		{#if !data.examFilter}
			<div class="p-12 text-center text-slate-400">
				<svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
				</svg>
				<p class="text-lg font-medium">Silakan pilih ujian terlebih dahulu</p>
			</div>
		{:else if filteredAttempts.length === 0}
			<div class="p-12 text-center text-slate-400">
				<svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.monitor} />
				</svg>
				<p class="text-lg font-medium">Tidak ada siswa yang sesuai filter</p>
			</div>
		{:else}
			<div class="table-container border-0 rounded-none">
				<table class="table">
					<thead>
						<tr>
							<th>Siswa</th>
							<th>Username</th>
							<th>Status</th>
							<th class="w-24 text-center">Pelanggaran</th>
							<th class="w-32">Progress</th>
							<th>Sisa Waktu</th>
							<th class="text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredAttempts as a (a.id)}
							<tr>
								<td class="font-semibold text-slate-800">{a.student_name}</td>
								<td class="text-slate-500">@{a.username}</td>
								<td>
									<span class={ATTEMPT_STATUS_COLORS[a.status] || 'badge-secondary'}>
										{#if a.status === 'mengerjakan'}
											<span class="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-1"></span>
										{/if}
										{ATTEMPT_STATUS_LABELS[a.status] || 'Belum Mengerjakan'}
									</span>
								</td>
								<td class="text-center">
									{#if a.status === 'belum_mengerjakan'}
										<span class="text-slate-400 text-xs">-</span>
									{:else if a.warnings > 0}
										<div class="flex items-center justify-center gap-1">
											<span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-xs">{a.warnings} kali</span>
											{#if a.warningLogs && a.warningLogs.length > 0}
												<button class="btn-ghost btn-sm p-1 rounded-full text-slate-400 hover:text-slate-600" on:click={() => selectedLogs = a.warningLogs}>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
														<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														<path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</button>
											{/if}
										</div>
									{:else}
										<span class="text-slate-400 text-xs">-</span>
									{/if}
								</td>
								<td class="w-32">
									{#if a.status === 'belum_mengerjakan'}
										<span class="text-xs text-slate-400">0%</span>
									{:else if a.question_count > 0}
										{@const pct = Math.round((a.answeredCount / a.question_count) * 100)}
										{@const color = pct < 30 ? 'bg-slate-300' : pct < 60 ? 'bg-rose-400' : pct < 90 ? 'bg-amber-400' : 'bg-emerald-500'}
										<div class="flex items-center gap-2">
											<div class="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
												<div class="h-full {color} transition-all duration-500" style="width: {pct}%"></div>
											</div>
											<span class="text-xs font-semibold text-slate-600 w-8 text-right">{pct}%</span>
										</div>
									{:else}
										<span class="text-xs text-slate-400">0%</span>
									{/if}
								</td>
								<td class="text-xs">
									{#if a.status === 'belum_mengerjakan'}
										<span class="text-slate-400 font-medium opacity-80">-</span>
									{:else if a.status === 'mengerjakan'}
										{@const startStr = a.start_time.replace(' ', 'T') + (a.start_time.includes('Z') ? '' : 'Z')}
										{@const start = new Date(startStr).getTime()}
										{@const end = start + (a.duration_minutes * 60 * 1000)}
										{@const remainingMs = end - currentTime}
										{#if remainingMs > 0}
											{@const totalM = Math.floor(remainingMs / 60000)}
											{@const h = Math.floor(totalM / 60)}
											{@const m = totalM % 60}
											<span class="text-slate-600 font-medium">
												{#if h > 0}{h} jam {/if}{m} mnt
											</span>
										{:else}
											<span class="text-rose-500 font-bold">Habis</span>
										{/if}
									{:else}
										{@const startStr = a.start_time.replace(' ', 'T') + (a.start_time.includes('Z') ? '' : 'Z')}
										{@const submitStr = a.submit_time ? (a.submit_time.replace(' ', 'T') + (a.submit_time.includes('Z') ? '' : 'Z')) : startStr}
										{@const start = new Date(startStr).getTime()}
										{@const submit = new Date(submitStr).getTime()}
										{@const end = start + (a.duration_minutes * 60 * 1000)}
										{@const remainingMs = end - submit}
										{#if remainingMs > 0}
											{@const totalM = Math.floor(remainingMs / 60000)}
											{@const h = Math.floor(totalM / 60)}
											{@const m = totalM % 60}
											<span class="text-slate-500 font-medium" title="Sisa Waktu Saat Selesai">
												{#if h > 0}{h} jam {/if}{m} mnt
											</span>
										{:else}
											<span class="text-slate-400 font-medium opacity-80">Habis</span>
										{/if}
									{/if}
								</td>
								<td class="text-right">
									{#if a.status === 'mengerjakan'}
										<button
											class="btn-sm btn-danger"
											on:click={() => (resetConfirm = a.attempt_id)}
										>
											<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.refresh} />
											</svg>
											Reset
										</button>
									{:else}
										<span class="text-slate-300">-</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<!-- Reset Confirmation -->
{#if resetConfirm !== null}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (resetConfirm = null)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-sm animate-bounce-in text-center" on:click|stopPropagation>
			<div class="w-14 h-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
				<svg class="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.warning} />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-slate-800 mb-2">Reset Sesi Ujian?</h3>
			<p class="text-sm text-slate-500 mb-5">Jawaban siswa akan dihapus dan siswa bisa memulai ulang.</p>
			<form method="POST" action="?/resetAttempt" use:enhance={() => { return async ({ update }) => { resetConfirm = null; await update(); }; }}>
				<input type="hidden" name="attempt_id" value={resetConfirm} />
				<div class="flex gap-3">
					<button type="button" class="btn-ghost flex-1" on:click={() => (resetConfirm = null)}>Batal</button>
					<button type="submit" class="btn-danger flex-1">Reset</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Violation Logs Modal -->
{#if selectedLogs !== null}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => selectedLogs = null}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-md animate-bounce-in" on:click|stopPropagation>
			<div class="flex items-center gap-3 mb-4">
				<div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				</div>
				<h3 class="text-lg font-bold text-slate-800">Riwayat Pelanggaran</h3>
			</div>
			
			{#if selectedLogs.length === 0}
				<p class="text-slate-500 text-sm text-center py-4">Tidak ada riwayat detail pelanggaran.</p>
			{:else}
				<ul class="space-y-3 max-h-64 overflow-y-auto pr-2">
					{#each selectedLogs as log}
						<li class="flex flex-col border-b border-slate-100 pb-2 last:border-0">
							<span class="font-medium text-rose-600 text-sm">{log.type}</span>
							<span class="text-xs text-slate-400">{new Date(log.time).toLocaleString('id-ID')}</span>
						</li>
					{/each}
				</ul>
			{/if}
			
			<div class="mt-5">
				<button class="btn-primary w-full" on:click={() => selectedLogs = null}>Tutup</button>
			</div>
		</div>
	</div>
{/if}
