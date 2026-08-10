<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	export let data;
	$: school = data.school as any;
	$: exam = data.exam as any;
	$: participantsByClass = data.participantsByClass as Record<string, any[]>;
	$: isNomorPesertaMode = data.isNomorPesertaMode;
</script>

<svelte:head>
	<title>Daftar Hadir Ujian - {exam.title}</title>
</svelte:head>

<div class="p-8">
	<!-- Print each class on a new page if necessary, but here we just list them -->
	{#each Object.entries(participantsByClass) as [className, students], classIdx}
		<div class={classIdx > 0 ? "break-before-page pt-8" : ""}>
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
						<tr><td class="py-1 w-32 font-medium">Ujian</td><td class="w-4">:</td><td>{exam.title}</td></tr>
						<tr><td class="py-1 font-medium">Mata Pelajaran</td><td>:</td><td>{exam.subject_name || 'Umum'}</td></tr>
						<tr><td class="py-1 font-medium">Kelas / Ruang</td><td>:</td><td>{className} / ....................</td></tr>
					</tbody>
				</table>
				<table class="w-full">
					<tbody>
						<tr><td class="py-1 w-32 font-medium">Hari, Tanggal</td><td class="w-4">:</td><td>{exam.start_time ? parseDate(exam.start_time).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '......................'}</td></tr>
						<tr><td class="py-1 font-medium">Waktu</td><td>:</td><td>{exam.start_time ? parseDate(exam.start_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '....'} - {exam.end_time ? parseDate(exam.end_time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : '....'}</td></tr>
					</tbody>
				</table>
			</div>

			<!-- Tabel Daftar Hadir -->
			<table class="w-full border-collapse border border-black mb-8 text-sm">
				<thead>
					<tr>
						<th class="border border-black p-2 w-12 text-center">No</th>
						<th class="border border-black p-2 w-32">{isNomorPesertaMode ? 'No. Peserta' : 'NISN'}</th>
						<th class="border border-black p-2 text-left">Nama Peserta</th>
						<th class="border border-black p-2 w-48 text-center" colspan="2">Tanda Tangan</th>
						<th class="border border-black p-2 w-24 text-center">Ket.</th>
					</tr>
				</thead>
				<tbody>
					{#each students as p, i}
						<tr>
							<td class="border border-black p-2 text-center">{i + 1}</td>
							<td class="border border-black p-2 text-center font-mono">{isNomorPesertaMode ? (p.nomor_peserta || '-') : (p.nisn || p.username)}</td>
							<td class="border border-black p-2">{p.student_name}</td>
							<td class="border-b border-black p-2 w-24 align-top h-12">
								{#if (i + 1) % 2 !== 0}
									<span class="text-xs text-slate-500">{i + 1}.</span>
								{/if}
							</td>
							<td class="border-b border-r border-black p-2 w-24 align-top h-12">
								{#if (i + 1) % 2 === 0}
									<span class="text-xs text-slate-500">{i + 1}.</span>
								{/if}
							</td>
							<td class="border border-black p-2 text-center"></td>
						</tr>
					{/each}
					{#if students.length === 0}
						<tr>
							<td colspan="6" class="border border-black p-4 text-center italic">Tidak ada peserta di kelas ini.</td>
						</tr>
					{/if}
				</tbody>
			</table>

			<!-- Tanda Tangan -->
			<div class="flex justify-between mt-8 text-sm px-10">
				<div class="text-center">
					<p class="mb-20">Pengawas Ruang</p>
					<p class="font-bold border-b border-black inline-block px-4">........................................</p>
					<p class="mt-1">NIP. ........................................</p>
				</div>
				<div class="text-center">
					<p class="mb-20">Proktor / Teknisi</p>
					<p class="font-bold border-b border-black inline-block px-4">........................................</p>
					<p class="mt-1">NIP. ........................................</p>
				</div>
			</div>
		</div>
	{/each}

	{#if Object.keys(participantsByClass).length === 0}
		<div class="text-center text-slate-500 py-10">
			Belum ada peserta di ujian ini.
		</div>
	{/if}
</div>
