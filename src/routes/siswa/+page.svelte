<script lang="ts">
	import { ICONS, ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS } from '$lib/utils/constants';

	export let data;
	$: activeExams = (data.activeExams as any[]).filter(exam => {
		if (!exam.start_time) return true;
		const start = new Date(exam.start_time);
		const end = exam.end_time ? new Date(exam.end_time) : null;
		const today = new Date();
		
		const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
		
		if (end) {
			return start <= todayEnd && end >= todayStart;
		}
		
		return start.getFullYear() === today.getFullYear() &&
			start.getMonth() === today.getMonth() &&
			start.getDate() === today.getDate();
	});
	$: myAttempts = data.myAttempts as any[];
	$: activeAttempt = data.activeAttempt as any;
</script>

<svelte:head><title>Dashboard Siswa — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Dashboard Siswa</h1>
		<p class="text-sm text-slate-500 mt-1">Selamat datang, {data.user.name}.</p>
	</div>

	<!-- Active Attempt Banner -->
	{#if activeAttempt}
		<div class="card p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-pulse">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} />
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="font-bold text-amber-800">Ujian Sedang Berlangsung</h3>
					<p class="text-sm text-amber-600">{activeAttempt.exam_title}</p>
				</div>
				<a href="/siswa/ujian/{activeAttempt.id}" class="btn-warning">
					Lanjutkan
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronRight} />
					</svg>
				</a>
			</div>
		</div>
	{/if}

	<!-- Active Exams -->
	<div>
		<h2 class="text-lg font-bold text-slate-800 mb-3">Ujian Tersedia</h2>
		{#if activeExams.length === 0}
			<div class="card p-8 text-center text-slate-400">
				<svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
				</svg>
				<p>Tidak ada ujian yang tersedia saat ini.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each activeExams as exam (exam.id)}
					<div class="card-hover p-5">
						<div class="flex items-start justify-between mb-3">
							<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
								<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
								</svg>
							</div>
							<span class="badge-success">Tersedia</span>
						</div>
						<h3 class="font-bold text-slate-800">{exam.title}</h3>
						<p class="text-sm text-slate-500 mt-1">{exam.subject || 'Umum'}</p>
						<div class="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
							<span class="flex items-center gap-1">
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} />
								</svg>
								{exam.duration_minutes} menit
							</span>
						</div>
						<a href="/siswa/ujian" class="btn-primary w-full mt-4 justify-center">Mulai Ujian</a>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- History -->
	<div>
		<h2 class="text-lg font-bold text-slate-800 mb-3">Riwayat Ujian</h2>
		{#if myAttempts.length === 0}
			<div class="card p-6 text-center text-slate-400 text-sm">Belum ada riwayat ujian.</div>
		{:else}
			<div class="card overflow-hidden">
				<div class="table-container border-0 rounded-none">
					<table class="table">
						<thead><tr><th>Ujian</th><th>Mapel</th><th>Status</th><th>Nilai</th><th>Tanggal</th></tr></thead>
						<tbody>
							{#each myAttempts as a}
								<tr>
									<td class="font-medium">{a.exam_title}</td>
									<td class="text-slate-500">{a.subject || '-'}</td>
									<td><span class={ATTEMPT_STATUS_COLORS[a.status]}>{ATTEMPT_STATUS_LABELS[a.status]}</span></td>
									<td class="font-bold {(a.score ?? 0) >= 70 ? 'text-emerald-600' : 'text-rose-600'}">{a.score != null ? a.score.toFixed(1) : '-'}</td>
									<td class="text-xs text-slate-500">{new Date(a.created_at).toLocaleDateString('id-ID')}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>
</div>
