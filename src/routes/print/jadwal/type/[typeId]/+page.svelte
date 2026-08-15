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

<div class="mt-20 print:mt-0 max-w-[21cm] mx-auto bg-white">
	{#if participants.length === 0}
		<div class="p-12 text-center text-slate-500">
			Tidak ada data peserta ujian untuk ditampilkan.
		</div>
	{/if}

	{#each participants as p, i}
		{@const locationStr = [
			school?.district ? `Kecamatan ${school.district}` : '',
			school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kabupaten ${school.city}`) : '',
			school?.province ? school.province : ''
		].filter(Boolean).join(', ')}
		<div class="p-8 print:p-0 {i < participants.length - 1 ? 'page-break mb-8 print:mb-0 border-b-8 print:border-b-0 border-slate-100' : ''}">
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
				<h2 class="font-bold text-lg uppercase underline tracking-wider m-0">JADWAL UJIAN PESERTA</h2>
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
				<div class="text-center text-sm min-w-[200px]">
					<div class="mb-14">Panitia Ujian,</div>
					<div class="font-bold border-b border-black w-full mb-0.5 px-2">{data.committeeName || '......................................'}</div>
					<div class="text-xs">NIP. {data.committeeNip || '..............................'}</div>
				</div>
			</div>
		</div>
	{/each}
</div>
