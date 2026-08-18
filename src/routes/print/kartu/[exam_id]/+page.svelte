<script lang="ts">
	import { parseProctors } from '$lib/utils/format';
	import { generateStudentQrData, getQrCodeImageUrl } from '$lib/utils/qrLogin';

	export let data;
	$: school = data.school as any;
	$: exam = data.exam as any;
	$: participants = data.participants as any[];
</script>

<svelte:head>
	<title>Cetak Kartu Peserta Ujian - {exam.title}</title>
</svelte:head>

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
			Cetak Kartu
		</button>
	</div>
</div>

<div class="p-4 sm:p-8 print:p-0 overflow-x-auto print:overflow-visible w-full">
	<div class="print:w-full min-w-[750px] print:min-w-0">
		{#each Array(Math.ceil(participants.length / 4)) as _, pageIndex}
		<div class="grid grid-cols-2 grid-rows-2 gap-6 print:h-[275mm] break-after-page mb-6 print:mb-0">
			{#each participants.slice(pageIndex * 4, pageIndex * 4 + 4) as p}
				<div class="border-2 border-slate-800 p-0 rounded-lg overflow-hidden break-inside-avoid shadow-sm h-full flex flex-col">
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
					<!-- QR Code Login Siswa (berada di kanan atas) -->
					<img src={getQrCodeImageUrl(generateStudentQrData(p.login_username || p.username, p.login_password || p.nisn, p.qr_token))} alt="QR Login" class="w-14 h-14 object-contain mix-blend-multiply" title="Scan QR untuk Login Siswa" />
				</div>

				<!-- Body Kartu -->
				<div class="p-4 flex-1 flex flex-col">
					<div class="text-center font-bold text-xs mb-3 pb-2 border-b border-slate-300 leading-snug break-words">
						{exam.title}
					</div>
						<div class="flex-1 flex gap-4">
							<div class="w-24 flex flex-col items-center gap-2">
								<div class="w-20 h-24 bg-slate-200 border border-slate-400 flex items-center justify-center text-[10px] text-slate-400 font-semibold text-center leading-tight p-1">
									FOTO 3x4
								</div>
								<div class="text-[10px] font-mono font-bold bg-slate-100 px-1 py-0.5 border border-slate-300 rounded text-center w-full truncate" title={p.username}>
									{p.username}
								</div>
							</div>
							
							<div class="flex-1 text-xs space-y-1.5">
								<div class="grid grid-cols-[80px_8px_1fr] items-baseline">
									<span class="text-slate-600">Nama</span>
									<span>:</span>
									<span class="font-bold uppercase truncate">{p.student_name}</span>
								</div>
								<div class="grid grid-cols-[80px_8px_1fr] items-baseline">
									<span class="text-slate-600">No. Peserta</span>
									<span>:</span>
									<span class="font-mono font-bold">{p.nomor_peserta || '-'}</span>
								</div>
								<div class="grid grid-cols-[80px_8px_1fr] items-baseline">
									<span class="text-slate-600">NISN</span>
									<span>:</span>
									<span class="font-mono">{p.nisn || '-'}</span>
								</div>
								<div class="grid grid-cols-[80px_8px_1fr] items-baseline">
									<span class="text-slate-600">Kelas</span>
									<span>:</span>
									<span class="font-bold">{p.class_name || '-'}</span>
								</div>
								<div class="grid grid-cols-[80px_8px_1fr] items-baseline">
									<span class="text-slate-600">Ruang / Sesi</span>
									<span>:</span>
									<span class="font-semibold">{p.room_name || '-'} / Sesi {p.session_number || 1}</span>
								</div>
								{#each parseProctors(exam.proctors) as pr}
									<div class="grid grid-cols-[80px_8px_1fr] items-baseline">
										<span class="text-slate-600">{pr.label}</span>
										<span>:</span>
										<span class="font-semibold truncate">{pr.name}</span>
									</div>
								{/each}
								<div class="grid grid-cols-[80px_8px_1fr] items-baseline">
									<span class="text-slate-600">Password</span>
									<span>:</span>
									<span class="font-mono bg-slate-100 px-1 border border-slate-200 rounded">{p.login_password || p.plain_password || p.nisn || '******'}</span>
								</div>
							</div>
						</div>

						<div class="mt-2 pt-2 border-t border-slate-200 flex justify-between items-end text-[9px] text-slate-500">
							<div>Simpan kartu ini dengan baik selama ujian.</div>
							<div class="font-semibold text-slate-700 text-right">
								<p class="text-[9px] mb-5">Panitia Ujian,</p>
								<p class="text-[9px] font-bold border-b border-slate-800 inline-block px-2">{data.committeeName || '......................................'}</p>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		{/each}
	</div>
</div>
