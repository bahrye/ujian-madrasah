<script lang="ts">
	import { enhance } from '$app/forms';
	import { ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';

	export let data;
	export let form: any;

	let showGenerate = false;
	let selectedExamId: number | '' = '';
	let currentTime = Date.now();
	let intervalId: any;

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
	$: tokens = data.tokens as any[];

	onMount(() => {
		if ($page.url.searchParams.get('generate') === '1') {
			showGenerate = true;
			const examIdParam = $page.url.searchParams.get('exam_id');
			if (examIdParam) {
				selectedExamId = parseInt(examIdParam, 10);
			}
		}

		intervalId = setInterval(() => {
			currentTime = Date.now();
		}, 1000);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});

	function isExpired(expiresAt: string): boolean {
		return new Date(expiresAt).getTime() < currentTime;
	}

	function getReleaseStatus(token: any, current: number) {
		if (token.is_released === 1) {
			if (!token.released_at) return { active: true, label: 'Dirilis' };
			const releasedAt = new Date(token.released_at + 'Z').getTime();
			const remaining = (releasedAt + 15 * 60 * 1000) - current;
			if (remaining > 0) {
				const m = Math.floor(remaining / 60000);
				const s = Math.floor((remaining % 60000) / 1000);
				return { active: true, label: `Dirilis (${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')})`, isAuto: false };
			} else {
				return { active: false, label: 'Ditarik Otomatis', isAuto: true };
			}
		}
		return { active: false, label: 'Belum dirilis', isAuto: false };
	}
</script>

<svelte:head><title>Token Ujian — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Token Ujian</h1>
			<p class="text-sm text-slate-500 mt-1">Generate dan kelola token akses ujian</p>
		</div>
		<button class="btn-primary" on:click={() => (showGenerate = !showGenerate)}>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
			</svg>
			Generate Token
		</button>
	</div>

	<!-- Generate Form -->
	{#if showGenerate}
		<div class="card p-6 border-2 border-amber-200 animate-in">
			<h2 class="text-lg font-bold text-slate-800 mb-4">Generate Token Baru</h2>
			<form method="POST" action="?/generate" use:enhance={() => { return async ({ update }) => { showGenerate = false; await update(); }; }} class="space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label class="label" for="t-exam">Ujian</label>
						<select id="t-exam" name="exam_id" required class="select" bind:value={selectedExamId}>
							<option value="">Pilih ujian</option>
							{#each data.exams as exam}
								<option value={exam.id}>{exam.title}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="label" for="t-duration">Durasi Validitas (jam)</label>
						<input id="t-duration" name="duration_hours" type="number" min="1" class="input" value="2" />
					</div>
				</div>
				<div class="flex gap-3">
					<button type="button" class="btn-ghost flex-1" on:click={() => (showGenerate = false)}>Batal</button>
					<button type="submit" class="btn-warning flex-1">Generate Token</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Tokens List -->
	<div class="space-y-3">
		{#each tokens as token (token.id)}
			{@const expired = isExpired(token.expires_at)}
			{@const status = getReleaseStatus(token, currentTime)}
			<div class="card p-5 {expired ? 'opacity-60' : ''}">
				<div class="flex flex-col sm:flex-row sm:items-center gap-4">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-3 mb-2">
							<span class="text-2xl font-mono font-bold tracking-[0.2em] {status.active ? 'text-emerald-600' : 'text-slate-700'}">
								{token.token_code}
							</span>
							{#if status.active}
								<span class="badge-success">{status.label}</span>
							{:else if status.isAuto}
								<span class="badge bg-amber-100 text-amber-700">{status.label}</span>
							{:else}
								<span class="badge bg-slate-100 text-slate-500">{status.label}</span>
							{/if}
							{#if expired}
								<span class="badge-danger">Kedaluwarsa</span>
							{/if}
						</div>
						<p class="text-sm text-slate-600">{token.exam_title}</p>
						<p class="text-xs text-slate-400 mt-1">
							Berlaku hingga: {new Date(token.expires_at).toLocaleString('id-ID')}
						</p>
					</div>
					<div class="flex items-center gap-2 flex-shrink-0">
						{#if !expired}
							{#if status.active}
								<form method="POST" action="?/revoke" use:enhance>
									<input type="hidden" name="id" value={token.id} />
									<button type="submit" class="btn-sm btn-warning">Tarik</button>
								</form>
							{:else}
								<form method="POST" action="?/release" use:enhance>
									<input type="hidden" name="id" value={token.id} />
									<button type="submit" class="btn-sm btn-success">Rilis</button>
								</form>
							{/if}
						{/if}
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={token.id} />
							<button type="submit" class="btn-sm btn-ghost text-rose-400 hover:text-rose-600">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
								</svg>
							</button>
						</form>
					</div>
				</div>
			</div>
		{:else}
			<div class="text-center py-12 text-slate-400">
				<p>Belum ada token. Klik "Generate Token" untuk membuat.</p>
			</div>
		{/each}
	</div>
</div>
