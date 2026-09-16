<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	import { page } from '$app/stores';

	export let data;
	$: school = data.school as any;
	$: exam = data.exam as any;
	$: students = (data.students || []) as any[];
	$: totalStudents = data.totalStudents as number;
	$: totalQuestions = data.totalQuestions as number;
	$: stats = data.stats as any;
	$: sessions = (data.sessions || []) as any[];
	$: teachers = (data.teachers || []) as any[];

	// KKM reactivity
	let currentKkm = data.kkm || 75;

	$: evaluatedStudents = students.map((s) => {
		const numScore = parseFloat(s.score);
		const isPassed = numScore >= currentKkm;
		return {
			...s,
			isPassed,
			keterangan: isPassed ? 'Tuntas' : 'Belum tuntas'
		};
	});

	$: dynamicPassedCount = evaluatedStudents.filter((s) => s.isPassed).length;
	$: dynamicPassedPercentage = totalStudents > 0 ? ((dynamicPassedCount / totalStudents) * 100).toFixed(1) : '0.0';

	// Teacher Selection for Signature
	let selectedTeacherId = '';
	let customTeacherName = '';
	let customTeacherNip = '';

	$: if (!selectedTeacherId && data?.exam) {
		selectedTeacherId = data.exam.created_by
			? String(data.exam.created_by)
			: data.teachers?.[0]?.id
				? String(data.teachers[0].id)
				: '';
	}

	$: selectedTeacher = teachers.find((t) => String(t.id) === String(selectedTeacherId));
	$: currentTeacherName =
		selectedTeacherId === 'custom'
			? customTeacherName || '......................................................'
			: selectedTeacher
				? selectedTeacher.name
				: exam?.created_by_name || 'Budi Santoso, S.Pd.';
	$: currentTeacherNip =
		selectedTeacherId === 'custom'
			? customTeacherNip || '............................................'
			: selectedTeacher
				? selectedTeacher.nip || '............................................'
				: exam?.created_by_nip || '............................................';

	// Format Exam Date
	function formatExamDate(dateStr: string | null) {
		if (!dateStr) {
			return new Date().toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});
		}
		const d = parseDate(dateStr);
		if (isNaN(d.getTime())) {
			return new Date().toLocaleDateString('id-ID', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			});
		}
		return d.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}

	function formatTime(str: string | null) {
		if (!str) return '';
		const s = String(str).trim();
		if (s.includes('T')) return s.split('T')[1].slice(0, 5);
		if (s.includes(' ')) return s.split(' ')[1].slice(0, 5);
		if (s.includes(':')) return s.slice(0, 5);
		return s;
	}

	// Session display
	$: sessionStr = (() => {
		if (sessions.length > 0 && sessions[0].start_time && sessions[0].end_time) {
			return `${sessions[0].session_number} (${formatTime(sessions[0].start_time)}–${formatTime(sessions[0].end_time)})`;
		}
		if (exam?.start_time && exam?.end_time) {
			return `1 (${formatTime(exam.start_time)}–${formatTime(exam.end_time)})`;
		}
		return '1';
	})();

	// Class Subtitle
	$: classSubtitle = (() => {
		if (exam?.class_name) return `Kelas ${exam.class_name}`;
		const uniqueClasses = Array.from(new Set(students.map((s) => s.className).filter((c) => c && c !== '-')));
		if (uniqueClasses.length === 1) return `Kelas ${uniqueClasses[0]}`;
		return 'Semua Kelas Peserta';
	})();

	// Location string exactly matching berita-acara
	$: locationStr = [
		school?.district ? `Kecamatan ${school.district}` : '',
		school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kabupaten ${school.city}`) : '',
		school?.province ? school.province : ''
	].filter(Boolean).join(', ');

	// Location City for Signature
	$: locationCity = school?.city
		? school.city.replace(/^(kab\.|kabupaten|kota)\s+/i, '')
		: school?.address
			? school.address.split(',')[0].trim()
			: 'Nusantara';

	$: formattedToday = new Date().toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
</script>

<svelte:head>
	<title>Daftar Nilai Ujian — {exam?.title || 'Ujian'}</title>
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
			margin: 1.2cm 1.5cm;
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
		border: 1px solid #111827;
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
	<div class="flex items-center gap-4 flex-wrap">
		<!-- Teacher Selector -->
		<div class="flex items-center gap-2">
			<label for="teacher-select" class="text-xs text-slate-300 font-semibold flex items-center gap-1">
				<svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				Guru Mata Pelajaran:
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

		<!-- KKM Input -->
		<div class="flex items-center gap-1.5 text-xs text-slate-300">
			<span class="font-semibold">KKM:</span>
			<input
				type="number"
				min="0"
				max="100"
				bind:value={currentKkm}
				class="w-14 bg-slate-700 text-white text-xs rounded-lg px-2 py-1 border border-slate-600 text-center font-bold"
			/>
		</div>
	</div>

	<div class="flex items-center gap-2">
		<button
			type="button"
			on:click={() => window.close()}
			class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors cursor-pointer"
		>
			Tutup
		</button>

		<button
			type="button"
			on:click={() => window.print()}
			class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow cursor-pointer"
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
			</svg>
			Cetak / Simpan PDF
		</button>
	</div>
</div>

<!-- Print Document Page Container (F4 / Folio) -->
<div class="p-4 md:p-8 print:p-0 print:m-0 max-w-[215.9mm] mx-auto bg-white text-slate-900" style="font-family: 'Times New Roman', Times, Arial, serif; font-variant-numeric: lining-nums tabular-nums;">
	
	<!-- KOP SURAT (SAMA PERSIS DENGAN KOP SURAT BERITA ACARA DI DAFTAR UJIAN) -->
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
				{school?.name || 'NAMA MADRASAH'}
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

	<!-- Garis Kop Surat (Tipis atas, Agak tebal bawah persis berita acara) -->
	<div class="mt-2 mb-3">
		<div class="border-b-2 border-black w-full"></div>
		<div class="border-b border-black w-full mt-0.5"></div>
	</div>

	<!-- 2. JUDUL DOKUMEN -->
	<div class="text-center mb-5">
		<h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-black underline decoration-1 underline-offset-4 m-0">
			DAFTAR NILAI UJIAN
		</h2>
		<p class="text-xs sm:text-sm font-semibold text-black mt-1 m-0">
			{exam?.exam_type_name || exam?.exam_type_code || 'Ulangan Harian'} — {exam?.title || 'Ujian'} — {classSubtitle}
		</p>
	</div>

	<!-- 3. INFORMASI UJIAN (METADATA DUA KOLOM PERSIS GAMBAR) -->
	<div class="mb-4 text-xs sm:text-sm leading-relaxed">
		<table class="w-full border-0">
			<tbody>
				<tr>
					<!-- Kolom Kiri -->
					<td class="w-[50%] align-top p-0 pr-4">
						<table class="w-full border-0">
							<tbody>
								<tr>
									<td class="w-36 font-semibold py-0.5">Mata pelajaran</td>
									<td class="w-3">:</td>
									<td class="font-normal py-0.5">{exam?.subject_name || 'Umum'}</td>
								</tr>
								<tr>
									<td class="font-semibold py-0.5">Tanggal</td>
									<td>:</td>
									<td class="font-normal py-0.5">{formatExamDate(exam?.start_time)}</td>
								</tr>
								<tr>
									<td class="font-semibold py-0.5">Jumlah soal / durasi</td>
									<td>:</td>
									<td class="font-normal py-0.5">{totalQuestions} soal / {exam?.duration_minutes || 60} menit</td>
								</tr>
								<tr>
									<td class="font-semibold py-0.5">Peserta</td>
									<td>:</td>
									<td class="font-normal py-0.5">{totalStudents} orang</td>
								</tr>
							</tbody>
						</table>
					</td>

					<!-- Kolom Kanan -->
					<td class="w-[50%] align-top p-0 pl-4">
						<table class="w-full border-0">
							<tbody>
								<tr>
									<td class="w-16 font-semibold py-0.5">Guru</td>
									<td class="w-3">:</td>
									<td class="font-normal py-0.5">{currentTeacherName}</td>
								</tr>
								<tr>
									<td class="font-semibold py-0.5">Sesi</td>
									<td>:</td>
									<td class="font-normal py-0.5">{sessionStr}</td>
								</tr>
								<tr>
									<td class="font-semibold py-0.5">KKM</td>
									<td>:</td>
									<td class="font-normal py-0.5">{currentKkm}</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- 4. TABEL DAFTAR NILAI SISWA (PERSIS GAMBAR) -->
	<div class="mb-3 overflow-hidden">
		<table class="print-table">
			<thead>
				<tr>
					<th class="w-10">No</th>
					<th>Nama peserta</th>
					<th class="w-24">NISN</th>
					<th class="w-24">Kelas</th>
					<th class="w-20">Ruang</th>
					<th class="w-16">Benar</th>
					<th class="w-16">Salah</th>
					<th class="w-20">Nilai</th>
					<th class="w-28">Keterangan</th>
				</tr>
			</thead>
			<tbody>
				{#if evaluatedStudents.length === 0}
					<tr>
						<td colspan="9" class="text-center py-6 text-slate-400 italic">
							Belum ada data peserta yang menyelesaikan ujian.
						</td>
					</tr>
				{:else}
					{#each evaluatedStudents as s}
						<tr>
							<td class="text-center font-bold">{s.no}</td>
							<td class="font-semibold">{s.studentName}</td>
							<td class="text-center font-mono text-xs">{s.nisn}</td>
							<td class="text-center">{s.className}</td>
							<td class="text-center">{s.roomName}</td>
							<td class="text-center font-bold">{s.correctCount}</td>
							<td class="text-center font-bold">{s.incorrectCount}</td>
							<td class="text-center font-bold">{s.score}</td>
							<td class="text-center font-medium">{s.keterangan}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- 5. STATISTIK & KETERANGAN DI BAWAH TABEL -->
	<div class="mb-8 text-xs sm:text-sm">
		<p class="m-0 font-bold leading-normal">
			<span>Rata-rata: {stats.meanScore}</span>
			<span class="mx-3 sm:mx-4">Tertinggi: {stats.maxScore}</span>
			<span class="mx-3 sm:mx-4">Terendah: {stats.minScore}</span>
			<span class="ml-3 sm:ml-4">Tuntas: {dynamicPassedCount} dari {totalStudents} peserta dinilai ({dynamicPassedPercentage}%)</span>
		</p>
		<p class="m-0 text-xs text-slate-700 mt-2 italic leading-normal">
			Nilai dihitung dari total poin jawaban dibagi total poin maksimal dikali 100, termasuk hasil koreksi uraian oleh guru.
		</p>
	</div>

	<!-- 6. TANDA TANGAN DUA KOLOM (KEPALA SEKOLAH & GURU MAPEL) -->
	<div class="w-full text-xs sm:text-sm leading-normal break-inside-avoid">
		<table class="w-full border-0">
			<tbody>
				<tr>
					<!-- Tanda Tangan Kiri: Kepala Sekolah -->
					<td class="w-[50%] align-top text-center p-0">
						<p class="m-0">Mengetahui,</p>
						<p class="m-0">Kepala {school?.name || 'SMA Negeri 1 Nusantara'}</p>
						
						<!-- Ruang Tanda Tangan (~65px) -->
						<div class="h-20 sm:h-24"></div>

						<p class="m-0 font-bold underline underline-offset-2">
							{school?.principal_name || 'Drs. H. Ahmad Subarjo, M.Pd.'}
						</p>
						<p class="m-0 text-xs">
							NIP. {school?.principal_nip || school?.nip || '196804121994031005'}
						</p>
					</td>

					<!-- Tanda Tangan Kanan: Guru Mata Pelajaran -->
					<td class="w-[50%] align-top text-center p-0">
						<p class="m-0">{locationCity}, {formattedToday}</p>
						<p class="m-0">Guru mata pelajaran</p>

						<!-- Ruang Tanda Tangan (~65px) -->
						<div class="h-20 sm:h-24"></div>

						<p class="m-0 font-bold underline underline-offset-2">
							{currentTeacherName}
						</p>
						<p class="m-0 text-xs">
							NIP. {currentTeacherNip}
						</p>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

</div>
