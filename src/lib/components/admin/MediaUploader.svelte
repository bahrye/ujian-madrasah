<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { env } from '$env/dynamic/public';

	export let value: string = '';
	export let label: string = 'Unggah Media';
	export let accept: string = 'image/*,audio/*';

	const dispatch = createEventDispatcher();
	let isUploading = false;
	let progress = 0;
	let errorMsg = '';
	let fileInput: HTMLInputElement;

	let showBankModal = false;
	let bankMedia: {url: string, media_type: string}[] = [];
	let loadingBank = false;

	async function openBankModal() {
		showBankModal = true;
		if (bankMedia.length === 0) {
			loadingBank = true;
			try {
				const res = await fetch('/api/media');
				const data = await res.json();
				if (data.success) bankMedia = data.media;
			} catch (e) {
				console.error(e);
			} finally {
				loadingBank = false;
			}
		}
	}

	function selectFromBank(mediaUrl: string, mediaType: string) {
		value = mediaUrl;
		dispatch('upload', { url: mediaUrl, type: mediaType });
		showBankModal = false;
	}

	const cloudName = env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfhtjgwcz';
	const uploadPreset = env.PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ujian-madrasah';

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		if (!cloudName || !uploadPreset) {
			errorMsg = 'Sistem belum dikonfigurasi untuk unggah media (Cloud Name atau Preset hilang di .env).';
			return;
		}

		// Validasi ukuran (maks 10MB)
		if (file.size > 10 * 1024 * 1024) {
			errorMsg = 'Ukuran file terlalu besar. Maksimal 10MB.';
			return;
		}

		isUploading = true;
		progress = 10;
		errorMsg = '';

		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', uploadPreset);

		// Menentukan resource_type berdasarkan tipe file
		const resourceType = file.type.startsWith('image/') ? 'image' : 'video'; // Cloudinary uses 'video' for audio files too

		try {
			progress = 40;
			const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
				method: 'POST',
				body: formData
			});

			progress = 80;
			if (!response.ok) {
				const errData = await response.json();
				throw new Error(errData.error?.message || 'Gagal mengunggah file.');
			}

			const data = await response.json();
			const newUrl = data.secure_url;
			const newType = file.type.startsWith('image/') ? 'image' : 'audio';
			
			// Lacak ke database backend
			try {
				await fetch('/api/track-media', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url: newUrl, media_type: newType })
				});
			} catch (e) {
				console.error('Failed to track media in DB:', e);
			}

			value = newUrl;
			dispatch('upload', { url: newUrl, type: newType });
			progress = 100;
		} catch (err: any) {
			console.error('Upload error:', err);
			errorMsg = err.message || 'Terjadi kesalahan saat mengunggah.';
		} finally {
			isUploading = false;
			if (fileInput) fileInput.value = '';
			setTimeout(() => { progress = 0; }, 1000);
		}
	}

	async function handleRemove() {
		// Menghapus langsung dari Cloudinary saat tombol 'X' ditekan ditiadakan.
		// Penghapusan permanen hanya terjadi saat form 'Simpan' ditekan (ditangani oleh backend).
		value = '';
		dispatch('remove');
	}

	function handleManualUrl(event: Event) {
		const target = event.target as HTMLInputElement;
		const url = target.value.trim();
		value = url;
		
		if (!url) {
			dispatch('remove');
			return;
		}

		let type = 'image';
		if (url.match(/\.(mp3|wav|ogg|m4a)$/i) || url.includes('drive.google.com') || url.includes('vocaroo') || url.includes('dropbox')) {
			type = 'audio';
		}

		dispatch('upload', { url, type });
	}

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}
		};
	}
</script>

