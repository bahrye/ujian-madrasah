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

<div class="p-8 max-w-4xl mx-auto font-serif">
	<!-- Kop -->
	<div class="text-center mb-6 pb-4 border-b-4 border-black flex items-center">
		{#if school?.logo_url}
			<img src={school.logo_url} alt="Logo" class="w-24 h-24 object-contain absolute" />
		{/if}
		<div class="flex-1">
			<h2 class="font-bold text-xl uppercase tracking-wide">PANITIA PENYELENGGARA UJIAN</h2>
			<h3 class="font-bold text-2xl uppercase">{school?.name || 'NAMA SEKOLAH'}</h3>
			{#if school?.address}
				<p class="text-base mt-1">{school.address}</p>
			{/if}
			{#if school?.website || school?.email}
				<p class="text-sm">Website: {school.website || '-'} | Email: {school.email || '-'}</p>
			{/if}
		</div>
	</div>

	<!-- Judul Surat -->
	<div class="text-center mb-8">
		<h4 class="font-bold text-xl uppercase underline">BERITA ACARA PELAKSANAAN UJIAN</h4>
	</div>

	<!-- Isi Surat -->
	<div class="text-justify leading-relaxed mb-6">
		<p class="mb-4">Pada hari ini <span class="font-bold">{exam.start_time ? parseDate(exam.start_time).toLocaleDateString('id-ID', { weekday: 'long' }) : '..................'}</span> tanggal <span class="font-bold">{exam.start_time ? parseDate(exam.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '..............................'}</span>, telah diselenggarakan Ujian untuk mata pelajaran <span class="font-bold">{exam.subject_name || 'Umum'}</span> dari pukul <span class="font-bold">{exam.start_time ? parseDate(exam.start_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '....'}</span> sampai dengan pukul <span class="font-bold">{exam.end_time ? parseDate(exam.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '....'}</span>.</p>

		<table class="w-full mb-6 mt-4">
			<tbody>
				<tr>
					<td class="py-2 w-8">1.</td>
					<td class="py-2 w-64">Nama Ujian</td>
					<td class="py-2 w-4">:</td>
					<td class="py-2 font-bold">{exam.title}</td>
				</tr>
				<tr>
					<td class="py-2">2.</td>
					<td class="py-2">Mata Pelajaran</td>
					<td class="py-2">:</td>
					<td class="py-2 font-bold">{exam.subject_name || 'Umum'}</td>
				</tr>
				<tr>
					<td class="py-2">3.</td>
					<td class="py-2">Ruang / Kelas</td>
					<td class="py-2">:</td>
					<td class="py-2 font-bold">................................................</td>
				</tr>
				<tr>
					<td class="py-2">4.</td>
					<td class="py-2">Jumlah Peserta Seharusnya</td>
					<td class="py-2">:</td>
					<td class="py-2 font-bold">{totalParticipants} Orang</td>
				</tr>
				<tr>
					<td class="py-2">5.</td>
					<td class="py-2">Jumlah Peserta Hadir</td>
					<td class="py-2">:</td>
					<td class="py-2 font-bold">.......... Orang</td>
				</tr>
				<tr>
					<td class="py-2">6.</td>
					<td class="py-2">Jumlah Peserta Tidak Hadir</td>
					<td class="py-2">:</td>
					<td class="py-2 font-bold">.......... Orang</td>
				</tr>
				<tr>
					<td class="py-2 align-top">7.</td>
					<td class="py-2 align-top">{isNomorPesertaMode ? 'Nomor Peserta Tidak Hadir' : 'NISN Tidak Hadir'}</td>
					<td class="py-2 align-top">:</td>
					<td class="py-2 align-top text-slate-400 italic">.......................................................................................<br/><br/>.......................................................................................</td>
				</tr>
			</tbody>
		</table>

		<p class="mb-4">Catatan selama pelaksanaan ujian / Kejadian penting:</p>
		<div class="border border-black p-4 h-32 rounded-sm mb-6 bg-slate-50/50">
			<!-- Empty space for writing notes -->
		</div>

		<p class="mb-8">Demikian berita acara ini dibuat dengan sesungguhnya untuk dapat dipergunakan sebagaimana mestinya.</p>
	</div>

	<!-- Tanda Tangan -->
	<div class="flex justify-between mt-12 px-8">
		<div class="text-center">
			<p class="mb-24">Proktor / Teknisi</p>
			<p class="font-bold border-b border-black inline-block px-4">........................................</p>
			<p class="mt-1">NIP. ........................................</p>
		</div>
		<div class="text-center">
			<p class="mb-2">............, ....................................</p>
			<p class="mb-20">Pengawas Ruang</p>
			<p class="font-bold border-b border-black inline-block px-4">........................................</p>
			<p class="mt-1">NIP. ........................................</p>
		</div>
	</div>
</div>
