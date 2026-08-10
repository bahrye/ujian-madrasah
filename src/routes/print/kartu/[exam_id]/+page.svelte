<script lang="ts">
	export let data;
	$: school = data.school as any;
	$: exam = data.exam as any;
	$: participants = data.participants as any[];
</script>

<svelte:head>
	<title>Cetak Kartu Peserta Ujian - {exam.title}</title>
</svelte:head>

<div class="p-8">
	<div class="grid grid-cols-2 gap-6">
		{#each participants as p}
			<div class="border-2 border-slate-800 p-0 rounded-lg overflow-hidden break-inside-avoid shadow-sm h-auto flex flex-col">
				<!-- Header Kop Sekolah -->
				<div class="flex items-center gap-4 p-3 border-b-2 border-slate-800 bg-slate-100">
					{#if school?.logo_url}
						<img src={school.logo_url} alt="Logo" class="w-14 h-14 object-contain" />
					{:else}
						<div class="w-14 h-14 bg-white border border-slate-300 rounded flex items-center justify-center text-[10px] text-center p-1 text-slate-500 font-bold">LOGO</div>
					{/if}
					<div class="flex-1 text-center">
						<h2 class="font-bold text-xs tracking-wide uppercase">KARTU PESERTA UJIAN</h2>
						<h3 class="font-bold text-xs uppercase">{school?.name || 'NAMA SEKOLAH'}</h3>
						{#if school?.address}
							<p class="text-[9px] text-slate-700 leading-tight mt-0.5">{school.address}</p>
						{/if}
					</div>
					<!-- QR Code (berada di kanan atas) -->
					<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ujian-madrasah.pages.dev" alt="QR Code" class="w-14 h-14 object-contain mix-blend-multiply" title="Scan untuk akses" />
				</div>

				<!-- Body Kartu -->
				<div class="p-4 flex-1 flex flex-col">
					<div class="text-center font-bold text-xs mb-3 pb-2 border-b border-slate-300">
							{exam.exam_type_name || 'Ujian'} - {exam.subject_name || 'Umum'}
						</div>
						<table class="w-full text-[11px] leading-snug">
							<tbody>
								<tr>
									<td class="py-1 w-24 font-medium text-slate-700">No. Peserta</td>
									<td class="py-1 w-4 text-center">:</td>
									<td class="py-1 font-bold">{p.nisn}</td>
								</tr>
								<tr>
									<td class="py-1 font-medium text-slate-700">Nama</td>
									<td class="py-1 text-center">:</td>
									<td class="py-1 font-bold"><div class="line-clamp-2 leading-tight pr-1">{p.student_name}</div></td>
								</tr>
								<tr>
									<td class="py-1 font-medium text-slate-700">Kelas / Ruang</td>
									<td class="py-1 text-center">:</td>
									<td class="py-1 font-bold">{p.class_name || '-'} / ..........</td>
								</tr>
								<tr>
									<td class="py-1 font-medium text-slate-700">TTL</td>
									<td class="py-1 text-center">:</td>
									<td class="py-1 font-bold">{p.place_of_birth || '-'}, {p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'}) : '-'}</td>
								</tr>
								<tr>
									<td class="py-1 font-medium text-slate-700">Link Akses</td>
									<td class="py-1 text-center">:</td>
									<td class="py-1 font-bold">https://ujian-madrasah.pages.dev</td>
								</tr>
							</tbody>
						</table>
						
						<!-- Spacer to push bottom content down evenly -->
						<div class="flex-1 min-h-[0.5rem]"></div>

						<div class="mt-3 text-[11px] bg-slate-50 border border-slate-200 p-1.5 rounded text-slate-700 text-center font-medium">
							Gunakan <span class="font-bold">No. Peserta</span> sebagai Username dan <span class="font-bold">NISN</span> sebagai Password.
						</div>
					
					<div class="mt-4 flex justify-between items-end">
						<div class="flex gap-3 items-end">
							{#if p.photo}
								<img src={p.photo} alt="Foto {p.student_name}" class="w-[2cm] h-[3cm] border-2 border-slate-300 object-cover bg-slate-50" />
							{:else}
								<div class="w-[2cm] h-[3cm] border-2 border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 text-[10px] text-center p-1">
									Pas Foto<br/>2 x 3
								</div>
							{/if}
						</div>
						<div class="text-center mt-3">
							<p class="text-[10px] mb-8">Panitia Ujian</p>
							<p class="text-[10px] font-bold border-b border-slate-800 inline-block px-4">......................................</p>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
	{#if participants.length === 0}
		<div class="text-center text-slate-500 py-10">
			Belum ada peserta di ujian ini.
		</div>
	{/if}
</div>
