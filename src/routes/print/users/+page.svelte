<script lang="ts">
	import { ROLE_LABELS } from '$lib/utils/constants';
	import { parseDate } from '$lib/utils/date';

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
</script>

<svelte:head>
	<title>Daftar Pengguna & Angka Rahasia - {school?.name || 'Ujian Madrasah'}</title>
</svelte:head>

<!-- Floating Bar (Hidden on Print) -->
<div class="no-print fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/90 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md border border-slate-700">
	<div class="flex items-center gap-2">
		<span class="text-xs text-slate-300 font-medium">Filter Role:</span>
		<select
			class="bg-slate-800 text-white text-xs px-2.5 py-1 rounded-lg border border-slate-600 outline-none"
			value={roleFilter}
			on:change={handleRoleChange}
		>
			<option value="">Semua Role ({users.length})</option>
			<option value="guru">Guru</option>
			<option value="pengawas">Pengawas</option>
			<option value="panitia">Panitia Ujian</option>
		</select>
	</div>
	<div class="h-4 w-px bg-slate-700"></div>
	<button
		type="button"
		class="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold transition-colors shadow-sm"
		on:click={printDoc}
	>
		<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
		</svg>
		Cetak / Simpan PDF
	</button>
	<button
		type="button"
		class="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
		on:click={() => window.close()}
	>
		Tutup
	</button>
</div>

