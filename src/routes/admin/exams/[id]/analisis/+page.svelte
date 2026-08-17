<script lang="ts">
	import { ICONS, QUESTION_TYPE_LABELS } from '$lib/utils/constants';
	import { mathRender } from '$lib/actions/mathRender';
	
	export let data;
	$: exam = data.exam as any;
	$: analysis = data.analysis as any[];
	$: totalAttempts = data.totalAttempts as number;
	$: groupSize = data.groupSize as number;

	$: summary = {
		total: analysis.length,
		gunakan: analysis.filter(a => a.status === 'Gunakan').length,
		revisi: analysis.filter(a => a.status === 'Revisi').length,
		buang: analysis.filter(a => a.status === 'Buang / Revisi Total').length
	};

	function getPCategoryColor(cat: string) {
		if (cat === 'Sukar') return 'text-rose-600 bg-rose-50 border-rose-200';
		if (cat === 'Mudah') return 'text-sky-600 bg-sky-50 border-sky-200';
		return 'text-emerald-600 bg-emerald-50 border-emerald-200';
	}

	function getDCategoryColor(cat: string) {
		if (cat === 'Sangat Baik' || cat === 'Baik') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
		if (cat === 'Cukup') return 'text-amber-600 bg-amber-50 border-amber-200';
		return 'text-rose-600 bg-rose-50 border-rose-200';
	}

	function getStatusColor(status: string) {
		if (status === 'Gunakan') return 'badge-success';
		if (status === 'Revisi') return 'badge-warning';
		return 'badge-error';
	}
</script>

