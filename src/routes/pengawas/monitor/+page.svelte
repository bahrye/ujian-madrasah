<script lang="ts">
	import { enhance } from '$app/forms';
	import { ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS, ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';
	import { onMount, onDestroy } from 'svelte';

	export let data;
	export let form: any;

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
	$: attempts = data.attempts as any[];

	let resetConfirm: number | null = null;
	let currentTime = Date.now();
	let interval: any;

	onMount(() => {
		interval = setInterval(() => {
			currentTime = Date.now();
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
		<p class="text-sm text-slate-500 mt-1">Pantau siswa yang sedang mengerjakan ujian</p>
	</div>

	<!-- Filter -->
	<div class="card p-4">
		<form method="GET" class="flex gap-3">
			<select name="exam_id" class="select flex-1">
				<option value="">Semua (Sedang Mengerjakan)</option>
				{#each data.exams as exam}
					<option value={exam.id} selected={data.examFilter === String(exam.id)}>{exam.title}</option>
				{/each}
			</select>
			<button type="submit" class="btn-secondary btn-sm">Filter</button>
		</form>
	</div>

	<!-- Monitor Table -->
	<div class="card overflow-hidden">
		{#if attempts.length === 0}
			<div class="p-12 text-center text-slate-400">
				<svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.monitor} />
				</svg>
				<p class="text-lg font-medium">Tidak ada siswa yang sedang mengerjakan</p>
			</div>
		{:else}
			<div class="table-container border-0 rounded-none">
				<table class="table">
					<thead>
						<tr>
							<th>Siswa</th>
							<th>Username</th>
							{#if !data.examFilter}<th>Ujian</th>{/if}
							<th>Status</th>
							<th class="w-32">Progress</th>
							<th>Sisa Waktu</th>
							<th class="text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each attempts as a (a.id)}
							<tr>
								<td class="font-semibold text-slate-800">{a.student_name}</td>
								<td class="text-slate-500">@{a.username}</td>
								{#if !data.examFilter}<td class="text-slate-600">{a.exam_title}</td>{/if}
								<td>
									<span class={ATTEMPT_STATUS_COLORS[a.status] || 'badge-info'}>
										{#if a.status === 'mengerjakan'}
											<span class="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-1"></span>
										{/if}
										{ATTEMPT_STATUS_LABELS[a.status] || a.status}
									</span>
								</td>
								<td class="w-32">
									{#if a.question_count > 0}
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
									{#if a.status === 'mengerjakan'}
										{@const start = new Date(a.start_time).getTime()}
										{@const end = start + (a.duration_minutes * 60 * 1000)}
										{@const remainingMs = end - currentTime}
										{#if remainingMs > 0}
											{@const m = Math.floor(remainingMs / 60000)}
											<span class="text-slate-600 font-medium">{m} mnt</span>
										{:else}
											<span class="text-rose-500 font-bold">Habis</span>
										{/if}
									{:else}
										<span class="text-slate-400">-</span>
									{/if}
								</td>
								<td class="text-right">
									{#if a.status === 'mengerjakan'}
										<button
											class="btn-sm btn-danger"
											on:click={() => (resetConfirm = a.id)}
										>
											<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.refresh} />
											</svg>
											Reset
										</button>
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
		<div class="card p-6 w-full max-w-sm animate-bounce-in text-center" on:click|stopPropagation>
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
