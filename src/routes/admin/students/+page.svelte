<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';
	import type { PageData, ActionData } from './$types';
	import { toasts } from '$lib/stores/toast';

	export let data: PageData;
	export let form: ActionData;

	let isAdding = false;
	let editingUser: any = null;
	let filterClass = '';

	$: if (form?.error) {
		toasts.error(form.error);
	} else if (form?.success) {
		toasts.success('Berhasil menyimpan data siswa');
		isAdding = false;
		editingUser = null;
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
		<button class="btn btn-primary" on:click={() => (isAdding = !isAdding)}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Tambah Siswa
		</button>
	</div>

	{#if isAdding}
		<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in">
			<h2 class="text-xl font-bold text-slate-800 mb-4">Tambah Siswa Baru</h2>
			<form method="POST" action="?/add" use:enhance class="space-y-4 max-w-lg">
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
	{/if}

	{#if editingUser}
		<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in mb-6">
			<h2 class="text-xl font-bold text-slate-800 mb-4">Edit Siswa</h2>
			<form method="POST" action="?/edit" use:enhance class="space-y-4 max-w-lg">
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

		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="bg-slate-50 text-slate-500 text-sm">
						<th class="p-4 font-semibold">Siswa</th>
						<th class="p-4 font-semibold">Kelas</th>
						<th class="p-4 font-semibold">Status</th>
						<th class="p-4 font-semibold">Terdaftar</th>
						<th class="p-4 font-semibold text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-slate-700">
					{#each data.users as user (user.id)}
						<tr class="hover:bg-slate-50/80 transition-colors">
							<td class="p-4">
								<div class="flex items-center space-x-3">
									<div class="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
										{user.name.charAt(0).toUpperCase()}
									</div>
									<div>
										<div class="font-medium text-slate-900">{user.name}</div>
										<div class="text-sm text-slate-500">{user.username}</div>
									</div>
								</div>
							</td>
							<td class="p-4">
								{#if user.class_name}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
										{user.class_name}
									</span>
								{:else}
									<span class="text-sm text-slate-400">-</span>
								{/if}
							</td>
							<td class="p-4">
								{#if user.is_active}
									<span class="badge badge-success">Aktif</span>
								{:else}
									<span class="badge badge-danger">Nonaktif</span>
								{/if}
							</td>
							<td class="p-4 text-sm text-slate-500">
								{new Date(String(user.created_at).replace(' ', 'T') + (String(user.created_at).includes('Z') ? '' : 'Z')).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
							</td>
							<td class="p-4 text-right">
								<div class="flex items-center justify-end space-x-2">
									<button class="btn-ghost btn-sm" on:click={() => { editingUser = user; window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
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
							<td colspan="5" class="p-12 text-center">
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
