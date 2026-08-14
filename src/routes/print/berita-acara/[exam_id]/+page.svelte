<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	export let data;
	$: school = data.school as any;
	$: exam = data.exam as any;
	$: participantsGrouped = data.participantsGrouped as Record<string, Record<number, number>>;
	$: isNomorPesertaMode = data.isNomorPesertaMode;
	$: sessionMap = data.sessionMap as Record<number, { start_time: string | null; end_time: string | null }>;
	$: proctorOptions = (data.proctorOptions || []) as any[];

	let proctor1Id = data.defaultProctor1Id || (proctorOptions[0]?.id || '');
	let proctor2Id = data.defaultProctor2Id || '';
	let proctorTechId = '';
	let committeeId = '';

	$: proctor1 = proctorOptions.find(p => String(p.id) === String(proctor1Id));
	$: proctor2 = proctorOptions.find(p => String(p.id) === String(proctor2Id));
	$: proctorTech = proctorOptions.find(p => String(p.id) === String(proctorTechId));
	$: committee = proctorOptions.find(p => String(p.id) === String(committeeId));

	function resolveStart(sessionData: any, exam: any) {
		if (sessionData?.start_time && sessionData.start_time.trim()) {
			const s = sessionData.start_time.trim();
			if (s.includes('-') || s.includes('/')) return s;
			const baseDateStr = exam?.start_time || exam?.exam_type_start_time || new Date().toISOString().slice(0, 10);
			const datePart = baseDateStr.split(/[T ]/)[0];
			return `${datePart}T${s.slice(0, 5)}:00`;
		}

		if (exam?.start_time && exam.start_time.trim()) {
			return exam.start_time.trim();
		}

		if (exam?.exam_type_start_time && exam.exam_type_start_time.trim()) {
			return exam.exam_type_start_time.trim();
		}

		return null;
	}

	function resolveEnd(sessionData: any, exam: any) {
		if (sessionData?.end_time && sessionData.end_time.trim()) {
			const s = sessionData.end_time.trim();
			if (s.includes('-') || s.includes('/')) return s;
			const baseDateStr = exam?.end_time || exam?.start_time || exam?.exam_type_end_time || new Date().toISOString().slice(0, 10);
			const datePart = baseDateStr.split(/[T ]/)[0];
			return `${datePart}T${s.slice(0, 5)}:00`;
		}

		if (exam?.end_time && exam.end_time.trim()) {
			return exam.end_time.trim();
		}

		if (exam?.exam_type_end_time && exam.exam_type_end_time.trim()) {
			return exam.exam_type_end_time.trim();
		}

		return null;
	}

	function getAcademicYear(dateStr: string | null) {
		if (!dateStr) return '2025/2026';
		const d = parseDate(dateStr);
		const validDate = isNaN(d.getTime()) ? new Date() : d;
		const year = validDate.getFullYear();
		const month = validDate.getMonth() + 1; // 1 to 12
		if (month >= 7) {
			return `${year}/${year + 1}`;
		} else {
			return `${year - 1}/${year}`;
		}
	}

	function getDayName(dateStr: string | null) {
		if (!dateStr) return '................';
		const d = parseDate(dateStr);
		if (isNaN(d.getTime())) return '................';
		return d.toLocaleDateString('id-ID', { weekday: 'long' });
	}

	function getDayNumber(dateStr: string | null) {
		if (!dateStr) return '......';
		const d = parseDate(dateStr);
		if (isNaN(d.getTime())) return '......';
		return d.getDate().toString();
	}

	function getMonthName(dateStr: string | null) {
		if (!dateStr) return '................';
		const d = parseDate(dateStr);
		if (isNaN(d.getTime())) return '................';
		return d.toLocaleDateString('id-ID', { month: 'long' });
	}

	function getYearNumber(dateStr: string | null) {
		if (!dateStr) return '..........';
		const d = parseDate(dateStr);
		if (isNaN(d.getTime())) return '..........';
		return d.getFullYear().toString();
	}

	function formatDateFull(dateStr: string | null) {
		if (!dateStr) return '......................';
		const date = parseDate(dateStr);
		if (isNaN(date.getTime())) return '......................';
		return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	}

	function formatTime(timeStr: string | null) {
		if (!timeStr) return '....';
		const str = String(timeStr).trim();
		if (str.includes('T')) return str.split('T')[1].slice(0, 5).replace(':', '.');
		if (str.includes(' ')) return str.split(' ')[1].slice(0, 5).replace(':', '.');
		if (str.includes(':')) return str.slice(0, 5).replace(':', '.');
		return str;
	}
</script>

<svelte:head>
	<title>Berita Acara - {exam.exam_type_name || exam.title}</title>
