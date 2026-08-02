<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { toasts } from '$lib/stores/toast';

	export let data: PageData;
	export let form: ActionData;

	let isAdding = false;
	let editingSchool: any = null;

	$: if (form?.error) {
		toasts.error(form.error);
	} else if (form?.success) {
		toasts.success('Berhasil menyimpan data sekolah');
		isAdding = false;
		editingSchool = null;
	}
</script>

<svelte:head>
	<title>Kelola Sekolah - Superadmin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex justify-between items-end">
		<div>
			<h1 class="text-3xl font-bold text-slate-800 tracking-tight">Kelola Sekolah (Tenant)</h1>
			<p class="text-slate-500 mt-1">Daftar semua madrasah yang menggunakan platform ini.</p>
		</div>
		<button class="btn btn-primary" on:click={() => (isAdding = !isAdding)}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Tambah Sekolah
		</button>
	</div>

	{#if isAdding}
		<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in">
			<h2 class="text-xl font-bold text-slate-800 mb-4">Tambah Sekolah Baru</h2>
			<form method="POST" action="?/add" use:enhance class="space-y-4 max-w-lg">
				<div>
					<label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Sekolah <span class="text-red-500">*</span></label>
					<input type="text" id="name" name="name" class="input" required placeholder="Contoh: MAN 1 Jakarta" value={form?.name || ''} />
				</div>
				<div>
					<label for="address" class="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
					<textarea id="address" name="address" class="input min-h-[100px]" placeholder="Alamat lengkap...">{form?.address || ''}</textarea>
				</div>
				<div class="flex space-x-3 pt-2">
					<button type="submit" class="btn btn-primary">Simpan</button>
					<button type="button" class="btn btn-secondary" on:click={() => (isAdding = false)}>Batal</button>
				</div>
			</form>
		</div>
	{/if}

	{#if editingSchool}
		<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in mb-6">
			<h2 class="text-xl font-bold text-slate-800 mb-4">Edit Sekolah</h2>
			<form method="POST" action="?/edit" use:enhance class="space-y-4 max-w-lg">
				<input type="hidden" name="id" value={editingSchool.id} />
				<div>
					<label for="e-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Sekolah <span class="text-red-500">*</span></label>
					<input type="text" id="e-name" name="name" class="input" required value={editingSchool.name} />
				</div>
				<div>
					<label for="e-address" class="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
					<textarea id="e-address" name="address" class="input min-h-[100px]" placeholder="Alamat lengkap...">{editingSchool.address || ''}</textarea>
				</div>
				<div class="flex space-x-3 pt-2">
					<button type="submit" class="btn btn-primary">Simpan Perubahan</button>
					<button type="button" class="btn btn-secondary" on:click={() => (editingSchool = null)}>Batal</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="bg-slate-50 text-slate-500 text-sm">
						<th class="p-4 font-semibold">ID</th>
						<th class="p-4 font-semibold">Nama Sekolah</th>
						<th class="p-4 font-semibold">Alamat</th>
						<th class="p-4 font-semibold">Status</th>
						<th class="p-4 font-semibold text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-slate-700">
					{#each data.schools as school (school.id)}
						<tr class="hover:bg-slate-50 transition-colors">
							<td class="p-4 text-sm text-slate-400">#{school.id}</td>
							<td class="p-4 font-medium text-slate-900">{school.name}</td>
							<td class="p-4 text-sm truncate max-w-xs" title={school.address}>{school.address || '-'}</td>
							<td class="p-4">
								{#if school.is_active}
									<span class="badge badge-success">Aktif</span>
								{:else}
									<span class="badge badge-danger">Nonaktif</span>
								{/if}
							</td>
							<td class="p-4 text-right">
								<div class="flex items-center justify-end space-x-2">
									<button class="btn-ghost btn-sm" on:click={() => { editingSchool = school; window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
										Edit
									</button>
									<form method="POST" action="?/toggleStatus" use:enhance class="inline-block">
										<input type="hidden" name="id" value={school.id} />
										<input type="hidden" name="is_active" value={school.is_active} />
										<button type="submit" class="btn-ghost btn-sm {school.is_active ? 'text-amber-600' : 'text-green-600'}">
											{school.is_active ? 'Nonaktifkan' : 'Aktifkan'}
										</button>
									</form>
									<form method="POST" action="?/delete" use:enhance class="inline-block" on:submit={(e) => {
										if (!confirm('Apakah Anda yakin ingin menghapus sekolah ini? Semua data terkait (user, ujian, dll) akan ikut terhapus!')) e.preventDefault();
									}}>
										<input type="hidden" name="id" value={school.id} />
										<button type="submit" class="btn-ghost btn-sm text-red-600">
											Hapus
										</button>
									</form>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="p-8 text-center text-slate-500">
								Belum ada data sekolah. Silakan tambahkan.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
