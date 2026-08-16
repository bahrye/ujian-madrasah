<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	export let data;

	$: school = data.school as any;
	$: examType = data.examType as any;
	$: classData = data.classData as any;
	$: schedules = (data.schedules || []) as any[];

	function formatDate(dateStr: string | null) {
		if (!dateStr) return '-';
		const date = parseDate(dateStr);
		if (isNaN(date.getTime())) return '-';
		return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	}

	function formatOnlyTime(dateStr: string | null) {
		if (!dateStr) return '--.--';
		const date = parseDate(dateStr);
		if (isNaN(date.getTime())) return '--.--';
		return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(date).replace(':', '.');
	}

	function formatDateToday() {
		const today = new Date();
		return today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
	}

	type ScheduleGroup = { dateStr: string; exams: any[] };

	$: ({ days, proctorMap, totalExams } = (() => {
		const daysList: ScheduleGroup[] = [];
		const map = new Map<string, number>();
		let proctorCounter = 1;
		let total = 0;
		let currentDateStr = '';
		let currentGroup: ScheduleGroup | null = null;

		schedules.forEach((exam) => {
			if (exam.proctor_names) {
				exam.proctor_names.split('||').forEach((p: string) => {
					const name = p.trim();
					if (name && !map.has(name)) {
						map.set(name, proctorCounter++);
					}
				});
			}

			if (!exam.start_time) return;
			const date = parseDate(String(exam.start_time));
			const dateFormatted = new Intl.DateTimeFormat('id-ID', {
				weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
			}).format(date);

			if (dateFormatted !== currentDateStr) {
				currentDateStr = dateFormatted;
				currentGroup = { dateStr: dateFormatted, exams: [] };
				daysList.push(currentGroup);
			}
			currentGroup?.exams.push(exam);
			total++;
		});

		return { days: daysList, proctorMap: map, totalExams: total };
	})());

	function getProctorNumbers(namesStr: string | null, map: Map<string, number>) {
		if (!namesStr) return '-';
		const names = namesStr.split('||').map((n) => n.trim()).filter(Boolean);
		if (names.length === 0) return '-';
		const numbers = names.map((n) => map.get(n)).filter(Boolean).sort((a, b) => (a || 0) - (b || 0));
		return numbers.length > 0 ? numbers.join(' & ') : '-';
	}

	$: locationStr = [
		school?.district ? `Kecamatan ${school.district}` : '',
		school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kabupaten ${school.city}`) : '',
		school?.province ? school.province : ''
	].filter(Boolean).join(', ');
</script>

<svelte:head>
	<title>Cetak Jadwal Ujian - {examType.name}</title>
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
			size: A4 portrait;
			margin: 1cm;
		}
		:global(body) {
			margin: 0;
			padding: 0;
			font-family: 'Times New Roman', Times, Arial, serif !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
		.no-print {
			display: none !important;
		}
	}
</style>

<!-- Control Bar -->
<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
	<div class="text-xs text-slate-300">
		Gunakan kertas <strong>A4</strong> saat mencetak jadwal ujian.
	</div>

	<div class="flex items-center gap-2">
		<button class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors" on:click={() => window.close()}>Tutup</button>
		<button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow" on:click={() => window.print()}>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
			</svg>
			Cetak Jadwal
		</button>
	</div>
</div>

<div class="p-4 md:p-8 print:p-0 print:m-0 max-w-[21cm] mx-auto bg-white" style="font-family: 'Times New Roman', Times, Arial, serif; font-variant-numeric: lining-nums tabular-nums;">
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

	<!-- Garis Kop Surat -->
	<div class="mt-2 mb-5">
		<div style="border-bottom: 1px solid #000;"></div>
		<div style="border-bottom: 2.5px solid #000; margin-top: 2px;"></div>
	</div>

	<!-- Judul Dokumen -->
	<div class="text-center mb-6 font-serif">
		<h2 class="font-bold text-lg uppercase underline tracking-wider m-0">
			JADWAL {examType.name}
		</h2>
		{#if classData}
			<p class="text-sm font-bold uppercase mt-1">KELAS: {classData.name}</p>
		{/if}
	</div>

	<!-- Tabel Jadwal Ujian (Sama seperti dashboard siswa, tanpa RUANG, SESI, dan STATUS) -->
	{#if days.length === 0}
		<div class="p-12 text-center text-slate-500 italic border border-black">
			Belum ada jadwal ujian untuk ditampilkan.
		</div>
	{:else}
		<div class="w-full">
			<table class="w-full text-sm border-collapse border-2 border-black">
				<thead>
					<tr class="bg-gray-100 text-black font-bold">
						<th class="border-2 border-black px-2 py-2 text-center uppercase w-10">NO</th>
						<th class="border-2 border-black px-3 py-2 text-center uppercase w-44 whitespace-nowrap">HARI, TANGGAL</th>
						<th class="border-2 border-black px-2 py-2 text-center uppercase w-16 whitespace-nowrap">JAM KE</th>
						<th class="border-2 border-black px-3 py-2 text-center uppercase w-32 whitespace-nowrap">WAKTU</th>
						<th class="border-2 border-black px-3 py-2 text-center uppercase">MATA PELAJARAN</th>
						<th class="border-2 border-black px-2 py-2 text-center uppercase w-24 whitespace-nowrap">PENGAWAS</th>
						<th class="border-2 border-black px-3 py-2 text-left uppercase w-48">DAFTAR PENGAWAS</th>
					</tr>
				</thead>
				<tbody>
					{#each days as group, gIdx}
						{#each group.exams as exam, eIdx}
							<tr class="bg-white text-black">
								{#if eIdx === 0}
									<td class="border-2 border-black px-2 py-2 text-center align-middle" rowspan={group.exams.length}>{gIdx + 1}</td>
									<td class="border-2 border-black px-3 py-2 text-center align-middle font-medium whitespace-nowrap" rowspan={group.exams.length}>{group.dateStr}</td>
								{/if}
								<td class="border-2 border-black px-2 py-2 text-center">{eIdx + 1}</td>
								<td class="border-2 border-black px-3 py-2 text-center tracking-wider whitespace-nowrap">
									{formatOnlyTime(exam.start_time || '')} - {formatOnlyTime(exam.end_time || '')}
								</td>
								<td class="border-2 border-black px-3 py-2 text-center font-medium leading-snug">{exam.subject_name || exam.title || ''}</td>
								<td class="border-2 border-black px-2 py-2 text-center font-semibold whitespace-nowrap">
									{getProctorNumbers(exam.proctor_names || '', proctorMap)}
								</td>
								{#if gIdx === 0 && eIdx === 0}
									<td class="border-2 border-black px-4 py-2 align-top bg-white" rowspan={totalExams}>
										<div class="space-y-1 text-xs">
											{#each Array.from(proctorMap.entries()) as [name, num]}
												<div class="leading-tight">
													<span class="inline-block w-4 font-bold">{num}.</span> {name}
												</div>
											{/each}
											{#if proctorMap.size === 0}
												<span class="italic text-gray-400">-</span>
											{/if}
										</div>
									</td>
								{/if}
							</tr>
						{/each}
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- TTD Panitia Ujian -->
	<div class="mt-10 flex justify-end">
		<div class="text-center text-sm min-w-[220px]">
			<p class="mb-1">{school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kab. ${school.city}`) : 'Madrasah'}, {formatDateToday()}</p>
			<p class="mb-14 font-medium">Panitia Ujian,</p>
			<p class="font-bold border-b border-black w-full mb-0.5 px-2">{data.committeeName || '......................................'}</p>
			<p class="text-xs">NIP. {data.committeeNip || '..............................'}</p>
		</div>
	</div>
</div>
