<script lang="ts">
	import type { PageData } from './$types';
	import { ICONS, ATTEMPT_STATUS_COLORS, ATTEMPT_STATUS_LABELS } from '$lib/utils/constants';
	import ScoreDisplay from '$lib/components/exam/ScoreDisplay.svelte';
	import { onMount, onDestroy } from 'svelte';

	export let data: PageData;
	$: finishedAttempts = data.finishedAttempts as any[];

	let currentTime = new Date();
	let timer: any;

	function formatDateTime(dateStr: string) {
		if (!dateStr) return '-';
		const str = String(dateStr).replace(' ', 'T');
		const date = new Date(str + (str.includes('T') && !str.includes('Z') ? 'Z' : ''));
		return date.toLocaleString('id-ID', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		}).replace(/\./g, ':');
	}

	function calculateRemainingTime(attempt: any) {
		const submitStr = attempt.submit_time || attempt.updated_at;
		if (!attempt.end_time || !submitStr) return '-';

		const submit = new Date(String(submitStr).replace(' ', 'T') + (String(submitStr).includes(' ') && !String(submitStr).includes('Z') ? 'Z' : ''));
		const targetEnd = new Date(String(attempt.end_time).replace(' ', 'T') + (String(attempt.end_time).includes(' ') && !String(attempt.end_time).includes('Z') ? 'Z' : ''));
		
		let remainingMs = targetEnd.getTime() - submit.getTime();
		if (remainingMs < 0) remainingMs = 0;
		
		const totalS = Math.floor(remainingMs / 1000);
		const h = Math.floor(totalS / 3600);
		const m = Math.floor((totalS % 3600) / 60);
		const s = totalS % 60;
		
		if (h > 0) return `${h} Jam ${m} Menit ${s} Detik`;
		if (m > 0) return `${m} Menit ${s} Detik`;
		return `${s} Detik`;
	}

	onMount(() => {
		timer = setInterval(() => {
			currentTime = new Date();
		}, 1000);
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});
</script>

<svelte:head>
	<title>Hasil Ujian Siswa</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold text-slate-800 tracking-tight">Hasil Ujian</h1>
			<p class="text-slate-500 mt-1">Daftar nilai dari ujian yang telah Anda selesaikan</p>
		</div>
	</div>

	{#if finishedAttempts.length === 0}
		<div class="card p-12 text-center flex flex-col items-center justify-center bg-white shadow-sm border border-slate-200">
			<div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 mb-4">
				<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.results} />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-slate-800 mb-1">Belum Ada Hasil</h3>
			<p class="text-slate-500 max-w-sm">Anda belum menyelesaikan ujian apapun. Hasil ujian akan muncul di sini setelah Anda menyelesaikannya.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-4">
			{#each finishedAttempts as attempt}
				<div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-shadow">
					<div class="flex-1 space-y-3">
						<div>
							<div class="flex items-center gap-2 mb-1">
								<span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
									{attempt.subject || 'Tanpa Mapel'}
								</span>
								<span class={ATTEMPT_STATUS_COLORS[attempt.status]}>
									{ATTEMPT_STATUS_LABELS[attempt.status]}
								</span>
							</div>
							<h3 class="text-xl font-bold text-slate-800 leading-tight">{attempt.exam_title}</h3>
						</div>

						<div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
							<div class="flex items-center gap-1.5">
								<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								{new Date(String(attempt.submit_time || attempt.updated_at).replace(' ', 'T') + (String(attempt.submit_time || attempt.updated_at).includes(' ') && !String(attempt.submit_time || attempt.updated_at).includes('Z') ? 'Z' : '')).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
							</div>
							<div class="flex items-center gap-1.5">
								<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} />
								</svg>
								{attempt.duration_minutes} Menit
							</div>
							<div class="flex items-center gap-1.5">
								<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								{attempt.question_count} Soal
							</div>
						</div>

						<div class="pt-4 mt-2 border-t border-dashed border-slate-200">
							<span class="inline-block px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-md uppercase tracking-wider mb-3">Proses Ujian</span>
							
							<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div>
									<p class="text-xs text-slate-400 font-medium mb-0.5">Tanggal Mulai Ujian</p>
									<p class="text-sm font-semibold text-slate-700">{formatDateTime(attempt.start_time)}</p>
								</div>
								<div>
									<p class="text-xs text-slate-400 font-medium mb-0.5">Tanggal Selesai Ujian</p>
									<p class="text-sm font-semibold text-slate-700">{formatDateTime(attempt.submit_time || attempt.updated_at)}</p>
								</div>
								<div>
									<p class="text-xs text-slate-400 font-medium mb-0.5">Sisa Waktu Ujian</p>
									<p class="text-sm font-semibold text-indigo-600">{calculateRemainingTime(attempt)}</p>
								</div>
							</div>
						</div>
					</div>

					<div class="md:w-auto w-full md:border-l border-t md:border-t-0 border-slate-100 md:pl-6 pt-4 md:pt-0 flex flex-col md:items-end gap-1">
						<span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nilai Akhir</span>
						<div class="text-3xl font-black">
							<ScoreDisplay {attempt} {currentTime} />
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
