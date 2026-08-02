<script lang="ts">
	import { ICONS } from '$lib/utils/constants';
	export let data;
</script>

<svelte:head><title>Bank Soal — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Bank Soal</h1>
		<p class="text-sm text-slate-500 mt-1">Pilih ujian untuk mengelola soal</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.exams as exam (exam.id)}
			<a href="/guru/bank-soal/{exam.id}" class="card-hover p-5 group">
				<div class="flex items-start justify-between mb-2">
					<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
						</svg>
					</div>
					{#if exam.is_active}
						<span class="badge-success">Aktif</span>
					{/if}
				</div>
				<h3 class="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{exam.title}</h3>
				<p class="text-xs text-slate-500 mt-1">{exam.subject || 'Umum'} · {exam.duration_minutes} menit</p>
				<div class="mt-3 flex items-center gap-1 text-sm font-semibold text-indigo-600">
					<span>{exam.question_count} soal</span>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronRight} />
					</svg>
				</div>
			</a>
		{:else}
			<div class="col-span-full text-center py-12 text-slate-400">Belum ada ujian. Hubungi admin untuk membuat ujian.</div>
		{/each}
	</div>
</div>
