<script lang="ts">
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores/toast';
	import type { PageData, ActionData } from './$types';
	import { env } from '$env/dynamic/public';

	export let data: PageData;
	export let form: ActionData;

	$: school = data.school as any;

	// Logo state — separate from form, injected manually on submit
	let logoUrl: string = school?.logo_url || '';
	let isUploading = false;
	let uploadProgress = 0;
	let uploadError = '';

	let fileInput: HTMLInputElement;

	const cloudName = env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfhtjgwcz';
	const uploadPreset = env.PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ujian-madrasah';

	$: if (form?.error) {
		toasts.error(form.error);
	} else if (form?.success) {
		toasts.success(form.message || 'Profil sekolah berhasil disimpan.');
	}

	// Custom enhance: inject logoUrl into FormData before sending
	function handleEnhance({ formData }: { formData: FormData }) {
		formData.set('logo_url', logoUrl);
		return async ({ update }: { update: (options?: any) => Promise<void> }) => {
			await update({ reset: false });
		};
	}

	async function handleLogoUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			uploadError = 'Ukuran file terlalu besar. Maksimal 5MB.';
			return;
		}

		isUploading = true;
		uploadProgress = 20;
		uploadError = '';

		const fd = new FormData();
		fd.append('file', file);
		fd.append('upload_preset', uploadPreset);

		try {
			uploadProgress = 50;
			const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
				method: 'POST',
				body: fd
			});
			uploadProgress = 90;
			if (!res.ok) {
				const err = await res.json() as any;
				throw new Error(err.error?.message || 'Gagal mengunggah logo.');
			}
			const result = await res.json() as any;
			logoUrl = result.secure_url;
			uploadProgress = 100;

			// 1. Simpan ke bank media
			try {
				await fetch('/api/track-media', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url: logoUrl, media_type: 'image' })
				});
			} catch (e) {
				console.error('Gagal menyimpan logo ke bank media:', e);
			}

			// 2. Submit form utama untuk menyimpan logo beserta data lainnya
			setTimeout(() => {
				const formElement = document.querySelector('form');
				if (formElement) formElement.requestSubmit();
			}, 100);

		} catch (err: any) {
			uploadError = err.message || 'Terjadi kesalahan saat mengunggah.';
		} finally {
			isUploading = false;
			if (fileInput) fileInput.value = '';
			setTimeout(() => { uploadProgress = 0; }, 1000);
		}
	}

	function removeLogo() {
		logoUrl = '';
	}

	const ACCREDITATIONS = ['A', 'B', 'C', 'Belum Terakreditasi'];
</script>

