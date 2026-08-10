<script lang="ts">
	export let data;
	$: school = data.school as any;
	$: examType = data.examType as any;
	$: participants = data.participants as any[];

	let selectedDesign = 'default';

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		try {
			const d = new Date(dateStr);
			return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
		} catch {
			return dateStr;
		}
	}

	function getTtl(p: any): string {
		const place = p.place_of_birth || '';
		const date = p.date_of_birth ? formatDate(p.date_of_birth) : '';
		if (place && date) return `${place}, ${date}`;
		if (place) return place;
		if (date) return date;
		return '-';
	}
</script>

<svelte:head>
	<title>Cetak Kartu Peserta Ujian - {examType.name}</title>
</svelte:head>

<!-- Design Selector (hidden when printing) -->
<div class="print:hidden p-4 bg-white border-b border-slate-200 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
	<span class="text-sm font-medium text-slate-700">Pilih Desain:</span>
	<button 
		class="px-4 py-2 rounded-lg text-sm font-medium transition-all {selectedDesign === 'default' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
		on:click={() => selectedDesign = 'default'}
	>
		Desain 1 (Default)
	</button>
	<button 
		class="px-4 py-2 rounded-lg text-sm font-medium transition-all {selectedDesign === 'kartu-login' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
		on:click={() => selectedDesign = 'kartu-login'}
	>
		Desain 2 (Kartu Login)
	</button>
	<button
		class="ml-auto px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all shadow-sm"
		on:click={() => window.print()}
	>
		🖨️ Cetak
	</button>
</div>

