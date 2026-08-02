<script lang="ts">
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import { ICONS } from '$lib/utils/constants';
	export let data;
</script>

<svelte:head><title>Dashboard Pengawas — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Dashboard Pengawas</h1>
		<p class="text-sm text-slate-500 mt-1">Selamat datang, {data.user.name}.</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		<StatCard label="Ujian Aktif" value={data.stats.activeExams} icon={ICONS.exam} gradient="indigo" />
		<StatCard label="Total Token" value={data.stats.totalTokens} icon={ICONS.token} gradient="amber" />
		<StatCard label="Sedang Mengerjakan" value={data.stats.activeAttempts} icon={ICONS.monitor} gradient="cyan" />
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<a href="/pengawas/tokens" class="card-hover p-6 text-center group">
			<div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
				<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.token} />
				</svg>
			</div>
			<h3 class="font-bold text-slate-800">Kelola Token Ujian</h3>
			<p class="text-sm text-slate-500 mt-1">Generate dan rilis token untuk siswa</p>
		</a>
		<a href="/pengawas/monitor" class="card-hover p-6 text-center group">
			<div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
				<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.monitor} />
				</svg>
			</div>
			<h3 class="font-bold text-slate-800">Monitoring Ujian</h3>
			<p class="text-sm text-slate-500 mt-1">Pantau siswa yang sedang mengerjakan</p>
		</a>
	</div>
</div>
