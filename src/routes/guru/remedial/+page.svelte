<script lang="ts">
	import { enhance } from '$app/forms';
	import { ICONS } from '$lib/utils/constants';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';

	export let data;

	let searchTerm = '';
	let showCreateModal = false;
	let editingExam: any = null;

	$: filteredExams = data.exams.filter((e: any) => 
		e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
		(e.subject_name && e.subject_name.toLowerCase().includes(searchTerm.toLowerCase()))
	);
</script>

<svelte:head>
	<title>Ujian Remedial | CBT Madrasah</title>
</svelte:head>

<div class="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Ujian Remedial</h1>
		<p class="text-slate-500 text-sm mt-1">Kelola dan selenggarakan ujian remedial/susulan mandiri Anda.</p>
	</div>
	<button class="btn btn-primary" on:click={() => (showCreateModal = true)}>
		<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
		</svg>
		Buat Ujian Remedial
	</button>
</div>

<div class="card overflow-hidden animate-in" style="animation-delay: 50ms;">
	<div class="p-4 border-b border-slate-100 flex gap-3">
		<div class="relative flex-1 max-w-md">
			<svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.search} />
			</svg>
			<input type="text" placeholder="Cari judul ujian atau mata pelajaran..." bind:value={searchTerm} class="input pl-10" />
		</div>
	</div>

	<div class="table-container max-h-[calc(100vh-250px)] overflow-y-auto">
		<table class="table">
			<thead class="sticky top-0 bg-white z-10">
				<tr>
					<th>Judul Ujian</th>
					<th>Status</th>
					<th>Jadwal</th>
					<th>Statistik</th>
					<th class="text-right">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#if filteredExams.length === 0}
					<tr>
						<td colspan="5" class="text-center py-12 text-slate-400">
							{#if searchTerm}
								Tidak ada ujian remedial yang sesuai pencarian.
							{:else}
								Anda belum membuat ujian remedial sama sekali.
							{/if}
						</td>
					</tr>
				{:else}
					{#each filteredExams as exam}
						<tr class="hover:bg-slate-50/50 transition-colors">
							<td>
								<div class="font-bold text-slate-800 mb-1">{exam.title}</div>
								<div class="text-xs text-slate-500">Mapel: {exam.subject_name || '-'} | Durasi: {exam.duration_minutes}m</div>
								<div class="text-xs text-slate-500 mt-0.5">Pengawas: {data.user?.name || '-'}</div>
							</td>
							<td>
								<form method="POST" action="?/toggleActive" use:enhance class="inline-block">
									<input type="hidden" name="id" value={exam.id} />
									<button type="submit" class="badge {exam.is_active ? 'badge-success hover:bg-emerald-200' : 'badge-slate hover:bg-slate-300'} transition-colors cursor-pointer" title="Klik untuk mengubah status">
										{exam.is_active ? 'Aktif' : 'Nonaktif'}
									</button>
								</form>
							</td>
							<td class="text-xs text-slate-600 space-y-1">
								<div>Mulai: {exam.start_time ? new Date(String(exam.start_time).replace(' ', 'T') + (String(exam.start_time).includes(' ') && !String(exam.start_time).includes('Z') ? 'Z' : '')).toLocaleString('id-ID') : '-'}</div>
								<div>Akhir: {exam.end_time ? new Date(String(exam.end_time).replace(' ', 'T') + (String(exam.end_time).includes(' ') && !String(exam.end_time).includes('Z') ? 'Z' : '')).toLocaleString('id-ID') : '-'}</div>
							</td>
							<td>
								<div class="flex items-center gap-3">
									<span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md" title="Jumlah Soal">{exam.question_count} soal</span>
									<span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md" title="Jumlah Peserta">{exam.participant_count} peserta</span>
								</div>
							</td>
							<td>
								<div class="flex items-center justify-end gap-2">
									<a href="/guru/remedial/{exam.id}" class="btn-sm btn-ghost text-indigo-600 hover:bg-indigo-50" title="Kelola & Monitor Ujian">
										Monitor & Kelola
									</a>
									<button class="btn-sm btn-ghost text-slate-400 hover:text-indigo-600" on:click={() => (editingExam = exam)} title="Edit Ujian">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.edit} /></svg>
									</button>
									<ConfirmForm 
										action="?/delete"
										confirmTitle="Hapus Ujian Remedial"
										confirmMessage="Hapus ujian '{exam.title}'? Semua data soal dan nilai siswa akan ikut terhapus."
										buttonClass="btn-sm btn-ghost text-rose-400 hover:text-rose-600 hover:bg-rose-50"
										buttonTitle="Hapus ujian"
									>
										<svelte:fragment slot="inputs">
											<input type="hidden" name="id" value={exam.id} />
										</svelte:fragment>
										<svelte:fragment slot="buttonContent">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} /></svg>
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