<svelte:head>
	<title>Profil Sekolah - Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
		<div>
			<h1 class="text-3xl font-bold text-slate-800 tracking-tight">Profil Sekolah</h1>
			<p class="text-slate-500 mt-1">Kelola identitas dan informasi resmi sekolah.</p>
		</div>
	</div>

	<!-- Hero Card -->
	<div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 shadow-xl shadow-indigo-500/20">
		<!-- Decorative blobs -->
		<div class="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
		<div class="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-violet-400/20 blur-2xl pointer-events-none"></div>

		<div class="relative flex flex-col sm:flex-row items-center sm:items-end gap-5">
			<!-- Logo Preview -->
			<div class="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
				{#if logoUrl}
					<img src={logoUrl} alt="Logo Sekolah" class="w-full h-full object-contain p-1" />
				{:else}
					<svg class="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 5.523-4.477 10-10 10S2 18.523 2 13c0-.97.13-1.91.38-2.8L12 14z"/>
					</svg>
				{/if}
			</div>
			<div>
				<p class="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Profil Institusi</p>
				<h2 class="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
					{school?.name || 'Nama Sekolah'}
				</h2>
				{#if school?.npsn}
					<p class="text-indigo-200 text-sm mt-1">NPSN: {school.npsn}</p>
				{/if}
				{#if school?.accreditation}
					<span class="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
						Akreditasi {school.accreditation}
					</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Form -->
	<form method="POST" action="?/update" use:enhance={handleEnhance} class="grid grid-cols-1 lg:grid-cols-3 gap-6">

		<!-- Left Column: Logo Upload -->
		<div class="lg:col-span-1 space-y-5">
			<!-- Logo Uploader Card -->
			<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
				<h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
					<div class="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
						<svg class="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z"/>
						</svg>
					</div>
					Logo Sekolah
				</h3>

				{#if logoUrl}
					<!-- Preview + Change -->
					<div class="relative rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 flex flex-col items-center gap-3">
						<img src={logoUrl} alt="Logo" class="max-h-36 object-contain rounded-lg" />
						<button
							type="button"
							class="text-xs font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1"
							on:click={removeLogo}
						>
							<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
							</svg>
							Hapus Logo
						</button>
					</div>
				{:else}
					<!-- Drop zone -->
					<div class="relative">
						<input
							type="file"
							accept="image/*"
							class="hidden"
							bind:this={fileInput}
							on:change={handleLogoUpload}
							disabled={isUploading}
						/>
						<button
							type="button"
							class="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all {isUploading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}"
							on:click={() => fileInput.click()}
							disabled={isUploading}
						>
							{#if isUploading}
								<svg class="animate-spin w-8 h-8 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								<span class="text-sm font-medium text-indigo-600">Mengunggah...</span>
							{:else}
								<div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
									<svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
									</svg>
								</div>
								<span class="text-sm font-medium text-slate-700">Klik untuk unggah logo</span>
								<span class="text-xs text-slate-400 mt-1">PNG, JPG, SVG — Maks 5MB</span>
							{/if}
						</button>
						{#if isUploading && uploadProgress > 0}
							<div class="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
								<div class="h-full bg-indigo-500 transition-all duration-300" style="width:{uploadProgress}%"></div>
							</div>
						{/if}
					</div>
				{/if}

				{#if uploadError}
					<p class="text-xs text-rose-500 mt-2">{uploadError}</p>
				{/if}

				<p class="text-xs text-slate-400 mt-3 text-center">Logo akan tampil di kartu login siswa</p>
			</div>
		</div>

		<!-- Right Column: Form Fields -->
		<div class="lg:col-span-2 space-y-5">
			<!-- Identitas Sekolah -->
			<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
				<h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
					<div class="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
						<svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
						</svg>
					</div>
					Identitas Sekolah
				</h3>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="sm:col-span-2">
						<label for="name" class="block text-sm font-semibold text-slate-700 mb-1.5">
							Nama Sekolah <span class="text-rose-500">*</span>
						</label>
						<input
							type="text"
							id="name"
							name="name"
							class="input"
							required
							placeholder="contoh: MAN 1 Kota..."
							value={school?.name || ''}
						/>
					</div>
					<div>
						<label for="npsn" class="block text-sm font-semibold text-slate-700 mb-1.5">NPSN</label>
						<input
							type="text"
							id="npsn"
							name="npsn"
							class="input"
							placeholder="8 digit NPSN"
							value={school?.npsn || ''}
						/>
					</div>
					<div>
						<label for="accreditation" class="block text-sm font-semibold text-slate-700 mb-1.5">Akreditasi</label>
						<select id="accreditation" name="accreditation" class="input">
							<option value="">-- Pilih Akreditasi --</option>
							{#each ACCREDITATIONS as a}
								<option value={a} selected={school?.accreditation === a}>{a}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>

			<!-- Kepala Sekolah & Kontak -->
			<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
				<h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
					<div class="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
						<svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
						</svg>
					</div>
					Kepala Sekolah & Kontak
				</h3>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="sm:col-span-2">
						<label for="principal_name" class="block text-sm font-semibold text-slate-700 mb-1.5">Nama Kepala Sekolah</label>
						<input
							type="text"
							id="principal_name"
							name="principal_name"
							class="input"
							placeholder="Drs. H. ..."
							value={school?.principal_name || ''}
						/>
					</div>
					<div>
						<label for="phone" class="block text-sm font-semibold text-slate-700 mb-1.5">Nomor Telepon</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							class="input"
							placeholder="(0xxx) xxxxxxx"
							value={school?.phone || ''}
						/>
					</div>
					<div>
						<label for="email" class="block text-sm font-semibold text-slate-700 mb-1.5">Email Sekolah</label>
						<input
							type="email"
							id="email"
							name="email"
							class="input"
							placeholder="info@sekolah.sch.id"
							value={school?.email || ''}
						/>
					</div>
					<div class="sm:col-span-2">
						<label for="website" class="block text-sm font-semibold text-slate-700 mb-1.5">Website Sekolah</label>
						<input
							type="url"
							id="website"
							name="website"
							class="input"
							placeholder="https://sekolah.sch.id"
							value={school?.website || ''}
						/>
					</div>
				</div>
			</div>

			<!-- Alamat -->
			<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
				<h3 class="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
					<div class="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
						<svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
						</svg>
					</div>
					Alamat Sekolah
				</h3>
				<div>
					<label for="address" class="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Lengkap</label>
					<textarea
						id="address"
						name="address"
						rows="3"
						class="input resize-none"
						placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan, Kota, Provinsi"
					>{school?.address || ''}</textarea>
				</div>
			</div>

			<!-- Submit -->
			<div class="flex justify-end">
				<button type="submit" class="btn btn-primary px-8">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
					</svg>
					Simpan Profil Sekolah
				</button>
			</div>
		</div>
	</form>
</div>
