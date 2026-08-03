<script lang="ts">
	import { enhance } from '$app/forms';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';
	import type { PageData, ActionData } from './$types';
	import { toasts } from '$lib/stores/toast';

	export let data: PageData;
	export let form: ActionData;

	let isAdding = false;

	$: if (form?.error) {
		toasts.error(form.error);
	} else if (form?.success) {
		toasts.success('Berhasil mengelola admin');
		isAdding = false;
	}
</script>

<svelte:head>
	<title>Kelola Admin - Superadmin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex justify-between items-end">
		<div>
			<h1 class="text-3xl font-bold text-slate-800 tracking-tight">Admin Sekolah</h1>
			<p class="text-slate-500 mt-1">Kelola akun administrator untuk setiap sekolah.</p>
		</div>
		<button class="btn btn-primary" on:click={() => (isAdding = !isAdding)}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Tambah Admin
		</button>
	</div>

	{#if isAdding}
		<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in">
			<h2 class="text-xl font-bold text-slate-800 mb-4">Buat Akun Admin Baru</h2>
			<form method="POST" action="?/add" use:enhance class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
				<div class="col-span-1 md:col-span-2">
					<label for="school_id" class="block text-sm font-medium text-slate-700 mb-1">Pilih Sekolah <span class="text-red-500">*</span></label>
					<div class="relative">
						<select id="school_id" name="school_id" class="select w-full" required>
							<option value="">-- Pilih Sekolah --</option>
							{#each data.schools as school}
								<option value={school.id} selected={form?.school_id === school.id.toString()}>{school.name}</option>
							{/each}
						</select>
					</div>
				</div>
				<div>
					<label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap <span class="text-red-500">*</span></label>
					<input type="text" id="name" name="name" class="input" required placeholder="Nama lengkap admin" value={form?.name || ''} />
				</div>
				<div>
					<label for="username" class="block text-sm font-medium text-slate-700 mb-1">Username <span class="text-red-500">*</span></label>
					<input type="text" id="username" name="username" class="input" required placeholder="username_admin" value={form?.username || ''} />
				</div>
				<div>
					<label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password <span class="text-red-500">*</span></label>
					<input type="password" id="password" name="password" class="input" required placeholder="Minimal 6 karakter" />
				</div>
				<div class="col-span-1 md:col-span-2 flex space-x-3 pt-2">
					<button type="submit" class="btn btn-primary">Simpan Admin</button>
					<button type="button" class="btn btn-secondary" on:click={() => (isAdding = false)}>Batal</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="bg-slate-50 text-slate-500 text-sm">
						<th class="p-4 font-semibold">Nama / Username</th>
						<th class="p-4 font-semibold">Sekolah (Tenant)</th>
						<th class="p-4 font-semibold">Dibuat</th>
						<th class="p-4 font-semibold">Status</th>
						<th class="p-4 font-semibold text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-slate-700">
					{#each data.admins as admin (admin.id)}
						<tr class="hover:bg-slate-50 transition-colors">
							<td class="p-4">
								<div class="font-medium text-slate-900">{admin.name}</div>
								<div class="text-sm text-slate-500">@{admin.username}</div>
							</td>
							<td class="p-4 font-medium text-indigo-600">{admin.school_name || 'Tidak diketahui'}</td>
							<td class="p-4 text-sm">{new Date(String(admin.created_at).replace(' ', 'T') + (String(admin.created_at).includes('Z') ? '' : 'Z')).toLocaleDateString('id-ID')}</td>
							<td class="p-4">
								{#if admin.is_active}
									<span class="badge badge-success">Aktif</span>
								{:else}
									<span class="badge badge-danger">Nonaktif</span>
								{/if}
							</td>
							<td class="p-4 text-right space-x-2">
								<form method="POST" action="?/toggleStatus" use:enhance class="inline-block">
									<input type="hidden" name="id" value={admin.id} />
									<input type="hidden" name="is_active" value={admin.is_active} />
									<button type="submit" class="btn btn-secondary py-1 px-3 text-xs" title={admin.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
										{admin.is_active ? 'Nonaktifkan' : 'Aktifkan'}
									</button>
								</form>
								<ConfirmForm 
									action="?/delete"
									confirmTitle="Hapus Admin"
									confirmMessage={`Yakin ingin menghapus admin ${admin.name}?`}
									buttonClass="btn bg-red-50 text-red-600 hover:bg-red-100 py-1 px-3 text-xs"
									buttonTitle="Hapus"
								>
									<svelte:fragment slot="inputs">
										<input type="hidden" name="id" value={admin.id} />
									</svelte:fragment>
									<svelte:fragment slot="buttonContent">
										Hapus
									</svelte:fragment>
								</ConfirmForm>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="p-8 text-center text-slate-500">
								Belum ada admin sekolah. Silakan buat yang pertama.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
