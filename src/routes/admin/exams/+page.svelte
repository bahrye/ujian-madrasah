<script lang="ts">
	import { enhance } from '$app/forms';
	import { ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';

	export let data;
	export let form: { error?: string; success?: string } | null;

	let showCreateModal = false;
	let editingType: any = null;
	let deleteConfirm: number | null = null;

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
</script>

<svelte:head>
	<title>Manajemen Tipe Ujian — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Manajemen Ujian</h1>
			<p class="text-sm text-slate-500 mt-1">Kelola tipe ujian (contoh: UAS, UM) beserta rentang waktunya</p>
		</div>
		<button class="btn-primary" on:click={() => (showCreateModal = true)}>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
			</svg>
			Buat Tipe Ujian Baru
		</button>
	</div>

	<!-- Exam Types Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.examTypes as type (type.id)}
			<div class="card-hover p-5 flex flex-col border-t-4 {type.is_active ? 'border-t-indigo-500' : 'border-t-slate-300'}">
				<div class="flex items-start justify-between mb-3">
					<div class="flex-1 min-w-0">
						<h3 class="font-bold text-slate-800 truncate">{type.name}</h3>
						<p class="text-xs text-indigo-500 font-mono font-semibold tracking-wider mt-0.5">{type.code}</p>
					</div>
					{#if type.is_active}
						<span class="badge-success ml-2 flex-shrink-0">Aktif</span>
					{:else}
						<span class="badge bg-slate-100 text-slate-500 ml-2 flex-shrink-0">Nonaktif</span>
					{/if}
				</div>

				{#if type.description}
					<p class="text-sm text-slate-500 mb-4 line-clamp-2">{type.description}</p>
				{/if}

				<div class="flex flex-col gap-1 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
					<div class="flex items-center gap-2">
						<svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						<span class="truncate">
							{type.start_time ? new Date(type.start_time.replace(' ', 'T') + (type.start_time.includes(' ') && !type.start_time.includes('Z') ? 'Z' : '')).toLocaleString('id-ID') : 'Belum diatur'} 
							- 
							{type.end_time ? new Date(type.end_time.replace(' ', 'T') + (type.end_time.includes(' ') && !type.end_time.includes('Z') ? 'Z' : '')).toLocaleString('id-ID') : 'Belum diatur'}
						</span>
					</div>
					<div class="flex items-center gap-2 mt-1">
						<svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
						</svg>
						<span>{type.exam_count} Ujian terdaftar</span>
					</div>
				</div>

				<div class="mt-auto flex items-center gap-2 pt-3 border-t border-slate-100">
					<a href="/admin/exams/type/{type.id}" class="btn-sm btn-outline flex-1 text-center">Lihat Ujian</a>
					<button class="btn-sm btn-ghost" on:click={() => (editingType = { ...type })} title="Edit Tipe">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.edit} />
						</svg>
					</button>
					<form method="POST" action="?/toggleActive" use:enhance>
						<input type="hidden" name="id" value={type.id} />
						<button type="submit" class="btn-sm btn-ghost" title={type.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
							{#if type.is_active}
								<svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.check} />
								</svg>
							{:else}
								<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
								</svg>
							{/if}
						</button>
					</form>
					<button class="btn-sm btn-ghost text-rose-400 hover:text-rose-600" on:click={() => (deleteConfirm = type.id)} title="Hapus">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
						</svg>
					</button>
				</div>
			</div>
		{:else}
			<div class="col-span-full text-center py-12 text-slate-400">
				<svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
				</svg>
				<p>Belum ada tipe ujian. Klik "Buat Tipe Ujian Baru" untuk memulai.</p>
			</div>
		{/each}
	</div>
</div>

<!-- Create Modal -->
{#if showCreateModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (showCreateModal = false)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-lg animate-bounce-in" on:click|stopPropagation>
			<h2 class="text-lg font-bold text-slate-800 mb-4">Buat Tipe Ujian Baru</h2>
			<form method="POST" action="?/create" use:enhance={() => { return async ({ update }) => { showCreateModal = false; await update(); }; }} class="space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<div class="sm:col-span-1">
						<label class="label" for="c-code">Kode / Singkatan</label>
						<input id="c-code" name="code" type="text" required class="input uppercase font-mono" placeholder="Contoh: UAS" />
					</div>
					<div class="sm:col-span-2">
						<label class="label" for="c-name">Nama Tipe Ujian</label>
						<input id="c-name" name="name" type="text" required class="input" placeholder="Contoh: Ujian Akhir Semester" />
					</div>
				</div>
				
				<div>
					<label class="label" for="c-desc">Deskripsi</label>
					<textarea id="c-desc" name="description" class="input" rows="2" placeholder="Deskripsi opsional"></textarea>
				</div>

				<div class="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
					<div class="col-span-full">
						<p class="text-sm font-semibold text-slate-700">Rentang Waktu Pelaksanaan</p>
						<p class="text-xs text-slate-500 mb-2">Semua ujian di dalam tipe ini tidak boleh berada di luar rentang waktu berikut.</p>
					</div>
					<div>
						<label class="label" for="c-start">Waktu Mulai</label>
						<input id="c-start" name="start_time" type="datetime-local" class="input" required />
					</div>
					<div>
						<label class="label" for="c-end">Waktu Selesai</label>
						<input id="c-end" name="end_time" type="datetime-local" class="input" required />
					</div>
				</div>

				<div class="flex items-center gap-2">
					<input id="c-active" name="is_active" type="checkbox" value="1" checked class="rounded border-slate-300" />
					<label for="c-active" class="text-sm font-medium text-slate-700">Langsung Aktifkan Tipe Ujian Ini</label>
				</div>
				
				<div class="flex gap-3 pt-2">
					<button type="button" class="btn-ghost flex-1" on:click={() => (showCreateModal = false)}>Batal</button>
					<button type="submit" class="btn-primary flex-1">Buat Tipe Ujian</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if editingType}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (editingType = null)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-lg animate-bounce-in" on:click|stopPropagation>
			<h2 class="text-lg font-bold text-slate-800 mb-4">Edit Tipe Ujian</h2>
			<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { editingType = null; await update(); }; }} class="space-y-4">
				<input type="hidden" name="id" value={editingType.id} />
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<div class="sm:col-span-1">
						<label class="label" for="e-code">Kode</label>
						<input id="e-code" name="code" type="text" required class="input uppercase font-mono" value={editingType.code} />
					</div>
					<div class="sm:col-span-2">
						<label class="label" for="e-name">Nama</label>
						<input id="e-name" name="name" type="text" required class="input" value={editingType.name} />
					</div>
				</div>
				
				<div>
					<label class="label" for="e-desc">Deskripsi</label>
					<textarea id="e-desc" name="description" class="input" rows="2" value={editingType.description}></textarea>
				</div>

				<div class="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
					<div class="col-span-full">
						<p class="text-sm font-semibold text-slate-700">Rentang Waktu Pelaksanaan</p>
					</div>
					<div>
						<label class="label" for="e-start">Waktu Mulai</label>
						<input id="e-start" name="start_time" type="datetime-local" class="input" required value={editingType.start_time?.slice(0, 16) || ''} />
					</div>
					<div>
						<label class="label" for="e-end">Waktu Selesai</label>
						<input id="e-end" name="end_time" type="datetime-local" class="input" required value={editingType.end_time?.slice(0, 16) || ''} />
					</div>
				</div>

				<div class="flex items-center gap-2">
					<input id="e-active" name="is_active" type="checkbox" value="1" checked={editingType.is_active === 1} class="rounded border-slate-300" />
					<label for="e-active" class="text-sm font-medium text-slate-700">Tipe Ujian Aktif</label>
				</div>
				
				<div class="flex gap-3 pt-2">
					<button type="button" class="btn-ghost flex-1" on:click={() => (editingType = null)}>Batal</button>
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
			<h3 class="text-lg font-bold text-slate-800 mb-2">Hapus Tipe Ujian?</h3>
			<p class="text-sm text-slate-500 mb-5">Hanya bisa dihapus jika tidak ada ujian di dalamnya.</p>
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
