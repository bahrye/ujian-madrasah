<script lang="ts">
	import { parseDate } from '$lib/utils/date';

	export let data;
	$: school = data.school as any;
	$: exam = data.exam as any;
	$: students = (data.students || []) as any[];
	$: totalQuestions = data.totalQuestions as number;
	$: totalExamPoints = data.totalExamPoints as number;
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

	// Format Date
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

	function formatTimeOnly(dateStr: string | null) {
		if (!dateStr) return '—';
		const d = parseDate(dateStr);
		if (isNaN(d.getTime())) return '—';
		const h = String(d.getHours()).padStart(2, '0');
		const m = String(d.getMinutes()).padStart(2, '0');
		return `${h}:${m}`;
	}

	function formatGeneratedDate() {
		const now = new Date();
		const dStr = now.toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
		const h = String(now.getHours()).padStart(2, '0');
		const m = String(now.getMinutes()).padStart(2, '0');
		return `${dStr}, ${h}:${m}`;
	}

	// Location string exactly matching berita-acara
	$: locationStr = [
		school?.district ? `Kecamatan ${school.district}` : '',
		school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kabupaten ${school.city}`) : '',
		school?.province ? school.province : ''
	].filter(Boolean).join(', ');

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
	<title>Laporan Hasil Ujian Peserta — {exam?.title || 'Ujian'}</title>
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
		.break-before-page {
			break-before: page;
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
		padding: 4px 8px;
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
		<div class="text-xs text-slate-300">
			Laporan Hasil Ujian per Peserta (1 Peserta 1 Halaman). Total: <strong>{evaluatedStudents.length} Siswa</strong>
		</div>

		<!-- Teacher Selector -->
		<div class="flex items-center gap-2">
			<label for="teacher-select" class="text-xs text-slate-300 font-semibold flex items-center gap-1">
				<svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				</svg>
				Guru Mapel:
			</label>
			<select
				id="teacher-select"
				bind:value={selectedTeacherId}
				class="bg-slate-700 text-white text-xs rounded-lg px-3 py-1.5 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[240px]"
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

<!-- Print Document Pages (1 Siswa = 1 Halaman) -->
{#if evaluatedStudents.length === 0}
	<div class="p-12 text-center text-slate-400 font-serif">
		Belum ada siswa yang menyelesaikan ujian ini.
	</div>
{:else}
	{#each evaluatedStudents as s, idx}
		<div
			class="p-4 md:p-8 print:p-0 print:m-0 max-w-[215.9mm] mx-auto bg-white text-slate-900 {idx > 0 ? 'break-before-page pt-8 print:pt-0' : ''}"
			style="font-family: 'Times New Roman', Times, Arial, serif; font-variant-numeric: lining-nums tabular-nums;"
		>
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

			<!-- JUDUL DOKUMEN -->
			<div class="text-center mb-4">
				<h2 class="text-base sm:text-lg font-black uppercase tracking-wider text-black underline decoration-1 underline-offset-4 m-0">
					LAPORAN HASIL UJIAN PESERTA
				</h2>
				<p class="text-xs sm:text-sm font-semibold text-black mt-1 m-0 uppercase">
					{exam?.exam_type_name || exam?.exam_type_code || 'Ulangan Harian'}
				</p>
			</div>

			<!-- INFORMASI METADATA SISWA & UJIAN (2 KOLOM PERSIS GAMBAR) -->
			<div class="mb-4 text-xs sm:text-sm leading-relaxed">
				<table class="w-full border-0">
					<tbody>
						<tr>
							<!-- Kolom Kiri -->
							<td class="w-[50%] align-top p-0 pr-4">
								<table class="w-full border-0">
									<tbody>
										<tr>
											<td class="w-28 font-semibold py-0.5">Nama peserta</td>
											<td class="w-3">:</td>
											<td class="font-normal py-0.5">
												<div>{s.studentName}</div>
												{#if s.nomorPeserta && s.nomorPeserta !== '-'}
													<div class="text-[10px] text-slate-600 font-mono mt-0.5 leading-none" title="No. Peserta">{s.nomorPeserta}</div>
												{/if}
											</td>
										</tr>
										<tr>
											<td class="font-semibold py-0.5">NISN</td>
											<td>:</td>
											<td class="font-normal py-0.5 font-mono">{s.nisn}</td>
										</tr>
										<tr>
											<td class="font-semibold py-0.5">Kelas / Ruang</td>
											<td>:</td>
											<td class="font-normal py-0.5">{s.className} / {s.roomName}</td>
										</tr>
										<tr>
											<td class="font-semibold py-0.5">Dikumpulkan</td>
											<td>:</td>
											<td class="font-normal py-0.5">{formatTimeOnly(s.submitTime)} WIB</td>
										</tr>
									</tbody>
								</table>
							</td>

							<!-- Kolom Kanan -->
							<td class="w-[50%] align-top p-0 pl-4">
								<table class="w-full border-0">
									<tbody>
										<tr>
											<td class="w-28 font-semibold py-0.5">Mata pelajaran</td>
											<td class="w-3">:</td>
											<td class="font-normal py-0.5">{exam?.subject_name || 'Umum'}</td>
										</tr>
										<tr>
											<td class="font-semibold py-0.5">Guru</td>
											<td>:</td>
											<td class="font-normal py-0.5">{currentTeacherName}</td>
										</tr>
										<tr>
											<td class="font-semibold py-0.5">Tanggal ujian</td>
											<td>:</td>
											<td class="font-normal py-0.5">{formatExamDate(s.startTime || exam?.start_time)}</td>
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

			<!-- TABEL 1: KOMPONEN PENILAIAN -->
			<div class="mb-4 overflow-hidden">
				<table class="print-table">
					<thead>
						<tr>
							<th class="w-12">No</th>
							<th>Komponen penilaian</th>
							<th class="w-36">Hasil</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="text-center">1</td>
							<td>Jumlah soal</td>
							<td class="text-center font-semibold">{totalQuestions}</td>
						</tr>
						<tr>
							<td class="text-center">2</td>
							<td>Jawaban benar</td>
							<td class="text-center font-semibold">{s.correctCount}</td>
						</tr>
						<tr>
							<td class="text-center">3</td>
							<td>Jawaban salah</td>
							<td class="text-center font-semibold">{s.incorrectCount}</td>
						</tr>
						<tr>
							<td class="text-center">4</td>
							<td>Total poin diperoleh</td>
							<td class="text-center font-semibold font-mono">{s.earnedPoints} / {s.totalExamPoints}</td>
						</tr>
						<tr>
							<td class="text-center font-bold">5</td>
							<td class="font-bold">Nilai akhir</td>
							<td class="text-center font-black text-sm">{s.score}</td>
						</tr>
						<tr>
							<td class="text-center">6</td>
							<td>Keterangan</td>
							<td class="text-center font-medium">{s.keterangan}</td>
						</tr>
						<tr>
							<td class="text-center">7</td>
							<td>Catatan pelanggaran pengawasan</td>
							<td class="text-center">{s.violationCount} kejadian</td>
						</tr>
						<tr>
							<td class="text-center">8</td>
							<td>Status pengumpulan</td>
							<td class="text-center">{s.statusPengumpulan}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- TABEL 2: RINCIAN PELANGGARAN (JIKA ADA) -->
			{#if s.violations && s.violations.length > 0}
				<div class="mb-4">
					<h4 class="text-xs sm:text-sm font-bold text-black mb-1.5">Rincian pelanggaran</h4>
					<table class="print-table">
						<thead>
							<tr>
								<th class="w-10">No</th>
								<th class="w-36">Waktu</th>
								<th>Jenis pelanggaran</th>
								<th>Keterangan sistem</th>
							</tr>
						</thead>
						<tbody>
							{#each s.violations as v}
								<tr>
									<td class="text-center font-semibold">{v.no}</td>
									<td class="text-center font-mono text-xs">{v.waktu}</td>
									<td>{v.jenis}</td>
									<td>{v.keterangan}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<!-- CATATAN FOOTER OTOMATIS -->
			<div class="mb-6 text-xs text-slate-700 italic">
				Catatan: laporan ini dihasilkan otomatis oleh CBT Madrasah pada {formatGeneratedDate()}.
			</div>

			<!-- TANDA TANGAN 2 KOLOM -->
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
	{/each}
{/if}
