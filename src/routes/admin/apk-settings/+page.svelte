<script lang="ts">
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores/toast';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	$: school = data.school;
	let requireExambro = '0';
	let masterExitPin = '';
	let showPin = false;
	let isSavingPin = false;

	// Pastikan nilai selalu sinkron dan reaktif dengan data dari server
	$: if (school?.require_exambro !== undefined) {
		requireExambro = String(school.require_exambro);
	}
	$: if (form?.require_exambro !== undefined) {
		requireExambro = String(form.require_exambro);
	}
	// Sinkron PIN master dari server
	$: if (school?.master_exit_pin) {
		masterExitPin = school.master_exit_pin;
	}
	$: if ((form as any)?.master_exit_pin) {
		masterExitPin = (form as any).master_exit_pin;
	}

	$: if (form?.error) {
		toasts.error(form.error);
	} else if ((form as any)?.success) {
		toasts.success((form as any).message || 'Pengaturan APK berhasil disimpan.');
	} else if ((form as any)?.success_pin) {
		toasts.success((form as any).message || 'PIN Master berhasil diperbarui.');
	}

	let isSaving = false;
</script>

<svelte:head>
	<title>Pengaturan APK — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Pengaturan Aplikasi Exambro (APK)</h1>
			<p class="text-sm text-slate-500 mt-1">
				Atur kebijakan akses ujian siswa untuk <strong class="text-slate-700">{school?.name || 'Madrasah'}</strong>.
			</p>
		</div>
		<div class="shrink-0">
			{#if requireExambro === '1'}
				<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
					<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
					Wajib Aplikasi Exambro Aktif
				</span>
			{:else}
				<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 shadow-xs">
					<span class="w-2 h-2 rounded-full bg-blue-500"></span>
					Mode Bebas (Web & APK)
				</span>
			{/if}
		</div>
	</div>

	<!-- Superadmin School Switcher (jika ada lebih dari 1 sekolah) -->
	{#if data.isSuperAdmin && data.allSchools && data.allSchools.length > 1}
		<div class="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
					</svg>
				</div>
				<div>
					<span class="text-xs font-bold uppercase tracking-wider text-slate-700 block">Pilih Sekolah yang Dikelola (Superadmin):</span>
					<span class="text-xs text-slate-500">Anda login sebagai Superadmin. Pilih sekolah yang ingin diatur kebijakannya.</span>
				</div>
			</div>
			<select 
				class="select text-xs font-medium w-full sm:w-72 bg-white"
				value={data.selectedSchoolId}
				on:change={(e) => {
					window.location.href = `/admin/apk-settings?school_id=${e.currentTarget.value}`;
				}}
			>
				{#each data.allSchools as s}
					<option value={s.id}>
						{s.name} — [{s.require_exambro === 1 ? 'Wajib Exambro' : 'Bebas Web'}]
					</option>
				{/each}
			</select>
		</div>
	{/if}

	<!-- Form Card -->
	<form 
		method="POST" 
		action="?/update" 
		use:enhance={() => {
			isSaving = true;
			return async ({ update }) => {
				isSaving = false;
				// reset: false penting agar pilihan radio tidak ter-reset ke bawaan DOM
				await update({ reset: false });
			};
		}} 
		class="space-y-6"
	>
		<input type="hidden" name="school_id" value={school?.id} />

		<div class="card p-6 border border-slate-200/80 shadow-xs bg-white rounded-xl">
			<div class="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
				<div>
					<h2 class="text-base font-bold text-slate-800">Kebijakan Akses Siswa</h2>
					<p class="text-xs text-slate-500 mt-0.5">Pilih metode yang diizinkan bagi siswa sekolah <strong class="text-slate-700">{school?.name}</strong> untuk login dan ujian.</p>
				</div>
				{#if data.isSuperAdmin}
					<label class="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer bg-slate-50 hover:bg-slate-100 p-2 rounded-lg border border-slate-200 transition-colors">
						<input type="checkbox" name="apply_all" value="1" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
						<span class="font-medium">Terapkan ke <strong>Semua Madrasah</strong></span>
					</label>
				{/if}
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Option 1: Bebas (Web & APK) -->
				<div 
					role="button"
					tabindex="0"
					class="relative flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 {requireExambro === '0' ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-600/10' : 'border-slate-200 hover:border-slate-300 bg-white'}"
					on:click={() => requireExambro = '0'}
					on:keydown={(e) => { if (e.key === ' ' || e.key === 'Enter') requireExambro = '0'; }}
				>
					<div class="flex items-start justify-between gap-3 mb-3">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-lg {requireExambro === '0' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'} flex items-center justify-center shrink-0">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
								</svg>
							</div>
							<div>
								<span class="font-bold text-sm text-slate-800 block">Bebas (Web Browser & APK)</span>
								<span class="text-xs text-slate-500">Fleksibel untuk semua jenis perangkat</span>
							</div>
						</div>
						<input 
							type="radio" 
							name="require_exambro" 
							value="0" 
							checked={requireExambro === '0'}
							bind:group={requireExambro}
							class="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 mt-1"
						/>
					</div>
					<ul class="text-xs text-slate-600 space-y-1.5 border-t border-slate-200/80 pt-3 mt-1">
						<li class="flex items-start gap-1.5">
							<svg class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
							<span>Siswa dapat login melalui Google Chrome, Edge, Safari, dll.</span>
						</li>
						<li class="flex items-start gap-1.5">
							<svg class="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
							<span>Dapat digunakan dari laptop, komputer laboratorium, atau HP.</span>
						</li>
						<li class="flex items-start gap-1.5">
							<svg class="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
							<span>Pengamanan hanya menggunakan anti-cheat berbasis web (tab blur & fullscreen).</span>
						</li>
					</ul>
				</div>

				<!-- Option 2: Wajib Aplikasi Exambro -->
				<div 
					role="button"
					tabindex="0"
					class="relative flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 {requireExambro === '1' ? 'border-emerald-600 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-600/10' : 'border-slate-200 hover:border-slate-300 bg-white'}"
					on:click={() => requireExambro = '1'}
					on:keydown={(e) => { if (e.key === ' ' || e.key === 'Enter') requireExambro = '1'; }}
				>
					<div class="flex items-start justify-between gap-3 mb-3">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-lg {requireExambro === '1' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'} flex items-center justify-center shrink-0">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
							</div>
							<div>
								<div class="flex items-center gap-1.5">
									<span class="font-bold text-sm text-slate-800 block">Wajib Aplikasi Exambro Madrasah</span>
									<span class="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-200 text-emerald-900">Aman</span>
								</div>
								<span class="text-xs text-slate-500">Kunci layar total & anti-kecurangan maksimal</span>
							</div>
						</div>
						<input 
							type="radio" 
							name="require_exambro" 
							value="1" 
							checked={requireExambro === '1'}
							bind:group={requireExambro}
							class="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500 mt-1"
						/>
					</div>
					<ul class="text-xs text-slate-600 space-y-1.5 border-t border-slate-200/80 pt-3 mt-1">
						<li class="flex items-start gap-1.5">
							<svg class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
							<span>Siswa <strong>WAJIB</strong> membuka aplikasi Android Exambro Madrasah.</span>
						</li>
						<li class="flex items-start gap-1.5">
							<svg class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
							<span>Jika siswa login lewat browser web biasa, akan diblokir dengan pesan petunjuk unduh aplikasi.</span>
						</li>
						<li class="flex items-start gap-1.5">
							<svg class="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
							<span>Guru, Pengawas, dan Administrator tetap dapat membuka web dari browser biasa tanpa batas.</span>
						</li>
					</ul>
				</div>
			</div>

			<div class="mt-6 pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
				<button 
					type="submit" 
					class="btn-primary flex items-center gap-2 text-sm px-6 py-2.5 shadow-sm"
					disabled={isSaving}
				>
					{#if isSaving}
						<svg class="w-4 h-4 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						<span>Menyimpan...</span>
					{:else}
						<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
						</svg>
						<span>Simpan Kebijakan APK</span>
					{/if}
				</button>
			</div>
		</div>
	</form>

	<!-- Information Cards Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Card 1: Mekanisme PIN Keluar Ujian -->
		<div class="card p-6 bg-white border border-slate-200/80 rounded-xl space-y-4 shadow-xs">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<div>
					<h3 class="text-sm font-bold text-slate-800">Sistem PIN Keluar & Toleransi Ujian</h3>
					<p class="text-xs text-slate-500">Keamanan terpadu aplikasi Exambro Madrasah</p>
				</div>
			</div>
			
			<div class="space-y-3 text-xs text-slate-600 leading-relaxed">
				<div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
					<span class="font-bold text-slate-800 block mb-1">1. Toleransi Halaman Awal & Token:</span>
					Siswa dapat bebas membuka aplikasi, memilih tombol Tentang Kami, Cek Update, atau memasukkan token ujian tanpa diminta PIN pengawas dan tanpa tercatat pelanggaran.
				</div>
				<div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
					<span class="font-bold text-slate-800 block mb-1">2. Penguncian Dimulai Saat Masuk Soal:</span>
					Kunci layar penuh, deteksi pelanggaran, dan perlindungan tombol keluar baru aktif setelah siswa menekan tombol "Mulai Ujian" dan masuk ke halaman pengerjaan soal.
				</div>
				<div class="p-3 bg-amber-50/70 rounded-lg border border-amber-200/70 text-amber-900">
					<span class="font-bold text-amber-950 block mb-1">3. PIN Acak per Ujian:</span>
					Setiap ujian memiliki PIN Keluar acak 5-digit yang dapat dilihat oleh Pengawas dan Admin di halaman <strong>Monitoring Ujian</strong>. Tersedia juga PIN Pengawas Master <code class="bg-amber-200/70 px-1 py-0.5 rounded font-mono font-bold">12345</code> sebagai cadangan darurat.
				</div>
			</div>
		</div>

		<!-- Card 2: Fitur Keamanan Exambro -->
		<div class="card p-6 bg-white border border-slate-200/80 rounded-xl space-y-4 shadow-xs">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
					</svg>
				</div>
				<div>
					<h3 class="text-sm font-bold text-slate-800">Proteksi Aplikasi Exambro</h3>
					<p class="text-xs text-slate-500">Fitur proteksi bawaan di perangkat Android siswa</p>
				</div>
			</div>

			<ul class="space-y-2 text-xs text-slate-600">
				<li class="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
					<span class="w-2 h-2 rounded-full bg-indigo-500"></span>
					<span><strong>Anti-Screenshot & Layar Gelap:</strong> Mencegah tangkapan layar dan perekaman layar HP.</span>
				</li>
				<li class="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
					<span class="w-2 h-2 rounded-full bg-indigo-500"></span>
					<span><strong>Anti-Split Screen & Floating Apps:</strong> Mencegah membuka kalkulator / Google melayang.</span>
				</li>
				<li class="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
					<span class="w-2 h-2 rounded-full bg-indigo-500"></span>
					<span><strong>Pembaruan Otomatis (Cek Update):</strong> Siswa dapat langsung memperbarui aplikasi tanpa install ulang manual.</span>
				</li>
				<li class="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
					<span class="w-2 h-2 rounded-full bg-indigo-500"></span>
					<span><strong>Sertifikat Keamanan Resmi:</strong> Ditandatangani dengan keystore resmi agar tidak terdeteksi aplikasi palsu.</span>
				</li>
			</ul>
		</div>
	</div>

	<!-- Card: PIN Master Pengawas -->
	<div class="card p-6 bg-white border border-slate-200/80 rounded-xl shadow-xs">
		<div class="flex items-center gap-3 mb-5">
			<div class="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
				</svg>
			</div>
			<div>
				<h3 class="text-sm font-bold text-slate-800">PIN Master Pengawas (Cadangan Darurat)</h3>
				<p class="text-xs text-slate-500">PIN ini digunakan sebagai cadangan jika PIN per-ujian tidak tersedia di APK siswa.</p>
			</div>
		</div>

		<form
			method="POST"
			action="?/update_pin"
			use:enhance={() => {
				isSavingPin = true;
				return async ({ update }) => {
					isSavingPin = false;
					await update({ reset: false });
				};
			}}
			class="space-y-4"
		>
			<input type="hidden" name="school_id" value={school?.id} />

			<!-- Info box -->
			<div class="p-3 bg-amber-50 rounded-lg border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
				<div class="flex items-start gap-2">
					<svg class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
					<span>
						<strong>Prioritas PIN saat siswa ingin keluar ujian:</strong><br/>
						1. PIN per-ujian acak (tampil di halaman Monitoring — lebih aman, berbeda tiap ujian)<br/>
						2. PIN Master ini (cadangan jika PIN per-ujian belum tersinkron ke APK)
					</span>
				</div>
			</div>

			<div class="flex flex-col sm:flex-row sm:items-end gap-3">
				<div class="flex-1 space-y-1.5">
					<label for="master_exit_pin" class="block text-xs font-semibold text-slate-700">
						PIN Master Baru
						<span class="font-normal text-slate-400">(4–8 digit angka)</span>
					</label>
					<div class="relative">
						<input
							id="master_exit_pin"
							name="master_exit_pin"
							type={showPin ? 'text' : 'password'}
							inputmode="numeric"
							pattern={"[0-9]{4,8}"}
							maxlength="8"
							placeholder={masterExitPin ? '••••••' : 'Contoh: 98523'}
							bind:value={masterExitPin}
							required
							class="input pr-10 font-mono text-lg tracking-widest w-full"
						/>
						<button
							type="button"
							class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
							on:click={() => showPin = !showPin}
							title={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
						>
							{#if showPin}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
							{:else}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
							{/if}
						</button>
					</div>
					{#if school?.master_exit_pin}
						<p class="text-xs text-slate-500">
							PIN master saat ini: 
							<code class="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-700">{showPin ? school.master_exit_pin : '•'.repeat(school.master_exit_pin.length)}</code>
						</p>
					{:else}
						<p class="text-xs text-amber-600 font-medium">
							⚠ PIN master belum diatur — APK menggunakan PIN default <code class="bg-amber-100 px-1 rounded font-mono">12345</code> yang diketahui publik.
						</p>
					{/if}
				</div>
				<button
					type="submit"
					class="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 shrink-0 shadow-sm"
					disabled={isSavingPin}
				>
					{#if isSavingPin}
						<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
						<span>Menyimpan...</span>
					{:else}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
						<span>Simpan PIN Master</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
