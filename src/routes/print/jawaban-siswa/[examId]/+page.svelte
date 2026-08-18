<script lang="ts">
	import { QUESTION_TYPE_LABELS } from '$lib/utils/constants';

	export let data;
	$: school = data.school || {};
	$: exam = data.exam || {};
	$: questions = data.questions || [];
	$: attempts = data.attempts || [];
	$: answerMatrixMap = data.answerMatrixMap || {};
	$: questionDiagnostics = data.questionDiagnostics || [];
	$: totalAttempts = data.totalAttempts || 0;
	$: avgScore = data.avgScore || 0;
	$: passPercentage = data.passPercentage || 0;
	$: passCount = data.passCount || 0;
	$: teachers = data.teachers || [];

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

	function getWrongHeatColor(pct: number) {
		if (pct >= 60) return 'bg-rose-100 text-rose-900 font-bold';
		if (pct >= 40) return 'bg-rose-50 text-rose-800 font-semibold';
		if (pct >= 20) return 'bg-amber-50 text-amber-800 font-medium';
		return 'bg-emerald-50 text-emerald-800 font-normal';
	}

	function formatAnswerDisplay(type: string, val: any): string {
		if (val == null || val === '') return '-';

		let parsed = val;
		if (typeof val === 'string') {
			const trimmed = val.trim();
			if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
				try {
					parsed = JSON.parse(trimmed);
				} catch {
					parsed = trimmed;
				}
			} else {
				parsed = trimmed;
			}
		}

		if (Array.isArray(parsed)) {
			return parsed.map(item => String(item).trim().toUpperCase()).join(',');
		}

		if (typeof parsed === 'object' && parsed !== null) {
			if (type === 'benar_salah') {
				return Object.entries(parsed).map(([k, v]) => `${Number(k) + 1}:${String(v).toLowerCase().startsWith('b') || String(v).toLowerCase() === 'true' ? 'B' : 'S'}`).join(' ');
			}
			return Object.entries(parsed).map(([k, v]) => `${k}:${v}`).join(',');
		}

		if (type === 'benar_salah') {
			const str = String(parsed).toLowerCase().trim();
			if (str === 'true' || str === 'benar' || str === 'b' || str === '1') return 'B';
			if (str === 'false' || str === 'salah' || str === 's' || str === '0') return 'S';
		}

		return String(parsed).trim().toUpperCase();
	}

	function getStudentStats(attId: number) {
		let correctCount = 0;
		for (const q of questions) {
			const ans = answerMatrixMap[`${attId}_${q.id}`];
			if (ans && (ans.is_correct === 1 || ans.is_correct === true)) {
				correctCount++;
			}
		}
		const total = questions.length || 1;
		const pct = Math.round((correctCount / total) * 1000) / 10;
		return {
			correctCount,
			total: questions.length,
			ratio: `${correctCount}/${questions.length}`,
			percentage: pct,
			pctStr: `${pct.toString().replace('.', ',')}%`
		};
	}

	$: avgWrongPct = questions.length > 0 ? (Math.round((questionDiagnostics.reduce((acc, q) => acc + q.wrongPercentage, 0) / questions.length) * 10) / 10).toString().replace('.', ',') : '0';
	$: avgCorrectPct = questions.length > 0 ? (Math.round((questionDiagnostics.reduce((acc, q) => acc + q.correctPercentage, 0) / questions.length) * 10) / 10).toString().replace('.', ',') : '0';
</script>

<svelte:head>
	<title>Cetak Analisis Jawaban Siswa — {exam.display_title || exam.title}</title>
</svelte:head>

