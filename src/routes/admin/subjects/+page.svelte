<script lang="ts">
	import { enhance } from '$app/forms';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';
	import type { PageData, ActionData } from './$types';
	import { toasts } from '$lib/stores/toast';

	export let data: PageData;
	export let form: ActionData;

	let isAdding = false;
	let editingSubject: any = null;

	$: if (form?.error) {
		toasts.error(form.error);
	} else if (form?.success) {
		toasts.success('Berhasil menyimpan data mata pelajaran');
		isAdding = false;
		editingSubject = null;
	}
</script>

<svelte:head>
	<title>Mata Pelajaran - Admin</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
		<div>
			<h1 class="text-3xl font-bold text-slate-800 tracking-tight">Mata Pelajaran</h1>
			<p class="text-slate-500 mt-1">Kelola data mata pelajaran di sekolah Anda.</p>
		</div>
		<button class="btn btn-primary" on:click={() => (isAdding = !isAdding)}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			Tambah Mapel
		</button>
	</div>

	{#if isAdding}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (isAdding = false)}>
			<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-lg animate-bounce-in" on:click|stopPropagation>
				<h2 class="text-xl font-bold text-slate-800 mb-4">Tambah Mata Pelajaran Baru</h2>
			<form method="POST" action="?/add" use:enhance={() => { return async ({ update }) => { isAdding = false; await update(); }; }} class="space-y-4 max-w-lg">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Mata Pelajaran <span class="text-red-500">*</span></label>
						<input type="text" id="name" name="name" class="input" required placeholder="Contoh: Matematika" />
					</div>
					<div>
						<label for="code" class="block text-sm font-medium text-slate-700 mb-1">Kode / Singkatan</label>
						<input type="text" id="code" name="code" class="input" placeholder="Contoh: MTK" />
					</div>
				</div>
				<div class="flex space-x-3 pt-2">
					<button type="submit" class="btn btn-primary">Simpan Mapel</button>
					<button type="button" class="btn btn-secondary" on:click={() => (isAdding = false)}>Batal</button>
				</div>
			</form>
			</div>
		</div>
	{/if}

	{#if editingSubject}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (editingSubject = null)}>
			<div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-lg animate-bounce-in" on:click|stopPropagation>
				<h2 class="text-xl font-bold text-slate-800 mb-4">Edit Mata Pelajaran</h2>
			<form method="POST" action="?/edit" use:enhance={() => { return async ({ update }) => { editingSubject = null; await update(); }; }} class="space-y-4 max-w-lg">
				<input type="hidden" name="id" value={editingSubject.id} />
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label for="e-name" class="block text-sm font-medium text-slate-700 mb-1">Nama Mata Pelajaran <span class="text-red-500">*</span></label>
						<input type="text" id="e-name" name="name" class="input" required value={editingSubject.name} />
					</div>
					<div>
						<label for="e-code" class="block text-sm font-medium text-slate-700 mb-1">Kode / Singkatan</label>
						<input type="text" id="e-code" name="code" class="input" value={editingSubject.code || ''} />
					</div>
				</div>
				<div class="flex space-x-3 pt-2">
					<button type="submit" class="btn btn-primary">Simpan Perubahan</button>
					<button type="button" class="btn btn-secondary" on:click={() => (editingSubject = null)}>Batal</button>
				</div>
			</form>
			</div>
		</div>
	{/if}

	<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="bg-slate-50 text-slate-500 text-sm">
						<th class="p-4 font-semibold">ID</th>
						<th class="p-4 font-semibold">Kode</th>
						<th class="p-4 font-semibold">Nama Mata Pelajaran</th>
						<th class="p-4 font-semibold text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-slate-700">
					{#each data.subjects as subject (subject.id)}
						<tr class="hover:bg-slate-50 transition-colors">
							<td class="p-4 text-sm text-slate-400">#{subject.id}</td>
							<td class="p-4 font-medium text-slate-900">{subject.code || '-'}</td>
							<td class="p-4 font-medium text-slate-900">{subject.name}</td>
							<td class="p-4 text-right">
								<div class="flex items-center justify-end space-x-2">
									<button class="btn-ghost btn-sm" on:click={() => { editingSubject = subject; }}>
										Edit
									</button>
									<ConfirmForm 
										action="?/delete"
										confirmTitle="Hapus Mata Pelajaran"
										confirmMessage="Hapus mata pelajaran ini?"
										buttonClass="btn-ghost btn-sm text-red-600"
										buttonTitle="Hapus"
									>
										<svelte:fragment slot="inputs">
											<input type="hidden" name="id" value={subject.id} />
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
							<td colspan="4" class="p-12 text-center text-slate-500">
								Belum ada data mata pelajaran. Silakan tambahkan.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
