<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';
	import ImportStudentsModal from '$lib/components/admin/ImportStudentsModal.svelte';
	import LoginCardModal from '$lib/components/admin/LoginCardModal.svelte';
	import type { PageData, ActionData } from './$types';
	import { toasts } from '$lib/stores/toast';
	import { ICONS } from '$lib/utils/constants';
	import { env } from '$env/dynamic/public';

	export let data: PageData;
	export let form: ActionData;

	let isAdding = false;
	let showImportModal = false;
	let showLoginCardModal = false;
	let showBulkDeleteModal = false;
	let showGenerateModal = false;
	let generateFormat = 'PAT-2026-VII-01-[nomor]';
	let generateClass = '';
	let editingUser: any = null;
	let filterClass = '';
	let selectedIds: number[] = [];

	let isUploadingPhotoFor: string | number | null = null;
	let photoFileInput: HTMLInputElement;
	let selectedStudentIdForPhoto: string | number | null = null;

	const cloudName = env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfhtjgwcz';
	const uploadPreset = env.PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ujian-madrasah';

	$: isAllSelected = data.users.length > 0 && selectedIds.length === data.users.length;

	function toggleSelectAll() {
		if (isAllSelected) {
			selectedIds = [];
		} else {
			selectedIds = data.users.map((u: any) => u.id);
		}
	}

	function toggleSelect(id: number) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((item) => item !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	$: if (form?.error) {
		toasts.error(form.error);
	} else if (form?.success) {
		toasts.success(form.message || 'Berhasil menyimpan data siswa');
		isAdding = false;
		showImportModal = false;
		showBulkDeleteModal = false;
		showGenerateModal = false;
		editingUser = null;
		selectedIds = [];
	}

	function handleFilterChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const url = new URL(window.location.href);
		if (target.value) {
			url.searchParams.set('class', target.value);
		} else {
			url.searchParams.delete('class');
		}
		window.location.href = url.toString();
	}

	function getClassColor(classId: number | string | null) {
		if (!classId) return 'bg-slate-100 text-slate-600';
		const colors = [
			'bg-blue-100 text-blue-700',
			'bg-emerald-100 text-emerald-700',
			'bg-amber-100 text-amber-700',
			'bg-purple-100 text-purple-700',
			'bg-pink-100 text-pink-700',
			'bg-indigo-100 text-indigo-700',
			'bg-teal-100 text-teal-700',
			'bg-rose-100 text-rose-700'
		];
		const index = Number(classId) % colors.length;
		return colors[index];
	}

	function triggerPhotoUpload(studentId: number | string) {
		selectedStudentIdForPhoto = studentId;
		if (photoFileInput) photoFileInput.click();
	}

	async function handlePhotoUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file || !selectedStudentIdForPhoto) return;

		if (file.size > 3 * 1024 * 1024) {
			toasts.error('Ukuran foto terlalu besar. Maksimal 3MB.');
			return;
		}

		isUploadingPhotoFor = selectedStudentIdForPhoto;

		const fd = new FormData();
		fd.append('file', file);
		fd.append('upload_preset', uploadPreset);
		fd.append('folder', 'ujian-madrasah/students');

		try {
			const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
				method: 'POST',
				body: fd
			});

			if (!res.ok) throw new Error('Upload ke Cloudinary gagal');
			const result = await res.json();
			const secureUrl = result.secure_url;

			// Update to database
			const dbFd = new FormData();
			dbFd.append('id', String(selectedStudentIdForPhoto));
			dbFd.append('photo', secureUrl);

			const updateRes = await fetch('?/updatePhoto', {
				method: 'POST',
				body: dbFd
			});
			
			if (updateRes.ok) {
				toasts.success('Foto profil siswa berhasil diperbarui!');
				await invalidateAll();
			} else {
				toasts.error('Gagal menyimpan foto ke database.');
			}
		} catch (err: any) {
			toasts.error(err.message || 'Terjadi kesalahan saat mengunggah foto.');
		} finally {
			isUploadingPhotoFor = null;
			selectedStudentIdForPhoto = null;
			if (photoFileInput) photoFileInput.value = '';
		}
	}

	function formatBirth(place: string | null | undefined, dateStr: string | null | undefined) {
		if (!place && !dateStr) return '-';
		let formattedDate = '';
		if (dateStr) {
			try {
				formattedDate = new Date(String(dateStr).replace(' ', 'T')).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
			} catch {
				formattedDate = dateStr;
			}
		}
		if (place && formattedDate) return `${place}, ${formattedDate}`;
		return place || formattedDate || '-';
	}
