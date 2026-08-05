<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;

	let expanded = new Set<number>();

	function toggleExpand(studentId: number) {
		if (expanded.has(studentId)) {
			expanded.delete(studentId);
		} else {
			expanded.add(studentId);
		}
		expanded = expanded; // trigger reactivity
	}
</script>

<svelte:head>
	<title>Papan Peringkat - {data.examType.name}</title>
</svelte:head>

<div class="px-5 py-6 sm:px-8 max-w-5xl mx-auto">
	<!-- Header -->
	<div class="mb-8">
		<a href="/admin/papan-peringkat" class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 mb-4 transition-colors">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Kembali ke Papan Peringkat
		</a>
		<h1 class="text-3xl font-bold text-slate-800 tracking-tight">Akumulasi: {data.examType.name}</h1>
		<p class="text-slate-500 mt-1">Papan Peringkat Seluruh Kelas berdasarkan total nilai seluruh ujian tipe {data.examType.code}. Klik nama siswa untuk melihat detail per ujian.</p>
	</div>

	<!-- Leaderboard -->
	<div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
		<div class="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
			</svg>
			<h2 class="text-lg font-bold text-slate-800">Daftar Peringkat (Seluruh Siswa)</h2>
		</div>

		{#if data.leaderboard.length === 0}
			<div class="p-10 text-center text-slate-500">
				<p>Belum ada rekapan ujian untuk tipe ini.</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse">
					<thead>
						<tr class="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
							<th class="p-4 w-16 text-center">Peringkat</th>
							<th class="p-4">Siswa</th>
							<th class="p-4 text-center">Total Poin (Maks)</th>
							<th class="p-4 text-center">Total Nilai</th>
							<th class="p-4 text-center">Rata-rata</th>
						</tr>
					</thead>
					<tbody>
						{#each data.leaderboard as student, index}
							{@const isOpen = expanded.has(student.student_id)}
							{@const details = data.detailMap[student.student_id] || []}

							<!-- Baris Utama Siswa -->
							<tr
								class="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer select-none"
								class:bg-indigo-50={isOpen}
								on:click={() => toggleExpand(student.student_id)}
							>
								<!-- Rank -->
								<td class="p-4 text-center align-middle">
									{#if index === 0}
										<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold text-lg shadow-sm">1</span>
									{:else if index === 1}
										<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-600 font-bold text-lg shadow-sm">2</span>
									{:else if index === 2}
										<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-lg shadow-sm">3</span>
									{:else}
										<span class="inline-flex items-center justify-center w-8 h-8 font-semibold text-slate-400">{index + 1}</span>
									{/if}
								</td>

								<!-- Student Info -->
								<td class="p-4">
									<div class="flex items-center gap-3">
										{#if student.photo}
											<img src={student.photo} alt={student.student_name} class="w-10 h-10 rounded-full object-cover border border-slate-200" />
										{:else}
											<div class="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold flex-shrink-0">
												{student.student_name.charAt(0).toUpperCase()}
											</div>
										{/if}
										<div class="min-w-0">
											<p class="font-bold text-slate-800 flex items-center gap-1.5">
												{student.student_name}
												<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
												</svg>
											</p>
											<p class="text-xs text-slate-500">{student.class_name || 'Tidak ada kelas'} • {student.exams_completed} Ujian</p>
										</div>
									</div>
								</td>

								<!-- Total Poin -->
								<td class="p-4 text-center text-slate-600 font-medium">
									{student.total_points}
								</td>

								<!-- Total Nilai -->
								<td class="p-4 text-center">
									<span class="inline-block px-3 py-1 bg-green-100 text-green-700 font-bold rounded-lg">
										{student.total_score}
									</span>
								</td>

								<!-- Rata-rata -->
								<td class="p-4 text-center text-slate-600 font-medium">
									{student.avg_score.toFixed(2)}
								</td>
							</tr>

							<!-- Baris Detail (Dropdown) -->
							{#if isOpen && details.length > 0}
								<tr class="bg-indigo-50/60 border-b border-indigo-100">
									<td></td>
									<td colspan="4" class="px-4 pb-4 pt-2">
										<div class="rounded-xl border border-indigo-100 overflow-hidden shadow-sm">
											<table class="w-full text-sm text-left border-collapse">
												<thead>
													<tr class="bg-indigo-100 text-indigo-700 font-semibold">
														<th class="px-4 py-2.5">Nama Ujian</th>
														<th class="px-4 py-2.5 text-center">Total Poin (Maks)</th>
														<th class="px-4 py-2.5 text-center">Nilai</th>
													</tr>
												</thead>
												<tbody class="divide-y divide-indigo-50 bg-white">
													{#each details as detail}
														<tr class="hover:bg-indigo-50/50 transition-colors">
															<td class="px-4 py-2.5 text-slate-700 font-medium">{detail.exam_title}</td>
															<td class="px-4 py-2.5 text-center text-slate-600">{detail.total_points}</td>
															<td class="px-4 py-2.5 text-center">
																<span class="inline-block px-2.5 py-0.5 bg-green-100 text-green-700 font-semibold rounded-md">
																	{detail.score}
																</span>
															</td>
														</tr>
													{/each}
												</tbody>
											</table>
										</div>
									</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
