<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	export let data;
	$: school = data.school as any;
	$: examType = data.examType as any;
	$: isNomorPesertaMode = data.isNomorPesertaMode;
	$: examDataList = (data.examDataList || []) as any[];

	let selectedTimezone = 'WIB';

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
		const month = validDate.getMonth() + 1;
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
		return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
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
	<title>Cetak Semua Berita Acara - {examType.name}</title>
</svelte:head>

<style>
	:global(body) {
		font-family: 'Times New Roman', Times, Arial, serif !important;
		font-variant-numeric: lining-nums tabular-nums !important;
		-webkit-font-feature-settings: "lnum" 1, "tnum" 1 !important;
		font-feature-settings: "lnum" 1, "tnum" 1 !important;
	}
	@media print {
		@page { 
			size: 215.9mm 330mm; /* F4 / Folio */
			margin: 1cm; 
		}
		:global(body) {
			margin: 0;
			font-family: 'Times New Roman', Times, Arial, serif !important;
			font-variant-numeric: lining-nums tabular-nums !important;
			-webkit-font-feature-settings: "lnum" 1, "tnum" 1 !important;
			font-feature-settings: "lnum" 1, "tnum" 1 !important;
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
	<div class="flex items-center gap-2">
		<label for="tz-select" class="text-xs text-slate-300 font-medium">Zona Waktu:</label>
		<select id="tz-select" bind:value={selectedTimezone} class="bg-slate-700 text-white text-xs border border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-400">
			<option value="WIB">WIB (Waktu Indonesia Barat)</option>
			<option value="WITA">WITA (Waktu Indonesia Tengah)</option>
			<option value="WIT">WIT (Waktu Indonesia Timur)</option>
		</select>
	</div>

	<div class="flex items-center gap-2">
		<button class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors" on:click={() => window.close()}>Tutup</button>
		<button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow" on:click={() => window.print()}>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
			</svg>
			Cetak Semua Berita Acara
		</button>
	</div>
</div>

<div class="p-4 md:p-8 max-w-[215.9mm] mx-auto font-serif text-[15px] leading-snug print:p-0 print:m-0 bg-white" style="font-family: 'Times New Roman', Times, Arial, serif; font-variant-numeric: lining-nums tabular-nums;">
	{#if examDataList.length === 0}
		<div class="p-12 text-center text-slate-500 italic font-sans">
			Belum ada ujian terdaftar pada tipe ujian ini.
		</div>
	{/if}

	{#each examDataList as item, examIdx}
		{@const locationStr = [
			school?.district ? `Kecamatan ${school.district}` : '',
			school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kabupaten ${school.city}`) : '',
			school?.province ? school.province : ''
		].filter(Boolean).join(', ')}
		{@const locationCity = school?.address 
			? school.address.split(',')[0].trim() 
			: (school?.city ? school.city.replace(/^(kab\.|kabupaten|kota)\s+/i, '') : '....................')}
		{@const exam = item.exam}
		{@const participantsGrouped = item.participantsGrouped}
		{@const sessionMap = item.sessionMap}
		{@const proctorOptions = item.proctorOptions}
		{@const defaultProctor1Id = item.defaultProctor1Id}
		{@const defaultProctor2Id = item.defaultProctor2Id}
		{@const defaultProctorTechId = item.defaultProctorTechId}
		{@const defaultCommitteeId = item.defaultCommitteeId}
		{@const proctor1 = proctorOptions.find((p: any) => String(p.id) === String(defaultProctor1Id))}
		{@const proctor2 = proctorOptions.find((p: any) => String(p.id) === String(defaultProctor2Id))}
		{@const proctorTech = proctorOptions.find((p: any) => String(p.id) === String(defaultProctorTechId))}
		{@const committee = proctorOptions.find((p: any) => String(p.id) === String(defaultCommitteeId))}

		{#each Object.entries(participantsGrouped) as [roomName, sessionsDict], roomIdx}
			{#each Object.entries(sessionsDict as Record<number, number>) as [sessionNumStr, count], sessionIdx}
				{@const sessionNum = parseInt(sessionNumStr)}
				{@const sessionData = sessionMap?.[sessionNum]}
				{@const effectiveStart = resolveStart(sessionData, exam)}
				{@const effectiveEnd = resolveEnd(sessionData, exam)}
				{@const activeOfficers = [
					{ role: 'Pengawas I', data: proctor1, id: 'p1' },
					{ role: 'Pengawas II', data: proctor2, id: 'p2' },
					{ role: 'Proktor / Teknisi', data: proctorTech, id: 'pt' },
					{ role: 'Panitia Ujian', data: committee, id: 'cm' }
				].filter(o => (o.id === 'p1' && defaultProctor1Id) || (o.id !== 'p1' && o.data))}

				<div class={examIdx > 0 || roomIdx > 0 || sessionIdx > 0 ? "break-before-page pt-8 print:pt-0" : ""}>
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

					<!-- Garis Kop Surat -->
					<div class="mt-2 mb-3">
						<div class="border-b-2 border-black w-full"></div>
						<div class="border-b border-black w-full mt-0.5"></div>
					</div>

					<!-- Judul Dokumen -->
					<div class="text-center mb-4">
						<h2 class="font-bold text-base uppercase underline tracking-wide m-0">BERITA ACARA PELAKSANAAN UJIAN</h2>
						<p class="text-xs mt-1 uppercase font-semibold">TAHUN PELAJARAN {getAcademicYear(effectiveStart)}</p>
					</div>

					<!-- Paragraf Pembuka -->
					<p class="text-justify mb-3 leading-relaxed">
						Pada hari ini <span class="font-semibold">{getDayName(effectiveStart)}</span> 
						tanggal <span class="font-semibold">{getDayNumber(effectiveStart)}</span> 
						bulan <span class="font-semibold">{getMonthName(effectiveStart)}</span> 
						tahun <span class="font-semibold">{getYearNumber(effectiveStart)}</span>, 
						pada <span class="font-semibold">{school?.name || 'Madrasah'}</span> 
						telah diselenggarakan <span class="font-semibold">{exam.exam_type_name || exam.title}</span> 
						untuk Mata Pelajaran <span class="font-semibold">{exam.subject_name || 'Umum'}</span> 
						dari pukul <span class="font-semibold">{formatTime(effectiveStart)}</span> 
						sampai dengan pukul <span class="font-semibold">{formatTime(effectiveEnd)}</span> {selectedTimezone}.
					</p>

					<!-- Rincian Pelaksanaan -->
					<div class="space-y-3 mb-4">
						<div class="flex items-start gap-2">
							<span class="font-bold w-4">1.</span>
							<div class="flex-1">
								<table class="w-full">
									<tbody>
										<tr>
											<td class="w-48 py-0.5">Ruang / Sesi Ujian</td>
											<td class="w-4 py-0.5">:</td>
											<td class="font-semibold py-0.5">{roomName} {#if item.hasSessions}/ Sesi {sessionNum}{/if}</td>
										</tr>
										<tr>
											<td class="py-0.5">Jumlah Peserta Seharusnya</td>
											<td class="py-0.5">:</td>
											<td class="py-0.5"><span class="font-semibold">{count}</span> Orang</td>
										</tr>
										<tr>
											<td class="py-0.5">Jumlah Peserta Hadir</td>
											<td class="py-0.5">:</td>
											<td class="py-0.5"><span class="font-semibold">{count}</span> Orang</td>
										</tr>
										<tr>
											<td class="py-0.5">Jumlah Peserta Tidak Hadir</td>
											<td class="py-0.5">:</td>
											<td class="py-0.5"><span class="font-semibold">0</span> Orang</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>

						<div class="flex items-start gap-2">
							<span class="font-bold w-4">2.</span>
							<div class="flex-1">
								<p class="m-0 mb-1">Catatan Selama Pelaksanaan Ujian:</p>
								<div class="border border-black p-3 rounded min-h-[60px] text-xs italic bg-slate-50/50">
									Pelaksanaan ujian berlangsung tertib, lancar, dan aman tanpa kendala teknis yang berarti.
								</div>
							</div>
						</div>
					</div>

					<p class="mb-4">Demikian Berita Acara ini dibuat dengan sesungguhnya untuk dipergunakan sebagaimana mestinya.</p>

					<!-- Lokasi & Tanggal TTD -->
					<div class="flex justify-end mb-4">
						<div class="text-right text-xs">
							{locationCity}, {formatDateFull(effectiveStart)}
						</div>
					</div>

					<!-- TTD Petugas Ujian -->
					<div class="mt-4 pt-2 border-t border-slate-300">
						<p class="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 text-center">Yang Membuat Berita Acara:</p>
						<div class="grid grid-cols-2 gap-x-8 gap-y-6 text-xs">
							{#each activeOfficers as officer}
								<div class="text-center">
									<p class="mb-12 font-medium">{officer.role},</p>
									<p class="border-b border-black font-bold inline-block px-3">{officer.data?.name || '( .................................... )'}</p>
									<p class="text-[11px] mt-0.5">NIP. {officer.data?.nip || '..............................'}</p>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		{/each}
	{/each}
</div>
