<script lang="ts">
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import { ICONS } from '$lib/utils/constants';
	export let data;
</script>

<svelte:head><title>Dashboard Guru — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Dashboard Guru</h1>
		<p class="text-sm text-slate-500 mt-1">Selamat datang, {data.user.name}.</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		<StatCard label="Total Ujian" value={data.stats.totalExams} icon={ICONS.exam} gradient="indigo" />
		<StatCard label="Total Soal" value={data.stats.totalQuestions} icon={ICONS.questions} gradient="cyan" />
		<StatCard label="Perlu Dinilai" value={data.stats.pendingGrading} icon={ICONS.grading} gradient="amber" />
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
		<div class="card p-5">
			<h2 class="text-lg font-bold text-slate-800 mb-4">Ujian Terbaru</h2>
			<div class="space-y-2">
				{#each data.recentExams as exam}
					<a href="/guru/bank-soal/{exam.id}" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
						<div>
							<p class="text-sm font-medium text-slate-700 group-hover:text-indigo-600">{exam.title}</p>
							<p class="text-xs text-slate-400">{exam.question_count} soal</p>
						</div>
						<svg class="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronRight} />
						</svg>
					</a>
				{:else}
					<p class="text-sm text-slate-400 text-center py-4">Belum ada ujian.</p>
				{/each}
			</div>
		</div>

		<div class="card p-5">
			<h2 class="text-lg font-bold text-slate-800 mb-4">Aksi Cepat</h2>
			<div class="space-y-3">
				<a href="/guru/bank-soal" class="btn-primary w-full justify-center">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.questions} />
					</svg>
					Kelola Bank Soal
				</a>
				<a href="/guru/penilaian" class="btn-secondary w-full justify-center">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.grading} />
					</svg>
					Penilaian Jawaban
				</a>
			</div>
		</div>
	</div>
</div>
