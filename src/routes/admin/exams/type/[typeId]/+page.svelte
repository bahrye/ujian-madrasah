<script lang="ts">
	import { parseDate } from '$lib/utils/date';

	import { enhance } from '$app/forms';
	import { ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';

	export let data;
	export let form: { error?: string; success?: string } | null;

	let showCreateModal = false;
	let showPrintModal = false;
	let selectedPrintClassId = '';
	let editingExam: any = null;
	let deleteConfirm: number | null = null;
	let editingRoomName = '';

	$: if (editingExam && data.subjects && data.examType) {
		const subject = data.subjects.find(s => s.id === editingExam.subject_id);
		if (subject) {
			const prefix = `${data.examType.code} - ${subject.name}`;
			if (editingExam.title.startsWith(prefix) && editingExam.title.length > prefix.length + 3) {
				editingRoomName = editingExam.title.substring(prefix.length + 3);
			} else {
				editingRoomName = '';
			}
		} else {
			editingRoomName = '';
		}
	}

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
</script>

<svelte:head>
	<title>{data.examType.name} — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div class="flex items-start sm:items-center gap-3">
			<a href="/admin/exams" class="btn-ghost p-2 rounded-lg text-slate-500 hover:text-slate-800 mt-1 sm:mt-0" title="Kembali ke Tipe Ujian">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
			</a>
			<div>
				<div class="flex flex-wrap items-center gap-2">
					<span class="text-xs font-mono font-bold tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">{data.examType.code}</span>
					<h1 class="text-2xl font-bold text-slate-800">{data.examType.name}</h1>
				</div>
				<p class="text-sm text-slate-500 mt-1">Daftar mata pelajaran yang diujikan pada tipe ini</p>
			</div>
		</div>
		<div class="w-full sm:w-auto sm:ml-auto flex flex-col sm:flex-row gap-2">
			<button class="btn-outline w-full sm:w-auto justify-center text-indigo-600 border-indigo-200 hover:bg-indigo-50" on:click={() => { showPrintModal = true; selectedPrintClassId = ''; }}>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
				Cetak Kartu Peserta
			</button>
			<button class="btn-primary w-full sm:w-auto justify-center" on:click={() => (showCreateModal = true)}>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
				</svg>
				Buat Ujian Baru
			</button>
		</div>
	</div>

	<!-- Exam Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.exams as exam (exam.id)}
			{@const isOutOfBounds = (exam.start_time && exam.start_time < data.examType.start_time) || (exam.end_time && exam.end_time > data.examType.end_time)}
			<div class="card-hover p-5 flex flex-col">
				<div class="flex items-start justify-between mb-3">
					<div class="flex-1 min-w-0">
						<h3 class="font-bold text-slate-800 truncate">{exam.title}</h3>
						<p class="text-xs text-slate-500 mt-0.5">{exam.subject_name || 'Tanpa Mapel'}</p>
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
						{exam.participant_count} peserta
					</span>
					<span class="flex items-center gap-1">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
						</svg>
						{exam.teacher_count} guru
					</span>
					<span class="flex items-center gap-1">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
						</svg>
						{exam.proctor_count} pengawas
					</span>
					{#if exam.class_names}
					<span class="flex items-start gap-1 w-full mt-1">
						<svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
						</svg>
						<span class="leading-snug line-clamp-2" title={exam.class_names}>{exam.class_names}</span>
					</span>
					{/if}
					<span class="flex items-center gap-1 w-full mt-1">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
						</svg>
						Soal: {exam.shuffle_questions ? 'Acak' : 'Tidak Acak'}
					</span>
					<span class="flex items-center gap-1 w-full">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Nilai: {({ after_type_end_time: 'Jadwal Tipe Ujian', after_submit: 'Langsung Tampil', after_end_time: 'Jadwal Ujian', objective_only: 'Hanya Nilai Otomatis', manual: 'Manual (Guru/Admin)' })[exam.show_score_type || 'after_submit'] || 'Langsung Tampil'}
					</span>
					<div class="flex items-start gap-1 w-full mt-0.5 {isOutOfBounds ? 'text-rose-500 font-medium' : 'text-slate-500'}" title={isOutOfBounds ? 'Waktu ujian berada di luar rentang tipe ujian, sehingga otomatis nonaktif' : 'Rentang Waktu Ujian'}>
					<svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.calendar} />
					</svg>
					{#if exam.start_time || exam.end_time}
						<div class="flex flex-col gap-0.5 min-w-0 flex-1">
							<span class="text-slate-400 text-[10px] font-medium">Mulai:</span>
							<span class="truncate text-xs">{exam.start_time ? parseDate(exam.start_time).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-'}</span>
							<span class="text-slate-400 text-[10px] font-medium mt-0.5">Berakhir:</span>
							<span class="truncate text-xs">{exam.end_time ? parseDate(exam.end_time).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-'}</span>
							{#if isOutOfBounds}
								<span class="mt-0.5 px-1.5 py-0.5 rounded bg-rose-100 text-[9px] text-rose-600 font-bold tracking-wide w-fit">NONAKTIF</span>
							{/if}
						</div>
					{:else}
						<span>Belum diatur</span>
					{/if}
				</div>
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
				<p>Belum ada ujian di tipe ini. Klik "Buat Ujian Baru" untuk memulai.</p>
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
			<h2 class="text-lg font-bold text-slate-800 mb-4">Buat Ujian Baru</h2>
			<form method="POST" action="?/create" use:enhance={() => { return async ({ update }) => { showCreateModal = false; await update(); }; }} class="space-y-4">
				
				<div class="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-sm text-indigo-700 mb-2">
					<strong>Informasi:</strong> Judul ujian akan otomatis dibuat dengan format <code>{data.examType.code} - Nama Mata Pelajaran</code>
				</div>

				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="label" for="c-subject">Mata Pelajaran</label>
						<select id="c-subject" name="subject_id" class="input" required>
							<option value="">Pilih Mata Pelajaran</option>
							{#each data.subjects as subject}
								<option value={subject.id}>{subject.name}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="label" for="c-room">Nama Ruang/Sesi (Opsional)</label>
						<input id="c-room" name="room_name" type="text" class="input" placeholder="Cth: Ruang 1" />
					</div>
					<div>
						<label class="label" for="c-duration">Durasi (menit)</label>
						<input id="c-duration" name="duration_minutes" type="number" min="1" class="input" value="60" />
					</div>
				</div>
				<div>
					<label class="label" for="c-desc">Deskripsi</label>
					<textarea id="c-desc" name="description" class="input" rows="2" placeholder="Deskripsi ujian (opsional)"></textarea>
				</div>
				<div class="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
					<div>
						<label class="label" for="c-start">Waktu Mulai</label>
						<input id="c-start" name="start_time" type="datetime-local" class="input" value={data.examType.start_time?.slice(0, 16) || ''} min={data.examType.start_time?.slice(0, 16) || ''} max={data.examType.end_time?.slice(0, 16) || ''} />
					</div>
					<div>
						<label class="label" for="c-end">Waktu Selesai</label>
						<input id="c-end" name="end_time" type="datetime-local" class="input" value={data.examType.end_time?.slice(0, 16) || ''} min={data.examType.start_time?.slice(0, 16) || ''} max={data.examType.end_time?.slice(0, 16) || ''} />
					</div>
					<div class="col-span-2 text-xs text-slate-500 mt-1">
						Pastikan waktu berada di dalam rentang: <br/> 
						{data.examType.start_time ? parseDate(data.examType.start_time).toLocaleString('id-ID') : '-'} s.d. 
						{data.examType.end_time ? parseDate(data.examType.end_time).toLocaleString('id-ID') : '-'}
					</div>
				</div>
				<div>
					<label class="label" for="c-shuffle">Pengaturan Soal</label>
					<select id="c-shuffle" name="shuffle_questions" class="input">
						<option value="1" selected>Acak Soal (Berbeda tiap siswa)</option>
						<option value="0">Tidak Acak (Sesuai Urutan)</option>
					</select>
				</div>
				<div>
					<label class="label" for="c-score-type">Tampilkan Nilai ke Siswa</label>
					<select id="c-score-type" name="show_score_type" class="input">
						<option value="after_type_end_time" selected>Setelah Waktu Jadwal Tipe Ujian Berakhir</option>
						<option value="after_submit">Setelah Ujian Selesai (Otomatis)</option>
						<option value="after_end_time">Setelah Waktu Jadwal Ujian Berakhir</option>
						<option value="objective_only">Tampilkan Nilai Selain Isian & Essay Saja</option>
						<option value="manual">Manual (Oleh Guru/Admin)</option>
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
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (editingExam = null)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-lg animate-bounce-in" on:click|stopPropagation>
			<h2 class="text-lg font-bold text-slate-800 mb-4">Edit Ujian</h2>
			<form method="POST" action="?/update" use:enhance={() => { return async ({ update }) => { editingExam = null; await update(); }; }} class="space-y-4">
				<input type="hidden" name="id" value={editingExam.id} />
				
				<div class="grid grid-cols-2 gap-3">
					<div>
						<label class="label" for="e-subject">Mata Pelajaran</label>
						<select id="e-subject" name="subject_id" class="input" value={editingExam.subject_id} required>
							<option value="">Pilih Mata Pelajaran</option>
							{#each data.subjects as subject}
								<option value={subject.id}>{subject.name}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="label" for="e-room">Nama Ruang/Sesi (Opsional)</label>
						<input id="e-room" name="room_name" type="text" class="input" placeholder="Cth: Ruang 1" value={editingRoomName} />
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
				<div class="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
					<div>
						<label class="label" for="e-start">Waktu Mulai</label>
						<input id="e-start" name="start_time" type="datetime-local" class="input" value={editingExam.start_time?.slice(0, 16) || ''} min={data.examType.start_time?.slice(0, 16) || ''} max={data.examType.end_time?.slice(0, 16) || ''} />
					</div>
					<div>
						<label class="label" for="e-end">Waktu Selesai</label>
						<input id="e-end" name="end_time" type="datetime-local" class="input" value={editingExam.end_time?.slice(0, 16) || ''} min={data.examType.start_time?.slice(0, 16) || ''} max={data.examType.end_time?.slice(0, 16) || ''} />
					</div>
				</div>
				<div>
					<label class="label" for="e-shuffle">Pengaturan Soal</label>
					<select id="e-shuffle" name="shuffle_questions" class="input" value={String(editingExam.shuffle_questions || 0)}>
						<option value="1">Acak Soal (Berbeda tiap siswa)</option>
						<option value="0">Tidak Acak (Sesuai Urutan)</option>
					</select>
				</div>
				<div>
					<label class="label" for="e-score-type">Tampilkan Nilai ke Siswa</label>
					<select id="e-score-type" name="show_score_type" class="input" value={editingExam.show_score_type || 'after_type_end_time'}>
						<option value="after_type_end_time">Setelah Waktu Jadwal Tipe Ujian Berakhir</option>
						<option value="after_submit">Setelah Ujian Selesai (Otomatis)</option>
						<option value="after_end_time">Setelah Waktu Jadwal Ujian Berakhir</option>
						<option value="objective_only">Tampilkan Nilai Selain Isian & Essay Saja</option>
						<option value="manual">Manual (Oleh Guru/Admin)</option>
					</select>
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
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-sm animate-bounce-in text-center" on:click|stopPropagation>
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

<!-- Print Options Modal -->
{#if showPrintModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (showPrintModal = false)}>
		<div class="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" on:click|stopPropagation>
			<div class="p-6 border-b border-slate-100 flex items-center justify-between">
				<h3 class="text-lg font-bold text-slate-800">Cetak Kartu Peserta</h3>
				<button class="text-slate-400 hover:text-slate-600 transition-colors" on:click={() => showPrintModal = false}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>
			<div class="p-6 overflow-y-auto">
				<label class="block text-sm font-medium text-slate-700 mb-2">Pilih Kelas</label>
				<select bind:value={selectedPrintClassId} class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
					<option value="">Semua Kelas (Seluruh Peserta)</option>
					{#each data.classes as c}
						<option value={c.id}>{c.name}</option>
					{/each}
				</select>
			</div>
			<div class="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
				<button type="button" class="btn-ghost text-slate-600 hover:bg-slate-200" on:click={() => showPrintModal = false}>
					Batal
				</button>
				<a href="/print/kartu/type/{data.examType.id}{selectedPrintClassId ? `?class_id=${selectedPrintClassId}` : ''}" target="_blank" class="btn-primary" on:click={() => showPrintModal = false}>
					Buka Cetak Kartu
				</a>
			</div>
		</div>
	</div>
{/if}