</script>

<input 
	type="file" 
	accept="image/*" 
	class="hidden" 
	bind:this={photoFileInput} 
	on:change={handlePhotoUpload} 
/>

<svelte:head>
	<title>Siswa - Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
		<div>
			<h1 class="text-3xl font-bold text-slate-800 tracking-tight">Manajemen Siswa</h1>
			<p class="text-slate-500 mt-1">Kelola data siswa dan kelasnya.</p>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			{#if selectedIds.length > 0}
				<button class="btn btn-danger flex-1 sm:flex-none animate-bounce-in" on:click={() => (showBulkDeleteModal = true)}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Hapus Massal ({selectedIds.length})
				</button>
			{/if}
			<button class="btn btn-secondary flex-1 sm:flex-none" on:click={() => (showGenerateModal = true)}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
				</svg>
				Generate Nomor
			</button>
			<!--
			<button class="btn flex-1 sm:flex-none" style="background: linear-gradient(135deg,#f59e0b,#f97316); color:#fff; box-shadow: 0 4px 15px rgba(245,158,11,.3);" on:click={() => (showLoginCardModal = true)}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
				</svg>
				Kartu Login
			</button>
			-->
			<button class="btn btn-secondary flex-1 sm:flex-none" on:click={() => (showImportModal = true)}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
				</svg>
				Import Excel
			</button>
			<button class="btn btn-primary flex-1 sm:flex-none" on:click={() => (isAdding = !isAdding)}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				Tambah Siswa
			</button>
		</div>
	</div>

	{#if isAdding}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (isAdding = false)}>
			<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-lg animate-bounce-in" on:click|stopPropagation>
				<h2 class="text-xl font-bold text-slate-800 mb-4">Tambah Siswa Baru</h2>
			<form method="POST" action="?/add" use:enhance={() => { return async ({ update }) => { isAdding = false; await update(); }; }} class="space-y-4 max-w-lg">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
						<input type="text" id="name" name="name" class="input" required placeholder="Nama Siswa" />
					</div>
					<div>
						<label for="nisn" class="block text-sm font-medium text-slate-700 mb-1">NISN <span class="text-red-500">*</span></label>
						<input type="text" id="nisn" name="nisn" class="input" required placeholder="10 Digit NISN" minlength="10" maxlength="10" inputmode="numeric" on:input={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 10)} title="Harus 10 digit angka" />
						<p class="text-xs text-slate-500 mt-1">NISN akan menjadi Password login.</p>
					</div>
				</div>
				<div>
					<label for="nomor_peserta" class="block text-sm font-medium text-slate-700 mb-1">Nomor Peserta <span class="text-red-500">*</span></label>
					<input type="text" id="nomor_peserta" name="nomor_peserta" class="input" required placeholder="Contoh: PAT-2026-VII-01-001" />
				</div>
				<div>
					<label for="gender" class="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
					<select id="gender" name="gender" class="input">
						<option value="">Pilih Jenis Kelamin (Opsional)</option>
						<option value="L">Laki-Laki (L)</option>
						<option value="P">Perempuan (P)</option>
					</select>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="place_of_birth" class="block text-sm font-medium text-slate-700 mb-1">Tempat Lahir</label>
						<input type="text" id="place_of_birth" name="place_of_birth" class="input" placeholder="Kota Kelahiran" />
					</div>
					<div>
						<label for="date_of_birth" class="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
						<input type="date" id="date_of_birth" name="date_of_birth" class="input" />
					</div>
				</div>
				<div>
					<label for="class_id" class="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
					<select id="class_id" name="class_id" class="input">
						<option value="">Pilih Kelas (Opsional)</option>
						{#each data.classes as cls (cls.id)}
							<option value={cls.id}>{cls.name}</option>
						{/each}
					</select>
				</div>
				<div class="flex space-x-3 pt-2">
					<button type="submit" class="btn btn-primary">Simpan Siswa</button>
					<button type="button" class="btn btn-secondary" on:click={() => (isAdding = false)}>Batal</button>
				</div>
			</form>
			</div>
		</div>
	{/if}

	{#if editingUser}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (editingUser = null)}>
			<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-lg animate-bounce-in" on:click|stopPropagation>
				<h2 class="text-xl font-bold text-slate-800 mb-4">Edit Siswa</h2>
			<form method="POST" action="?/edit" use:enhance={() => { return async ({ update }) => { editingUser = null; await update(); }; }} class="space-y-4 max-w-lg">
				<input type="hidden" name="id" value={editingUser.id} />
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="e-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
						<input type="text" id="e-name" name="name" class="input" required value={editingUser.name} />
					</div>
					<div>
						<label for="e-nisn" class="block text-sm font-medium text-slate-700 mb-1">NISN <span class="text-red-500">*</span></label>
						<input type="text" id="e-nisn" name="nisn" class="input" required value={(editingUser.nisn || editingUser.username).trim()} minlength="10" maxlength="10" inputmode="numeric" on:input={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 10)} title="Harus 10 digit angka" />
						<p class="text-xs text-slate-500 mt-1">Mengubah NISN akan mereset Password.</p>
					</div>
				</div>
				<div>
					<label for="edit_nomor_peserta" class="block text-sm font-medium text-slate-700 mb-1">Nomor Peserta <span class="text-red-500">*</span></label>
					<input type="text" id="edit_nomor_peserta" name="nomor_peserta" class="input" required placeholder="Contoh: PAT-2026-VII-01-001" value={editingUser.nomor_peserta || ''} />
				</div>
				<div>
					<label for="e-gender" class="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
					<select id="e-gender" name="gender" class="input">
						<option value="" selected={!editingUser.gender}>Pilih Jenis Kelamin (Opsional)</option>
						<option value="L" selected={editingUser.gender === 'L'}>Laki-Laki (L)</option>
						<option value="P" selected={editingUser.gender === 'P'}>Perempuan (P)</option>
					</select>
				</div>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="e-place_of_birth" class="block text-sm font-medium text-slate-700 mb-1">Tempat Lahir</label>
						<input type="text" id="e-place_of_birth" name="place_of_birth" class="input" value={editingUser.place_of_birth || ''} />
					</div>
					<div>
						<label for="e-date_of_birth" class="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
						<input type="date" id="e-date_of_birth" name="date_of_birth" class="input" value={editingUser.date_of_birth || ''} />
					</div>
				</div>
				<div>
					<label for="e-class_id" class="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
					<select id="e-class_id" name="class_id" class="input">
						<option value="">Pilih Kelas (Opsional)</option>
						{#each data.classes as cls (cls.id)}
							<option value={cls.id} selected={cls.id == editingUser.class_id}>{cls.name}</option>
						{/each}
					</select>
				</div>
				<div class="flex space-x-3 pt-2">
					<button type="submit" class="btn btn-primary">Simpan Perubahan</button>
					<button type="button" class="btn btn-secondary" on:click={() => (editingUser = null)}>Batal</button>
				</div>
			</form>
			</div>
		</div>
	{/if}

	<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
		<div class="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
			<form class="relative w-full max-w-md" method="GET" action="">
				<input type="hidden" name="class" value={filterClass} />
				<svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input type="search" name="search" placeholder="Cari nama atau username..." class="input pl-10 bg-white" />
			</form>
			<div class="w-full sm:w-48">
				<select class="input bg-white" bind:value={filterClass} on:change={handleFilterChange}>
					<option value="">Semua Kelas</option>
					{#each data.classes as cls (cls.id)}
						<option value={cls.id}>{cls.name}</option>
					{/each}
				</select>
			</div>
		</div>

		{#if selectedIds.length > 0}
			<div class="bg-indigo-50 border-b border-indigo-100 p-3 px-4 flex items-center justify-between animate-fade-in">
				<div class="text-sm font-medium text-indigo-900 flex items-center gap-2">
					<span class="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
						{selectedIds.length}
					</span>
					<span>Siswa dipilih</span>
				</div>
				<div class="flex items-center gap-2">
					<button class="btn btn-sm btn-danger" on:click={() => (showBulkDeleteModal = true)}>
						Hapus Massal ({selectedIds.length})
					</button>
					<button class="btn btn-sm btn-secondary" on:click={() => (selectedIds = [])}>
						Batal Pilih
					</button>
				</div>
			</div>
		{/if}

		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="bg-slate-50 text-slate-500 text-sm">
						<th class="p-4 w-12 text-center whitespace-nowrap">
							<input
								type="checkbox"
								checked={isAllSelected}
								on:change={toggleSelectAll}
								class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
								title="Pilih Semua Siswa"
							/>
						</th>
						<th class="p-4 font-semibold whitespace-nowrap">Siswa</th>
						<th class="p-4 font-semibold whitespace-nowrap">No. Peserta</th>
						<th class="p-4 font-semibold whitespace-nowrap">NISN</th>
						<th class="p-4 font-semibold whitespace-nowrap">Kelas</th>
						<th class="p-4 font-semibold whitespace-nowrap text-center">JK</th>
						<th class="p-4 font-semibold whitespace-nowrap">Tempat, Tgl Lahir</th>
						<th class="p-4 font-semibold whitespace-nowrap">Status</th>
						<th class="p-4 font-semibold text-right whitespace-nowrap">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-slate-700">
					{#each data.users as user (user.id)}
						<tr class="hover:bg-slate-50/80 transition-colors {selectedIds.includes(user.id) ? 'bg-indigo-50/40' : ''}">
							<td class="p-4 text-center whitespace-nowrap">
								<input
									type="checkbox"
									checked={selectedIds.includes(user.id)}
									on:change={() => toggleSelect(user.id)}
									class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
								/>
							</td>
							<td class="p-4 whitespace-nowrap">
								<div class="flex items-center space-x-3">
									<button 
										type="button" 
										class="relative h-10 w-10 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold overflow-hidden group cursor-pointer border border-slate-200 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-1 transition-all"
										on:click={() => triggerPhotoUpload(user.id)}
										title="Klik untuk mengubah foto"
									>
										{#if isUploadingPhotoFor === user.id}
											<div class="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm z-10">
												<div class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
											</div>
										{/if}
										
										{#if user.photo}
											<img src={user.photo} alt={user.name} class="w-full h-full object-cover" />
										{:else}
											{user.name.charAt(0).toUpperCase()}
										{/if}
										
										<div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
											<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
										</div>
									</button>
									<div class="whitespace-nowrap">
										<div class="font-medium whitespace-nowrap {user.class_id ? 'text-slate-900' : 'text-red-600 drop-shadow-sm'}">{user.name}</div>
										<div class="text-sm text-slate-500 whitespace-nowrap">@{user.username}</div>
									</div>
								</div>
							</td>
							<td class="p-4 whitespace-nowrap">
								<span class="text-slate-700">{user.nomor_peserta || '-'}</span>
							</td>
							<td class="p-4 whitespace-nowrap">
								<span class="text-slate-700">{user.nisn || user.username}</span>
							</td>
							<td class="p-4 whitespace-nowrap">
								{#if user.class_name}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap {getClassColor(user.class_id)}">
										{user.class_name}
									</span>
								{:else}
									<span class="text-sm text-slate-400 whitespace-nowrap">-</span>
								{/if}
							</td>
							<td class="p-4 whitespace-nowrap text-center">
								{#if user.gender === 'L'}
									<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs" title="Laki-Laki">L</span>
								{:else if user.gender === 'P'}
									<span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-700 font-bold text-xs" title="Perempuan">P</span>
								{:else}
									<span class="text-slate-400">-</span>
								{/if}
							</td>
							<td class="p-4 text-sm text-slate-600 whitespace-nowrap">
								{formatBirth(user.place_of_birth, user.date_of_birth)}
							</td>
							<td class="p-4 whitespace-nowrap">
								{#if user.is_active}
									<span class="badge badge-success whitespace-nowrap">Aktif</span>
								{:else}
									<span class="badge badge-danger whitespace-nowrap">Nonaktif</span>
								{/if}
							</td>
							<td class="p-4 text-right whitespace-nowrap">
								<div class="flex items-center justify-end gap-1.5 whitespace-nowrap">
									<button
										type="button"
										class="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-xs"
										on:click={() => { editingUser = user; }}
										title="Edit Siswa"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.edit} />
										</svg>
									</button>
									<form method="POST" action="?/toggleStatus" use:enhance class="inline-block">
										<input type="hidden" name="id" value={user.id} />
										<input type="hidden" name="is_active" value={user.is_active} />
										{#if user.is_active}
											<button
												type="submit"
												class="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-colors shadow-xs"
												title="Nonaktifkan Siswa"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
												</svg>
											</button>
										{:else}
											<button
												type="submit"
												class="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors shadow-xs"
												title="Aktifkan Siswa"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
											</button>
										{/if}
									</form>
									<ConfirmForm 
										action="?/delete"
										confirmTitle="Hapus Siswa"
										confirmMessage="Hapus siswa ini? Semua rekam jejak ujiannya akan ikut terhapus permanen!"
										buttonClass="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors shadow-xs"
										buttonTitle="Hapus Siswa"
									>
										<svelte:fragment slot="inputs">
											<input type="hidden" name="id" value={user.id} />
										</svelte:fragment>
										<svelte:fragment slot="buttonContent">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
											</svg>
										</svelte:fragment>
									</ConfirmForm>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="p-12 text-center">
								<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3-2.803a4 4 0 11-8 0 4 4 0 018 0z" />
									</svg>
								</div>
								<h3 class="text-lg font-medium text-slate-900 mb-1">Tidak ada data siswa</h3>
								<p class="text-slate-500">Gunakan pencarian atau filter untuk menemukan siswa, atau tambahkan siswa baru.</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<ImportStudentsModal 
	bind:show={showImportModal} 
	classes={data.classes}
/>

<LoginCardModal
	bind:show={showLoginCardModal}
	classes={data.classes}
	students={data.users as any[]}
	schoolName={data.schoolName}
	schoolLogo={data.schoolLogo}
/>

{#if showBulkDeleteModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (showBulkDeleteModal = false)}>
		<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-md animate-bounce-in text-center" on:click|stopPropagation>
			<div class="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4 text-rose-600">
				<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
			</div>
			<h3 class="text-xl font-bold text-slate-800 mb-2">Hapus Massal Siswa ({selectedIds.length})?</h3>
			<p class="text-sm text-slate-500 mb-6">Apakah Anda yakin ingin menghapus <strong>{selectedIds.length} siswa</strong> terpilih? Semua data rekam jejak ujian mereka akan terhapus secara permanen.</p>
			
			<form method="POST" action="?/deleteBulk" use:enhance={() => { return async ({ update }) => { showBulkDeleteModal = false; selectedIds = []; await update(); }; }}>
				<input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />
				<div class="flex space-x-3">
					<button type="button" class="btn btn-secondary flex-1" on:click={() => (showBulkDeleteModal = false)}>Batal</button>
					<button type="submit" class="btn btn-danger flex-1">Ya, Hapus Semua</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if showGenerateModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (showGenerateModal = false)}>
		<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-md animate-bounce-in" on:click|stopPropagation>
			<h2 class="text-xl font-bold text-slate-800 mb-2">Generate Nomor Peserta Ujian</h2>
			<p class="text-sm text-slate-500 mb-6">Nomor peserta akan di-generate berurutan otomatis (A-Z) untuk semua siswa di kelas yang dipilih.</p>
			
			<form method="POST" action="?/generate_peserta" use:enhance={() => { return async ({ update }) => { showGenerateModal = false; await update(); }; }}>
				<div class="space-y-4 mb-6">
					<div>
						<label for="generateClass" class="block text-sm font-medium text-slate-700 mb-1">Pilih Kelas</label>
						<select id="generateClass" name="class_id" class="input" bind:value={generateClass} required>
							<option value="">-- Pilih Kelas --</option>
							{#each data.classes as cls}
								<option value={cls.id}>{cls.name}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="generateFormat" class="block text-sm font-medium text-slate-700 mb-1">Format Penomoran</label>
						<input type="text" id="generateFormat" name="format" class="input font-mono" bind:value={generateFormat} required placeholder="Misal: PAT-2026-VII-01-[nomor]" />
						<p class="text-xs text-slate-500 mt-1">Gunakan <strong>[nomor]</strong> sebagai tempat angka urut otomatis (contoh: 001, 002, dst).</p>
					</div>
				</div>
				
				<div class="flex space-x-3">
					<button type="button" class="btn btn-secondary flex-1" on:click={() => (showGenerateModal = false)}>Batal</button>
					<button type="submit" class="btn btn-primary flex-1">Generate Sekarang</button>
				</div>
			</form>
		</div>
	</div>
{/if}
