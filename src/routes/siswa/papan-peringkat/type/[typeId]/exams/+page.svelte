<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Peringkat Ujian: {data.type_name} - Siswa</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="mb-8">
		<a href="/siswa/papan-peringkat" class="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
			</svg>
			Kembali ke Kategori
		</a>
		<h1 class="text-3xl font-bold text-slate-800 tracking-tight">Peringkat Per Ujian</h1>
		<p class="text-slate-500 mt-1">Daftar peringkat untuk setiap ujian pada kategori <span class="font-bold text-slate-700">{data.type_name}</span>.</p>
	</div>

	<!-- Peringkat Ujian -->
	<section class="mb-10">
		<h2 class="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
			</svg>
			Daftar Ujian
		</h2>
		
		{#if data.exams.length === 0}
			<div class="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-sm">
				<p>Belum ada ujian yang tersedia untuk dilihat peringkatnya pada kategori ini.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{#each data.exams as exam}
					<div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
						<div class="flex items-start justify-between mb-4">
							<div>
								<span class="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg mb-2">
									{exam.type_name || 'Ujian'}
								</span>
								<h3 class="font-bold text-slate-800 leading-tight">{exam.title}</h3>
								{#if exam.subject}
									<p class="text-sm text-slate-500 mt-1">{exam.subject}</p>
								{/if}
							</div>
						</div>
						
						<div class="mt-auto pt-5 border-t border-slate-100">
							<a href="/siswa/papan-peringkat/{exam.id}" class="btn btn-primary w-full justify-center">
								Lihat Peringkat
							</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