</svelte:head>

<style>
	@media print {
		@page { 
			size: A4;
			margin: 1cm; 
		}
		:global(body) {
			margin: 0;
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
	}
</style>

<!-- Control Bar -->
<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
	<div class="flex items-center gap-4 flex-wrap">
		<span class="text-xs font-semibold uppercase tracking-wider text-slate-300">Pengaturan TTD Petugas:</span>
		
		<div class="flex items-center gap-1.5">
			<label for="p1-select" class="text-xs text-slate-300 font-medium">Pengawas 1:</label>
			<select id="p1-select" bind:value={proctor1Id} class="bg-slate-700 text-white text-xs border border-slate-600 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-400 max-w-[140px]">
				<option value="">-- Pilih Pengawas 1 --</option>
				{#each proctorOptions as p}
					<option value={p.id}>{p.name}</option>
				{/each}
			</select>
		</div>

		<div class="flex items-center gap-1.5">
			<label for="p2-select" class="text-xs text-slate-300 font-medium">Pengawas 2:</label>
			<select id="p2-select" bind:value={proctor2Id} class="bg-slate-700 text-white text-xs border border-slate-600 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-400 max-w-[140px]">
				<option value="">-- Kosongkan --</option>
				{#each proctorOptions as p}
					<option value={p.id}>{p.name}</option>
				{/each}
			</select>
		</div>

		<div class="flex items-center gap-1.5">
			<label for="pt-select" class="text-xs text-slate-300 font-medium">Proktor/Teknisi:</label>
			<select id="pt-select" bind:value={proctorTechId} class="bg-slate-700 text-white text-xs border border-slate-600 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-400 max-w-[140px]">
				<option value="">-- Kosongkan --</option>
				{#each proctorOptions as p}
					<option value={p.id}>{p.name}</option>
				{/each}
			</select>
		</div>

		<div class="flex items-center gap-1.5">
			<label for="cm-select" class="text-xs text-slate-300 font-medium">Panitia Ujian:</label>
			<select id="cm-select" bind:value={committeeId} class="bg-slate-700 text-white text-xs border border-slate-600 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-400 max-w-[140px]">
				<option value="">-- Kosongkan --</option>
				{#each proctorOptions as p}
					<option value={p.id}>{p.name}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="flex items-center gap-2">
		<button class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors" on:click={() => window.close()}>Tutup</button>
		<button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow" on:click={() => window.print()}>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
			</svg>
			Cetak Berita Acara
		</button>
	</div>
</div>

<div class="p-4 md:p-8 max-w-4xl mx-auto font-serif text-[15px] leading-snug print:p-0 print:m-0 bg-white">
{#each Object.entries(participantsGrouped) as [roomName, sessionsDict], roomIdx}
	{#each Object.entries(sessionsDict) as [sessionNumStr, count], sessionIdx}
		{@const sessionNum = parseInt(sessionNumStr)}
		{@const sessionData = sessionMap?.[sessionNum]}
		{@const effectiveStart = resolveStart(sessionData, exam)}
		{@const effectiveEnd = resolveEnd(sessionData, exam)}
		{@const locationStr = [
			school?.district ? `Kecamatan ${school.district}` : '',
			school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kabupaten ${school.city}`) : '',
			school?.province ? school.province : ''
		].filter(Boolean).join(', ')}
		{@const locationCity = school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kab. ${school.city}`) : '....................'}
		{@const activeOfficers = [
			{ role: 'Pengawas I', data: proctor1, id: 'p1' },
			{ role: 'Pengawas II', data: proctor2, id: 'p2' },
			{ role: 'Proktor / Teknisi', data: proctorTech, id: 'pt' },
			{ role: 'Panitia Ujian', data: committee, id: 'cm' }
		].filter(o => (o.id === 'p1' && proctor1Id) || (o.id !== 'p1' && o.data))}

		<div class={roomIdx > 0 || sessionIdx > 0 ? "break-before-page pt-8" : ""}>
			<!-- Kop Surat -->
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

			<!-- Judul -->
			<div class="text-center mb-6">
				<h1 class="font-bold text-lg uppercase underline tracking-wider mb-1">BERITA ACARA PELAKSANAAN UJIAN</h1>
				<p class="text-sm font-medium">Tahun Ajaran {getAcademicYear(effectiveStart)}</p>
			</div>

			<!-- Isu/Paragraf Pembuka -->
			<p class="mb-4 text-justify">
				Pada hari ini <span class="border-b border-dotted border-black px-2">{getDayName(effectiveStart)}</span> 
				tanggal <span class="border-b border-dotted border-black px-2">{getDayNumber(effectiveStart)}</span> 
				bulan <span class="border-b border-dotted border-black px-2">{getMonthName(effectiveStart)}</span> 
				tahun <span class="border-b border-dotted border-black px-2">{getYearNumber(effectiveStart)}</span>, 
				telah diselenggarakan <strong class="uppercase">{exam.exam_type_name || exam.title}</strong> Mata Pelajaran <strong>{exam.subject_name || 'Umum'}</strong> untuk:
			</p>

			<!-- Tabel Info Ruang & Waktu -->
			<div class="ml-4 mb-6">
				<table class="w-full">
					<tbody>
						<tr class="align-top"><td class="w-48 py-1">a. Satuan Pendidikan</td><td class="w-4 py-1">:</td><td class="py-1 font-bold uppercase">{school?.name || '-'}</td></tr>
						<tr class="align-top"><td class="py-1">b. Ruang / Sesi Ujian</td><td class="py-1">:</td><td class="py-1 font-bold">{roomName} / Sesi {sessionNum}</td></tr>
						<tr class="align-top"><td class="py-1">c. Waktu Pelaksanaan</td><td class="py-1">:</td><td class="py-1">{formatTime(effectiveStart)} s.d. {formatTime(effectiveEnd)} WIB</td></tr>
						<tr class="align-top"><td class="py-1">d. Jumlah Peserta Seharusnya</td><td class="py-1">:</td><td class="py-1">{count} Orang</td></tr>
						<tr class="align-top"><td class="py-1">e. Jumlah Peserta Hadir</td><td class="py-1">:</td><td class="py-1">........... Orang</td></tr>
						<tr class="align-top"><td class="py-1">f. Jumlah Peserta Tidak Hadir</td><td class="py-1">:</td><td class="py-1">........... Orang</td></tr>
						<tr class="align-top">
							<td class="py-1.5 pl-4 text-sm font-sans" colspan="3">
								<div class="flex items-baseline gap-2">
									<span>- Nomor Peserta yang Tidak Hadir:</span>
									<span class="border-b border-dotted border-black flex-1 min-h-[1.2rem]"></span>
								</div>
								<div class="mt-1.5">
									<span class="border-b border-dotted border-black block w-full min-h-[1.2rem]"></span>
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Catatan / Kejadian Penting -->
			<div class="mb-6">
				<p class="mb-2 font-bold">Catatan / Kejadian Penting Selama Ujian Berlangsung:</p>
				<div class="border border-black p-3 min-h-[90px] text-xs font-mono text-slate-500 rounded">
					<span class="print:hidden">( Kosongkan jika pelaksanaan ujian berjalan tertib dan lancar )</span>
				</div>
			</div>

			<p class="mb-8">
				Demikian Berita Acara ini dibuat dengan sesungguhnya untuk dipergunakan sebagaimana mestinya.
			</p>

			<!-- TTD Petugas & Kepala Madrasah (2-Column Grid Alignment System) -->
			<div class="mt-8 text-sm font-serif">
				{#if activeOfficers.length <= 1}
					<!-- CASE 1: 1 Officer (Pengawas Ruang) -->
					<div class="grid grid-cols-2 gap-8 text-center">
						<!-- Left Column: Kepala Madrasah -->
						<div>
							<div class="h-6"></div>
							<p class="font-medium mb-14">Kepala Madrasah,</p>
							<p class="border-b border-black font-bold inline-block px-3">{school?.principal_name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {school?.principal_nip || '..............................'}</p>
						</div>

						<!-- Right Column: Date + Pengawas Ruang -->
						<div>
							<p class="text-xs text-slate-700 mb-1">{locationCity}, {formatDateFull(effectiveStart)}</p>
							<p class="font-medium mb-14">{activeOfficers[0]?.role === 'Pengawas I' ? 'Pengawas Ruang' : (activeOfficers[0]?.role || 'Pengawas Ruang')},</p>
							<p class="border-b border-black font-bold inline-block px-3">{activeOfficers[0]?.data?.name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {activeOfficers[0]?.data?.nip || '..............................'}</p>
						</div>
					</div>

				{:else if activeOfficers.length === 2}
					<!-- CASE 2: 2 Officers (Pengawas I & Pengawas II) -->
					<div class="grid grid-cols-2 gap-8 text-center">
						<!-- Row 1 Left: Pengawas I -->
						<div>
							<div class="h-6"></div>
							<p class="font-medium mb-14">{activeOfficers[0].role},</p>
							<p class="border-b border-black font-bold inline-block px-3">{activeOfficers[0].data?.name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {activeOfficers[0].data?.nip || '..............................'}</p>
						</div>

						<!-- Row 1 Right: Date + Pengawas II -->
						<div>
							<p class="text-xs text-slate-700 mb-1">{locationCity}, {formatDateFull(effectiveStart)}</p>
							<p class="font-medium mb-14">{activeOfficers[1].role},</p>
							<p class="border-b border-black font-bold inline-block px-3">{activeOfficers[1].data?.name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {activeOfficers[1].data?.nip || '..............................'}</p>
						</div>

						<!-- Row 2 Left: Empty Spacer -->
						<div></div>

						<!-- Row 2 Right: Kepala Madrasah -->
						<div class="mt-4">
							<p class="font-medium mb-14">Kepala Madrasah,</p>
							<p class="border-b border-black font-bold inline-block px-3">{school?.principal_name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {school?.principal_nip || '..............................'}</p>
						</div>
					</div>

				{:else if activeOfficers.length === 3}
					<!-- CASE 3: 3 Officers (Pengawas I, Pengawas II, Panitia/Proktor) -->
					<div class="grid grid-cols-2 gap-8 text-center">
						<!-- Row 1 Left: Pengawas I -->
						<div>
							<div class="h-6"></div>
							<p class="font-medium mb-14">{activeOfficers[0].role},</p>
							<p class="border-b border-black font-bold inline-block px-3">{activeOfficers[0].data?.name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {activeOfficers[0].data?.nip || '..............................'}</p>
						</div>

						<!-- Row 1 Right: Date + Pengawas II -->
						<div>
							<p class="text-xs text-slate-700 mb-1">{locationCity}, {formatDateFull(effectiveStart)}</p>
							<p class="font-medium mb-14">{activeOfficers[1].role},</p>
							<p class="border-b border-black font-bold inline-block px-3">{activeOfficers[1].data?.name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {activeOfficers[1].data?.nip || '..............................'}</p>
						</div>

						<!-- Row 2 Left: Officer 3 (Panitia/Proktor) -->
						<div class="mt-4">
							<p class="font-medium mb-14">{activeOfficers[2].role},</p>
							<p class="border-b border-black font-bold inline-block px-3">{activeOfficers[2].data?.name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {activeOfficers[2].data?.nip || '..............................'}</p>
						</div>

						<!-- Row 2 Right: Kepala Madrasah -->
						<div class="mt-4">
							<p class="font-medium mb-14">Kepala Madrasah,</p>
							<p class="border-b border-black font-bold inline-block px-3">{school?.principal_name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {school?.principal_nip || '..............................'}</p>
						</div>
					</div>

				{:else}
					<!-- CASE 4: 4 Officers (Pengawas I, Pengawas II, Proktor, Panitia) -->
					<div class="grid grid-cols-2 gap-8 text-center">
						<!-- Row 1 Left: Pengawas I -->
						<div>
							<div class="h-6"></div>
							<p class="font-medium mb-14">{activeOfficers[0].role},</p>
							<p class="border-b border-black font-bold inline-block px-3">{activeOfficers[0].data?.name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {activeOfficers[0].data?.nip || '..............................'}</p>
						</div>

						<!-- Row 1 Right: Date + Pengawas II -->
						<div>
							<p class="text-xs text-slate-700 mb-1">{locationCity}, {formatDateFull(effectiveStart)}</p>
							<p class="font-medium mb-14">{activeOfficers[1].role},</p>
							<p class="border-b border-black font-bold inline-block px-3">{activeOfficers[1].data?.name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {activeOfficers[1].data?.nip || '..............................'}</p>
						</div>

						<!-- Row 2 Left: Proktor / Teknisi -->
						<div class="mt-4">
							<p class="font-medium mb-14">{activeOfficers[2].role},</p>
							<p class="border-b border-black font-bold inline-block px-3">{activeOfficers[2].data?.name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {activeOfficers[2].data?.nip || '..............................'}</p>
						</div>

						<!-- Row 2 Right: Panitia Ujian -->
						<div class="mt-4">
							<p class="font-medium mb-14">{activeOfficers[3].role},</p>
							<p class="border-b border-black font-bold inline-block px-3">{activeOfficers[3].data?.name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {activeOfficers[3].data?.nip || '..............................'}</p>
						</div>

						<!-- Row 3 Left: Empty Spacer -->
						<div></div>

						<!-- Row 3 Right: Kepala Madrasah -->
						<div class="mt-4">
							<p class="font-medium mb-14">Kepala Madrasah,</p>
							<p class="border-b border-black font-bold inline-block px-3">{school?.principal_name || '( .................................... )'}</p>
							<p class="text-xs mt-1">NIP. {school?.principal_nip || '..............................'}</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
{/each}
</div>
