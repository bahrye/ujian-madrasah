<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';
	import ImportStudentsModal from '$lib/components/admin/ImportStudentsModal.svelte';
	import LoginCardModal from '$lib/components/admin/LoginCardModal.svelte';
	import type { PageData, ActionData } from './$types';
	import { toasts } from '$lib/stores/toast';

	export let data: PageData;
	export let form: ActionData;

	let isAdding = false;
	let showImportModal = false;
	let showLoginCardModal = false;
	let showBulkDeleteModal = false;
	let editingUser: any = null;
	let filterClass = '';
	let selectedIds: number[] = [];

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

	const classColors = [
		'bg-emerald-100 text-emerald-800 border border-emerald-200',
		'bg-sky-100 text-sky-800 border border-sky-200',
		'bg-amber-100 text-amber-800 border border-amber-200',
		'bg-rose-100 text-rose-800 border border-rose-200',
		'bg-violet-100 text-violet-800 border border-violet-200',
		'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200',
		'bg-indigo-100 text-indigo-800 border border-indigo-200',
		'bg-teal-100 text-teal-800 border border-teal-200'
	];
	function getClassColor(classId: any) {
		if (classId === null || classId === undefined || classId === '') return 'bg-slate-100 text-slate-700';
		const strId = String(classId);
		const hash = strId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return classColors[hash % classColors.length];
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
			<button class="btn flex-1 sm:flex-none" style="background: linear-gradient(135deg,#f59e0b,#f97316); color:#fff; box-shadow: 0 4px 15px rgba(245,158,11,.3);" on:click={() => (showLoginCardModal = true)}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
				</svg>
				Kartu Login
			</button>
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
						<input type="text" id="nisn" name="nisn" class="input" required placeholder="10 Digit NISN" />
						<p class="text-xs text-slate-500 mt-1">NISN juga akan menjadi Password login.</p>
					</div>
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
						<input type="text" id="e-nisn" name="nisn" class="input" required value={editingUser.username} />
						<p class="text-xs text-slate-500 mt-1">Mengubah NISN akan mereset Password.</p>
					</div>
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
						<th class="p-4 w-12 text-center">
							<input
								type="checkbox"
								checked={isAllSelected}
								on:change={toggleSelectAll}
								class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
								title="Pilih Semua Siswa"
							/>
						</th>
						<th class="p-4 font-semibold">Siswa</th>
						<th class="p-4 font-semibold">Kelas</th>
						<th class="p-4 font-semibold">Tempat, Tgl Lahir</th>
						<th class="p-4 font-semibold">Status</th>
						<th class="p-4 font-semibold text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-slate-700">
					{#each data.users as user (user.id)}
						<tr class="hover:bg-slate-50/80 transition-colors {selectedIds.includes(user.id) ? 'bg-indigo-50/40' : ''}">
							<td class="p-4 text-center">
								<input
									type="checkbox"
									checked={selectedIds.includes(user.id)}
									on:change={() => toggleSelect(user.id)}
									class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
								/>
							</td>
							<td class="p-4">
								<div class="flex items-center space-x-3">
									<div class="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
										{user.name.charAt(0).toUpperCase()}
									</div>
									<div>
										<div class="font-medium {user.class_id ? 'text-slate-900' : 'text-red-600 drop-shadow-sm'}">{user.name}</div>
										<div class="text-sm text-slate-500">{user.username}</div>
									</div>
								</div>
							</td>
							<td class="p-4">
								{#if user.class_name}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold {getClassColor(user.class_id)}">
										{user.class_name}
									</span>
								{:else}
									<span class="text-sm text-slate-400">-</span>
								{/if}
							</td>
							<td class="p-4 text-sm text-slate-600">
								{formatBirth(user.place_of_birth, user.date_of_birth)}
							</td>
							<td class="p-4">
								{#if user.is_active}
									<span class="badge badge-success">Aktif</span>
								{:else}
									<span class="badge badge-danger">Nonaktif</span>
								{/if}
							</td>
							<td class="p-4 text-right">
								<div class="flex items-center justify-end space-x-2">
									<button class="btn-ghost btn-sm" on:click={() => { editingUser = user; }}>
										Edit
									</button>
									<form method="POST" action="?/toggleStatus" use:enhance class="inline-block">
										<input type="hidden" name="id" value={user.id} />
										<input type="hidden" name="is_active" value={user.is_active} />
										<button type="submit" class="btn-ghost btn-sm {user.is_active ? 'text-amber-600' : 'text-green-600'}">
											{user.is_active ? 'Nonaktif' : 'Aktif'}
										</button>
									</form>
									<ConfirmForm 
										action="?/delete"
										confirmTitle="Hapus Siswa"
										confirmMessage="Hapus siswa ini? Semua rekam jejak ujiannya akan ikut terhapus permanen!"
										buttonClass="btn-ghost btn-sm text-red-600"
										buttonTitle="Hapus"
									>
										<svelte:fragment slot="inputs">
											<input type="hidden" name="id" value={user.id} />
										</svelte:fragment>
										<svelte:fragment slot="buttonContent">
											Hapus
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
