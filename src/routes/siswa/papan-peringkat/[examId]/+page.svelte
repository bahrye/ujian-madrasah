<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>Papan Peringkat - {data.exam.title}</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<!-- Header -->
	<div class="mb-8">
		<a href="/siswa/papan-peringkat" class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 mb-4 transition-colors">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Kembali ke Papan Peringkat
		</a>
		<h1 class="text-3xl font-bold text-slate-800 tracking-tight">{data.exam.title}</h1>
		<p class="text-slate-500 mt-1">Papan Peringkat Kelas untuk Ujian {data.exam.subject_name}</p>
	</div>

	<!-- Leaderboard -->
	<div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
		<div class="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
			</svg>
			<h2 class="text-lg font-bold text-slate-800">Daftar Peringkat</h2>
		</div>

		{#if data.leaderboard.length === 0}
			<div class="p-10 text-center text-slate-500">
				<p>Belum ada siswa di kelas Anda yang menyelesaikan ujian ini.</p>
			</div>
		{:else}
			<div class="divide-y divide-slate-100">
				{#each data.leaderboard as student, index}
					<div class="flex items-center px-6 py-4 hover:bg-slate-50 transition-colors">
						<!-- Rank -->
						<div class="w-12 flex-shrink-0 flex justify-center">
							{#if index === 0}
								<span class="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold text-lg">1</span>
							{:else if index === 1}
								<span class="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-lg">2</span>
							{:else if index === 2}
								<span class="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-lg">3</span>
							{:else}
								<span class="flex items-center justify-center w-8 h-8 font-semibold text-slate-400">{index + 1}</span>
							{/if}
						</div>

						<!-- Student Info -->
						<div class="ml-4 flex items-center gap-4 flex-grow">
							{#if student.photo}
								<img src={student.photo} alt={student.student_name} class="w-10 h-10 rounded-full object-cover border border-slate-200" />
							{:else}
								<div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
									{student.student_name.charAt(0).toUpperCase()}
								</div>
							{/if}
							
							<div>
								<p class="font-bold text-slate-800">{student.student_name}</p>
								<p class="text-xs text-slate-400">Telah Menyelesaikan</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