<!-- Print Page Container -->
<div class="print-container">
	<!-- KOP Surat -->
	<div class="kop-surat">
		<div class="kop-logo">
			{#if school?.logo_url}
				<img src={school.logo_url} alt="Logo" class="logo-img" />
			{:else}
				<div class="logo-placeholder">LOGO</div>
			{/if}
		</div>
		<div class="kop-text">
			<h1 class="school-name">{school?.name || 'MADRASAH ALIYAH / TSANAWIYAH'}</h1>
			{#if school?.address}
				<p class="school-address">{school.address}</p>
			{/if}
			{#if school?.phone || school?.email}
				<p class="school-contact">
					{school?.phone ? `Telp: ${school.phone}` : ''} 
					{school?.phone && school?.email ? ' | ' : ''} 
					{school?.email ? `Email: ${school.email}` : ''}
				</p>
			{/if}
		</div>
	</div>
	<div class="kop-divider"></div>

	<!-- Title Document -->
	<div class="doc-header">
		<h2 class="doc-title">DAFTAR PENGGUNA & KODE AKSES RAHASIA LOGIN</h2>
		<p class="doc-subtitle">
			{roleFilter ? `Kategori: ${ROLE_LABELS[roleFilter] || roleFilter}` : 'Guru, Pengawas, dan Panitia Ujian'}
		</p>
	</div>

	<!-- Table -->
	<table class="data-table">
		<thead>
			<tr>
				<th style="width: 35px; text-align: center;">No</th>
				<th style="text-align: left;">Nama Lengkap</th>
				<th style="width: 140px; text-align: left;">NIP</th>
				<th style="width: 100px; text-align: center;">Role / Jabatan</th>
				<th style="width: 120px; text-align: left;">Username</th>
				<th style="width: 110px; text-align: center;">Angka Rahasia (PIN)</th>
			</tr>
		</thead>
		<tbody>
			{#each users as u, idx}
				<tr>
					<td style="text-align: center;">{idx + 1}</td>
					<td>
						<strong>{u.name}</strong>
					</td>
					<td style="font-family: monospace; font-size: 11px;">
						{u.nip || '-'}
					</td>
					<td style="text-align: center;">
						<span class="role-badge">{ROLE_LABELS[u.role] || u.role}</span>
					</td>
					<td style="font-family: monospace; font-weight: bold; font-size: 11px;">
						{u.username}
					</td>
					<td style="text-align: center;">
						{#if u.login_pin}
							<span class="pin-code">{u.login_pin}</span>
						{:else}
							<span style="color: #94a3b8; font-size: 10px;">- (Tanpa PIN)</span>
						{/if}
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="6" style="text-align: center; padding: 20px; color: #64748b;">
						Tidak ada data pengguna.
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- Footer Info & Signature -->
	<div class="signature-section">
		<div class="signature-note">
			<p><strong>Catatan Keamanan:</strong></p>
			<p>1. Angka rahasia (PIN) digunakan untuk login via Scan QR Code.</p>
			<p>2. Jaga kerahasiaan username dan angka rahasia masing-masing.</p>
		</div>
		<div class="signature-box">
			<p class="sig-date">{school?.address ? school.address.split(',')[0] : 'Madrasah'}, {today}</p>
			<p class="sig-role">Kepala Madrasah / Administrator,</p>
			<div class="sig-space"></div>
			<p class="sig-name"><u>{school?.principal_name || '__________________________'}</u></p>
			{#if school?.npsn}
				<p class="sig-nip">NPSN: {school.npsn}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

	:global(body) {
		background-color: #f1f5f9;
		margin: 0;
		padding: 20px;
		font-family: 'Inter', sans-serif;
		color: #0f172a;
	}

	.print-container {
		max-width: 210mm;
		margin: 0 auto;
		background: #fff;
		padding: 20mm 20mm;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
		border-radius: 4px;
		box-sizing: border-box;
	}

	.kop-surat {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 8px;
	}

	.kop-logo {
		width: 70px;
		height: 70px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo-img {
		max-width: 70px;
		max-height: 70px;
		object-fit: contain;
	}

	.logo-placeholder {
		width: 60px;
		height: 60px;
		border: 2px dashed #94a3b8;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		color: #94a3b8;
		font-weight: bold;
	}

	.kop-text {
		flex: 1;
		text-align: center;
	}

	.school-name {
		font-size: 16px;
		font-weight: 800;
		text-transform: uppercase;
		margin: 0;
		letter-spacing: 0.03em;
		color: #0f172a;
	}

	.school-address {
		font-size: 11px;
		margin: 2px 0 0 0;
		color: #475569;
	}

	.school-contact {
		font-size: 10px;
		margin: 2px 0 0 0;
		color: #64748b;
	}

	.kop-divider {
		border-top: 3px double #0f172a;
		margin-top: 8px;
		margin-bottom: 16px;
	}

	.doc-header {
		text-align: center;
		margin-bottom: 16px;
	}

	.doc-title {
		font-size: 14px;
		font-weight: 800;
		letter-spacing: 0.05em;
		margin: 0;
		text-transform: uppercase;
	}

	.doc-subtitle {
		font-size: 11px;
		color: #475569;
		margin-top: 2px;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 11px;
		margin-bottom: 24px;
	}

	.data-table th,
	.data-table td {
		border: 1px solid #cbd5e1;
		padding: 7px 9px;
		vertical-align: middle;
	}

	.data-table th {
		background-color: #f8fafc;
		font-weight: 700;
		color: #1e293b;
		text-transform: uppercase;
		font-size: 10px;
		letter-spacing: 0.03em;
	}

	.role-badge {
		display: inline-block;
		font-size: 9.5px;
		font-weight: 700;
		padding: 1.5px 6px;
		border-radius: 4px;
		background-color: #e0f2fe;
		color: #0369a1;
		text-transform: uppercase;
	}

	.pin-code {
		display: inline-block;
		font-family: monospace;
		font-weight: 800;
		font-size: 12px;
		letter-spacing: 0.1em;
		padding: 2px 8px;
		border-radius: 6px;
		background: #fef3c7;
		color: #92400e;
		border: 1px solid #fde68a;
	}

	.signature-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-top: 20px;
		page-break-inside: avoid;
	}

	.signature-note {
		font-size: 10px;
		color: #64748b;
		max-width: 50%;
		line-height: 1.4;
	}

	.signature-note p {
		margin: 2px 0;
	}

	.signature-box {
		text-align: center;
		min-width: 200px;
		font-size: 11px;
	}

	.sig-date {
		margin: 0;
		color: #334155;
	}

	.sig-role {
		margin: 2px 0 0 0;
		font-weight: 600;
	}

	.sig-space {
		height: 60px;
	}

	.sig-name {
		font-weight: 700;
		margin: 0;
	}

	.sig-nip {
		font-size: 10px;
		color: #64748b;
		margin-top: 2px;
	}

	@media print {
		:global(body) {
			background: transparent !important;
			padding: 0 !important;
			margin: 0 !important;
		}

		.no-print {
			display: none !important;
		}

		.print-container {
			max-width: 100% !important;
			box-shadow: none !important;
			padding: 0 !important;
			border-radius: 0 !important;
		}

		@page {
			size: A4 portrait;
			margin: 15mm 15mm 15mm 15mm;
		}

		.data-table th {
			background-color: #f1f5f9 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		.pin-code {
			background-color: #fef3c7 !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		.role-badge {
			background-color: #e0f2fe !important;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
