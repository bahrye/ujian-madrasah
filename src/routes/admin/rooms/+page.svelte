<script lang="ts">
	import { enhance } from '$app/forms';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';
	import { toasts } from '$lib/stores/toast';
	import { ICONS } from '$lib/utils/constants';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let isAdding = false;
	let editingRoom: any = null;
	let searchQuery = '';

	$: if (form?.error) {
		toasts.error(form.error);
	} else if (form?.success) {
		toasts.success(form.success);
		isAdding = false;
		editingRoom = null;
	}

	$: rooms = data.rooms || [];
	$: filteredRooms = rooms.filter(r => {
		if (!searchQuery.trim()) return true;
		const q = searchQuery.toLowerCase();
		return (
			r.name.toLowerCase().includes(q) ||
			(r.location && r.location.toLowerCase().includes(q))
		);
	});
</script>

<svelte:head>
	<title>Ruang Ujian — Admin Ujian Online</title>
</svelte:head>

<div class="space-y-6 pb-12">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div>
			<h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Manajemen Ruang Ujian</h1>
			<p class="text-sm text-slate-500 mt-1">
				Kelola daftar ruang ujian dan lokasi/gedung di sekolah Anda.
			</p>
		</div>

		<button 
			class="btn btn-primary shadow-sm hover:shadow active:scale-95 transition-all flex items-center gap-2"
			on:click={() => (isAdding = true)}
		>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
			</svg>
			<span>Tambah Ruang</span>
		</button>
	</div>

	<!-- Filter & Search Bar -->
	<div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
		<div class="relative w-full sm:w-80">
			<input 
				type="text" 
				bind:value={searchQuery}
				placeholder="Cari nama ruang atau lokasi..."
				class="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
			/>
			<svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.search} />
			</svg>
			{#if searchQuery}
				<button 
					type="button" 
					on:click={() => searchQuery = ''}
					class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
				>
					✕
				</button>
			{/if}
		</div>

		<div class="text-xs text-slate-500 self-end sm:self-center font-medium">
			Total: <span class="font-bold text-slate-800">{filteredRooms.length}</span> ruang
		</div>
	</div>

	<!-- Content Table / Card -->
	<div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
						<th class="py-3.5 px-4 w-16 text-center">NO</th>
						<th class="py-3.5 px-4">NAMA RUANG</th>
						<th class="py-3.5 px-4">LOKASI / GEDUNG</th>
						<th class="py-3.5 px-4 text-center">KAPASITAS</th>
						<th class="py-3.5 px-4 text-right">AKSI</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-sm">
					{#if filteredRooms.length === 0}
						<tr>
							<td colspan="5" class="py-12 text-center text-slate-400">
								<div class="flex flex-col items-center justify-center gap-2">
									<div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
										<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
											<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.room} />
										</svg>
									</div>
									<p class="font-medium text-slate-700">Belum ada ruang ujian</p>
									<p class="text-xs text-slate-400 max-w-sm">
										{#if searchQuery}
											Tidak ada ruang yang cocok dengan pencarian "{searchQuery}"
										{:else}
											Tambahkan ruang ujian terlebih dahulu agar dapat dipilih pada menu Manajemen Ruang saat membuat ujian.
										{/if}
									</p>
									{#if !searchQuery}
										<button 
											class="mt-2 btn btn-sm btn-primary"
											on:click={() => (isAdding = true)}
										>
											+ Tambah Ruang Sekarang
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{:else}
						{#each filteredRooms as room, i (room.id)}
							<tr class="hover:bg-slate-50/70 transition-colors">
								<!-- No -->
								<td class="py-3.5 px-4 text-center text-xs text-slate-500 font-medium">
									{i + 1}
								</td>

								<!-- Nama Ruang -->
								<td class="py-3.5 px-4 font-semibold text-slate-800">
									<div class="flex items-center gap-2.5">
										<div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.room} />
											</svg>
										</div>
										<span>{room.name}</span>
									</div>
								</td>

								<!-- Lokasi / Gedung -->
								<td class="py-3.5 px-4 text-slate-600 text-xs">
									{#if room.location}
										<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
											<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
												<path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
											</svg>
											{room.location}
										</span>
									{:else}
										<span class="text-slate-400 italic">-</span>
									{/if}
								</td>

								<!-- Kapasitas -->
								<td class="py-3.5 px-4 text-center text-xs font-semibold text-slate-700">
									{room.capacity || 30} Kursi
								</td>

								<!-- Aksi -->
								<td class="py-3.5 px-4 text-right whitespace-nowrap">
									<div class="flex items-center justify-end gap-1.5">
										<button 
											type="button" 
											class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
											title="Edit Ruang"
											on:click={() => (editingRoom = room)}
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.edit} />
											</svg>
										</button>

										<ConfirmForm 
											action="?/delete"
											confirmTitle="Hapus Ruang Ujian"
											confirmMessage={`Hapus ruang ujian "${room.name}"? Data ruang ini tidak dapat dikembalikan.`}
											buttonClass="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
											buttonTitle="Hapus Ruang"
										>
											<svelte:fragment slot="inputs">
												<input type="hidden" name="id" value={room.id} />
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
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Modal Tambah Ruang -->
{#if isAdding}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (isAdding = false)}>
		<div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-md animate-bounce-in" on:click|stopPropagation>
			<div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
				<h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
					<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.room} />
					</svg>
					Tambah Ruang Ujian
				</h2>
				<button 
					type="button" 
					on:click={() => (isAdding = false)}
					class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
				>
					✕
				</button>
			</div>

			<form 
				method="POST" 
				action="?/add" 
				use:enhance={() => { 
					return async ({ update }) => { 
						await update(); 
					}; 
				}} 
				class="space-y-4"
			>
				<div>
					<label for="room_name" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
						Nama Ruang <span class="text-rose-500">*</span>
					</label>
					<input 
						type="text" 
						id="room_name" 
						name="name" 
						class="input w-full text-sm" 
						required 
						placeholder="Contoh: RUANG 01 atau LAB KOMPUTER 1" 
					/>
				</div>

				<div>
					<label for="room_location" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
						Lokasi / Gedung <span class="text-slate-400 font-normal">(opsional)</span>
					</label>
					<input 
						type="text" 
						id="room_location" 
						name="location" 
						class="input w-full text-sm" 
						placeholder="Contoh: Gedung A Lantai 2" 
					/>
				</div>

				<div>
					<label for="room_capacity" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
						Kapasitas Kursi <span class="text-slate-400 font-normal">(opsional)</span>
					</label>
					<input 
						type="number" 
						id="room_capacity" 
						name="capacity" 
						value="30"
						min="1"
						max="500"
						class="input w-full text-sm" 
						placeholder="Default: 30" 
					/>
				</div>

				<div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
					<button 
						type="button" 
						class="btn btn-secondary text-sm py-2 px-4" 
						on:click={() => (isAdding = false)}
					>
						Batal
					</button>
					<button 
						type="submit" 
						class="btn btn-primary text-sm py-2 px-4 shadow-sm"
					>
						Simpan Ruang
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Modal Edit Ruang -->
{#if editingRoom}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (editingRoom = null)}>
		<div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 max-h-[90vh] overflow-y-auto w-full max-w-md animate-bounce-in" on:click|stopPropagation>
			<div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
				<h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
					<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.edit} />
					</svg>
					Edit Ruang Ujian
				</h2>
				<button 
					type="button" 
					on:click={() => (editingRoom = null)}
					class="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
				>
					✕
				</button>
			</div>

			<form 
				method="POST" 
				action="?/edit" 
				use:enhance={() => { 
					return async ({ update }) => { 
						await update(); 
					}; 
				}} 
				class="space-y-4"
			>
				<input type="hidden" name="id" value={editingRoom.id} />

				<div>
					<label for="edit_room_name" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
						Nama Ruang <span class="text-rose-500">*</span>
					</label>
					<input 
						type="text" 
						id="edit_room_name" 
						name="name" 
						class="input w-full text-sm" 
						required 
						value={editingRoom.name}
						placeholder="Contoh: RUANG 01 atau LAB KOMPUTER 1" 
					/>
				</div>

				<div>
					<label for="edit_room_location" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
						Lokasi / Gedung <span class="text-slate-400 font-normal">(opsional)</span>
					</label>
					<input 
						type="text" 
						id="edit_room_location" 
						name="location" 
						class="input w-full text-sm" 
						value={editingRoom.location || ''}
						placeholder="Contoh: Gedung A Lantai 2" 
					/>
				</div>

				<div>
					<label for="edit_room_capacity" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
						Kapasitas Kursi <span class="text-slate-400 font-normal">(opsional)</span>
					</label>
					<input 
						type="number" 
						id="edit_room_capacity" 
						name="capacity" 
						value={editingRoom.capacity || 30}
						min="1"
						max="500"
						class="input w-full text-sm" 
					/>
				</div>

				<div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
					<button 
						type="button" 
						class="btn btn-secondary text-sm py-2 px-4" 
						on:click={() => (editingRoom = null)}
					>
						Batal
					</button>
					<button 
						type="submit" 
						class="btn btn-primary text-sm py-2 px-4 shadow-sm"
					>
						Simpan Perubahan
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
