<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import MediaUploader from '$lib/components/admin/MediaUploader.svelte';

	export let data: PageData;
	export let form: ActionData;

	let isDeleting = false;
	let showUploadModal = false;
	let tempUploadedUrl = '';

	function confirmDelete(item: any) {
		let msg = '';
		if (item.question_id) {
			msg = `Peringatan Keras!\n\nFile ${item.media_type} ini sedang digunakan pada:\n- Mapel: ${item.subject_name || 'Tidak ada mapel'}\n- Ujian: ${item.exam_title}\n- Soal Nomor: ${item.question_number}\n\nYakin ingin menghapus? File akan dimusnahkan dari Cloudinary dan dilepas dari soal tersebut secara permanen.`;
		} else {
			msg = `Konfirmasi Penghapusan\n\nFile ini adalah File Yatim Piatu (tidak terhubung dengan soal manapun). Yakin ingin membersihkannya dari Cloudinary?`;
		}
		
		return confirm(msg);
	}
</script>

<svelte:head>
	<title>Bank Berkas - Ujian Madrasah</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
	<div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
				<svg class="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
				Bank Berkas (Cloudinary)
			</h1>
			<p class="text-slate-500 mt-1">Kelola semua file gambar dan audio yang telah diunggah ke Cloudinary dan terhubung dengan soal ujian.</p>
		</div>
		<button class="btn btn-primary whitespace-nowrap shadow-sm" on:click={() => showUploadModal = true}>
			<svg class="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
			Unggah Media Baru
		</button>
	</div>

	{#if form?.error}
		<div class="alert alert-danger mb-6">
			<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
			<span>{form.error}</span>
		</div>
	{/if}

	{#if form?.success}
		<div class="alert alert-success mb-6">
			<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
			<span>{form.success}</span>
		</div>
	{/if}

	{#if data.mediaItems.length === 0}
		<div class="card p-12 text-center">
			<div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
			</div>
			<h3 class="text-lg font-medium text-slate-900">Bank Berkas Kosong</h3>
			<p class="text-slate-500 mt-1">Belum ada file media Cloudinary yang terhubung dengan soal ujian.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{#each data.mediaItems as item}
				<div class="card overflow-hidden flex flex-col {item.question_id ? '' : 'border-amber-400 ring-2 ring-amber-400/20'}">
					<!-- Preview Area -->
					<div class="h-40 {item.question_id ? 'bg-slate-100' : 'bg-amber-50'} relative flex items-center justify-center border-b {item.question_id ? 'border-slate-100' : 'border-amber-200'}">
						{#if item.media_type === 'image'}
							<img src={item.media_url} alt="Media Soal {item.question_number}" class="w-full h-full object-contain p-2" loading="lazy" />
						{:else}
							<div class="text-center p-4">
								<svg class="w-12 h-12 text-indigo-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
								<span class="text-xs font-medium text-slate-500 uppercase tracking-wider">File Audio</span>
							</div>
						{/if}
						<div class="absolute top-2 left-2">
							<span class="badge badge-primary shadow-sm">{item.media_type}</span>
						</div>
					</div>

					<!-- Details Area -->
					<div class="p-4 flex-1 flex flex-col {item.question_id ? '' : 'bg-amber-50/50'}">
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

						<div class="pt-3 border-t {item.question_id ? 'border-slate-100' : 'border-amber-200'}">
							<form method="POST" action="?/deleteMedia" use:enhance={({ cancel }) => {
								if (!confirmDelete(item)) {
									cancel();
									return;
								}
								isDeleting = true;
								return async ({ update }) => {
									isDeleting = false;
									await update();
								};
							}}>
								<input type="hidden" name="media_url" value={item.media_url} />
								<button 
									type="submit" 
									class="btn {item.question_id ? 'btn-danger' : 'bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg'} w-full py-2 flex items-center justify-center gap-2"
									disabled={isDeleting}
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
									{item.question_id ? 'Hapus File Permanen' : 'Bersihkan File Ini'}
								</button>
							</form>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Upload Modal -->
{#if showUploadModal}
	<div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
