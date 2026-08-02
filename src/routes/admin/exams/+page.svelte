<script lang="ts">
	import { enhance } from '$app/forms';
	import { ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';

	export let data;
	export let form: { error?: string; success?: string } | null;

	let showCreateModal = false;
	let editingExam: any = null;
	let deleteConfirm: number | null = null;

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
</script>

<svelte:head>
	<title>Manajemen Ujian — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Manajemen Ujian</h1>
			<p class="text-sm text-slate-500 mt-1">Buat dan kelola ujian</p>
		</div>
		<button class="btn-primary" on:click={() => (showCreateModal = true)}>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
			</svg>
			Buat Ujian Baru
		</button>
	</div>

	<!-- Exam Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.exams as exam (exam.id)}
			<div class="card-hover p-5 flex flex-col">
				<div class="flex items-start justify-between mb-3">
					<div class="flex-1 min-w-0">
						<h3 class="font-bold text-slate-800 truncate">{exam.title}</h3>
						<p class="text-xs text-slate-500 mt-0.5">{exam.subject || 'Umum'}</p>
					</div>
					{#if exam.is_active}
						<span class="badge-success ml-2 flex-shrink-0">Aktif</span>
					{:else}
						<span class="badge bg-slate-100 text-slate-500 ml-2 flex-shrink-0">Nonaktif</span>
					{/if}
				</div>

				{#if exam.description}
					<p class="text-sm text-slate-500 mb-3 line-clamp-2">{exam.description}</p>
				{/if}

				<div class="flex flex-wrap gap-3 text-xs text-slate-500 mb-4">
					<span class="flex items-center gap-1">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} />
						</svg>
						{exam.duration_minutes} menit
					</span>
					<span class="flex items-center gap-1">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.questions} />
						</svg>
						{exam.question_count} soal
					</span>
					<span class="flex items-center gap-1">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.users} />
						</svg>
						{exam.attempt_count} peserta
					</span>
				</div>

				<div class="mt-auto flex items-center gap-2 pt-3 border-t border-slate-100">
					<a href="/admin/exams/{exam.id}" class="btn-sm btn-outline flex-1 text-center">Detail</a>
					<button class="btn-sm btn-ghost" on:click={() => (editingExam = { ...exam })} title="Edit">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.edit} />
						</svg>
					</button>
					<form method="POST" action="?/toggleActive" use:enhance>
						<input type="hidden" name="id" value={exam.id} />
						<button type="submit" class="btn-sm btn-ghost" title={exam.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
							{#if exam.is_active}
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
					<button class="btn-sm btn-ghost text-rose-400 hover:text-rose-600" on:click={() => (deleteConfirm = exam.id)} title="Hapus">
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
				<p>Belum ada ujian. Klik "Buat Ujian Baru" untuk memulai.</p>
			</div>
		{/each}
	</div>
</div>

<!-- Create Modal -->
{#if showCreateModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (showCreateModal = false)}>
		<div class="card p-6 w-full max-w-lg animate-bounce-in" on:click|stopPropagation>
			<h2 class="text-lg font-bold text-slate-800 mb-4">Buat Ujian Baru</h2>
			<form method="POST" action="?/create" use:enhance={() => { return async ({ update }) => { showCreateModal = false; await update(); }; }} class="space-y-4">
				<div>
					<label class="label" for="c-title">Judul Ujian</label>
					<input id="c-title" name="title" type="text" required class="input" placeholder="Contoh: UTS Matematika Kelas 9" />
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="label" for="c-subject">Mata Pelajaran</label>
						<input id="c-subject" name="subject" type="text" class="input" placeholder="Matematika" />
					</div>
					<div>
						<label class="label" for="c-duration">Durasi (menit)</label>
						<input id="c-duration" name="duration_minutes" type="number" min="1" class="input" value="60" />
					</div>
				</div>
				<div>
					<label class="label" for="c-desc">Deskripsi</label>
					<textarea id="c-desc" name="description" class="input" rows="2" placeholder="Deskripsi ujian (opsional)" />
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="label" for="c-start">Waktu Mulai</label>
						<input id="c-start" name="start_time" type="datetime-local" class="input" />
					</div>
					<div>
						<label class="label" for="c-end">Waktu Selesai</label>
						<input id="c-end" name="end_time" type="datetime-local" class="input" />
					</div>
				</div>
				<div class="flex gap-3 pt-2">
					<button type="button" class="btn-ghost flex-1" on:click={() => (showCreateModal = false)}>Batal</button>
					<button type="submit" class="btn-primary flex-1">Buat Ujian</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Edit Modal -->
{#if editingExam}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (editingExam = null)}>
		<div class="card p-6 w-full max-w-lg animate-bounce-in" on:click|stopPropagation>
			<h2 class="text-lg font-bold text-slate-800 mb-4">Edit Ujian</h2>
			<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { editingExam = null; await update(); }; }} class="space-y-4">
				<input type="hidden" name="id" value={editingExam.id} />
				<div>
					<label class="label" for="e-title">Judul</label>
					<input id="e-title" name="title" type="text" required class="input" bind:value={editingExam.title} />
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="label" for="e-subject">Mata Pelajaran</label>
						<input id="e-subject" name="subject" type="text" class="input" bind:value={editingExam.subject} />
					</div>
					<div>
						<label class="label" for="e-duration">Durasi (menit)</label>
						<input id="e-duration" name="duration_minutes" type="number" min="1" class="input" bind:value={editingExam.duration_minutes} />
					</div>
				</div>
				<div>
					<label class="label" for="e-desc">Deskripsi</label>
					<textarea id="e-desc" name="description" class="input" rows="2" bind:value={editingExam.description} />
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="label" for="e-start">Waktu Mulai</label>
						<input id="e-start" name="start_time" type="datetime-local" class="input" value={editingExam.start_time?.slice(0, 16) || ''} />
					</div>
					<div>
						<label class="label" for="e-end">Waktu Selesai</label>
						<input id="e-end" name="end_time" type="datetime-local" class="input" value={editingExam.end_time?.slice(0, 16) || ''} />
					</div>
				</div>
				<div class="flex items-center gap-2">
					<input id="e-active" name="is_active" type="checkbox" value="1" checked={editingExam.is_active} class="rounded border-slate-300" />
					<label for="e-active" class="text-sm font-medium text-slate-700">Ujian Aktif</label>
				</div>
				<div class="flex gap-3 pt-2">
					<button type="button" class="btn-ghost flex-1" on:click={() => (editingExam = null)}>Batal</button>
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
		<div class="card p-6 w-full max-w-sm animate-bounce-in text-center" on:click|stopPropagation>
			<div class="w-14 h-14 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-4">
				<svg class="w-7 h-7 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.warning} />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-slate-800 mb-2">Hapus Ujian?</h3>
			<p class="text-sm text-slate-500 mb-5">Semua soal dan data terkait akan ikut terhapus.</p>
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