<!-- Create Modal -->
{#if showCreateModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" on:click={() => (showCreateModal = false)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-lg animate-in fade-in zoom-in duration-200" on:click|stopPropagation>
			<h2 class="text-lg font-bold text-slate-800 mb-4">Buat Ujian Remedial Baru</h2>
			<form method="POST" action="?/create" use:enhance={() => { return async ({ update }) => { showCreateModal = false; await update(); }; }} class="space-y-4">
				<div>
					<label class="label" for="c-title">Judul Ujian</label>
					<input id="c-title" name="title" type="text" required class="input" placeholder="Contoh: Remedial Matematika Kelas 9A" />
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="label" for="c-subject">Mata Pelajaran</label>
						<select id="c-subject" name="subject_id" class="input">
							<option value="">Pilih Mata Pelajaran (Opsional)</option>
							{#each data.subjects as subject}
								<option value={subject.id}>{subject.name}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="label" for="c-duration">Durasi (menit)</label>
						<input id="c-duration" name="duration_minutes" type="number" min="1" class="input" value="60" />
					</div>
				</div>
				<div>
					<label class="label" for="c-desc">Deskripsi</label>
					<textarea id="c-desc" name="description" class="input" rows="2" placeholder="Informasi untuk siswa"></textarea>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="label" for="c-start">Waktu Mulai (Opsional)</label>
						<input id="c-start" name="start_time" type="datetime-local" class="input" />
					</div>
					<div>
						<label class="label" for="c-end">Waktu Selesai (Opsional)</label>
						<input id="c-end" name="end_time" type="datetime-local" class="input" />
					</div>
				</div>
				<div>
					<label class="label" for="c-shuffle">Pengaturan Soal</label>
					<select id="c-shuffle" name="shuffle_questions" class="input">
						<option value="1">Acak Soal (Sangat Disarankan)</option>
						<option value="0">Tidak Acak (Sesuai Urutan)</option>
					</select>
				</div>
				<div>
					<label class="label" for="c-score-type">Kapan nilai dirilis ke siswa?</label>
					<select id="c-score-type" name="show_score_type" class="input">
						<option value="after_submit">Langsung Setelah Ujian Selesai</option>
						<option value="manual">Manual (Dirilis sendiri oleh Guru)</option>
					</select>
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
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" on:click={() => (editingExam = null)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-lg animate-in fade-in zoom-in duration-200" on:click|stopPropagation>
			<h2 class="text-lg font-bold text-slate-800 mb-4">Edit Ujian Remedial</h2>
			<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { editingExam = null; await update(); }; }} class="space-y-4">
				<input type="hidden" name="id" value={editingExam.id} />
				<div>
					<label class="label" for="e-title">Judul</label>
					<input id="e-title" name="title" type="text" required class="input" value={editingExam.title} />
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="label" for="e-subject">Mata Pelajaran</label>
						<select id="e-subject" name="subject_id" class="input" value={editingExam.subject_id}>
							<option value="">Pilih Mata Pelajaran</option>
							{#each data.subjects as subject}
								<option value={subject.id}>{subject.name}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="label" for="e-duration">Durasi (menit)</label>
						<input id="e-duration" name="duration_minutes" type="number" min="1" class="input" value={editingExam.duration_minutes} />
					</div>
				</div>
				<div>
					<label class="label" for="e-desc">Deskripsi</label>
					<textarea id="e-desc" name="description" class="input" rows="2" value={editingExam.description}></textarea>
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
				<div>
					<label class="label" for="e-shuffle">Pengaturan Soal</label>
					<select id="e-shuffle" name="shuffle_questions" class="input" value={String(editingExam.shuffle_questions || 0)}>
						<option value="1">Acak Soal</option>
						<option value="0">Tidak Acak</option>
					</select>
				</div>
				<div>
					<label class="label" for="e-score-type">Tampilkan Nilai ke Siswa</label>
					<select id="e-score-type" name="show_score_type" class="input" value={editingExam.show_score_type || 'after_submit'}>
						<option value="after_submit">Langsung Setelah Selesai</option>
						<option value="manual">Manual (Oleh Guru)</option>
					</select>
				</div>
				<div class="flex items-center gap-2">
					<input id="e-active" name="is_active" type="checkbox" value="1" checked={editingExam.is_active} class="rounded border-slate-300" />
					<label for="e-active" class="text-sm font-medium text-slate-700">Ujian Aktif</label>
				</div>
				<div class="flex gap-3 pt-2">
					<button type="button" class="btn-ghost flex-1" on:click={() => (editingExam = null)}>Batal</button>
					<button type="submit" class="btn-primary flex-1">Simpan Perubahan</button>
				</div>
			</form>
		</div>
	</div>
{/if}
