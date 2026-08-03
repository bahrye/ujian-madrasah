<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import MediaUploader from '$lib/components/admin/MediaUploader.svelte';

	export let data: PageData;
	export let form: ActionData;

	let isDeleting = false;
	let showUploadModal = false;
	let tempUploadedUrl = '';
	let itemToDelete: any = null;
	let previewMedia: { type: 'image' | 'audio', url: string } | null = null;

	let successMsg = '';
	let errorMsg = '';
	
	$: {
		if (form?.success) {
			successMsg = form.success;
			setTimeout(() => successMsg = '', 4000);
		}
		if (form?.error) {
			errorMsg = form.error;
			setTimeout(() => errorMsg = '', 6000);
		}
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

<svelte:head>
	<title>Bank Media - Ujian Madrasah</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
	<div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
				<svg class="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
				Bank Media (Cloudinary)
			</h1>
			<p class="text-slate-500 mt-1">Kelola semua file gambar dan audio yang telah diunggah ke Cloudinary dan terhubung dengan soal ujian.</p>
		</div>
		<button class="btn btn-primary whitespace-nowrap shadow-sm" on:click={() => showUploadModal = true}>
			<svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
			Unggah Media Baru
		</button>
	</div>

	{#if errorMsg}
		<div class="alert alert-danger mb-6 transition-opacity duration-300">
			<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
			<span>{errorMsg}</span>
		</div>
	{/if}

	{#if successMsg}
		<div class="alert alert-success mb-6 transition-opacity duration-300">
			<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
			<span>{successMsg}</span>
		</div>
	{/if}

	{#if data.mediaItems.length === 0}
		<div class="card p-12 text-center">
			<div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
			</div>
			<h3 class="text-lg font-medium text-slate-900">Bank Media Kosong</h3>
			<p class="text-slate-500 mt-1">Belum ada file media Cloudinary yang terhubung dengan soal ujian.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each data.mediaItems as item}
				<div class="card overflow-hidden flex flex-col {item.question_id ? '' : 'border-amber-400 ring-2 ring-amber-400/20'}">
					<!-- Preview Area -->
					<div class="h-40 {item.question_id ? 'bg-slate-100' : 'bg-amber-50'} relative flex items-center justify-center border-b {item.question_id ? 'border-slate-100' : 'border-amber-200'} cursor-pointer group" on:click={() => previewMedia = { type: item.media_type, url: item.media_url }}>
						{#if item.media_type === 'image'}
							<img src={item.media_url} alt="Media Soal {item.question_number}" class="w-full h-full object-contain p-2 transition-transform group-hover:scale-105" loading="lazy" />
						{:else}
							<div class="text-center p-4 transition-transform group-hover:scale-110">
								<svg class="w-12 h-12 text-indigo-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
								<span class="text-xs font-medium text-slate-500 uppercase tracking-wider">File Audio</span>
							</div>
						{/if}
						<div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-0"></div>
						
						<!-- Action Overlays (Z-index ensures they stay above the click overlay) -->
						<div class="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
							<span class="badge badge-primary shadow-sm">{item.media_type}</span>
						</div>
						<div class="absolute top-2 right-2 z-10">
							{#if item.uploaded_by === data.user?.id}
								<form method="POST" action="?/toggleVisibility" use:enhance>
									<input type="hidden" name="media_url" value={item.media_url} />
									<input type="hidden" name="is_public" value={item.is_public ? '0' : '1'} />
									<button type="submit" class="group relative px-2.5 py-1 rounded-full border shadow-sm transition-all flex items-center gap-1.5 {item.is_public ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}">
										<span class="w-2 h-2 rounded-full {item.is_public ? 'bg-emerald-500' : 'bg-slate-400'} transition-colors"></span>
										<span class="text-[10px] font-semibold tracking-wide">
											{item.is_public ? 'PUBLIK' : 'PRIVAT'}
										</span>
										<div class="absolute inset-0 bg-white/0 group-hover:bg-black/5 rounded-full transition-colors"></div>
									</button>
								</form>
							{:else}
								<span class="badge bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm text-[10px] border px-2.5 py-1">
									🌐 Publik
								</span>
							{/if}
						</div>
					</div>

					<!-- Details Area -->
					<div class="p-4 flex-1 flex flex-col {item.question_id ? '' : 'bg-amber-50/50'}">
						<form method="POST" action="?/updateName" use:enhance class="mb-4">
							<input type="hidden" name="media_url" value={item.media_url} />
							<p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama File</p>
							<div class="flex gap-2">
								<input 
									type="text" 
									name="name" 
									value={item.name || ''} 
									placeholder="Belum ada nama" 
									class="input py-1.5 px-2.5 text-sm flex-1 h-8"
									disabled={item.uploaded_by !== data.user?.id}
								/>
								{#if item.uploaded_by === data.user?.id}
									<button type="submit" class="btn btn-primary py-1.5 px-3 text-xs h-8">Simpan</button>
								{/if}
							</div>
						</form>
						<div class="flex-1 space-y-2 mb-4">
							{#if item.question_id}
								<div>
									<p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Mata Pelajaran</p>
									<p class="text-sm font-medium text-slate-700 line-clamp-1">{item.subject_name || 'Tidak ada'}</p>
								</div>
								<div>
									<p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Ujian & Posisi</p>
									<p class="text-sm text-slate-600 line-clamp-2">
										<span class="font-medium">{item.exam_title}</span> <br/>
										<span class="text-indigo-600 font-medium">Soal Nomor {item.question_number}</span>
									</p>
								</div>
							{:else}
								<div class="h-full flex flex-col items-center justify-center text-center space-y-2">
									<div class="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
										<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
									</div>
									<div>
										<p class="text-sm font-bold text-amber-600">Yatim Piatu</p>
										<p class="text-xs text-amber-700/70 mt-1">File tidak digunakan di soal manapun</p>
									</div>
								</div>
							{/if}
						</div>
						
						<div class="mt-3 mb-3 text-[11px] text-slate-500 bg-white p-2 rounded-lg flex justify-between items-center border border-slate-200 shadow-sm">
							<span class="flex items-center gap-1">
								<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
								Pengunggah:
							</span>
							<span class="font-bold text-slate-700">{item.uploader_name || 'Sistem'}</span>
						</div>

						{#if item.uploaded_by === data.user?.id}
							<div class="pt-3 border-t {item.question_id ? 'border-slate-100' : 'border-amber-200'}">
								<button 
									type="button" 
									class="btn {item.question_id ? 'btn-danger' : 'bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg'} w-full py-2 flex items-center justify-center gap-2"
									on:click={() => itemToDelete = item}
									disabled={isDeleting}
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
									{item.question_id ? 'Hapus File Permanen' : 'Bersihkan File Ini'}
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Upload Modal -->
{#if showUploadModal}
	<div use:portal class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all duration-300">
		<div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
			<div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
				<h3 class="text-lg font-bold text-slate-800">Unggah Media ke Cloudinary</h3>
				<button class="text-slate-400 hover:text-slate-600 transition-colors" on:click={() => showUploadModal = false}>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>
			
			<div class="p-6 overflow-y-auto">
				<div class="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-700">
					<p>Media yang diunggah di sini akan otomatis masuk ke Cloudinary dan tercatat sebagai <strong>File Yatim Piatu</strong> sampai Anda menghubungkannya ke sebuah soal saat proses pembuatan soal.</p>
				</div>
				
				<MediaUploader 
					label="Pilih File Gambar atau Audio"
					bind:value={tempUploadedUrl}
				/>
			</div>
			
			<div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
				<button class="btn bg-slate-200 hover:bg-slate-300 text-slate-700" on:click={() => showUploadModal = false}>
					Tutup
				</button>
				<button class="btn btn-primary" on:click={() => {
					showUploadModal = false;
					window.location.reload();
				}}>
					Selesai & Muat Ulang
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Confirmation Modal -->
{#if itemToDelete}
	<div use:portal class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 transition-all duration-300">
		<div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform scale-100">
			<div class="p-6">
				<div class="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-5 mx-auto">
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
				</div>
				<h3 class="text-xl font-bold text-slate-800 mb-2 text-center">Peringatan Keras!</h3>
				
				{#if itemToDelete.question_id}
					<p class="text-slate-600 mb-4 text-sm text-center">
						File <span class="font-semibold px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">{itemToDelete.media_type}</span> ini masih digunakan pada:
					</p>
					<div class="space-y-2 text-sm text-slate-600 mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
						<div class="flex justify-between border-b border-slate-100 pb-2">
							<span class="font-medium text-slate-500">Mata Pelajaran</span>
							<span class="font-semibold text-slate-800 text-right">{itemToDelete.subject_name || 'Tidak ada'}</span>
						</div>
						<div class="flex justify-between border-b border-slate-100 pb-2">
							<span class="font-medium text-slate-500">Ujian</span>
							<span class="font-semibold text-slate-800 text-right">{itemToDelete.exam_title}</span>
						</div>
						<div class="flex justify-between pt-1">
							<span class="font-medium text-slate-500">Letak Soal</span>
							<span class="text-indigo-600 font-bold">Nomor {itemToDelete.question_number}</span>
						</div>
					</div>
					<p class="text-sm text-red-600 font-medium text-center">
						Yakin ingin menghapus? File akan dimusnahkan dari Cloudinary dan soal akan kehilangan media ini secara permanen.
					</p>
				{:else}
					<p class="text-slate-600 mb-4 text-sm text-center leading-relaxed">
						File ini adalah <span class="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">File Yatim Piatu</span> (tidak terhubung dengan soal manapun).
					</p>
					<p class="text-sm text-red-600 font-medium text-center">
						Yakin ingin membersihkannya dari Cloudinary secara permanen?
					</p>
				{/if}
			</div>
			
			<div class="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
				<button class="btn bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium transition-colors" on:click={() => itemToDelete = null} disabled={isDeleting}>
					Batal
				</button>
				<form method="POST" action="?/deleteMedia" use:enhance={() => {
					isDeleting = true;
					return async ({ update }) => {
						isDeleting = false;
						itemToDelete = null;
						await update();
					};
				}}>
					<input type="hidden" name="media_url" value={itemToDelete.media_url} />
					<button type="submit" class="btn btn-danger flex items-center gap-2 shadow-sm transition-all" disabled={isDeleting}>
						{#if isDeleting}
							<svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
							Menghapus...
						{:else}
							Ya, Hapus Permanen
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Media Preview Modal -->
{#if previewMedia}
	<div use:portal class="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4 transition-all duration-300" on:click={() => previewMedia = null}>
		<div class="absolute top-4 right-4 flex gap-3 z-10">
			<!-- Download Button -->
			<a 
				href={previewMedia.url} 
				download
				target="_blank"
				class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-md"
				on:click|stopPropagation
				title="Unduh File"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
			</a>
			<!-- Close Button -->
			<button class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-md" on:click|stopPropagation={() => previewMedia = null}>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
			</button>
		</div>

		{#if previewMedia.type === 'image'}
			<img 
				src={previewMedia.url} 
				alt="Preview Media" 
				class="max-w-full max-h-full object-contain select-none shadow-2xl rounded-lg"
				on:click|stopPropagation 
			/>
		{:else if previewMedia.type === 'audio'}
			<div class="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full" on:click|stopPropagation>
				<div class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
				</div>
				<h3 class="text-lg font-bold text-slate-800 text-center mb-6">Pemutar Audio</h3>
				<audio controls class="w-full">
					<source src={previewMedia.url} type="audio/mpeg">
					Browser Anda tidak mendukung elemen audio.
				</audio>
			</div>
		{/if}
	</div>
{/if}
