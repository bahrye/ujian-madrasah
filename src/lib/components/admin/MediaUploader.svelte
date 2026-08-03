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
			value = data.secure_url;
			dispatch('upload', { url: data.secure_url, type: file.type.startsWith('image/') ? 'image' : 'audio' });
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
		if (value && value.includes('res.cloudinary.com')) {
			isUploading = true;
			try {
				await fetch('/api/delete-media', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url: value })
				});
			} catch (e) {
				console.error('Delete error:', e);
			} finally {
				isUploading = false;
			}
		}
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
	{/if}

	{#if errorMsg}
		<p class="text-xs text-rose-500 mt-1">{errorMsg}</p>
	{/if}
</div>
