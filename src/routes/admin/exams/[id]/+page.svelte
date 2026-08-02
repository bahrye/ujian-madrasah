<script lang="ts">
	import { enhance } from '$app/forms';
	import { QUESTION_TYPE_LABELS, ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS, ICONS } from '$lib/utils/constants';

	export let form: { error?: string; success?: string } | null = null;
	export let data;
	$: exam = data.exam as any;
	$: questions = data.questions as any[];
	$: attempts = data.attempts as any[];
	$: tokens = data.tokens as any[];
	$: participants = data.participants as any[];
	
	let showAddParticipantModal = false;
	let addParticipantTab: 'class' | 'student' = 'class';

	import { toasts } from '$lib/stores/toast';
	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
</script>

<svelte:head>
	<title>{exam.title} — Detail Ujian</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex items-center gap-3">
		<a href="/admin/exams" class="btn-ghost btn-sm">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
			</svg>
			Kembali
		</a>
	</div>

	<!-- Exam Header -->
	<div class="card p-6">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
			<div>
				<h1 class="text-2xl font-bold text-slate-800">{exam.title}</h1>
				<p class="text-sm text-slate-500 mt-1">{exam.subject || 'Umum'} · {exam.duration_minutes} menit</p>
			</div>
			{#if exam.is_active}
				<span class="badge-success text-sm px-4 py-1.5">Aktif</span>
			{:else}
				<span class="badge bg-slate-100 text-slate-500 text-sm px-4 py-1.5">Nonaktif</span>
			{/if}
		</div>
		{#if exam.description}
			<p class="mt-3 text-sm text-slate-600">{exam.description}</p>
		{/if}
		<div class="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
			<span>Mulai: {exam.start_time ? new Date(exam.start_time).toLocaleString('id-ID') : '-'}</span>
			<span>Selesai: {exam.end_time ? new Date(exam.end_time).toLocaleString('id-ID') : '-'}</span>
		</div>
	</div>

	<!-- Stats Row -->
	<div class="grid grid-cols-3 gap-4">
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-gradient">{questions.length}</p>
			<p class="text-xs text-slate-500">Soal</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-gradient-cyan">{attempts.length}</p>
			<p class="text-xs text-slate-500">Peserta</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-amber-500">{tokens.length}</p>
			<p class="text-xs text-slate-500">Token</p>
		</div>
	</div>

	<!-- Questions List -->
	<div class="card overflow-hidden">
		<div class="p-5 border-b border-slate-100 flex items-center justify-between">
			<h2 class="text-lg font-bold text-slate-800">Daftar Soal</h2>
			<a href="/guru/bank-soal/{exam.id}" class="btn-sm btn-outline">Kelola Soal</a>
		</div>
		{#if questions.length === 0}
			<div class="p-8 text-center text-slate-400 text-sm">Belum ada soal untuk ujian ini.</div>
		{:else}
			<div class="divide-y divide-slate-100">
				{#each questions as q}
					<div class="p-4 flex items-center gap-3">
						<span class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">{q.question_number}</span>
						<div class="flex-1 min-w-0">
							<p class="text-sm text-slate-700 truncate">{q.question_text}</p>
							<span class="text-[10px] badge-primary mt-0.5">{QUESTION_TYPE_LABELS[q.type] || q.type}</span>
						</div>
						<span class="text-xs text-slate-400">{q.points} poin</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Participants Table -->
	<div class="card overflow-hidden">
		<div class="p-5 border-b border-slate-100 flex items-center justify-between">
			<h2 class="text-lg font-bold text-slate-800">Daftar Peserta Ujian</h2>
			<button class="btn-sm btn-primary" on:click={() => (showAddParticipantModal = true)}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
				</svg>
				Tambah Peserta
			</button>
		</div>
		{#if participants.length === 0}
			<div class="p-8 text-center text-slate-400 text-sm">Belum ada peserta yang ditambahkan ke ujian ini. Ujian tidak bisa diakses siswa.</div>
		{:else}
			<div class="table-container border-0 rounded-none max-h-96 overflow-y-auto">
				<table class="table">
					<thead class="sticky top-0 bg-white"><tr><th>NISN</th><th>Nama Siswa</th><th>Kelas</th><th>Aksi</th></tr></thead>
					<tbody>
						{#each participants as p}
							<tr>
								<td class="text-xs font-mono">{p.nisn}</td>
								<td class="font-medium">{p.student_name}</td>
								<td>{p.class_name || '-'}</td>
								<td>
									<form method="POST" action="?/removeParticipant" use:enhance>
										<input type="hidden" name="participant_id" value={p.participant_id} />
										<button type="submit" class="text-rose-500 hover:text-rose-700 p-1" title="Hapus dari ujian" on:click={(e) => { if (!confirm('Hapus siswa ini dari ujian?')) e.preventDefault(); }}>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
											</svg>
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Attempts Table -->
	<div class="card overflow-hidden">
		<div class="p-5 border-b border-slate-100">
			<h2 class="text-lg font-bold text-slate-800">Riwayat Pengerjaan</h2>
		</div>
		{#if attempts.length === 0}
			<div class="p-8 text-center text-slate-400 text-sm">Belum ada peserta yang mengerjakan ujian ini.</div>
		{:else}
			<div class="table-container border-0 rounded-none">
				<table class="table">
					<thead><tr><th>Siswa</th><th>Status</th><th>Nilai</th><th>Waktu Mulai</th></tr></thead>
					<tbody>
						{#each attempts as a}
							<tr>
								<td class="font-medium">{a.student_name}</td>
								<td><span class={ATTEMPT_STATUS_COLORS[a.status] || 'badge-info'}>{ATTEMPT_STATUS_LABELS[a.status] || a.status}</span></td>
								<td class="font-semibold">{a.score != null ? a.score : '-'}</td>
								<td class="text-xs text-slate-500">{new Date(a.start_time).toLocaleString('id-ID')}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<!-- Add Participant Modal -->
{#if showAddParticipantModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (showAddParticipantModal = false)}>
		<div class="card p-6 w-full max-w-lg animate-bounce-in" on:click|stopPropagation>
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-bold text-slate-800">Tambah Peserta Ujian</h2>
				<button class="text-slate-400 hover:text-slate-600" on:click={() => (showAddParticipantModal = false)}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>
			
			<div class="flex border-b border-slate-200 mb-4">
				<button class="px-4 py-2 text-sm font-medium {addParticipantTab === 'class' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}" on:click={() => (addParticipantTab = 'class')}>Per Kelas</button>
				<button class="px-4 py-2 text-sm font-medium {addParticipantTab === 'student' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}" on:click={() => (addParticipantTab = 'student')}>Per Siswa</button>
			</div>

			{#if addParticipantTab === 'class'}
				<form method="POST" action="?/addParticipantClass" use:enhance={() => { return async ({ update }) => { showAddParticipantModal = false; await update(); }; }} class="space-y-4">
					<div>
						<label class="label" for="add-class">Pilih Kelas</label>
						<select id="add-class" name="class_id" class="input" required>
							<option value="">-- Pilih Kelas --</option>
							{#each data.classes as c}
								<option value={c.id}>{c.name}</option>
							{/each}
						</select>
						<p class="text-xs text-slate-500 mt-1">Semua siswa di kelas ini akan ditambahkan sebagai peserta ujian.</p>
					</div>
					<div class="pt-2">
						<button type="submit" class="btn-primary w-full">Tambahkan Kelas</button>
					</div>
				</form>
			{:else}
				<form method="POST" action="?/addParticipantStudent" use:enhance={() => { return async ({ update }) => { showAddParticipantModal = false; await update(); }; }} class="space-y-4">
					<div>
						<label class="label" for="add-student">Pilih Siswa</label>
						<select id="add-student" name="student_id" class="input" required>
							<option value="">-- Pilih Siswa --</option>
							{#each data.allStudents as s}
								<option value={s.id}>{s.name} ({s.username})</option>
							{/each}
						</select>
					</div>
					<div class="pt-2">
						<button type="submit" class="btn-primary w-full">Tambahkan Siswa</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}
