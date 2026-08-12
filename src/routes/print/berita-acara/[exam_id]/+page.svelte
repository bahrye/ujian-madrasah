<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	export let data;
	$: school = data.school as any;
	$: exam = data.exam as any;
	$: totalParticipants = data.totalParticipants as number;
	$: isNomorPesertaMode = data.isNomorPesertaMode;
</script>

<svelte:head>
	<title>Berita Acara - {exam.title}</title>
</svelte:head>

<div class="p-4 md:p-8 max-w-4xl mx-auto font-serif text-[15px] leading-snug print:p-0 print:m-0">
	<!-- Kop -->
	<div class="text-center mb-4 pb-3 border-b-4 border-black flex items-center relative">
		{#if school?.logo_url}
			<img src={school.logo_url} alt="Logo" class="w-20 h-20 object-contain absolute left-0" />
		{/if}
		<div class="flex-1 px-24">
			<h2 class="font-bold text-lg uppercase tracking-wide m-0">PANITIA PENYELENGGARA UJIAN</h2>
			<h3 class="font-bold text-xl uppercase m-0">{school?.name || 'NAMA SEKOLAH'}</h3>
			{#if school?.address}
				<p class="text-sm mt-1 mb-0">{school.address}</p>
			{/if}
			{#if school?.website || school?.email}
				<p class="text-xs m-0">Website: {school.website || '-'} | Email: {school.email || '-'}</p>
			{/if}
		</div>
	</div>

	<!-- Judul Surat -->
	<div class="text-center mb-4">
		<h4 class="font-bold text-lg uppercase underline">BERITA ACARA PELAKSANAAN UJIAN</h4>
	</div>

	<!-- Isi Surat -->
	<div class="text-justify mb-4">
		<p class="mb-3">Pada hari ini <span class="font-bold">{exam.start_time ? parseDate(exam.start_time).toLocaleDateString('id-ID', { weekday: 'long' }) : '..................'}</span> tanggal <span class="font-bold">{exam.start_time ? parseDate(exam.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '..............................'}</span>, telah diselenggarakan Ujian untuk mata pelajaran <span class="font-bold">{exam.subject_name || 'Umum'}</span> dari pukul <span class="font-bold">{exam.start_time ? parseDate(exam.start_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '....'}</span> sampai dengan pukul <span class="font-bold">{exam.end_time ? parseDate(exam.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '....'}</span>.</p>

		<table class="w-full mb-4">
			<tbody>
				<tr>
					<td class="py-1 w-8">1.</td>
					<td class="py-1 w-60">Nama Ujian</td>
					<td class="py-1 w-4">:</td>
					<td class="py-1 font-bold">{exam.title}</td>
				</tr>
				<tr>
					<td class="py-1">2.</td>
					<td class="py-1">Mata Pelajaran</td>
					<td class="py-1">:</td>
					<td class="py-1 font-bold">{exam.subject_name || 'Umum'}</td>
				</tr>
				<tr>
					<td class="py-1">3.</td>
					<td class="py-1">Ruang / Kelas</td>
					<td class="py-1">:</td>
					<td class="py-1 font-bold">................................................</td>
				</tr>
				<tr>
					<td class="py-1">4.</td>
					<td class="py-1">Jumlah Peserta Seharusnya</td>
					<td class="py-1">:</td>
					<td class="py-1 font-bold">{totalParticipants} Orang</td>
				</tr>
				<tr>
					<td class="py-1">5.</td>
					<td class="py-1">Jumlah Peserta Hadir</td>
					<td class="py-1">:</td>
					<td class="py-1 font-bold">.......... Orang</td>
				</tr>
				<tr>
					<td class="py-1">6.</td>
					<td class="py-1">Jumlah Peserta Tidak Hadir</td>
					<td class="py-1">:</td>
					<td class="py-1 font-bold">.......... Orang</td>
				</tr>
				<tr>
					<td class="py-1 align-top">7.</td>
					<td class="py-1 align-top">{isNomorPesertaMode ? 'Nomor Peserta Tidak Hadir' : 'NISN Tidak Hadir'}</td>
					<td class="py-1 align-top">:</td>
					<td class="py-1 align-top text-slate-400 italic">.......................................................................................<br/><br/>.......................................................................................</td>
				</tr>
			</tbody>
		</table>

		<p class="mb-1">Catatan selama pelaksanaan ujian / Kejadian penting:</p>
		<div class="border border-black p-2 h-16 rounded-sm mb-4 bg-transparent">
			<!-- Empty space for writing notes -->
		</div>

		<p class="mb-2">Demikian berita acara ini dibuat dengan sesungguhnya untuk dapat dipergunakan sebagaimana mestinya.</p>
	</div>

	<!-- Tanda Tangan -->
	<div class="mt-4 px-4 text-sm">
		<div class="flex justify-end mb-2">
			<p>............, ....................................</p>
		</div>
		
		<div class="flex justify-between mb-2">
			<div class="text-center w-52">
				<p class="mb-10">Pengawas 1</p>
				<p class="font-bold border-b border-black w-full text-transparent">.............................</p>
				<p class="mt-1 text-left">NIP.</p>
			</div>
			<div class="text-center w-52">
				<p class="mb-10">Pengawas 2</p>
				<p class="font-bold border-b border-black w-full text-transparent">.............................</p>
				<p class="mt-1 text-left">NIP.</p>
			</div>
		</div>

		<div class="flex justify-between mb-2">
			<div class="text-center w-52">
				<p class="mb-10">Proktor / Teknisi</p>
				<p class="font-bold border-b border-black w-full text-transparent">.............................</p>
				<p class="mt-1 text-left">NIP.</p>
			</div>
			<div class="text-center w-52">
				<p class="mb-10">Panitia Ujian</p>
				<p class="font-bold border-b border-black w-full text-transparent">.............................</p>
				<p class="mt-1 text-left">NIP.</p>
			</div>
		</div>

		<div class="flex justify-center">
			<div class="text-center w-60">
				<p class="mb-1">Mengetahui,</p>
				<p class="mb-10">Kepala Madrasah</p>
				<p class="font-bold border-b border-black w-full text-transparent">...................................</p>
				<p class="mt-1 text-left">NIP.</p>
			</div>
		</div>
	</div>
</div>
