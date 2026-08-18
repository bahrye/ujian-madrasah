<script lang="ts">
	import { ROLE_LABELS } from '$lib/utils/constants';

	export let data;
	$: school = data.school as any;
	$: users = (data.users || []) as any[];
	$: roleFilter = data.roleFilter;

	function printDoc() {
		window.print();
	}

	function handleRoleChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const val = target.value;
		const url = new URL(window.location.href);
		if (val) {
			url.searchParams.set('role', val);
		} else {
			url.searchParams.delete('role');
		}
		window.location.href = url.toString();
	}

	const today = new Date().toLocaleDateString('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});

	$: locationStr = [
		school?.district ? `Kecamatan ${school.district}` : '',
		school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kabupaten ${school.city}`) : '',
		school?.province ? school.province : ''
	].filter(Boolean).join(', ');
</script>

<svelte:head>
	<title>Daftar Pengguna & Angka Rahasia - {school?.name || 'Ujian Madrasah'}</title>
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
			size: 215.9mm 330mm; /* F4 / Folio */
			margin: 0;
		}
		:global(body) {
			margin: 0;
			padding: 1.5cm 1cm;
			font-family: 'Times New Roman', Times, Arial, serif !important;
			font-variant-numeric: lining-nums tabular-nums !important;
			-webkit-font-feature-settings: "lnum" 1, "tnum" 1 !important;
			font-feature-settings: "lnum" 1, "tnum" 1 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
		.no-print {
			display: none !important;
		}
	}
</style>

<!-- Control Bar (Hidden on Print) -->
<div class="no-print p-4 bg-slate-800 text-white border-b border-slate-700 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
	<div class="flex items-center gap-3 text-xs text-slate-300">
		<span>Filter Jabatan:</span>
		<select
			class="bg-slate-700 text-white text-xs px-2.5 py-1.5 rounded border border-slate-600 outline-none"
			value={roleFilter}
			on:change={handleRoleChange}
		>
			<option value="">Semua Role ({users.length})</option>
			<option value="guru">Guru</option>
			<option value="pengawas">Pengawas</option>
			<option value="panitia">Panitia Ujian</option>
		</select>
	</div>

	<div class="flex items-center gap-2">
		<button class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium transition-colors" on:click={() => window.close()}>Tutup</button>
		<button class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-bold transition-colors flex items-center gap-1.5 shadow" on:click={printDoc}>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
			</svg>
			Cetak / Simpan PDF
		</button>
	</div>
</div>

<div class="p-4 md:p-8 print:p-0 print:m-0 max-w-[215.9mm] mx-auto bg-white" style="font-family: 'Times New Roman', Times, Arial, serif; font-variant-numeric: lining-nums tabular-nums;">
	<!-- Kop Surat Resmi (Sama persis seperti Daftar Hadir) -->
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
	<div class="mt-2 mb-4">
		<div style="border-bottom: 1px solid #000;"></div>
		<div style="border-bottom: 2.5px solid #000; margin-top: 2px;"></div>
	</div>

	<!-- Title Document -->
	<div class="text-center mb-4">
		<h2 class="text-base font-bold uppercase tracking-wide text-black m-0 underline">
			DAFTAR PENGGUNA & KODE AKSES RAHASIA (PIN) LOGIN
		</h2>
		<p class="text-xs text-black mt-1">
			{roleFilter ? `Kategori: ${ROLE_LABELS[roleFilter] || roleFilter}` : 'Guru, Pengawas, dan Panitia Ujian'}
		</p>
	</div>

	<!-- Table -->
	<table class="w-full border-collapse text-xs mb-6 text-black border border-black">
		<thead>
			<tr class="bg-slate-100 print:bg-slate-100">
				<th class="border border-black px-2 py-1.5 text-center font-bold" style="width: 35px;">No</th>
				<th class="border border-black px-2.5 py-1.5 text-left font-bold">Nama Lengkap</th>
				<th class="border border-black px-2.5 py-1.5 text-left font-bold" style="width: 140px;">NIP</th>
				<th class="border border-black px-2.5 py-1.5 text-center font-bold" style="width: 100px;">Jabatan</th>
				<th class="border border-black px-2.5 py-1.5 text-left font-bold" style="width: 120px;">Username</th>
				<th class="border border-black px-2.5 py-1.5 text-center font-bold" style="width: 110px;">Angka Rahasia (PIN)</th>
			</tr>
		</thead>
		<tbody>
			{#each users as u, idx}
				<tr class="hover:bg-slate-50">
					<td class="border border-black px-2 py-1 text-center">{idx + 1}</td>
					<td class="border border-black px-2.5 py-1 font-medium">{u.name}</td>
					<td class="border border-black px-2.5 py-1 font-mono">{u.nip || '-'}</td>
					<td class="border border-black px-2.5 py-1 text-center font-semibold">{ROLE_LABELS[u.role] || u.role}</td>
					<td class="border border-black px-2.5 py-1 font-mono font-bold">{u.username}</td>
					<td class="border border-black px-2.5 py-1 text-center font-mono font-bold text-sm tracking-wider">
						{u.login_pin || '-'}
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="6" class="border border-black p-4 text-center text-slate-500 italic">
						Tidak ada data pengguna.
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- Signature Section -->
	<div class="flex justify-between items-start mt-6 text-xs text-black" style="page-break-inside: avoid;">
		<div class="max-w-[45%] text-[11px] leading-tight">
			<p class="font-bold underline mb-1">Catatan Keamanan:</p>
			<p class="m-0 mb-0.5">1. Angka rahasia (PIN) digunakan untuk login via Scan QR Code.</p>
			<p class="m-0">2. Harap menjaga kerahasiaan username dan angka rahasia masing-masing.</p>
		</div>
		<div class="text-center min-w-[220px]">
			<p class="m-0">{school?.city ? (school.city.toLowerCase().startsWith('kab') || school.city.toLowerCase().startsWith('kota') ? school.city : `Kab. ${school.city}`) : (school?.address ? school.address.split(',')[0] : 'Madrasah')}, {today}</p>
			<p class="m-0 font-semibold mt-0.5">Kepala Madrasah,</p>
			<div class="h-16"></div>
			<p class="m-0 font-bold underline">{school?.principal_name || '....................................................'}</p>
			<p class="m-0 mt-0.5">NIP. {school?.principal_nip || school?.nip || '-'}</p>
		</div>
	</div>
</div>