<div class="space-y-3">
	<label class="label block text-sm font-medium text-slate-700">{label}</label>
	
	{#if value && !value.includes('res.cloudinary.com')}
		<div class="relative">
			<input
				type="url"
				class="input pr-10"
				placeholder="Tempel URL media (opsional)..."
				value={value}
				on:input={handleManualUrl}
				disabled={isUploading}
			/>
			<button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors" title="Hapus URL" on:click={handleRemove} disabled={isUploading}>
				<svg class="w-4 h-4 {isUploading ? 'animate-spin' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if isUploading}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					{/if}
				</svg>
			</button>
		</div>
	{:else if value}
		<div class="relative group rounded-xl border border-indigo-100 bg-indigo-50/50 p-2 overflow-hidden {isUploading ? 'opacity-50' : ''}">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 text-indigo-600">
					{#if value.match(/\.(jpeg|jpg|gif|png|webp)$/i)}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
					{:else}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
					{/if}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-xs text-indigo-900 font-medium truncate">{value.split('/').pop()}</p>
					<p class="text-[10px] text-indigo-500 truncate">{isUploading ? 'Menghapus...' : 'Berhasil diunggah'}</p>
				</div>
				<button type="button" class="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors flex-shrink-0" title="Hapus file" on:click={handleRemove} disabled={isUploading}>
					<svg class="w-4 h-4 {isUploading ? 'animate-spin' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if isUploading}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						{/if}
					</svg>
				</button>
			</div>
		</div>
	{:else}
		<div class="relative">
			<input
				type="file"
				{accept}
				class="hidden"
				bind:this={fileInput}
				on:change={handleFileSelect}
				disabled={isUploading}
			/>
			<button
				type="button"
				class="w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all {isUploading ? 'opacity-50 cursor-not-allowed' : ''}"
				on:click={() => fileInput.click()}
				disabled={isUploading}
			>
				<div class="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-2">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
					</svg>
				</div>
				<span class="text-sm font-medium text-slate-700">
					{isUploading ? 'Mengunggah...' : 'Klik untuk memilih file'}
				</span>
				<span class="text-xs text-slate-400 mt-1">Maksimal 10MB (Gambar/Audio)</span>
			</button>

			{#if isUploading}
				<div class="absolute inset-x-0 bottom-0 h-1 bg-slate-100 rounded-b-xl overflow-hidden">
					<div 
						class="h-full bg-indigo-500 transition-all duration-300 ease-out" 
						style="width: {progress}%"
					></div>
				</div>
			{/if}
		</div>

		<div class="flex items-center gap-3">
			<div class="h-px bg-slate-200 flex-1"></div>
			<span class="text-xs font-medium text-slate-400 uppercase tracking-wider">ATAU</span>
			<div class="h-px bg-slate-200 flex-1"></div>
		</div>

		<div class="relative">
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
			</div>
			<input
				type="url"
				class="input pl-9"
				placeholder="Tempel URL gambar/audio eksternal di sini..."
				on:input={handleManualUrl}
				disabled={isUploading}
			/>
		</div>

		<button type="button" class="w-full flex items-center justify-center p-3 mt-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-xl border border-indigo-200 transition-colors" on:click={openBankModal} disabled={isUploading}>
			<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
			Pilih dari Bank Media
		</button>
	{/if}

	{#if errorMsg}
		<p class="text-xs text-rose-500 mt-1">{errorMsg}</p>
	{/if}
</div>

{#if showBankModal}
	<div use:portal class="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
		<div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
			<div class="p-4 border-b flex justify-between items-center bg-slate-50/50">
				<h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
					<svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
					Pilih dari Bank Media
				</h3>
				<button type="button" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" on:click={() => showBankModal = false}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>
			<div class="p-6 overflow-y-auto flex-1 bg-slate-50">
				{#if loadingBank}
					<div class="flex flex-col items-center justify-center p-12 text-slate-400">
						<svg class="animate-spin w-8 h-8 mb-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
						<p>Memuat bank berkas...</p>
					</div>
				{:else if bankMedia.length === 0}
					<div class="text-center p-12 bg-white rounded-xl border border-slate-200">
						<svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
						<p class="text-slate-500">Bank berkas masih kosong.</p>
					</div>
				{:else}
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{#each bankMedia as media}
							<button type="button" class="group relative border rounded-xl bg-white overflow-hidden hover:border-indigo-500 hover:shadow-md transition-all text-left flex flex-col h-full" on:click={() => selectFromBank(media.url, media.media_type)}>
								<div class="h-28 bg-slate-100 flex items-center justify-center relative border-b border-slate-100">
									<span class="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-slate-900/60 backdrop-blur-sm text-white px-2 py-0.5 rounded shadow-sm z-10">{media.media_type}</span>
									{#if media.media_type === 'image'}
										<img src={media.url} alt="Media" class="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" loading="lazy" />
									{:else}
										<div class="text-indigo-400 group-hover:text-indigo-500 transition-colors">
											<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
										</div>
									{/if}
								</div>
								<div class="p-2 bg-white">
									<p class="text-[10px] text-slate-500 truncate" title={media.name || media.url.split('/').pop()}>{media.name || media.url.split('/').pop()}</p>
								</div>
								
								<!-- Overlay on hover -->
								<div class="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center">
									<div class="opacity-0 group-hover:opacity-100 bg-white text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transform translate-y-2 group-hover:translate-y-0 transition-all">
										Pilih Media
									</div>
								</div>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
