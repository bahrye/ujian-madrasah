<script lang="ts">
	import type { PageData } from './$types';
	import { parseDate } from '$lib/utils/date';

	export let data: PageData;
	const { school, examType, participants } = data;

	function formatDate(dateStr: string | null) {
		if (!dateStr || dateStr === '-') return '-';
		const date = parseDate(dateStr);
		if (isNaN(date.getTime())) return '-';
		return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	}

	function formatTime(timeStr: string | null) {
		if (!timeStr) return '--:--';
		if (timeStr.length <= 5) return timeStr;
		if (timeStr.includes('T')) return timeStr.split('T')[1].slice(0, 5);
		if (timeStr.includes(' ')) return timeStr.split(' ')[1].slice(0, 5);
		return timeStr.slice(0, 5);
	}
</script>

<svelte:head>
	<title>Cetak Jadwal Ujian - {examType.name}</title>
	<style>
		@media print {
			@page {
				size: A4;
				margin: 1cm;
			}
			body {
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
			}
			.page-break {
				break-after: page;
				page-break-after: always;
			}
			.no-print {
				display: none !important;
			}
		}
	</style>
</svelte:head>

<div class="no-print p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
	<div class="text-sm text-slate-600">
		Gunakan pengaturan <strong>Kertas A4</strong> dan <strong>Skala Default</strong> saat mencetak.
	</div>
	<div class="flex gap-3">
		<button class="btn-ghost" on:click={() => window.close()}>Tutup</button>
		<button class="btn-primary" on:click={() => window.print()}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
			</svg>
			Cetak Jadwal
		</button>
	</div>
</div>

<div class="mt-20 print:mt-0 max-w-[21cm] mx-auto bg-white">
	{#if participants.length === 0}
		<div class="p-12 text-center text-slate-500">
			Tidak ada data peserta ujian untuk ditampilkan.
		</div>
	{/if}

	{#each participants as p, i}
		<div class="p-8 print:p-0 {i < participants.length - 1 ? 'page-break mb-8 print:mb-0 border-b-8 print:border-b-0 border-slate-100' : ''}">
			<!-- Kop Surat -->
			<div class="flex items-center gap-6 border-b-[3px] border-black pb-4 mb-6">
				{#if school?.logo_url}
					<img src={school.logo_url} alt="Logo" class="w-20 h-20 object-contain" />
				{:else}
					<div class="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 font-bold text-xl">
						{school?.name?.charAt(0) || 'M'}
					</div>
				{/if}
				
				<div class="text-center flex-1 pr-26">
					<div class="font-bold text-xl uppercase leading-tight mb-1">{school?.name || ''}</div>
					<div class="text-sm font-medium uppercase mb-1">Jadwal {examType.name}</div>
					{#if school?.address}
						<div class="text-xs">{school.address}</div>
					{/if}
				</div>
			</div>

			<!-- Profil Siswa -->
			<div class="mb-6">
				<table class="text-sm w-full max-w-md">
					<tbody>
						<tr>
							<td class="py-1 w-32 font-medium">Nama Peserta</td>
							<td class="py-1 w-4 text-center">:</td>
							<td class="py-1 font-bold">{p.student_name}</td>
						</tr>
						<tr>
							<td class="py-1 font-medium">NISN</td>
							<td class="py-1 text-center">:</td>
							<td class="py-1">{p.nisn || '-'}</td>
						</tr>
						<tr>
							<td class="py-1 font-medium">Nomor Peserta</td>
							<td class="py-1 text-center">:</td>
							<td class="py-1">{p.nomor_peserta || '-'}</td>
						</tr>
						<tr>
							<td class="py-1 font-medium">Kelas</td>
							<td class="py-1 text-center">:</td>
							<td class="py-1">{p.class_name || '-'}</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Tabel Jadwal -->
			<div class="border border-black">
				<table class="w-full text-sm text-left">
					<thead class="bg-gray-100 border-b border-black">
						<tr>
							<th class="py-2 px-3 border-r border-black w-12 text-center">No</th>
							<th class="py-2 px-3 border-r border-black">Hari, Tanggal</th>
							<th class="py-2 px-3 border-r border-black">Mata Pelajaran</th>
							<th class="py-2 px-3 border-r border-black text-center">Waktu</th>
							<th class="py-2 px-3 border-r border-black text-center w-24">Sesi</th>
							<th class="py-2 px-3 text-center w-32">Ruang</th>
						</tr>
					</thead>
					<tbody>
						{#if p.schedules && p.schedules.length > 0}
							{#each p.schedules as schedule, idx}
								<tr class="border-b border-black last:border-b-0">
									<td class="py-2 px-3 border-r border-black text-center">{idx + 1}</td>
									<td class="py-2 px-3 border-r border-black whitespace-nowrap">{formatDate(schedule.date)}</td>
									<td class="py-2 px-3 border-r border-black font-medium">{schedule.subject_name || schedule.exam_title}</td>
									<td class="py-2 px-3 border-r border-black text-center whitespace-nowrap">
										{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
									</td>
									<td class="py-2 px-3 border-r border-black text-center">
										{schedule.has_sessions ? `Sesi ${schedule.session_number}` : '-'}
									</td>
									<td class="py-2 px-3 text-center font-medium">
										{schedule.room_name}
									</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan="6" class="py-8 text-center text-gray-500 italic">Belum ada jadwal ujian yang ditugaskan.</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
			
			<div class="mt-8 flex justify-end">
				<div class="text-center text-sm w-48">
					<div class="mb-16">Panitia Ujian,</div>
					<div class="border-b border-black w-full mb-1"></div>
					<div class="text-xs">NIP. ..............................</div>
				</div>
			</div>
		</div>
	{/each}
</div>