<svelte:head>
	<title>Analisis Butir Soal - {exam.title}</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex items-center gap-3">
		<button type="button" on:click={() => history.back()} class="btn-ghost btn-sm">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
			</svg>
			Kembali
		</button>
	</div>

	<!-- Header -->
	<div class="card p-6">
		<div class="flex flex-col md:flex-row justify-between gap-4">
			<div>
				<h1 class="text-2xl font-bold text-slate-800">Analisis Butir Soal</h1>
				<p class="text-sm text-slate-500 mt-1">{exam.title} ({exam.subject_name || 'Umum'})</p>
			</div>
			<div class="flex gap-4">
				<div class="text-right">
					<p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Peserta</p>
					<p class="text-xl font-bold text-slate-800">{totalAttempts}</p>
				</div>
				<div class="w-px bg-slate-200"></div>
				<div class="text-right">
					<p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Sampel (27%)</p>
					<p class="text-xl font-bold text-slate-800">{groupSize} Atas / {groupSize} Bawah</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Summary Cards -->
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		<div class="card p-4 border-t-4 border-t-slate-800">
			<p class="text-3xl font-bold text-slate-800">{summary.total}</p>
			<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Total Soal</p>
		</div>
		<div class="card p-4 border-t-4 border-t-emerald-500">
			<p class="text-3xl font-bold text-emerald-600">{summary.gunakan}</p>
			<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Gunakan (D Baik)</p>
		</div>
		<div class="card p-4 border-t-4 border-t-amber-500">
			<p class="text-3xl font-bold text-amber-600">{summary.revisi}</p>
			<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Perlu Revisi (D Cukup)</p>
		</div>
		<div class="card p-4 border-t-4 border-t-rose-500">
			<p class="text-3xl font-bold text-rose-600">{summary.buang}</p>
			<p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Buang/Rombak (D Buruk)</p>
		</div>
	</div>

	{#if totalAttempts === 0}
		<div class="card p-12 text-center">
			<svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<h3 class="text-lg font-bold text-slate-700">Belum Ada Data</h3>
			<p class="text-slate-500 mt-2 text-sm max-w-md mx-auto">Analisis butir soal baru dapat dilakukan jika sudah ada siswa yang menyelesaikan ujian ini.</p>
		</div>
	{:else}
		<!-- Table -->
		<div class="card overflow-hidden">
			<div class="p-5 border-b border-slate-100 bg-slate-50/50">
				<h2 class="text-lg font-bold text-slate-800">Detail Analisis per Soal</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="table min-w-[1000px]">
					<thead>
						<tr>
							<th class="w-16 text-center">No.</th>
							<th class="w-72">Teks Soal</th>
							<th class="w-32">Tipe</th>
							<th>Tingkat Kesukaran (P)</th>
							<th>Daya Pembeda (D)</th>
							<th class="w-32">Keputusan</th>
						</tr>
					</thead>
					<tbody use:mathRender={analysis}>
						{#each analysis as item}
							<tr class="hover:bg-slate-50/50 transition-colors">
								<td class="text-center font-bold text-slate-700">{item.question_number}</td>
								<td>
									<div class="line-clamp-2 text-sm text-slate-700" title={item.question_text}>{@html item.question_text}</div>
									<!-- Distribution for multiple choice -->
									{#if Object.keys(item.distribution).length > 0}
										<div class="flex gap-2 mt-2 text-[10px] font-mono">
											{#each ['A', 'B', 'C', 'D', 'E'] as opt}
												{#if item.distribution[opt] !== undefined || (opt !== 'E')}
													<div class="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500" title="Pemilih Opsi {opt}">
														{opt}: {item.distribution[opt] || 0}
													</div>
												{/if}
											{/each}
										</div>
									{/if}
								</td>
								<td><span class="text-xs badge-info">{QUESTION_TYPE_LABELS[item.type] || item.type}</span></td>
								
								<td>
									<div class="flex flex-col gap-1">
										<div class="flex items-center gap-2">
											<span class="font-bold text-slate-700">{item.pIndex}</span>
											<span class="text-[10px] px-2 py-0.5 rounded border {getPCategoryColor(item.pCategory)} font-medium">{item.pCategory}</span>
										</div>
										<div class="text-xs text-slate-400">Benar: {item.correctCount} dari {totalAttempts}</div>
									</div>
								</td>

								<td>
									<div class="flex flex-col gap-1">
										<div class="flex items-center gap-2">
											<span class="font-bold text-slate-700">{item.dIndex}</span>
											<span class="text-[10px] px-2 py-0.5 rounded border {getDCategoryColor(item.dCategory)} font-medium whitespace-nowrap">{item.dCategory}</span>
										</div>
										<div class="text-[10px] text-slate-400 font-mono mt-0.5 bg-slate-50 inline-block px-1 rounded border border-slate-100 self-start">
											{item.upperCorrect} Atas - {item.lowerCorrect} Bawah
										</div>
									</div>
								</td>

								<td>
									<span class="text-xs font-semibold px-2.5 py-1 rounded-full {getStatusColor(item.status)} text-center block w-full whitespace-nowrap">{item.status}</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
			<div class="card p-6 bg-slate-50/50 border border-slate-200">
				<h3 class="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2">
					<svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					Tingkat Kesukaran (P)
				</h3>
				<ul class="text-xs text-slate-600 space-y-2">
					<li><strong class="text-rose-600">P &lt; 0.30</strong> : Soal Sukar</li>
					<li><strong class="text-emerald-600">0.30 &le; P &le; 0.70</strong> : Soal Sedang</li>
					<li><strong class="text-sky-600">P &gt; 0.70</strong> : Soal Mudah</li>
				</ul>
				<p class="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-3">
					Tingkat kesukaran yang ideal adalah yang menyebar, namun sebagian besar berada di kategori sedang. Soal yang terlalu mudah atau terlalu sukar tidak dapat membedakan kemampuan siswa.
				</p>
			</div>
			
			<div class="card p-6 bg-slate-50/50 border border-slate-200">
				<h3 class="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2">
					<svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					Daya Pembeda (D)
				</h3>
				<ul class="text-xs text-slate-600 space-y-2">
					<li><strong class="text-emerald-600">D &ge; 0.40</strong> : Sangat Baik</li>
					<li><strong class="text-emerald-500">0.30 &le; D &le; 0.39</strong> : Baik</li>
					<li><strong class="text-amber-500">0.20 &le; D &le; 0.29</strong> : Cukup (Perlu Revisi)</li>
					<li><strong class="text-rose-600">D &lt; 0.20</strong> : Buruk (Buang / Revisi Total)</li>
				</ul>
				<p class="mt-3 text-xs text-slate-500 leading-relaxed border-t border-slate-200 pt-3">
					Daya pembeda menunjukkan seberapa baik sebuah soal dapat membedakan siswa kelompok pandai (atas) dengan kelompok kurang (bawah). Nilai negatif berarti siswa kelompok bawah lebih banyak yang menjawab benar.
				</p>
			</div>
		</div>
	{/if}
</div>