<!-- CONTROL BAR (Hidden when Printing) -->
<div class="print:hidden sticky top-0 z-50 bg-slate-900 text-white px-4 py-3 shadow-lg flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
	<div class="flex items-center gap-3 flex-wrap">
		<div class="flex items-center gap-2">
			<svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
			</svg>
			<span class="text-xs font-semibold text-slate-300">Guru Pengampu:</span>
			<select
				bind:value={selectedTeacherId}
				class="bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[220px]"
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
					class="bg-slate-700 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44"
				/>
				<input
					type="text"
					bind:value={customTeacherNip}
					placeholder="NIP (opsional)"
					class="bg-slate-700 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-32"
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
			href={`/api/export/jawaban-siswa/${exam.id}`}
			class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-sm"
			title="Download Rekap Jawaban Siswa (Excel .xlsx)"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
			</svg>
			Export Excel
		</a>

		<button
			type="button"
			on:click={() => window.print()}
			class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-md"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
			</svg>
			Cetak / Simpan PDF
		</button>
	</div>
</div>

<!-- Print Document Page Container (F4 / Folio Landscape-Optimized) -->
<div class="p-4 md:p-8 print:p-0 print:m-0 max-w-[297mm] mx-auto bg-white" style="font-family: 'Times New Roman', Times, Arial, serif; font-variant-numeric: lining-nums tabular-nums;">
	<!-- KOP SURAT RESMI -->
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

	<!-- Garis Kop Surat (Garis ganda) -->
	<div class="mt-2 mb-4">
		<div style="border-bottom: 1px solid #000;"></div>
		<div style="border-bottom: 2.5px solid #000; margin-top: 2px;"></div>
	</div>

	<!-- TITLE -->
	<div class="text-center mb-4">
		<h2 class="text-base font-bold uppercase tracking-wide text-slate-900 underline decoration-1 underline-offset-4">
			LAPORAN ANALISIS JAWABAN SISWA & DIAGNOSA POLA KESALAHAN
		</h2>
		<p class="text-xs text-slate-600 mt-1">Tahun Ajaran {new Date().getFullYear()} / {new Date().getFullYear() + 1}</p>
	</div>

	<!-- INFORMASI UJIAN (METADATA) -->
	<div class="border border-slate-800 rounded-md p-3 mb-4 text-xs bg-slate-50/40">
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
				<span class="w-36 font-semibold text-slate-700">Tingkat Ketuntasan (&ge;75)</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{passPercentage}% ({passCount} Siswa Tuntas)</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Kelas / Tingkat</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{exam?.class_name || (exam?.class_level ? `Kelas ${exam.class_level}` : 'Semua Kelas')}</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Rata-rata Skor Ujian</span>
				<span class="mr-2">:</span>
				<span class="font-bold text-slate-900 flex-1">{avgScore} Poin</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Guru Pengampu</span>
				<span class="mr-2">:</span>
				<span class="font-bold text-indigo-900 flex-1">{currentTeacherName}</span>
			</div>
			<div class="flex">
				<span class="w-36 font-semibold text-slate-700">Total Butir Soal</span>
				<span class="mr-2">:</span>
				<span class="font-semibold text-slate-900 flex-1">{questions.length} Butir</span>
			</div>
		</div>
	</div>

	<!-- TABEL 1: MATRIKS JAWABAN SISWA -->
	<div class="mb-5">
		<h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
			<span class="w-2 h-2 rounded-full bg-slate-800"></span>
			I. Matriks Jawaban Siswa per Butir Soal
		</h3>

		<div class="overflow-x-auto">
			<table class="w-full border border-collapse border-black text-[10px] text-center">
				<thead>
					<tr class="bg-slate-100 font-bold">
						<th class="border border-black px-1 py-1 w-8">No</th>
						<th class="border border-black px-2 py-1 text-left min-w-[140px]">Nama Siswa</th>
						<th class="border border-black px-1 py-1 w-14">Kelas</th>
						<th class="border border-black px-1 py-1 w-12">Nilai</th>
						{#each questions as q, idx}
							<th class="border border-black px-0.5 py-1 font-mono text-[9px] min-w-[18px]">
								S{q.question_number || idx + 1}
							</th>
						{/each}
						<th class="border border-black px-1 py-1 w-12 bg-amber-50">Benar</th>
						<th class="border border-black px-1 py-1 w-12 bg-amber-50">%</th>
					</tr>
				</thead>
				<tbody>
					{#each attempts as att, attIdx}
						{@const stats = getStudentStats(att.id)}
						<tr class="border-b border-black">
							<td class="border border-black py-0.5">{attIdx + 1}</td>
							<td class="border border-black px-1.5 py-0.5 text-left font-medium truncate max-w-[140px]">{att.student_name}</td>
							<td class="border border-black py-0.5">{att.class_name || '-'}</td>
							<td class="border border-black py-0.5 font-bold">{att.score != null ? att.score : 0}</td>

							{#each questions as q}
								{@const ans = answerMatrixMap[`${att.id}_${q.id}`]}
								{@const displayAns = formatAnswerDisplay(q.type, ans?.answer_given)}
								{#if !ans || ans.answer_given == null || ans.answer_given === ''}
									<td class="border border-black py-0.5 text-slate-400 bg-slate-50">-</td>
								{:else if ans.is_correct === 1 || ans.is_correct === true}
									<td class="border border-black py-0.5 font-bold text-emerald-800 bg-emerald-50">{displayAns}</td>
								{:else}
									<td class="border border-black py-0.5 font-bold text-rose-800 bg-rose-50">{displayAns}</td>
								{/if}
							{/each}
							<td class="border border-black py-0.5 font-bold bg-amber-50/50">{stats.ratio}</td>
							<td class="border border-black py-0.5 font-bold bg-amber-50/50">{stats.pctStr}</td>
						</tr>
					{/each}
				</tbody>

				<!-- Summary Rows -->
				<tfoot>
					<tr class="font-bold bg-slate-100 border-t border-black">
						<td colspan="4" class="border border-black text-right px-2 py-1">KUNCI JAWABAN RESMI</td>
						{#each questionDiagnostics as q}
							<td class="border border-black py-0.5 text-emerald-900 bg-emerald-100 font-bold">{q.correctKey}</td>
						{/each}
						<td class="border border-black py-0.5 font-bold bg-emerald-100">{questions.length}/{questions.length}</td>
						<td class="border border-black py-0.5 font-bold bg-emerald-100">100%</td>
					</tr>
					<tr class="font-bold bg-slate-50">
						<td colspan="4" class="border border-black text-right px-2 py-1">JUMLAH SISWA BENAR</td>
						{#each questionDiagnostics as q}
							<td class="border border-black py-0.5 text-emerald-700">{q.correctCount}</td>
						{/each}
						<td class="border border-black py-0.5 text-slate-500">-</td>
						<td class="border border-black py-0.5 text-slate-500">-</td>
					</tr>
					<tr class="font-bold bg-slate-50">
						<td colspan="4" class="border border-black text-right px-2 py-1">TINGKAT KESALAHAN (%)</td>
						{#each questionDiagnostics as q}
							<td class="border border-black py-0.5 {getWrongHeatColor(q.wrongPercentage)}">{q.wrongPercentage}%</td>
						{/each}
						<td class="border border-black py-0.5 text-slate-500">-</td>
						<td class="border border-black py-0.5 font-bold text-rose-800">{avgWrongPct}%</td>
					</tr>
					<tr class="font-bold bg-slate-50">
						<td colspan="4" class="border border-black text-right px-2 py-1">TINGKAT BENAR (%)</td>
						{#each questionDiagnostics as q}
							<td class="border border-black py-0.5 text-emerald-800">{q.correctPercentage}%</td>
						{/each}
						<td class="border border-black py-0.5 text-slate-500">-</td>
						<td class="border border-black py-0.5 font-bold text-emerald-800">{avgCorrectPct}%</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>

	<!-- TABEL 2: DIAGNOSA POLA KESALAHAN & JEBAKAN MISKONSEPSI -->
	<div class="mb-5 page-break-inside-avoid">
		<h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1.5">
			<span class="w-2 h-2 rounded-full bg-slate-800"></span>
			II. Diagnosa Pola Kesalahan & Miskonsepsi Utama per Butir Soal
		</h3>

		<table class="w-full border border-collapse border-black text-[10px] text-center">
			<thead>
				<tr class="bg-slate-100 font-bold">
					<th class="border border-black px-1 py-1 w-8">No</th>
					<th class="border border-black px-1 py-1 w-14">No Soal</th>
					<th class="border border-black px-1 py-1 w-20">Tipe</th>
					<th class="border border-black px-1 py-1 w-16">Kunci</th>
					<th class="border border-black px-2 py-1 text-left">Pengecoh Dominan (Jebakan)</th>
					<th class="border border-black px-1 py-1 w-16">% Pengecoh</th>
					<th class="border border-black px-1 py-1 w-16">% Salah</th>
					<th class="border border-black px-1 py-1 w-16">% Akurasi</th>
					<th class="border border-black px-1 py-1 w-14">Benar</th>
					<th class="border border-black px-1 py-1 w-14">Salah</th>
				</tr>
			</thead>
			<tbody>
				{#each questionDiagnostics as q, idx}
					<tr class="border-b border-black">
						<td class="border border-black py-0.5">{idx + 1}</td>
						<td class="border border-black py-0.5 font-bold">Soal #{q.question_number}</td>
						<td class="border border-black py-0.5">{QUESTION_TYPE_LABELS[q.type] || q.type}</td>
						<td class="border border-black py-0.5 font-bold text-emerald-800 bg-emerald-50">{q.correctKey}</td>
						<td class="border border-black px-2 py-0.5 text-left font-semibold text-rose-800">
							{q.dominantDistractor !== '-' ? `Opsi ${q.dominantDistractor}` : '-'}
						</td>
						<td class="border border-black py-0.5">{q.dominantDistractor !== '-' ? `${q.dominantDistractorPct}%` : '0%'}</td>
						<td class="border border-black py-0.5 font-bold {q.wrongPercentage >= 50 ? 'text-rose-700 bg-rose-50' : ''}">{q.wrongPercentage}%</td>
						<td class="border border-black py-0.5 font-semibold text-emerald-800">{q.correctPercentage}%</td>
						<td class="border border-black py-0.5">{q.correctCount}</td>
						<td class="border border-black py-0.5">{q.wrongCount + q.emptyCount}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- TANDA TANGAN RESMI -->
	<div class="mt-8 pt-4 flex justify-between text-xs font-serif break-inside-avoid">
		<!-- Mengetahui Kepala Madrasah -->
		<div class="text-center w-64">
			<p class="m-0">Mengetahui,</p>
			<p class="font-bold m-0 mt-0.5">Kepala {school?.name || 'Madrasah'}</p>
			<div class="h-20"></div>
			<p class="font-bold underline uppercase m-0 leading-none">
				{school?.principal_name || '......................................................'}
			</p>
			<p class="m-0 mt-1 leading-none">
				NIP. {school?.principal_nip || '............................................'}
			</p>
		</div>

		<!-- Guru Pengampu / Pembuat Laporan -->
		<div class="text-center w-64">
			<p class="m-0">{school?.city || 'Tempat'}, {formatDateNow()}</p>
			<p class="font-bold m-0 mt-0.5">Guru Pengampu Mata Pelajaran,</p>
			<div class="h-20"></div>
			<p class="font-bold underline uppercase m-0 leading-none">
				{currentTeacherName}
			</p>
			<p class="m-0 mt-1 leading-none">
				NIP. {currentTeacherNip}
			</p>
		</div>
	</div>
</div>

<style>
	@media print {
		@page {
			size: 215.9mm 330mm landscape;
			margin: 10mm;
		}
		body {
			background: white !important;
			color: black !important;
			font-family: 'Times New Roman', Times, Arial, serif !important;
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		}
	}
</style>
