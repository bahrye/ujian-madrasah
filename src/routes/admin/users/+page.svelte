<script lang="ts">
	import { enhance } from '$app/forms';
	import { ROLE_LABELS, ROLE_COLORS, ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';

	export let data;
	export let form: { error?: string; success?: string } | null;

	let showCreateModal = false;
	let editingUser: any = null;
	let deleteConfirm: number | null = null;

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
</script>

<svelte:head>
	<title>Manajemen Pengguna — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1>
			<p class="text-sm text-slate-500 mt-1">Kelola data pengguna sistem</p>
		</div>
		<button class="btn-primary" on:click={() => (showCreateModal = true)}>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
			</svg>
			Tambah Pengguna
		</button>
	</div>

	<!-- Search & Filter -->
	<div class="card p-4">
		<form method="GET" class="flex flex-col sm:flex-row gap-3">
			<div class="relative flex-1">
				<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.search} />
				</svg>
				<input name="search" type="text" class="input pl-9" placeholder="Cari pengguna..." value={data.search} />
			</div>
			<select name="role" class="select w-full sm:w-40">
				<option value="">Semua Role</option>
				<option value="admin" selected={data.roleFilter === 'admin'}>Admin</option>
				<option value="guru" selected={data.roleFilter === 'guru'}>Guru</option>
				<option value="pengawas" selected={data.roleFilter === 'pengawas'}>Pengawas</option>
				<option value="siswa" selected={data.roleFilter === 'siswa'}>Siswa</option>
			</select>
			<button type="submit" class="btn-secondary btn-sm">Cari</button>
		</form>
	</div>

	<!-- Users Table -->
	<div class="card overflow-hidden">
		<div class="table-container border-0 rounded-none">
			<table class="table">
				<thead>
					<tr>
						<th>Nama</th>
						<th>Username</th>
						<th>Role</th>
						<th>Status</th>
						<th>Dibuat</th>
						<th class="text-right">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each data.users as user (user.id)}
						<tr>
							<td class="font-semibold text-slate-800">{user.name}</td>
							<td class="text-slate-600">@{user.username}</td>
							<td><span class={ROLE_COLORS[user.role] || 'badge-info'}>{ROLE_LABELS[user.role] || user.role}</span></td>
							<td>
								{#if user.is_active}
									<span class="badge-success">Aktif</span>
								{:else}
									<span class="badge-danger">Nonaktif</span>
								{/if}
							</td>
							<td class="text-xs text-slate-500">{new Date(String(user.created_at).replace(' ', 'T') + (String(user.created_at).includes('Z') ? '' : 'Z')).toLocaleDateString('id-ID')}</td>
							<td class="text-right">
								<div class="flex items-center justify-end gap-1">
									<button
										class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
										on:click={() => (editingUser = { ...user })}
										title="Edit"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.edit} />
										</svg>
									</button>
									<button
										class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
										on:click={() => (deleteConfirm = user.id)}
										title="Hapus"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
										</svg>
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="text-center py-8 text-slate-400">Tidak ada pengguna ditemukan.</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Create Modal -->
{#if showCreateModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (showCreateModal = false)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-md animate-bounce-in" on:click|stopPropagation>
			<h2 class="text-lg font-bold text-slate-800 mb-4">Tambah Pengguna Baru</h2>
			<form method="POST" action="?/create" use:enhance={() => { return async ({ update }) => { showCreateModal = false; await update(); }; }} class="space-y-4">
				<div>
					<label for="create-name" class="label">Nama Lengkap</label>
					<input id="create-name" name="name" type="text" required class="input" placeholder="Nama lengkap" />
				</div>
				<div>
					<label for="create-username" class="label">Username</label>
					<input id="create-username" name="username" type="text" required class="input" placeholder="Username untuk login" />
				</div>
				<div>
					<label for="create-password" class="label">Kata Sandi</label>
					<input id="create-password" name="password" type="password" required class="input" placeholder="Kata sandi" />
				</div>
				<div>
					<label for="create-role" class="label">Role</label>
					<select id="create-role" name="role" required class="select">
						<option value="">Pilih role</option>
						<option value="admin">Administrator</option>
						<option value="guru">Guru</option>
						<option value="pengawas">Pengawas</option>
						<option value="siswa">Siswa</option>
					</select>
				</div>
				<div class="flex gap-3 pt-2">
					<button type="button" class="btn-ghost flex-1" on:click={() => (showCreateModal = false)}>Batal</button>
					<button type="submit" class="btn-primary flex-1">Simpan</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if editingUser}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (editingUser = null)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-md animate-bounce-in" on:click|stopPropagation>
			<h2 class="text-lg font-bold text-slate-800 mb-4">Edit Pengguna</h2>
			<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { editingUser = null; await update(); }; }} class="space-y-4">
				<input type="hidden" name="id" value={editingUser.id} />
				<div>
					<label for="edit-name" class="label">Nama Lengkap</label>
					<input id="edit-name" name="name" type="text" required class="input" bind:value={editingUser.name} />
				</div>
				<div>
					<label for="edit-role" class="label">Role</label>
					<select id="edit-role" name="role" required class="select" bind:value={editingUser.role}>
						<option value="admin">Administrator</option>
						<option value="guru">Guru</option>
						<option value="pengawas">Pengawas</option>
						<option value="siswa">Siswa</option>
					</select>
				</div>
				<div>
					<label for="edit-password" class="label">Kata Sandi Baru <span class="text-slate-400 font-normal">(kosongkan jika tidak diubah)</span></label>
					<input id="edit-password" name="password" type="password" class="input" placeholder="Kata sandi baru" />
				</div>
				<div class="flex items-center gap-2">
					<input id="edit-active" name="is_active" type="checkbox" value="1" checked={editingUser.is_active} class="rounded border-slate-300" />
					<label for="edit-active" class="text-sm font-medium text-slate-700">Akun Aktif</label>
				</div>
				<div class="flex gap-3 pt-2">
					<button type="button" class="btn-ghost flex-1" on:click={() => (editingUser = null)}>Batal</button>
					<button type="submit" class="btn-primary flex-1">Perbarui</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Confirmation -->
{#if deleteConfirm !== null}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (deleteConfirm = null)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-sm animate-bounce-in text-center" on:click|stopPropagation>
			<div class="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4">
				<svg class="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.warning} />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-slate-800 mb-2">Hapus Pengguna?</h3>
			<p class="text-sm text-slate-500 mb-5">Tindakan ini tidak bisa dibatalkan.</p>
			<form method="POST" action="?/delete" use:enhance={() => { return async ({ update }) => { deleteConfirm = null; await update(); }; }}>
				<input type="hidden" name="id" value={deleteConfirm} />
				<div class="flex gap-3">
					<button type="button" class="btn-ghost flex-1" on:click={() => (deleteConfirm = null)}>Batal</button>
					<button type="submit" class="btn-danger flex-1">Hapus</button>
				</div>
			</form>
		</div>
	</div>
{/if}
