<script lang="ts">
	import { parseDate } from '$lib/utils/date';

	import { enhance } from '$app/forms';
	import { ROLE_LABELS, ROLE_COLORS, ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';
	import ImportUsersModal from '$lib/components/admin/ImportUsersModal.svelte';
	import AdminLoginCardModal from '$lib/components/admin/AdminLoginCardModal.svelte';
	import PasswordInput from '$lib/components/ui/PasswordInput.svelte';

	export let data;
	export let form: { error?: string; success?: string } | null;

	let showCreateModal = false;
	let showImportModal = false;
	let showLoginCardModal = false;
	let editingUser: any = null;
	let deleteConfirm: number | null = null;

	function copyPin(pin: string, name: string) {
		if (!navigator?.clipboard) return;
		navigator.clipboard.writeText(pin);
		toasts.success(`Angka rahasia untuk ${name} (${pin}) berhasil disalin!`);
	}

	$: if (form?.success) { toasts.success(form.success); showImportModal = false; showCreateModal = false; }
	$: if (form?.error) toasts.error(form.error);
</script>

<svelte:head>
	<title>Manajemen Pengguna — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1>
			<p class="text-sm text-slate-500 mt-1">Kelola data pengguna sistem</p>
		</div>
		<div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
			<form method="POST" action="?/generateAllPins" use:enhance class="inline">
				<button
					type="submit"
					class="btn-secondary btn text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
					on:click={(e) => {
						if (!confirm('Acak angka rahasia 5-digit baru untuk SEMUA petugas?')) e.preventDefault();
					}}
					title="Acak angka rahasia 5 digit untuk semua guru/pengawas/panitia"
				>
					🎲 Acak PIN Semua
				</button>
			</form>
			<button class="btn flex-1 sm:flex-none" style="background: linear-gradient(135deg,#0ea5e9,#3b82f6); color:#fff; box-shadow: 0 4px 15px rgba(14,165,233,.3);" on:click={() => (showLoginCardModal = true)}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
				</svg>
				Kartu Login
			</button>
			<button class="btn-secondary flex-1 sm:flex-none" on:click={() => (showImportModal = true)}>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
				</svg>
				Import Excel
			</button>
			<button class="btn-primary flex-1 sm:flex-none" on:click={() => (showCreateModal = true)}>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				Tambah Pengguna
			</button>
		</div>
	</div>

	<!-- Filter & Search -->
	<div class="card p-4">
		<form method="GET" class="flex flex-col sm:flex-row gap-3">
			<div class="relative flex-1">
				<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					type="text"
					name="search"
					placeholder="Cari nama atau username..."
					value={data.search}
					class="input pl-9 text-sm"
				/>
			</div>
			<select name="role" class="select w-full sm:w-40">
				<option value="">Semua Role</option>
				<option value="guru" selected={data.roleFilter === 'guru'}>Guru</option>
				<option value="pengawas" selected={data.roleFilter === 'pengawas'}>Pengawas</option>
				<option value="panitia" selected={data.roleFilter === 'panitia'}>Panitia Ujian</option>
			</select>
			<button type="submit" class="btn-secondary btn-sm">Cari</button>
		</form>
	</div>

	<!-- Users Table -->
	<div class="card overflow-hidden">
		<div class="table-container border-0 rounded-none">
			<table class="table">
				<thead>
					<tr class="bg-slate-50 text-slate-500 text-sm">
						<th class="p-4 font-semibold whitespace-nowrap">Nama</th>
						<th class="p-4 font-semibold whitespace-nowrap">Username</th>
						<th class="p-4 font-semibold whitespace-nowrap">Role</th>
						<th class="p-4 font-semibold whitespace-nowrap">Angka Rahasia (PIN)</th>
						<th class="p-4 font-semibold whitespace-nowrap">Status</th>
						<th class="p-4 font-semibold whitespace-nowrap">Dibuat</th>
						<th class="p-4 font-semibold text-right whitespace-nowrap">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-slate-700">
					{#each data.users as user (user.id)}
						<tr class="hover:bg-slate-50/80 transition-colors">
							<td class="p-4 whitespace-nowrap">
								<div class="font-semibold text-slate-800">{user.name}</div>
								{#if user.nip}<div class="text-xs text-slate-400 mt-0.5">NIP: {user.nip}</div>{/if}
							</td>
							<td class="p-4 text-slate-600 whitespace-nowrap">@{user.username}</td>
							<td class="p-4 whitespace-nowrap"><span class="{ROLE_COLORS[user.role] || 'badge-info'} whitespace-nowrap">{ROLE_LABELS[user.role] || user.role}</span></td>
							<td class="p-4 whitespace-nowrap">
								{#if user.login_pin}
									<div class="flex items-center gap-1.5">
										<span class="inline-flex items-center gap-1 font-mono font-bold text-xs bg-amber-50 text-amber-900 border border-amber-300/80 px-2.5 py-1 rounded-xl shadow-xs">
											🔒 {user.login_pin}
										</span>
										<button
											type="button"
											class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
											on:click={() => copyPin(user.login_pin, user.name)}
											title="Salin PIN"
										>
											<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
											</svg>
										</button>
										<form method="POST" action="?/generatePin" use:enhance class="inline">
											<input type="hidden" name="id" value={user.id} />
											<button
												type="submit"
												class="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 transition-colors text-xs font-bold"
												title="Acak Ulang PIN Baru"
											>
												🎲
											</button>
										</form>
										<form method="POST" action="?/clearPin" use:enhance class="inline">
											<input type="hidden" name="id" value={user.id} />
											<button
												type="submit"
												class="p-1.5 rounded-lg hover:bg-rose-100 text-rose-500 transition-colors text-xs font-bold"
												title="Hapus / Nonaktifkan PIN"
												on:click={(e) => { if (!confirm(`Nonaktifkan angka rahasia untuk ${user.name}?`)) e.preventDefault(); }}
											>
												✕
											</button>
										</form>
									</div>
								{:else}
									<form method="POST" action="?/generatePin" use:enhance class="inline">
										<input type="hidden" name="id" value={user.id} />
										<button
											type="submit"
											class="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors border border-indigo-200"
											title="Buat angka rahasia 5 digit untuk pengguna ini"
										>
											+ Buat PIN 5-Digit
										</button>
									</form>
								{/if}
							</td>
							<td class="p-4 whitespace-nowrap">
								{#if user.is_active}
									<span class="badge-success whitespace-nowrap">Aktif</span>
								{:else}
									<span class="badge-danger whitespace-nowrap">Nonaktif</span>
								{/if}
							</td>
							<td class="p-4 text-xs text-slate-500 whitespace-nowrap">{parseDate(user.created_at).toLocaleDateString('id-ID')}</td>
							<td class="p-4 text-right whitespace-nowrap">
								<div class="flex items-center justify-end gap-1.5 whitespace-nowrap">
									<button
										type="button"
										class="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors shadow-xs"
										on:click={() => (editingUser = { ...user })}
										title="Edit Pengguna"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.edit} />
										</svg>
									</button>
									{#if user.is_active}
										<button
											type="button"
											class="p-2 rounded-xl bg-slate-100 text-slate-300 cursor-not-allowed opacity-60 shadow-xs"
											disabled
											title="Nonaktifkan pengguna terlebih dahulu sebelum menghapus"
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
											</svg>
										</button>
									{:else}
										<button
											type="button"
											class="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors shadow-xs"
											on:click={() => (deleteConfirm = user.id)}
											title="Hapus Pengguna Nonaktif"
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
											</svg>
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7" class="text-center py-8 text-slate-400 whitespace-nowrap">Tidak ada pengguna ditemukan.</td>
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
					<label for="create-nip" class="label">NIP <span class="text-slate-400 font-normal">(opsional)</span></label>
					<input id="create-nip" name="nip" type="text" class="input" placeholder="19xxxxxxxxxxxxxx" />
				</div>
				<div>
					<label for="create-username" class="label">Username</label>
					<input id="create-username" name="username" type="text" required class="input" placeholder="Username untuk login" />
				</div>
				<div>
					<label for="create-password" class="label">Kata Sandi</label>
					<PasswordInput id="create-password" name="password" required={true} placeholder="Kata sandi" />
				</div>
				<div>
					<label for="create-role" class="label">Role</label>
					<select id="create-role" name="role" required class="select">
						<option value="">Pilih role</option>
						<option value="guru">Guru</option>
						<option value="pengawas">Pengawas</option>
						<option value="panitia">Panitia Ujian</option>
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
					<label for="edit-nip" class="label">NIP <span class="text-slate-400 font-normal">(opsional)</span></label>
					<input id="edit-nip" name="nip" type="text" class="input" placeholder="19xxxxxxxxxxxxxx" bind:value={editingUser.nip} />
				</div>
				<div>
					<label for="edit-role" class="label">Role</label>
					<select id="edit-role" name="role" required class="select" bind:value={editingUser.role}>
						<option value="guru">Guru</option>
						<option value="pengawas">Pengawas</option>
						<option value="panitia">Panitia Ujian</option>
					</select>
				</div>
				<div>
					<label for="edit-password" class="label">Kata Sandi Baru <span class="text-slate-400 font-normal">(kosongkan jika tidak diubah)</span></label>
					<PasswordInput id="edit-password" name="password" required={false} placeholder="Kata sandi baru" />
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

<ImportUsersModal bind:show={showImportModal} />

<AdminLoginCardModal
	bind:show={showLoginCardModal}
	users={data.users}
	schoolName={data.schoolName}
	schoolLogo={data.schoolLogo}
/>
