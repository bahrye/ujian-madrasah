<script lang="ts">
	import { parseDate, checkSessionTimeWindow } from '$lib/utils/date';

	import { enhance } from '$app/forms';
	import { ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';

	export let data;
	export let form: any;

	let showGenerate = false;
	let showStudentsModal = false;
	let selectedToken: any = null;
	let selectedExamId: number | '' = '';
	let selectedSessionNumber: number | '' = '';
	let currentTime = Date.now();
	let intervalId: any;

	$: selectedExam = data.exams.find((e: any) => e.id === Number(selectedExamId));
	$: availableSessions = selectedExam?.sessions || [];
	$: if (availableSessions.length > 0 && (!selectedSessionNumber || !availableSessions.some((s: any) => s.session_number === Number(selectedSessionNumber)))) {
		selectedSessionNumber = availableSessions[0].session_number;
	}

	function openStudentsModal(token: any) {
		selectedToken = token;
		showStudentsModal = true;
	}

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
			const releasedAt = parseDate(token.released_at).getTime();
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
			<p class="text-sm text-slate-500 mt-1">Generate dan kelola token akses ujian per sesi</p>
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
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<div>
						<label class="label" for="t-exam">Ujian</label>
						<select id="t-exam" name="exam_id" required class="select" bind:value={selectedExamId}>
							<option value="">Pilih ujian</option>
							{#each data.exams as exam}
								<option value={exam.id}>
									{exam.title}
								</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="label" for="t-session">Sesi Ujian</label>
						<select id="t-session" name="session_number" required class="select" bind:value={selectedSessionNumber} disabled={!selectedExamId || availableSessions.length === 0}>
							{#if !selectedExamId}
								<option value="">Pilih ujian dulu</option>
							{:else}
								{#each availableSessions as session}
									{@const timeCheck = checkSessionTimeWindow(session.start_time, session.end_time, new Date(currentTime))}
									{@const isAllowed = timeCheck.allowed}
									{@const isPastEnd = timeCheck.reason === 'too_late'}
									{@const startTimeFormatted = session.start_time ? (session.start_time.includes('T') ? session.start_time.split('T')[1].slice(0, 5) : session.start_time.includes(' ') ? session.start_time.split(' ')[1].slice(0, 5) : session.start_time) : ''}
									{@const endTimeFormatted = session.end_time ? (session.end_time.includes('T') ? session.end_time.split('T')[1].slice(0, 5) : session.end_time.includes(' ') ? session.end_time.split(' ')[1].slice(0, 5) : session.end_time) : ''}
									{@const timeLabel = startTimeFormatted ? ` (${startTimeFormatted}${endTimeFormatted ? ' - ' + endTimeFormatted : ''})` : ''}
									<option value={session.session_number} disabled={!isAllowed}>
										Sesi {session.session_number}{timeLabel}
										{!isAllowed && isPastEnd ? ' (Sudah berakhir)' : ''}
										{!isAllowed && !isPastEnd ? ' (Belum waktu generate)' : ''}
									</option>
								{/each}
							{/if}
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
						<div class="flex items-center flex-wrap gap-3 mb-2">
							<span class="text-2xl font-mono font-bold tracking-[0.2em] {status.active ? 'text-emerald-600' : 'text-slate-700'}">
								{token.token_code}
							</span>
							<span class="badge bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
								Sesi {token.session_number || 1}
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
							Berlaku hingga: {parseDate(token.expires_at).toLocaleString('id-ID')}
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
						<button type="button" class="btn-sm btn-ghost text-indigo-400 hover:text-indigo-600" on:click={() => openStudentsModal(token)} title="Lihat Penggunaan">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
							</svg>
						</button>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={token.id} />
							<button type="submit" class="btn-sm btn-ghost text-rose-400 hover:text-rose-600" title="Hapus">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
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

{#if showStudentsModal && selectedToken}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300" on:click={() => showStudentsModal = false}>
		<div class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-xl" on:click|stopPropagation>
			<div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
				<div>
					<h3 class="font-bold text-slate-800 text-lg">Penggunaan Token</h3>
					<p class="text-sm text-slate-500 font-mono tracking-widest">{selectedToken.token_code}</p>
				</div>
				<button class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Tutup" on:click={() => showStudentsModal = false}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			
			<div class="p-6 overflow-y-auto flex-1">
				{#if selectedToken.used_by_students && selectedToken.used_by_students.length > 0}
					<div class="space-y-3">
						{#each selectedToken.used_by_students as student, i}
							<div class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 transition-all">
								<div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xs">
									{i + 1}
								</div>
								<div class="flex-1 min-w-0">
									<p class="font-medium text-slate-800 truncate">{student.name}</p>
									<p class="text-xs text-slate-500">
										NISN: {student.username}
									</p>
								</div>
								<div class="text-right flex-shrink-0">
									<p class="text-xs font-medium text-slate-700">Waktu Akses</p>
									<p class="text-[10px] text-slate-500">{parseDate(student.start_time).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-10">
						<div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
							<svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						</div>
						<p class="text-slate-500 font-medium">Belum ada yang menggunakan</p>
						<p class="text-sm text-slate-400 mt-1">Token ini belum diakses oleh peserta ujian manapun.</p>
					</div>
				{/if}
			</div>
			
			<div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
				<button type="button" class="btn-ghost" on:click={() => showStudentsModal = false}>Tutup</button>
			</div>
		</div>
	</div>
{/if}
