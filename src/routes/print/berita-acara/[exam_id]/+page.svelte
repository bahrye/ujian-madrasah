<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	export let data;
	$: school = data.school as any;
	$: exam = data.exam as any;
	$: participantsGrouped = data.participantsGrouped as Record<string, Record<number, number>>;
	$: isNomorPesertaMode = data.isNomorPesertaMode;
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
	}
</style>

<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex justify-between items-center sticky top-0 z-50 shadow-md">
	<div class="text-xs text-slate-300">
		Gunakan kertas <strong>A4</strong> saat mencetak.
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
		{@const locationStr = [
			school?.district ? `Kecamatan ${school.district}` : '',
			school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kabupaten ${school.city}`) : '',
			school?.province ? school.province : ''
		].filter(Boolean).join(', ')}
		<div class={roomIdx > 0 || sessionIdx > 0 ? "break-before-page pt-8" : ""}>
	<!-- Kop Surat -->
	<div class="flex items-center justify-between gap-4 pb-3 mb-5 relative" style="border-bottom: 3px double #000;">
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

	<!-- Judul -->
	<div class="text-center mb-6">
		<h1 class="font-bold text-lg uppercase underline tracking-wider mb-1">BERITA ACARA PELAKSANAAN UJIAN</h1>
		<p class="text-sm font-medium">Tahun Ajaran 2025/2026</p>
	</div>

	<!-- Isu/Paragraf Pembuka -->
	<p class="mb-4 text-justify">
		Pada hari ini <span class="border-b border-dotted border-black px-2">{exam.start_time ? parseDate(exam.start_time).toLocaleDateString('id-ID', { weekday: 'long' }) : '................'}</span> 
		tanggal <span class="border-b border-dotted border-black px-2">{exam.start_time ? parseDate(exam.start_time).getDate() : '......'}</span> 
		bulan <span class="border-b border-dotted border-black px-2">{exam.start_time ? parseDate(exam.start_time).toLocaleDateString('id-ID', { month: 'long' }) : '................'}</span> 
		tahun <span class="border-b border-dotted border-black px-2">{exam.start_time ? parseDate(exam.start_time).getFullYear() : '..........'}</span>, 
		telah diselenggarakan <strong class="uppercase">{exam.exam_type_name || exam.title}</strong> Mata Pelajaran <strong>{exam.subject_name || 'Umum'}</strong> untuk:
	</p>

	<!-- Tabel Info Ruang & Waktu -->
	<div class="ml-4 mb-6">
		<table class="w-full">
			<tbody>
				<tr class="align-top"><td class="w-48 py-1">a. Satuan Pendidikan</td><td class="w-4 py-1">:</td><td class="py-1 font-bold uppercase">{school?.name || '-'}</td></tr>
				<tr class="align-top"><td class="py-1">b. Ruang / Sesi Ujian</td><td class="py-1">:</td><td class="py-1 font-bold">{roomName} / Sesi {sessionNum}</td></tr>
				<tr class="align-top"><td class="py-1">c. Waktu Pelaksanaan</td><td class="py-1">:</td><td class="py-1">{exam.start_time ? parseDate(exam.start_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '....'} s.d. {exam.end_time ? parseDate(exam.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '....'} WIB</td></tr>
				<tr class="align-top"><td class="py-1">d. Jumlah Peserta Seharusnya</td><td class="py-1">:</td><td class="py-1">{count} Orang</td></tr>
				<tr class="align-top"><td class="py-1">e. Jumlah Peserta Hadir</td><td class="py-1">:</td><td class="py-1">........... Orang</td></tr>
				<tr class="align-top"><td class="py-1">f. Jumlah Peserta Tidak Hadir</td><td class="py-1">:</td><td class="py-1">........... Orang</td></tr>
				<tr class="align-top">
					<td class="py-1 pl-4 text-sm font-sans" colspan="3">
						- Nomor Peserta yang Tidak Hadir: <span class="border-b border-dotted border-black px-4 inline-block min-w-[250px]"></span>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- Catatan / Kejadian Penting -->
	<div class="mb-6">
		<p class="mb-2 font-bold">Catatan / Kejadian Penting Selama Ujian Berlangsung:</p>
		<div class="border border-slate-400 p-3 min-h-[100px] text-xs font-mono text-slate-500 rounded">
			( Kosongkan jika pelaksanaan ujian berjalan tertib dan lancar )
		</div>
	</div>

	<p class="mb-8">
		Demikian Berita Acara ini dibuat dengan sesungguhnya untuk dipergunakan sebagaimana mestinya.
	</p>

	<!-- TTD Pengawas -->
	<div class="grid grid-cols-2 gap-8 text-center mt-12">
		<div>
			<p class="mb-16">Pengawas I</p>
			<p class="font-bold border-b border-black inline-block px-4">( .................................................... )</p>
			<p class="text-xs mt-1">NIP. ........................................</p>
		</div>
		<div>
			<p class="mb-16">Pengawas II</p>
			<p class="font-bold border-b border-black inline-block px-4">( .................................................... )</p>
			<p class="text-xs mt-1">NIP. ........................................</p>
		</div>
	</div>
</div>
	{/each}
{/each}
</div>
