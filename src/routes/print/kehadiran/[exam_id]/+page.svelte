<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	export let data;
	$: school = data.school as any;
	$: exam = data.exam as any;
	$: participantsGrouped = data.participantsGrouped as Record<string, Record<number, any[]>>;
	$: isNomorPesertaMode = data.isNomorPesertaMode;
	$: sessionMap = data.sessionMap as Record<number, { start_time: string | null; end_time: string | null }>;

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
			size: A4;
			margin: 1cm;
		}
		:global(body) {
			margin: 0;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>

<div class="p-8 print:p-12 max-w-[21cm] mx-auto bg-white">
	<!-- Print each room and session on a new page -->
	{#each Object.entries(participantsGrouped) as [roomName, sessionsDict], roomIdx}
		{#each Object.entries(sessionsDict) as [sessionNumStr, students], sessionIdx}
			{@const sessionNum = parseInt(sessionNumStr)}
			{@const sessionData = sessionMap?.[sessionNum]}
			{@const effectiveStart = sessionData?.start_time || exam.start_time}
			{@const effectiveEnd = sessionData?.end_time || exam.end_time}
			{@const effectiveDateStr = (effectiveStart && effectiveStart.includes('-')) ? effectiveStart : exam.start_time}
		<div class={roomIdx > 0 || sessionIdx > 0 ? "break-before-page pt-8" : ""}>
			<!-- Kop -->
			<div class="text-center mb-6 pb-4 border-b-2 border-black flex items-center">
				{#if school?.logo_url}
					<img src={school.logo_url} alt="Logo" class="w-20 h-20 object-contain absolute" />
				{/if}
				<div class="flex-1">
					<h2 class="font-bold text-lg uppercase tracking-wide">DAFTAR HADIR PESERTA UJIAN</h2>
					<h3 class="font-bold text-xl uppercase">{school?.name || 'NAMA SEKOLAH'}</h3>
					{#if school?.address}
						<p class="text-sm mt-1">{school.address}</p>
					{/if}
				</div>
			</div>

			<!-- Info Ujian -->
			<div class="grid grid-cols-2 gap-4 mb-4 text-sm">
				<table class="w-full">
					<tbody>
						<tr><td class="py-1 w-32 font-medium">Ujian</td><td class="w-4">:</td><td>{exam.exam_type_name || exam.title}</td></tr>
						<tr><td class="py-1 font-medium">Mata Pelajaran</td><td>:</td><td>{exam.subject_name || 'Umum'}</td></tr>
						{#if data.hasSessions}
						<tr><td class="py-1 font-medium">Ruang / Sesi</td><td>:</td><td>{roomName} / Sesi {sessionNum}</td></tr>
						{:else}
						<tr><td class="py-1 font-medium">Ruang</td><td>:</td><td>{roomName}</td></tr>
						{/if}
					</tbody>
				</table>
				<table class="w-full">
					<tbody>
						<tr><td class="py-1 w-32 font-medium">Hari, Tanggal</td><td class="w-4">:</td><td>{formatDate(effectiveDateStr)}</td></tr>
						<tr><td class="py-1 font-medium">Waktu</td><td>:</td><td>{formatTime(effectiveStart)} - {formatTime(effectiveEnd)}</td></tr>
					</tbody>
				</table>
			</div>

			<!-- Tabel Daftar Hadir -->
			<table class="w-full border-collapse border border-black mb-8 text-sm">
				<thead>
					<tr>
						<th class="border border-black p-2 w-12 text-center">No</th>
						<th class="border border-black p-2 px-4 whitespace-nowrap">{isNomorPesertaMode ? 'No. Peserta' : 'NISN'}</th>
						<th class="border border-black p-2 text-left">Nama Peserta</th>
						<th class="border border-black p-2 text-left w-24">Kelas</th>
						<th class="border border-black p-2 w-48 text-center" colspan="2">Tanda Tangan</th>
						<th class="border border-black p-2 w-24 text-center">Ket.</th>
					</tr>
				</thead>
				<tbody>
					{#each students as p, i}
						<tr>
							<td class="border border-black p-2 text-center">{i + 1}</td>
							<td class="border border-black p-2 text-center font-mono whitespace-nowrap text-[11px] leading-tight">{isNomorPesertaMode ? (p.nomor_peserta || '-') : (p.nisn || p.username)}</td>
							<td class="border border-black p-2">{p.student_name}</td>
							<td class="border border-black p-2 text-xs">{p.class_name || '-'}</td>
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

			<div class="grid grid-cols-2 gap-8 text-sm">
				<div>
					<p class="font-medium mb-1">Keterangan:</p>
					<ol class="list-decimal pl-4 text-xs space-y-1">
						<li>Daftar Hadir dibuat rangkap 2 (dua), masing-masing untuk Panitia dan Sekolah.</li>
						<li>Pengawas ruang menyilangkan nama peserta yang tidak hadir.</li>
					</ol>
				</div>
				<div class="text-center flex justify-end">
					<div class="w-48">
						<p class="mb-12">Pengawas Ruang,</p>
						<p class="border-b border-black font-medium">( .................................... )</p>
						<p class="text-xs mt-1">NIP. ..............................</p>
					</div>
				</div>
			</div>
		</div>
		{/each}
	{/each}
</div>
