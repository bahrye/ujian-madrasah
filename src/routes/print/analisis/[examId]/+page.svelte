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
	$: teachers = (data.teachers || []) as any[];

	// Pilihan Guru Pengampu
	let selectedTeacherId = '';
	let customTeacherName = '';
	let customTeacherNip = '';

	$: if (!selectedTeacherId && data?.exam) {
		selectedTeacherId = data.exam.created_by ? String(data.exam.created_by) : (data.teachers?.[0]?.id ? String(data.teachers[0].id) : '');
	}

	$: selectedTeacher = teachers.find(t => String(t.id) === String(selectedTeacherId));
	$: currentTeacherName = selectedTeacherId === 'custom' 
		? (customTeacherName || '......................................................')
		: (selectedTeacher ? selectedTeacher.name : (exam?.teacher_name || '......................................................'));
	$: currentTeacherNip = selectedTeacherId === 'custom'
		? (customTeacherNip || '............................................')
		: (selectedTeacher ? (selectedTeacher.nip || '-') : (exam?.teacher_nip || '............................................'));

	$: locationStr = [
		school?.district ? `Kecamatan ${school.district}` : '',
		school?.city ? (String(school.city).toLowerCase().startsWith('kab') || String(school.city).toLowerCase().startsWith('kota') ? school.city : `Kabupaten ${school.city}`) : '',
		school?.province ? school.province : ''
	].filter(Boolean).join(', ');

	function formatDateNow() {
		return new Date().toLocaleDateString('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
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
			size: 215.9mm 330mm; /* F4 / Folio */
			margin: 1cm;
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

<!-- Control Bar (Sticky Header, Hidden when printing) -->
<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
	<div class="flex items-center gap-3 flex-wrap">
		<div class="flex items-center gap-2">
			<label for="teacher-select" class="text-xs text-slate-300 font-semibold flex items-center gap-1">
				<svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				Guru Pengampu:
			</label>
			<select
				id="teacher-select"
				bind:value={selectedTeacherId}
				class="bg-slate-700 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[260px]"
			>
				{#each teachers as t}
					<option value={String(t.id)}>{t.name} {t.nip ? `(NIP: ${t.nip})` : ''}</option>
				{/each}
				<option value="custom">-- Input Manual / Lainnya --</option>
			</select>
		</div>

		{#if selectedTeacherId === 'custom'}
			<div class="flex items-center gap-2 animate-in fade-in">
				<input
					type="text"
					bind:value={customTeacherName}
					placeholder="Nama Guru Pengampu"
					class="bg-slate-700 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
				/>
				<input
					type="text"
					bind:value={customTeacherNip}
					placeholder="NIP (opsional)"
					class="bg-slate-700 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36"
				/>
			</div>
		{/if}
	</div>

	<div class="flex items-center gap-2">
		<button
			type="button"
			on:click={() => window.close()}
			class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors"
		>
			Tutup
		</button>

		<a
			href={`/api/export/analisis/${exam.id}`}
			class="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
			</svg>
			Export Excel
		</a>

		<button
			type="button"
			on:click={() => window.print()}
			class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
			</svg>
			Cetak / Simpan PDF
		</button>
	</div>
</div>

<!-- Print Document Page Container (F4 / Folio) -->
<div class="p-4 md:p-8 print:p-0 print:m-0 max-w-[215.9mm] mx-auto bg-white" style="font-family: 'Times New Roman', Times, Arial, serif; font-variant-numeric: lining-nums tabular-nums;">
	<!-- KOP SURAT PERSIS SEPERTI DAFTAR HADIR -->
	<div class="flex items-center justify-between gap-4 pb-2 relative">
		<img 
			src="/kemenag.png" 
			alt="Logo Kemenag" 
			class="w-20 h-20 object-contain shrink-0" 
			on:error={(e) => { (e.currentTarget as HTMLElement).style.visibility = 'hidden'; }}
		/>
		<div class="flex-1 text-center font-serif px-2">
			<h4 class="font-semibold text-sm uppercase tracking-wider text-black m-0 leading-tight">
				KEMENTERIAN AGAMA REPUBLIK INDONESIA
			</h4>
			<h3 class="font-bold text-xl uppercase tracking-wide text-black m-0 my-0.5">
				{school?.name || 'NAMA SEKOLAH'}
			</h3>
			{#if school?.address}
				<p class="text-xs italic text-black m-0 leading-tight">{school.address}</p>
			{/if}
			{#if locationStr}
				<p class="text-xs italic text-black m-0 leading-tight mt-0.5">{locationStr}</p>
			{/if}
		</div>
		{#if school?.logo_url}
			<img 
				src={school.logo_url} 
				alt="Logo Sekolah" 
				class="w-20 h-20 object-contain shrink-0" 
			/>
		{:else}
			<div class="w-20 h-20 shrink-0"></div>
		{/if}
	</div>

	<!-- Garis Kop Surat (Tipis atas, Agak tebal bawah) -->
	<div class="mt-2 mb-5">
		<div style="border-bottom: 1px solid #000;"></div>
		<div style="border-bottom: 2.5px solid #000; margin-top: 2px;"></div>
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
				<span class="font-bold text-slate-900 flex-1">{exam?.display_title || exam?.title || 'Ujian'}</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Jumlah Peserta Selesai</span>
				<span class="mr-2">:</span>
				<span class="font-bold text-slate-900 flex-1">{totalAttempts} Siswa</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Mata Pelajaran</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{exam?.subject_name || 'Umum'}</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Sampel 27% (Atas / Bawah)</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{groupSize} Siswa Atas / {groupSize} Siswa Bawah</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Kelas / Tingkat</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{exam?.class_name || (exam?.class_level ? `Kelas ${exam.class_level}` : 'Semua Kelas')}</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Rata-rata Skor Ujian</span>
				<span class="mr-2">:</span>
				<span class="font-bold text-slate-900 flex-1">{summary?.avgScore ?? 0} (Maks: {summary?.maxScore ?? 0}, Min: {summary?.minScore ?? 0})</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Guru Pengampu</span>
				<span class="mr-2">:</span>
				<span class="font-bold text-indigo-900 flex-1">{currentTeacherName}</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Total Butir Soal</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{analysis?.length || 0} Soal</span>
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
			<p class="font-bold underline text-sm">{currentTeacherName}</p>
			<p class="text-[11px] text-slate-600">NIP. {currentTeacherNip}</p>
		</div>
	</div>
</div>
