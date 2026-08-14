<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	export let data;
	$: school = data.school as any;
	$: exam = data.exam as any;
	$: participantsGrouped = data.participantsGrouped as Record<string, Record<number, any[]>>;
	$: isNomorPesertaMode = data.isNomorPesertaMode;
	$: sessionMap = data.sessionMap as Record<number, { start_time: string | null; end_time: string | null }>;
	$: proctorOptions = (data.proctorOptions || []) as any[];

	let proctor1Id = data.defaultProctor1Id || (proctorOptions[0]?.id || '');
	let proctor2Id = data.defaultProctor2Id || '';

	$: proctor1 = proctorOptions.find(p => String(p.id) === String(proctor1Id));
	$: proctor2 = proctorOptions.find(p => String(p.id) === String(proctor2Id));

	function formatDate(dateStr: string | null) {
		if (!dateStr || dateStr === '-') return '......................';
		const date = parseDate(dateStr);
		if (isNaN(date.getTime())) return '......................';
		return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	}

	function formatTime(timeStr: string | null) {
		if (!timeStr) return '....';
		if (timeStr.length <= 5) return timeStr;
		if (timeStr.includes('T')) return timeStr.split('T')[1].slice(0, 5);
		if (timeStr.includes(' ')) return timeStr.split(' ')[1].slice(0, 5);
		return timeStr.slice(0, 5);
	}
</script>

<svelte:head>
	<title>Daftar Hadir Ujian - {exam.title}</title>
</svelte:head>