<div class="p-8">
	<!-- ===== DESIGN 1: DEFAULT ===== -->
	{#if selectedDesign === 'default'}
	<div class="grid grid-cols-2 gap-6">
		{#each participants as p}
			<div class="border-2 border-slate-800 p-0 rounded-lg overflow-hidden break-inside-avoid shadow-sm h-auto min-h-[11cm] flex flex-col">
				<!-- Header Kop Sekolah -->
				<div class="flex items-center gap-4 p-3 border-b-2 border-slate-800 bg-slate-100">
					{#if school?.logo_url}
						<img src={school.logo_url} alt="Logo" class="w-14 h-14 object-contain" />
					{:else}
						<div class="w-14 h-14 bg-white border border-slate-300 rounded flex items-center justify-center text-[10px] text-center p-1 text-slate-500 font-bold">LOGO</div>
					{/if}
					<div class="flex-1 text-center">
						<h2 class="font-bold text-sm tracking-wide uppercase">KARTU PESERTA UJIAN</h2>
						<h3 class="font-bold text-sm uppercase">{school?.name || 'NAMA SEKOLAH'}</h3>
						{#if school?.address}
							<p class="text-[10px] text-slate-700 leading-tight mt-1">{school.address}</p>
						{/if}
					</div>
					<!-- Placeholder for balance -->
					<div class="w-14 h-14"></div>
				</div>

				<!-- Body Kartu -->
				<div class="p-4 flex-1 flex flex-col justify-between">
					<div>
						<div class="text-center font-bold text-sm mb-4 pb-2 border-b border-slate-300">
							{examType.name || 'Ujian'}
						</div>
						<table class="w-full text-sm">
							<tbody>
								<tr>
									<td class="py-1 w-28 align-top font-medium text-slate-700">No. Peserta</td>
									<td class="py-1 w-4 align-top text-center">:</td>
									<td class="py-1 font-bold align-top">{p.display_nomor_peserta}</td>
								</tr>
								<tr>
									<td class="py-1 align-top font-medium text-slate-700">NISN</td>
									<td class="py-1 align-top text-center">:</td>
									<td class="py-1 align-top font-bold">{p.display_nisn}</td>
								</tr>
								<tr>
									<td class="py-1 align-top font-medium text-slate-700">Nama</td>
									<td class="py-1 align-top text-center">:</td>
									<td class="py-1 align-top font-bold">{p.student_name}</td>
								</tr>
								<tr>
									<td class="py-1 align-top font-medium text-slate-700">Kelas / Ruang</td>
									<td class="py-1 align-top text-center">:</td>
									<td class="py-1 align-top font-bold">{p.class_name || '-'} / ..........</td>
								</tr>
								<tr>
									<td class="py-1 align-top font-medium text-slate-700">Username</td>
									<td class="py-1 align-top text-center">:</td>
									<td class="py-1 align-top font-mono font-bold tracking-wider">{p.login_username}</td>
								</tr>
								<tr>
									<td class="py-1 align-top font-medium text-slate-700">Password</td>
									<td class="py-1 align-top text-center">:</td>
									<td class="py-1 align-top font-mono font-bold tracking-wider">{p.login_password}</td>
								</tr>
							</tbody>
						</table>
					</div>
					
					<div class="mt-4 flex justify-between items-end">
						{#if p.photo}
							<img src={p.photo} alt="Foto {p.student_name}" class="w-[3cm] h-[4cm] border-2 border-slate-300 object-cover bg-slate-50" />
						{:else}
							<div class="w-[3cm] h-[4cm] border-2 border-slate-300 flex items-center justify-center bg-slate-50 text-slate-400 text-xs text-center p-2">
								Pas Foto<br/>3 x 4
							</div>
						{/if}
						<div class="text-center">
							<p class="text-xs mb-10">Panitia Ujian</p>
							<p class="text-xs font-bold border-b border-slate-800 inline-block px-4">......................................</p>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
	{/if}

	<!-- ===== DESIGN 2: KARTU LOGIN (ANBK STYLE) ===== -->
	{#if selectedDesign === 'kartu-login'}
	<div class="grid grid-cols-2 gap-5">
		{#each participants as p}
			<div class="border border-slate-700 break-inside-avoid bg-white" style="page-break-inside: avoid;">
				<!-- Header -->
				<div class="flex items-center gap-3 px-3 py-2 border-b border-slate-700">
					{#if school?.logo_url}
						<img src={school.logo_url} alt="Logo" class="w-10 h-10 object-contain flex-shrink-0" />
					{:else}
						<div class="w-10 h-10 bg-white border border-slate-400 rounded-full flex items-center justify-center text-[8px] text-center text-slate-500 font-bold flex-shrink-0">LOGO</div>
					{/if}
					<div class="flex-1 text-center">
						<p class="font-bold text-xs tracking-wide uppercase leading-tight">KARTU LOGIN</p>
						<p class="font-bold text-xs uppercase leading-tight">{examType.name || 'UJIAN'}</p>
						<p class="font-bold text-xs uppercase leading-tight">{school?.name || 'NAMA SEKOLAH'}</p>
					</div>
					<img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data={encodeURIComponent(p.login_username)}" alt="QR" class="w-10 h-10 flex-shrink-0" />
				</div>

				<!-- Body: Data full-width -->
				<div class="px-3 py-2">
					<table class="w-full text-[11px] leading-snug">
						<tbody>
							<tr>
								<td class="py-[2px] w-[90px] align-top font-medium text-slate-700 whitespace-nowrap">Nama Peserta</td>
								<td class="py-[2px] w-3 align-top text-center">:</td>
								<td class="py-[2px] font-bold align-top">{p.student_name}</td>
							</tr>
							<tr>
								<td class="py-[2px] align-top font-medium text-slate-700 whitespace-nowrap">NISN</td>
								<td class="py-[2px] align-top text-center">:</td>
								<td class="py-[2px] align-top">{p.display_nisn}</td>
							</tr>
							{#if p.display_nomor_peserta && p.display_nomor_peserta !== '-'}
							<tr>
								<td class="py-[2px] align-top font-medium text-slate-700 whitespace-nowrap">No. Peserta</td>
								<td class="py-[2px] align-top text-center">:</td>
								<td class="py-[2px] align-top">{p.display_nomor_peserta}</td>
							</tr>
							{/if}
							<tr>
								<td class="py-[2px] align-top font-medium text-slate-700 whitespace-nowrap">TTL</td>
								<td class="py-[2px] align-top text-center">:</td>
								<td class="py-[2px] align-top">{getTtl(p)}</td>
							</tr>
							<tr>
								<td class="py-[2px] align-top font-medium text-slate-700 whitespace-nowrap">Kelas</td>
								<td class="py-[2px] align-top text-center">:</td>
								<td class="py-[2px] align-top">{p.class_name || '-'}</td>
							</tr>
							<tr class="border-t border-slate-300">
								<td class="py-[2px] pt-1 align-top font-medium text-slate-700 whitespace-nowrap">Username</td>
								<td class="py-[2px] pt-1 align-top text-center">:</td>
								<td class="py-[2px] pt-1 font-bold font-mono tracking-wide align-top">{p.login_username}</td>
							</tr>
							<tr>
								<td class="py-[2px] align-top font-medium text-slate-700 whitespace-nowrap">Password</td>
								<td class="py-[2px] align-top text-center">:</td>
								<td class="py-[2px] font-bold font-mono tracking-wide align-top">{p.login_password}</td>
							</tr>
							<tr>
								<td class="py-[2px] align-top font-medium text-slate-700 whitespace-nowrap">Link Akses</td>
								<td class="py-[2px] align-top text-center">:</td>
								<td class="py-[2px] font-bold align-top">https://ujian-madrasah.pages.dev</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Footer: Photo + TTD Panitia -->
				<div class="px-3 pb-3 flex justify-between items-end">
					<div class="flex-shrink-0">
						{#if p.photo}
							<img src={p.photo} alt="Foto {p.student_name}" class="w-[2cm] h-[2.5cm] border border-slate-400 object-cover bg-slate-50" />
						{:else}
							<div class="w-[2cm] h-[2.5cm] border border-slate-400 flex items-center justify-center bg-slate-50 text-slate-400 text-[9px] text-center p-1">
								Foto<br/>2x3
							</div>
						{/if}
					</div>
					<div class="text-center">
						<p class="text-[10px] mb-6">Panitia Ujian</p>
						<p class="text-[10px] font-bold border-b border-slate-700 inline-block px-3">..............................</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
	{/if}

	{#if participants.length === 0}
		<div class="text-center text-slate-500 py-10">
			Belum ada data siswa.
		</div>
	{/if}
</div>

<style>
	@page {
		size: A4;
		margin: 0;
	}
	@media print {
		:global(body) {
			margin: 0 !important;
			padding: 0 !important;
			-webkit-print-color-adjust: exact !important;
			print-color-adjust: exact !important;
		}
	}
</style>
