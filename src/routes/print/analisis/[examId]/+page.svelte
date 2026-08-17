<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	import { QUESTION_TYPE_LABELS } from '$lib/utils/constants';
	import { mathRender } from '$lib/actions/mathRender';

	export let data;
	$: school = data.school as any;
	$: exam = data.exam as any;
	$: analysis = data.analysis as any[];
	$: summary = data.summary as any;
	$: totalAttempts = data.totalAttempts as number;
	$: groupSize = data.groupSize as number;

	function formatDateNow() {
		return new Date().toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatShortDate(dateStr: string | null) {
		if (!dateStr) return '-';
		const d = parseDate(dateStr);
		if (isNaN(d.getTime())) return dateStr;
		return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
	}

	function getStatusBadge(status: string) {
		if (status === 'Gunakan') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
		if (status === 'Revisi') return 'bg-amber-100 text-amber-800 border-amber-300';
		return 'bg-rose-100 text-rose-800 border-rose-300';
	}
</script>

<svelte:head>
	<title>Analisis Butir Soal — {exam.display_title || exam.title}</title>
</svelte:head>

<style>
	:global(body) {
		font-family: 'Times New Roman', Times, Arial, serif !important;
		font-variant-numeric: lining-nums tabular-nums !important;
		-webkit-font-feature-settings: "lnum" 1, "tnum" 1 !important;
		font-feature-settings: "lnum" 1, "tnum" 1 !important;
		background-color: white !important;
		color: #111827 !important;
	}

	@media print {
		@page {
			size: 215.9mm 330mm; /* F4 / Folio Landscape or Portrait */
			margin: 1.2cm;
		}
		:global(body) {
			margin: 0;
			padding: 0;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
		.no-print {
			display: none !important;
		}
		.page-break {
			page-break-before: always;
		}
		tr {
			page-break-inside: avoid !important;
		}
	}

	.kop-border {
		border-bottom: 3px double #000;
	}

	table.print-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 10pt;
	}

	table.print-table th,
	table.print-table td {
		border: 1px solid #1f2937;
		padding: 4px 6px;
		vertical-align: middle;
	}

	table.print-table th {
		background-color: #f3f4f6;
		font-weight: bold;
		text-align: center;
	}
</style>

<!-- Floating Toolbar for Screen View (Hidden when printing) -->
<div class="no-print fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md text-white p-2.5 px-4 rounded-2xl shadow-2xl border border-slate-700">
	<button
		type="button"
		on:click={() => history.back()}
		class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
	>
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
		</svg>
		Kembali
	</button>

	<a
		href={`/api/export/analisis/${exam.id}`}
		class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/40"
	>
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
		</svg>
		Export Excel (.xlsx)
	</a>

	<button
		type="button"
		on:click={() => window.print()}
		class="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-900/40"
	>
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
		</svg>
		Cetak / Simpan PDF
	</button>
</div>

<!-- Print Document Page Container -->
<div class="max-w-[21.5cm] mx-auto p-4 sm:p-8 bg-white print:max-w-none print:p-0">
	<!-- KOP SURAT RESMI MADRASAH -->
	<div class="flex items-center gap-4 pb-3 kop-border mb-4">
		{#if school?.logo_url}
			<img src={school.logo_url} alt="Logo" class="w-20 h-20 object-contain flex-shrink-0" />
		{/if}
		<div class="flex-1 text-center">
			<h2 class="text-sm font-semibold tracking-wider uppercase text-slate-700">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h2>
			<h1 class="text-xl font-bold uppercase tracking-tight text-slate-900 leading-tight">
				{school?.name || 'MADRASAH ALIYAH / TSANAWIYAH'}
			</h1>
			<p class="text-xs text-slate-600 mt-0.5 leading-snug">
				{school?.address || 'Jl. Pendidikan Madrasah'}
				{#if school?.phone} | Telp: {school.phone}{/if}
				{#if school?.email} | Email: {school.email}{/if}
			</p>
			{#if school?.npsn}
				<p class="text-[11px] font-semibold text-slate-700">NPSN: {school.npsn} | Akreditasi: {school?.accreditation || '-'}</p>
			{/if}
		</div>
	</div>

	<!-- TITLE -->
	<div class="text-center mb-5">
		<h2 class="text-base font-bold uppercase tracking-wide text-slate-900 underline decoration-1 underline-offset-4">
			LAPORAN HASIL ANALISIS BUTIR SOAL & DAYA PEMBEDA
		</h2>
		<p class="text-xs text-slate-600 mt-1">Tahun Ajaran {new Date().getFullYear()} / {new Date().getFullYear() + 1}</p>
	</div>

	<!-- INFORMASI UJIAN (METADATA) -->
	<div class="border border-slate-800 rounded-md p-3 mb-5 text-xs bg-slate-50/40">
		<div class="grid grid-cols-2 gap-x-6 gap-y-1.5">
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Nama Ujian</span>
				<span class="mr-2">:</span>
				<span class="font-bold text-slate-900 flex-1">{exam.display_title || exam.title}</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Jumlah Peserta Selesai</span>
				<span class="mr-2">:</span>
				<span class="font-bold text-slate-900 flex-1">{totalAttempts} Siswa</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Mata Pelajaran</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{exam.subject_name || 'Umum'}</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Sampel 27% (Atas / Bawah)</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{groupSize} Siswa Atas / {groupSize} Siswa Bawah</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Kelas / Tingkat</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{exam.class_name || (exam.class_level ? `Kelas ${exam.class_level}` : 'Semua Kelas')}</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Rata-rata Skor Ujian</span>
				<span class="mr-2">:</span>
				<span class="font-bold text-slate-900 flex-1">{summary.avgScore} (Maks: {summary.maxScore}, Min: {summary.minScore})</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Guru Pengampu</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{exam.teacher_name || '-'}</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Total Butir Soal</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{analysis.length} Soal</span>
			</div>
		</div>
	</div>

	<!-- RINGKASAN REKAPITULASI KLASIFIKASI SOAL -->
	<div class="mb-5">
		<h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
			<span class="w-2 h-2 rounded-full bg-slate-800"></span>
			Rekapitulasi Kualitas Butir Soal
		</h3>
		<div class="grid grid-cols-3 gap-2 text-xs">
			<!-- Rekap Status -->
			<div class="border border-slate-400 rounded p-2 bg-white">
				<p class="font-bold text-slate-800 border-b border-slate-300 pb-1 mb-1 text-[11px]">STATUS REKOMENDASI</p>
				<div class="space-y-0.5 text-[11px]">
					<div class="flex justify-between">
						<span>Diterima / Gunakan (D Baik):</span>
						<strong class="text-emerald-700">{summary.gunakan} Soal ({analysis.length > 0 ? Math.round((summary.gunakan / analysis.length) * 100) : 0}%)</strong>
					</div>
					<div class="flex justify-between">
						<span>Direvisi (D Cukup):</span>
						<strong class="text-amber-700">{summary.revisi} Soal ({analysis.length > 0 ? Math.round((summary.revisi / analysis.length) * 100) : 0}%)</strong>
					</div>
					<div class="flex justify-between">
						<span>Ditolak / Buang (D Buruk):</span>
						<strong class="text-rose-700">{summary.buang} Soal ({analysis.length > 0 ? Math.round((summary.buang / analysis.length) * 100) : 0}%)</strong>
					</div>
				</div>
			</div>

			<!-- Rekap Tingkat Kesukaran (P) -->
			<div class="border border-slate-400 rounded p-2 bg-white">
				<p class="font-bold text-slate-800 border-b border-slate-300 pb-1 mb-1 text-[11px]">TINGKAT KESUKARAN (P)</p>
				<div class="space-y-0.5 text-[11px]">
					<div class="flex justify-between">
						<span>Mudah (P &gt; 0.70):</span>
						<strong>{summary.mudah} Soal ({analysis.length > 0 ? Math.round((summary.mudah / analysis.length) * 100) : 0}%)</strong>
					</div>
					<div class="flex justify-between">
						<span>Sedang (0.30 &le; P &le; 0.70):</span>
						<strong class="text-emerald-700">{summary.sedang} Soal ({analysis.length > 0 ? Math.round((summary.sedang / analysis.length) * 100) : 0}%)</strong>
					</div>
					<div class="flex justify-between">
						<span>Sukar (P &lt; 0.30):</span>
						<strong>{summary.sukar} Soal ({analysis.length > 0 ? Math.round((summary.sukar / analysis.length) * 100) : 0}%)</strong>
					</div>
				</div>
			</div>

			<!-- Rekap Daya Pembeda (D) -->
			<div class="border border-slate-400 rounded p-2 bg-white">
				<p class="font-bold text-slate-800 border-b border-slate-300 pb-1 mb-1 text-[11px]">DAYA PEMBEDA (D)</p>
				<div class="space-y-0.5 text-[11px]">
					<div class="flex justify-between">
						<span>Sangat Baik (D &ge; 0.40):</span>
						<strong class="text-emerald-700">{summary.sangatBaikD} Soal</strong>
					</div>
					<div class="flex justify-between">
						<span>Baik (0.30 &le; D &le; 0.39):</span>
						<strong>{summary.baikD} Soal</strong>
					</div>
					<div class="flex justify-between">
						<span>Cukup / Buruk:</span>
						<strong>{summary.cukupD + summary.burukD} Soal</strong>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- TABEL UTAMA ANALISIS BUTIR SOAL -->
	<div class="mb-6">
		<h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
			<span class="w-2 h-2 rounded-full bg-slate-800"></span>
			Tabel Detail Analisis Butir Soal Lengkap
		</h3>

		{#if totalAttempts === 0}
			<div class="border border-slate-300 rounded p-6 text-center text-xs text-slate-500">
				Belum ada data peserta yang menyelesaikan ujian ini untuk dianalisis.
			</div>
		{:else}
			<table class="print-table" use:mathRender={analysis}>
				<thead>
					<tr>
						<th rowspan="2" class="w-8">No</th>
						<th rowspan="2" class="w-14">Tipe</th>
						<th rowspan="2" class="w-10">Kunci</th>
						<th rowspan="2" class="w-8">Poin</th>
						<th colspan="3">Tingkat Kesukaran (P)</th>
						<th colspan="4">Daya Pembeda (D)</th>
						<th rowspan="2" class="w-24">Status / Rekomendasi</th>
						<th colspan="5" class="w-28">Sebaran Pilihan (Pengecoh)</th>
					</tr>
					<tr>
						<th class="w-10">Benar</th>
						<th class="w-10">Nilai P</th>
						<th class="w-14">Kategori</th>
						<th class="w-10">Atas (U)</th>
						<th class="w-10">Bawah (L)</th>
						<th class="w-10">Nilai D</th>
						<th class="w-14">Kategori</th>
						<th class="w-5">A</th>
						<th class="w-5">B</th>
						<th class="w-5">C</th>
						<th class="w-5">D</th>
						<th class="w-5">E</th>
					</tr>
				</thead>
				<tbody>
					{#each analysis as q}
						<tr>
							<td class="text-center font-bold">{q.no}</td>
							<td class="text-center text-[9pt]">{QUESTION_TYPE_LABELS[q.type] || q.type}</td>
							<td class="text-center font-bold text-[9pt]">{q.correctKey}</td>
							<td class="text-center">{q.points}</td>
							
							<!-- Tingkat Kesukaran (P) -->
							<td class="text-center">{q.correctCount}</td>
							<td class="text-center font-bold">{q.pIndex}</td>
							<td class="text-center text-[9pt]">{q.pCategory}</td>

							<!-- Daya Pembeda (D) -->
							<td class="text-center">{q.upperCorrect}</td>
							<td class="text-center">{q.lowerCorrect}</td>
							<td class="text-center font-bold">{q.dIndex}</td>
							<td class="text-center text-[9pt]">{q.dCategory}</td>

							<!-- Rekomendasi -->
							<td class="text-center font-semibold text-[8.5pt]">
								<span class="px-1.5 py-0.5 rounded border text-[8pt] inline-block {getStatusBadge(q.status)}">
									{q.status}
								</span>
							</td>

							<!-- Sebaran Opsi A-E -->
							<td class="text-center text-[8.5pt]">{q.distribution['A'] || 0}</td>
							<td class="text-center text-[8.5pt]">{q.distribution['B'] || 0}</td>
							<td class="text-center text-[8.5pt]">{q.distribution['C'] || 0}</td>
							<td class="text-center text-[8.5pt]">{q.distribution['D'] || 0}</td>
							<td class="text-center text-[8.5pt]">{q.distribution['E'] || 0}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<!-- KRITERIA PENAFSIRAN STATISTIK -->
	<div class="grid grid-cols-2 gap-4 border border-slate-700 rounded p-3 mb-8 text-[9.5pt] bg-slate-50/50">
		<div>
			<h4 class="font-bold text-slate-900 border-b border-slate-300 pb-0.5 mb-1 text-[10pt]">1. Klasifikasi Tingkat Kesukaran (P)</h4>
			<ul class="space-y-0.5 text-slate-700 list-disc pl-4 text-[9pt]">
				<li>P &lt; 0.30 : <strong>Sukar</strong> (Hanya sedikit siswa yang menjawab benar)</li>
				<li>0.30 &le; P &le; 0.70 : <strong>Sedang</strong> (Kualitas ideal & proporsional)</li>
				<li>P &gt; 0.70 : <strong>Mudah</strong> (Sebagian besar siswa menjawab benar)</li>
			</ul>
		</div>
		<div>
			<h4 class="font-bold text-slate-900 border-b border-slate-300 pb-0.5 mb-1 text-[10pt]">2. Klasifikasi Daya Pembeda (D)</h4>
			<ul class="space-y-0.5 text-slate-700 list-disc pl-4 text-[9pt]">
				<li>D &ge; 0.40 : <strong>Sangat Baik</strong> (Diterima / Gunakan)</li>
				<li>0.30 &le; D &lt; 0.40 : <strong>Baik</strong> (Diterima / Gunakan)</li>
				<li>0.20 &le; D &lt; 0.30 : <strong>Cukup</strong> (Perlu direvisi / diperbaiki)</li>
				<li>D &lt; 0.20 : <strong>Buruk</strong> (Ditolak / Buang / Rombak total)</li>
			</ul>
		</div>
	</div>

	<!-- LEMBAR TANDA TANGAN RESMI -->
	<div class="flex justify-between items-start text-xs text-slate-900 px-6 pt-2 page-break-inside-avoid">
		<div class="text-center">
			<p>Mengetahui,</p>
			<p class="font-semibold">Kepala Madrasah</p>
			<div class="h-20"></div>
			<p class="font-bold underline text-sm">{school?.principal_name || '......................................................'}</p>
			<p class="text-[11px] text-slate-600">NIP. {school?.principal_nip || '............................................'}</p>
		</div>

		<div class="text-center">
			<p>{school?.city || 'Madrasah'}, {formatDateNow()}</p>
			<p class="font-semibold">Guru Mata Pelajaran</p>
			<div class="h-20"></div>
			<p class="font-bold underline text-sm">{exam.teacher_name || '......................................................'}</p>
			<p class="text-[11px] text-slate-600">NIP. {exam.teacher_nip || '............................................'}</p>
		</div>
	</div>
</div>