<style>
	@media print {
		@page {
			size: 215.9mm 330mm; /* F4 / Folio */
			margin: 1cm;
		}
		:global(body) {
			margin: 0;
			padding: 0;
			font-family: 'Times New Roman', Times, Georgia, serif !important;
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
		<span class="text-xs font-semibold uppercase tracking-wider text-slate-300">Pengaturan Pengawas:</span>
		
		<div class="flex items-center gap-2">
			<label for="p1-select" class="text-xs text-slate-300 font-medium">Pengawas 1:</label>
			<select id="p1-select" bind:value={proctor1Id} class="bg-slate-700 text-white text-xs border border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-400">
				<option value="">-- Pilih Pengawas 1 --</option>
				{#each proctorOptions as p}
					<option value={p.id}>{p.name} {p.nip ? `(NIP. ${p.nip})` : ''}</option>
				{/each}
			</select>
		</div>

		<div class="flex items-center gap-2">
			<label for="p2-select" class="text-xs text-slate-300 font-medium">Pengawas 2:</label>
			<select id="p2-select" bind:value={proctor2Id} class="bg-slate-700 text-white text-xs border border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-400">
				<option value="">-- Tidak Ada / Kosongkan --</option>
				{#each proctorOptions as p}
					<option value={p.id}>{p.name} {p.nip ? `(NIP. ${p.nip})` : ''}</option>
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
			Cetak Daftar Hadir
		</button>
	</div>
</div>

<div class="p-8 print:p-8 max-w-[215.9mm] mx-auto bg-white" style="font-family: 'Times New Roman', Times, Georgia, serif;">
	<!-- Print each room and session on a new page -->
	{#each Object.entries(participantsGrouped) as [roomName, sessionsDict], roomIdx}
		{#each Object.entries(sessionsDict) as [sessionNumStr, students], sessionIdx}
			{@const sessionNum = parseInt(sessionNumStr)}
			{@const sessionData = sessionMap?.[sessionNum]}
			{@const effectiveStart = sessionData?.start_time || exam.start_time}
			{@const effectiveEnd = sessionData?.end_time || exam.end_time}
			{@const effectiveDateStr = (effectiveStart && effectiveStart.includes('-')) ? effectiveStart : exam.start_time}
			{@const classNames = Array.from(new Set(students.map(s => s.class_name).filter(Boolean))).join(', ') || '-'}
			{@const locationStr = [
				school?.district ? `Kecamatan ${school.district}` : '',
				school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kabupaten ${school.city}`) : '',
				school?.province ? school.province : ''
			].filter(Boolean).join(', ')}
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

			<!-- Judul Dokumen -->
			<div class="text-center mb-5 font-serif">
				<h2 class="font-bold text-lg uppercase underline tracking-wider m-0">DAFTAR HADIR PESERTA UJIAN</h2>
			</div>

			<!-- Info Ujian -->
			<div class="grid grid-cols-2 gap-4 mb-4 text-sm">
				<table class="w-full">
					<tbody>
						<tr><td class="py-1 w-32 font-medium">Ujian</td><td class="w-4">:</td><td>{exam.exam_type_name || exam.title}</td></tr>
						<tr><td class="py-1 font-medium">Mata Pelajaran</td><td>:</td><td>{exam.subject_name || 'Umum'}</td></tr>
						<tr><td class="py-1 font-medium">Kelas</td><td>:</td><td>{classNames}</td></tr>
					</tbody>
				</table>
				<table class="w-full">
					<tbody>
						<tr><td class="py-1 w-32 font-medium">Hari, Tanggal</td><td class="w-4">:</td><td>{formatDate(effectiveDateStr)}</td></tr>
						<tr><td class="py-1 font-medium">Waktu</td><td>:</td><td>{formatTime(effectiveStart)} - {formatTime(effectiveEnd)}</td></tr>
						{#if data.hasSessions}
						<tr><td class="py-1 font-medium">Ruang / Sesi</td><td>:</td><td>{roomName} / Sesi {sessionNum}</td></tr>
						{:else}
						<tr><td class="py-1 font-medium">Ruang</td><td>:</td><td>{roomName}</td></tr>
						{/if}
					</tbody>
				</table>
			</div>

			<!-- Tabel Daftar Hadir -->
			<table class="w-full border-collapse border border-black mb-6 text-sm">
				<thead>
					<tr>
						<th class="border border-black p-2 w-12 text-center">No</th>
						<th class="border border-black p-2 px-4 whitespace-nowrap">{isNomorPesertaMode ? 'No. Peserta' : 'NISN'}</th>
						<th class="border border-black p-2 text-left">Nama Peserta</th>
						<th class="border border-black p-2 w-48 text-center" colspan="2">Tanda Tangan</th>
						<th class="border border-black p-2 w-24 text-center">Ket.</th>
					</tr>
				</thead>
				<tbody>
					{#each students as p, i}
						<tr>
							<td class="border border-black p-2 text-center">{i + 1}</td>
							<td class="border border-black p-2 text-center whitespace-nowrap text-xs leading-tight font-serif">{isNomorPesertaMode ? (p.nomor_peserta || '-') : (p.nisn || p.username)}</td>
							<td class="border border-black p-2">{p.student_name}</td>
							<td class="border-b border-black p-2 w-24 align-top h-12 relative text-center">
								{#if (i + 1) % 2 !== 0}
									<span class="text-xs text-slate-500 text-left absolute top-1 left-1 z-10">{i + 1}.</span>
									{#if p.signature}
										<img src={p.signature} alt="TTD" class="absolute inset-1 w-[90%] h-[90%] object-contain z-0 opacity-80 mix-blend-multiply" />
									{/if}
								{/if}
							</td>
							<td class="border-b border-r border-black p-2 w-24 align-top h-12 relative text-center">
								{#if (i + 1) % 2 === 0}
									<span class="text-xs text-slate-500 text-left absolute top-1 left-1 z-10">{i + 1}.</span>
									{#if p.signature}
										<img src={p.signature} alt="TTD" class="absolute inset-1 w-[90%] h-[90%] object-contain z-0 opacity-80 mix-blend-multiply" />
									{/if}
								{/if}
							</td>
							<td class="border border-black p-2 text-center text-xs"></td>
						</tr>
					{/each}
				</tbody>
			</table>

			<!-- Keterangan & TTD Pengawas -->
			<div class="mb-4 text-xs text-slate-700">
				<p class="font-medium mb-0.5">Keterangan:</p>
				<ol class="list-decimal pl-4 space-y-0.5">
					<li>Daftar Hadir dibuat rangkap 2 (dua), masing-masing untuk Panitia dan Sekolah.</li>
					<li>Pengawas ruang menyilangkan nama peserta yang tidak hadir.</li>
				</ol>
			</div>

			<!-- TTD Pengawas -->
			{#if proctor1 && proctor2 && String(proctor1.id) !== String(proctor2.id)}
				<!-- 2 Pengawas Layout -->
				<div class="grid grid-cols-2 gap-8 text-sm pt-2">
					<div class="text-center">
						<p class="mb-14 font-medium">Pengawas I,</p>
						<p class="border-b border-black font-bold inline-block px-4">{proctor1.name}</p>
						<p class="text-xs mt-1">NIP. {proctor1.nip || '..............................'}</p>
					</div>
					<div class="text-center">
						<p class="mb-14 font-medium">Pengawas II,</p>
						<p class="border-b border-black font-bold inline-block px-4">{proctor2.name}</p>
						<p class="text-xs mt-1">NIP. {proctor2.nip || '..............................'}</p>
					</div>
				</div>
			{:else}
				<!-- 1 Pengawas Layout -->
				<div class="flex justify-end text-sm pt-2">
					<div class="w-60 text-center">
						<p class="mb-14 font-medium">Pengawas Ruang,</p>
						<p class="border-b border-black font-bold inline-block px-2">{proctor1?.name || '( .................................... )'}</p>
						<p class="text-xs mt-1">NIP. {proctor1?.nip || '..............................'}</p>
					</div>
				</div>
			{/if}
		</div>
		{/each}
	{/each}
</div>
