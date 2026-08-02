<script lang="ts">
	import { QUESTION_TYPE_LABELS, ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS, ICONS } from '$lib/utils/constants';

	export let data;
	$: exam = data.exam as any;
	$: questions = data.questions as any[];
	$: attempts = data.attempts as any[];
	$: tokens = data.tokens as any[];
</script>

<svelte:head>
	<title>{exam.title} — Detail Ujian</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex items-center gap-3">
		<a href="/admin/exams" class="btn-ghost btn-sm">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
			</svg>
			Kembali
		</a>
	</div>

	<!-- Exam Header -->
	<div class="card p-6">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
			<div>
				<h1 class="text-2xl font-bold text-slate-800">{exam.title}</h1>
				<p class="text-sm text-slate-500 mt-1">{exam.subject || 'Umum'} · {exam.duration_minutes} menit</p>
			</div>
			{#if exam.is_active}
				<span class="badge-success text-sm px-4 py-1.5">Aktif</span>
			{:else}
				<span class="badge bg-slate-100 text-slate-500 text-sm px-4 py-1.5">Nonaktif</span>
			{/if}
		</div>
		{#if exam.description}
			<p class="mt-3 text-sm text-slate-600">{exam.description}</p>
		{/if}
		<div class="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
			<span>Mulai: {exam.start_time ? new Date(exam.start_time).toLocaleString('id-ID') : '-'}</span>
			<span>Selesai: {exam.end_time ? new Date(exam.end_time).toLocaleString('id-ID') : '-'}</span>
		</div>
	</div>

	<!-- Stats Row -->
	<div class="grid grid-cols-3 gap-4">
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-gradient">{questions.length}</p>
			<p class="text-xs text-slate-500">Soal</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-gradient-cyan">{attempts.length}</p>
			<p class="text-xs text-slate-500">Peserta</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-amber-500">{tokens.length}</p>
			<p class="text-xs text-slate-500">Token</p>
		</div>
	</div>

	<!-- Questions List -->
	<div class="card overflow-hidden">
		<div class="p-5 border-b border-slate-100 flex items-center justify-between">
			<h2 class="text-lg font-bold text-slate-800">Daftar Soal</h2>
			<a href="/guru/bank-soal/{exam.id}" class="btn-sm btn-outline">Kelola Soal</a>
		</div>
		{#if questions.length === 0}
			<div class="p-8 text-center text-slate-400 text-sm">Belum ada soal untuk ujian ini.</div>
		{:else}
			<div class="divide-y divide-slate-100">
				{#each questions as q}
					<div class="p-4 flex items-center gap-3">
						<span class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">{q.question_number}</span>
						<div class="flex-1 min-w-0">
							<p class="text-sm text-slate-700 truncate">{q.question_text}</p>
							<span class="text-[10px] badge-primary mt-0.5">{QUESTION_TYPE_LABELS[q.type] || q.type}</span>
						</div>
						<span class="text-xs text-slate-400">{q.points} poin</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Attempts Table -->
	<div class="card overflow-hidden">
		<div class="p-5 border-b border-slate-100">
			<h2 class="text-lg font-bold text-slate-800">Riwayat Peserta</h2>
		</div>
		{#if attempts.length === 0}
			<div class="p-8 text-center text-slate-400 text-sm">Belum ada peserta yang mengerjakan ujian ini.</div>
		{:else}
			<div class="table-container border-0 rounded-none">
				<table class="table">
					<thead><tr><th>Siswa</th><th>Status</th><th>Nilai</th><th>Waktu Mulai</th></tr></thead>
					<tbody>
						{#each attempts as a}
							<tr>
								<td class="font-medium">{a.student_name}</td>
								<td><span class={ATTEMPT_STATUS_COLORS[a.status] || 'badge-info'}>{ATTEMPT_STATUS_LABELS[a.status] || a.status}</span></td>
								<td class="font-semibold">{a.score != null ? a.score : '-'}</td>
								<td class="text-xs text-slate-500">{new Date(a.start_time).toLocaleString('id-ID')}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
