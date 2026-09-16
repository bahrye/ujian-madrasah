<script lang="ts">
	import { parseDate } from '$lib/utils/date';

	import { enhance } from '$app/forms';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';
	import { QUESTION_TYPE_LABELS, ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS, ICONS } from '$lib/utils/constants';
	import { mathRender } from '$lib/actions/mathRender';
	import { arabicRender } from '$lib/actions/arabicRender';

	export let form: { error?: string; success?: string } | null = null;
	export let data;
	$: exam = data.exam as any;
	$: questions = data.questions as any[];
	$: attempts = data.attempts as any[];
	$: tokens = data.tokens as any[];
	$: participants = data.participants as any[];
	
	$: allTeachers = data.allTeachers as any[];
	$: examTeachers = data.examTeachers as any[];
	$: examProctors = data.examProctors as any[];
	$: examSessions = (data.examSessions || []) as any[];
	$: hasSessionsOrRooms = data.hasSessions || (data.examRooms && data.examRooms.length > 0);

	let showAddParticipantModal = false;
	let addParticipantTab: 'class' | 'student' = 'class';
	let studentSearch = '';
	let studentClassFilter = '';
	
	let showAddTeacherModal = false;
	let teacherSearch = '';
	
	let showAddProctorModal = false;
	let proctorSearch = '';
	let isSavingProctors = false;
	let isSavingParticipants = false;

	let selectedClassId = '';
	$: previewStudents = selectedClassId ? data.allStudents.filter((s: any) => s.class_id?.toString() === selectedClassId) : [];

	$: filteredStudents = data.allStudents ? data.allStudents.filter((s: any) => {
		const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.username.toLowerCase().includes(studentSearch.toLowerCase());
		const matchesClass = studentClassFilter ? s.class_id?.toString() === studentClassFilter : true;
		return matchesSearch && matchesClass;
	}) : [];

	import { toasts } from '$lib/stores/toast';
	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
</script>

<svelte:head>
	<title>{exam.title} — Detail Ujian</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex items-center justify-between gap-3">
		<a href={exam.class_id ? `/admin/exams/type/${exam.exam_type_id}/class/${exam.class_id}` : `/admin/exams/type/${exam.exam_type_id}`} class="btn-ghost btn-sm">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
			</svg>
			Kembali
		</a>
		
		<div class="relative group">
			<button class="btn-outline btn-sm flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
				</svg>
				Cetak & Export
				<svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
			</button>
			<div class="absolute right-0 mt-1 w-56 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">

				<a href="/print/jadwal-rekap/type/{exam.exam_type_id}{exam.class_id ? `?class_id=${exam.class_id}` : ''}" target="_blank" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
					<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
					Cetak Jadwal Ujian
				</a>
				<a href="/print/kehadiran/{exam.id}" target="_blank" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
					<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
					Cetak Daftar Hadir
				</a>
				<a href="/print/berita-acara/{exam.id}" target="_blank" class="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
					<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
					Cetak Berita Acara
				</a>
				<div class="h-px bg-slate-100 my-1"></div>
				<a href="/api/export/excel/{exam.id}" class="flex items-center gap-3 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors">
					<svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
					Export Nilai (Excel)
				</a>
			</div>
		</div>
	</div>

	<!-- Exam Header -->
	<div class="card p-6">
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
			<div>
				{#if exam.exam_type_code}
					<div class="flex items-center gap-2 mb-1">
						<span class="text-xs font-mono font-bold tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">{exam.exam_type_code}</span>
					</div>
				{/if}
				<h1 class="text-2xl font-bold text-slate-800">{exam.title}</h1>
				<p class="text-sm text-slate-500 mt-1">{exam.subject_name || exam.subject || 'Umum'} · {exam.duration_minutes} menit</p>
			</div>
			<div class="flex items-center gap-3">
				{#if exam.show_score_type === 'manual'}
					<form method="POST" action="?/toggleScoreRelease" use:enhance>
						<button type="submit" class="flex items-center gap-2 px-3 py-1.5 rounded-full border {exam.is_score_released ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'} transition-colors" title="Klik untuk mengubah status rilis nilai manual">
							<div class="relative inline-flex h-4 w-7 items-center rounded-full {exam.is_score_released ? 'bg-indigo-500' : 'bg-slate-300'} transition-colors">
								<span class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform {exam.is_score_released ? 'translate-x-3.5' : 'translate-x-0.5'}"></span>
							</div>
							<span class="text-xs font-semibold">{exam.is_score_released ? 'Nilai Dirilis' : 'Nilai Disembunyikan'}</span>
						</button>
					</form>
				{/if}
				{#if exam.is_active}
					<span class="badge-success text-sm px-4 py-1.5">Aktif</span>
				{:else}
					<span class="badge bg-slate-100 text-slate-500 text-sm px-4 py-1.5">Nonaktif</span>
				{/if}
			</div>
		</div>
		{#if exam.description}
			<p class="mt-3 text-sm text-slate-600">{exam.description}</p>
		{/if}
		<div class="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 items-center">
			{#if examSessions.length > 0}
				<div class="w-full flex flex-wrap gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-1">
					<span class="text-slate-600 font-semibold flex items-center gap-1 mr-1">
						<svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} /></svg>
						Jadwal Per Sesi:
					</span>
					<div class="flex flex-wrap gap-2">
						{#each examSessions as session}
							<span class="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-slate-200 text-xs shadow-xs">
								<strong class="text-indigo-600 font-bold">Sesi {session.session_number}:</strong>
								<span class="text-slate-700 font-medium">
									{session.start_time ? parseDate(session.start_time).toLocaleString('id-ID') : '-'}
									<span class="text-slate-400 mx-0.5">s/d</span>
									{session.end_time ? parseDate(session.end_time).toLocaleString('id-ID') : '-'}
								</span>
							</span>
						{/each}
					</div>
				</div>
			{:else}
				<span class="flex items-center gap-1">
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} /></svg>
					Mulai: <strong class="text-slate-600 font-medium">{exam.start_time ? parseDate(exam.start_time).toLocaleString('id-ID') : '-'}</strong>
				</span>
				<span class="flex items-center gap-1">
					<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} /></svg>
					Selesai: <strong class="text-slate-600 font-medium">{exam.end_time ? parseDate(exam.end_time).toLocaleString('id-ID') : '-'}</strong>
				</span>
			{/if}
			<span class="flex items-center gap-1">
				<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>
				Tampilan Soal: <strong class="text-slate-600 font-medium">{exam.shuffle_questions ? 'Acak' : 'Tidak Acak'}</strong>
			</span>
			<span class="flex items-center gap-1">
				<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
				Tampilan Nilai: <strong class="text-slate-600 font-medium">{({ after_type_end_time: 'Jadwal Tipe Ujian', after_submit: 'Langsung Tampil', after_end_time: 'Jadwal Ujian', objective_only: 'Hanya Nilai Otomatis', manual: 'Manual (Guru/Admin)' })[exam.show_score_type || 'after_submit'] || 'Langsung Tampil'}</strong>
			</span>
		</div>
	</div>

	<!-- Stats Row -->
	<div class="grid grid-cols-2 md:grid-cols-5 gap-4">
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-gradient">{questions.length}</p>
			<p class="text-xs text-slate-500">Soal</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-gradient-cyan">{participants.length}</p>
			<p class="text-xs text-slate-500">Peserta</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-amber-500">{tokens.length}</p>
			<p class="text-xs text-slate-500">Token</p>
		</div>
		<div class="card p-4 text-center">
			<p class="text-2xl font-bold text-indigo-500">{examTeachers.length}</p>
			<p class="text-xs text-slate-500">Guru</p>
		</div>
		<div class="card p-4 text-center col-span-2 md:col-span-1">
			<p class="text-2xl font-bold text-rose-500">{examProctors.length}</p>
			<p class="text-xs text-slate-500">Pengawas</p>
		</div>
	</div>

	<!-- Manajemen Ruang -->
	<div class="card overflow-hidden mb-6">
		<div class="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
			<div>
				<h2 class="text-lg font-bold text-slate-800">Manajemen Ruang</h2>
				<p class="text-xs text-slate-500 mt-0.5">Bagi peserta dan pengawas ke dalam beberapa ruang (opsional).</p>
			</div>
			{#if data.masterRooms && data.masterRooms.length > 0}
				<form method="POST" action="?/addRoom" use:enhance class="flex items-center gap-2">
					<select name="name" class="input py-1.5 text-sm min-w-[220px]" required>
						<option value="">-- Pilih Ruang Ujian --</option>
						{#each data.masterRooms as mRoom}
							<option value={mRoom.name}>
								{mRoom.name}{mRoom.location ? ` (${mRoom.location})` : ''}
							</option>
						{/each}
					</select>
					<button type="submit" class="btn-sm btn-primary shrink-0">Tambah Ruang</button>
				</form>
			{:else}
				<div class="flex items-center gap-2">
					<span class="text-xs text-slate-500">Belum ada ruang di master.</span>
					<a href="/admin/rooms" class="btn-sm btn-secondary text-xs shrink-0 flex items-center gap-1.5">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
						</svg>
						<span>Tambah di Ruang Ujian</span>
					</a>
				</div>
			{/if}
		</div>
		{#if data.examRooms.length === 0}
			<div class="p-6 text-center text-slate-400 text-sm">Tidak ada pembagian ruang. Semua peserta berada dalam 1 ruang default.</div>
		{:else}
			<div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
				{#each data.examRooms as room}
					<div class="border border-slate-100 rounded-lg p-3 bg-slate-50 flex items-center justify-between">
						<div class="font-medium text-slate-700 text-sm">{room.name}</div>
						<ConfirmForm 
							action="?/deleteRoom"
							confirmTitle="Hapus Ruang"
							confirmMessage="Hapus ruang ujian ini? Peserta dan pengawas di ruang ini tidak akan memiliki ruang yang spesifik."
							buttonClass="text-rose-500 hover:text-rose-700 p-1"
							buttonTitle="Hapus"
						>
							<svelte:fragment slot="inputs">
								<input type="hidden" name="room_id" value={room.id} />
							</svelte:fragment>
							<svelte:fragment slot="buttonContent">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
								</svg>
							</svelte:fragment>
						</ConfirmForm>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Daftar Pengajar -->
	<div class="card overflow-hidden mb-6">
		<div class="p-5 border-b border-slate-100 flex items-center justify-between">
			<div>
				<h2 class="text-lg font-bold text-slate-800">Daftar Pengajar</h2>
				<p class="text-xs text-slate-500 mt-0.5">Guru yang diizinkan mengelola bank soal untuk ujian ini.</p>
			</div>
			<button class="btn-sm btn-primary" on:click={() => (showAddTeacherModal = true)}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
				</svg>
				Tambah Pengajar
			</button>
		</div>
		{#if examTeachers.length === 0}
			<div class="p-8 text-center text-slate-400 text-sm">Belum ada pengajar tambahan. Hanya pembuat ujian yang dapat mengelola soal.</div>
		{:else}
			<div class="table-container border-0 rounded-none">
				<table class="table">
					<thead><tr><th>Nama Guru</th><th>Username</th><th>Aksi</th></tr></thead>
					<tbody>
						{#each examTeachers as teacher}
							<tr>
								<td class="font-medium text-slate-800">{teacher.name}</td>
								<td class="font-mono text-sm text-slate-500">{teacher.username}</td>

								<td>
									<ConfirmForm 
										action="?/removeTeacher"
										confirmTitle="Hapus Pengajar"
										confirmMessage="Hapus pengajar ini?"
										buttonClass="text-rose-500 hover:text-rose-700 p-1"
										buttonTitle="Hapus Pengajar"
									>
										<svelte:fragment slot="inputs">
											<input type="hidden" name="exam_teacher_id" value={teacher.exam_teacher_id} />
										</svelte:fragment>
										<svelte:fragment slot="buttonContent">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
											</svg>
										</svelte:fragment>
									</ConfirmForm>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Proctors List -->
	<div class="card overflow-hidden mb-6">
		<div class="p-5 border-b border-slate-100 flex items-center justify-between">
			<div>
				<h2 class="text-lg font-bold text-slate-800">Daftar Pengawas Ujian</h2>
				<p class="text-xs text-slate-500 mt-0.5">Tentukan penetapan pengawas, sesi, dan ruang mengawas untuk setiap pengawas.</p>
			</div>
			<div class="flex items-center gap-2">
				{#if examProctors.length > 0}
					<button type="submit" form="proctors-form" disabled={isSavingProctors} class="btn-sm btn-primary flex items-center gap-1.5 shadow-sm">
						{#if isSavingProctors}
							<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
							Menyimpan...
						{:else}
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							Simpan Pengawas
						{/if}
					</button>
				{/if}
				<button class="btn-sm btn-secondary flex items-center gap-1.5" on:click={() => (showAddProctorModal = true)}>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
					</svg>
					Tambah Pengawas
				</button>
			</div>
		</div>
		{#if examProctors.length === 0}
			<div class="p-8 text-center text-slate-400 text-sm">Belum ada pengawas yang ditugaskan untuk ujian ini.</div>
		{:else}
			<form id="proctors-form" method="POST" action="?/updateAllProctors" use:enhance={() => {
				isSavingProctors = true;
				return async ({ update }) => {
					await update({ reset: false });
					isSavingProctors = false;
				};
			}}>
				<div class="table-container border-0 rounded-none max-h-80 overflow-y-auto">
					<table class="table">
						<thead class="sticky top-0 bg-white z-10">
							<tr>
								<th>Nama Pengawas</th>
								<th>Username</th>
								<th>Penetapan Peran</th>
								{#if data.hasSessions}<th>Sesi Mengawas</th>{/if}
								{#if data.examRooms.length > 0}<th>Ruang Ujian</th>{/if}
								<th class="w-16">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{#each examProctors as proctor (proctor.exam_proctor_id)}
								<tr>
									<td class="font-medium text-slate-800">
										<input type="hidden" name="exam_proctor_ids" value={proctor.exam_proctor_id} />
										{proctor.name}
									</td>
									<td class="font-mono text-sm text-slate-500">{proctor.username}</td>
									<td>
										<select name={`role_${proctor.exam_proctor_id}`} class="select select-sm select-bordered w-full max-w-[150px]" value={proctor.proctor_role === 'p2' ? 'p2' : 'p1'}>
											<option value="p1">Pengawas 1</option>
											<option value="p2">Pengawas 2</option>
										</select>
									</td>
									{#if data.hasSessions}
										{@const sessionsArr = proctor.sessions ? JSON.parse(proctor.sessions) : []}
										<td>
											<div class="flex flex-wrap gap-2.5 items-center">
												{#each Array(data.sessionsCount) as _, i}
													{@const sNum = i + 1}
													<label class="flex items-center gap-1.5 cursor-pointer bg-slate-50 hover:bg-indigo-50 px-2 py-1 rounded border border-slate-200 hover:border-indigo-200 transition-colors">
														<input 
															type="checkbox" 
															name={`sessions_${proctor.exam_proctor_id}`} 
															value={sNum} 
															checked={sessionsArr.includes(sNum)} 
															class="w-3.5 h-3.5 text-indigo-600 rounded focus:ring-indigo-500" 
														/>
														<span class="text-xs font-medium text-slate-700">Sesi {sNum}</span>
													</label>
												{/each}
											</div>
										</td>
									{/if}
									{#if data.examRooms.length > 0}
										<td>
											<select name={`room_${proctor.exam_proctor_id}`} class="select select-sm select-bordered w-full max-w-[140px]">
												<option value="">- Semua Ruang -</option>
												{#each data.examRooms as room}
													<option value={room.id} selected={proctor.room_id === room.id}>{room.name}</option>
												{/each}
											</select>
										</td>
									{/if}
									<td>
										<ConfirmForm 
											action="?/removeProctor"
											confirmTitle="Hapus Pengawas"
											confirmMessage="Hapus pengawas ini?"
											buttonClass="text-rose-500 hover:text-rose-700 p-1"
											buttonTitle="Hapus Pengawas"
										>
											<svelte:fragment slot="inputs">
												<input type="hidden" name="exam_proctor_id" value={proctor.exam_proctor_id} />
											</svelte:fragment>
											<svelte:fragment slot="buttonContent">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
												</svg>
											</svelte:fragment>
										</ConfirmForm>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</form>
		{/if}
	</div>

	<!-- Participants Table -->
	<div class="card overflow-hidden mb-6">
		<div class="p-5 border-b border-slate-100 flex items-center justify-between">
			<div>
				<h2 class="text-lg font-bold text-slate-800">Daftar Peserta Ujian</h2>
				<p class="text-xs text-slate-500 mt-0.5">Tentukan sesi dan ruang untuk peserta ujian.</p>
			</div>
			<div class="flex items-center gap-2">
				{#if participants.length > 0 && hasSessionsOrRooms}
					<button type="submit" form="participants-form" disabled={isSavingParticipants} class="btn-sm btn-primary flex items-center gap-1.5 shadow-sm">
						{#if isSavingParticipants}
							<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
							Menyimpan...
						{:else}
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							Simpan Sesi & Ruang Peserta
						{/if}
					</button>
				{/if}
				<button class="btn-sm btn-secondary flex items-center gap-1.5" on:click={() => (showAddParticipantModal = true)}>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
					</svg>
					Tambah Peserta
				</button>
			</div>
		</div>
		{#if participants.length === 0}
			<div class="p-8 text-center text-slate-400 text-sm">Belum ada peserta yang ditambahkan ke ujian ini. Ujian tidak bisa diakses siswa.</div>
		{:else}
			<form id="participants-form" method="POST" action="?/updateAllParticipants" use:enhance={() => {
				isSavingParticipants = true;
				return async ({ update }) => {
					await update({ reset: false });
					isSavingParticipants = false;
				};
			}}>
				<div class="table-container border-0 rounded-none max-h-96 overflow-y-auto">
					<table class="table">
						<thead class="sticky top-0 bg-white z-10">
							<tr>
								<th>NISN</th>
								<th>Nama Siswa</th>
								<th>Kelas</th>
								{#if data.hasSessions}<th>Sesi</th>{/if}
								{#if data.examRooms.length > 0}<th>Ruang</th>{/if}
								<th class="w-16">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{#each participants as p (p.participant_id)}
								<tr>
									<td class="text-xs font-mono">
										<input type="hidden" name="participant_ids" value={p.participant_id} />
										<input type="hidden" name="user_ids" value={p.user_id} />
										{p.nisn}
									</td>
									<td class="font-medium">{p.student_name}</td>
									<td>{p.class_name || '-'}</td>
									{#if data.hasSessions}
										<td>
											<select name={`session_${p.user_id}`} class="select select-sm select-bordered w-full max-w-[120px]">
												{#each Array(data.sessionsCount) as _, i}
													<option value={i + 1} selected={p.session_number === i + 1}>Sesi {i + 1}</option>
												{/each}
											</select>
										</td>
									{/if}
									{#if data.examRooms.length > 0}
										<td>
											<select name={`room_${p.participant_id}`} class="select select-sm select-bordered w-full max-w-[120px]">
												<option value="">- Default -</option>
												{#each data.examRooms as room}
													<option value={room.id} selected={p.room_id === room.id}>{room.name}</option>
												{/each}
											</select>
										</td>
									{/if}
									<td>
										<ConfirmForm 
											action="?/removeParticipant"
											confirmTitle="Hapus Siswa dari Ujian"
											confirmMessage="Hapus siswa ini dari ujian?"
											buttonClass="text-rose-500 hover:text-rose-700 p-1"
											buttonTitle="Hapus dari ujian"
										>
											<svelte:fragment slot="inputs">
												<input type="hidden" name="participant_id" value={p.participant_id} />
											</svelte:fragment>
											<svelte:fragment slot="buttonContent">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
												</svg>
											</svelte:fragment>
										</ConfirmForm>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</form>
		{/if}
	</div>

	<!-- Questions List -->
	<div class="card overflow-hidden mb-6">
		<div class="p-5 border-b border-slate-100 flex items-center justify-between">
			<h2 class="text-lg font-bold text-slate-800">Daftar Soal</h2>
			<div class="flex items-center gap-2 flex-wrap">
				<a href="/admin/exams/{exam.id}/jawaban-siswa" class="btn-sm btn-outline text-emerald-600 border-emerald-200 hover:bg-emerald-50">Analisis Jawaban Siswa</a>
				<a href="/admin/exams/{exam.id}/analisis" class="btn-sm btn-outline text-indigo-600 border-indigo-200 hover:bg-indigo-50">Analisis Butir Soal</a>
				<a href="/admin/bank-soal/{exam.id}" class="btn-sm btn-primary">Kelola Soal</a>
			</div>
		</div>
		{#if questions.length === 0}
			<div class="p-8 text-center text-slate-400 text-sm">Belum ada soal untuk ujian ini.</div>
		{:else}
			<div class="divide-y divide-slate-100" use:mathRender={questions} use:arabicRender={questions}>
				{#each questions.slice(0, 5) as q}
					<div class="p-4 flex items-center gap-3">
						<span class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">{q.question_number}</span>
						<div class="flex-1 min-w-0">
							<div class="text-sm text-slate-700 line-clamp-2 prose prose-sm max-w-none prose-p:m-0 prose-img:m-0 prose-ul:m-0">{@html q.question_text}</div>
							<span class="text-[10px] badge-primary mt-0.5 inline-block">{QUESTION_TYPE_LABELS[q.type] || q.type}</span>
						</div>
						<span class="text-xs text-slate-400">{q.points} poin</span>
					</div>
				{/each}
			</div>
			{#if questions.length > 5}
				<div class="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-600">
					<span>Menampilkan 5 dari <strong>{questions.length}</strong> soal (masih ada <strong>{questions.length - 5}</strong> soal lagi).</span>
					<a href="/admin/bank-soal/{exam.id}" class="text-indigo-600 hover:text-indigo-800 font-semibold text-xs flex items-center gap-1 hover:underline">
						Buka Kelola Soal
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
						</svg>
					</a>
				</div>
			{/if}
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
					<thead><tr><th>Siswa</th><th>Status</th><th>Nilai</th><th>Waktu Mulai</th><th>TTD</th></tr></thead>
					<tbody>
						{#each attempts as a}
							<tr>
								<td class="font-medium">{a.student_name}</td>
								<td><span class={ATTEMPT_STATUS_COLORS[a.status] || 'badge-info'}>{ATTEMPT_STATUS_LABELS[a.status] || a.status}</span></td>
								<td class="font-semibold">{a.score != null ? a.score : '-'}</td>
								<td class="text-xs text-slate-500">{parseDate(a.start_time).toLocaleString('id-ID')}</td>
								<td>
									{#if a.signature}
										<img src={a.signature} alt="TTD {a.student_name}" class="h-8 object-contain bg-white rounded border border-slate-200 p-0.5" />
									{:else}
										<span class="text-xs text-slate-400 italic">-</span>
									{/if}
								</td>
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
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-lg animate-bounce-in" on:click|stopPropagation>
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
				<form method="POST" action="?/addParticipantClass" use:enhance={() => { return async ({ update }) => { showAddParticipantModal = false; selectedClassId = ''; await update(); }; }} class="space-y-4">
					<div>
						<label class="label" for="add-class">Pilih Kelas</label>
						<select id="add-class" name="class_id" class="input" bind:value={selectedClassId} required>
							<option value="">-- Pilih Kelas --</option>
							{#each data.classes as c}
								<option value={c.id.toString()}>{c.name}</option>
							{/each}
						</select>
						<p class="text-xs text-slate-500 mt-1 mb-2">Semua siswa di kelas ini akan ditambahkan sebagai peserta ujian.</p>
						
						{#if selectedClassId}
							<div class="mt-3 border border-slate-200 rounded-lg max-h-48 overflow-y-auto p-2 bg-slate-50">
								<p class="text-xs font-semibold text-slate-600 px-2 py-1 mb-1 sticky top-0 bg-slate-50">Pratinjau Siswa ({previewStudents.length})</p>
								{#if previewStudents.length === 0}
									<p class="text-sm text-slate-500 p-2 text-center">Tidak ada siswa di kelas ini.</p>
								{:else}
									<ul class="text-sm text-slate-700 divide-y divide-slate-100">
										{#each previewStudents as s}
											<li class="py-1.5 px-2 flex justify-between">
												<span>{s.name}</span>
												<span class="text-xs font-mono text-slate-400">{s.username}</span>
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						{/if}
					</div>
					<div class="pt-2">
						<button type="submit" class="btn-primary w-full" disabled={!selectedClassId || previewStudents.length === 0}>Tambahkan Kelas</button>
					</div>
				</form>
			{:else}
				<form method="POST" action="?/addParticipantStudent" use:enhance={() => { return async ({ update }) => { showAddParticipantModal = false; studentSearch = ''; studentClassFilter = ''; await update(); }; }} class="space-y-4">
					<div>
						<div class="flex items-center justify-between mb-2">
							<label class="label mb-0 block">Pilih Siswa</label>
							<button type="button" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium" on:click={() => {
								const checkboxes = document.querySelectorAll('input[name="student_ids"]:not(:disabled)');
								const allChecked = Array.from(checkboxes).length > 0 && Array.from(checkboxes).every(cb => (cb as HTMLInputElement).checked);
								checkboxes.forEach(cb => (cb as HTMLInputElement).checked = !allChecked);
							}}>
								Pilih Semua / Batal (Sesuai Filter)
							</button>
						</div>
						
						<!-- Filters -->
						<div class="grid grid-cols-2 gap-2 mb-3">
							<input type="text" placeholder="Cari nama/NISN..." bind:value={studentSearch} class="input text-sm py-1.5" />
							<select bind:value={studentClassFilter} class="input text-sm py-1.5">
								<option value="">Semua Kelas</option>
								{#each data.classes as c}
									<option value={c.id.toString()}>{c.name}</option>
								{/each}
							</select>
						</div>

						<div class="border border-slate-200 rounded-lg max-h-60 overflow-y-auto p-2 bg-slate-50">
							{#each filteredStudents as s}
								{@const isParticipant = participants.some(p => p.user_id === s.id)}
								<label class="flex items-center gap-3 p-2 rounded transition-colors {isParticipant ? 'bg-slate-100 opacity-70' : 'hover:bg-white cursor-pointer'}">
									<input type="checkbox" name="student_ids" value={s.id} class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50" checked={isParticipant} disabled={isParticipant} />
									<div class="flex flex-col flex-1">
										<span class="text-sm font-medium text-slate-800">{s.name}</span>
										<span class="text-xs text-slate-500 font-mono">{s.username}</span>
									</div>
									{#if isParticipant}
										<span class="text-[10px] badge-success">Sudah Masuk</span>
									{/if}
								</label>
							{/each}
							{#if filteredStudents.length === 0}
								<div class="p-4 text-center text-sm text-slate-500">Tidak ada data siswa yang cocok dengan filter.</div>
							{/if}
						</div>
					</div>
					<div class="pt-2">
						<button type="submit" class="btn-primary w-full">Tambahkan Siswa</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}

{#if showAddTeacherModal}
	<div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
			<div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
				<h3 class="font-bold text-slate-800 text-lg">Tambah Pengajar Ujian</h3>
				<button class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors" on:click={() => showAddTeacherModal = false}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.close} />
					</svg>
				</button>
			</div>
			
			<div class="p-6 overflow-y-auto">
				<form method="POST" action="?/addTeacher" use:enhance={() => { return async ({ update }) => { showAddTeacherModal = false; teacherSearch = ''; await update(); }; }} class="space-y-4">
					<div>
						<div class="flex items-center justify-between mb-2">
							<label class="label mb-0 block">Pilih Guru</label>
							<button type="button" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium" on:click={() => {
								const checkboxes = document.querySelectorAll('input[name="teacher_ids"]:not(:disabled)');
								const allChecked = Array.from(checkboxes).length > 0 && Array.from(checkboxes).every(cb => (cb as HTMLInputElement).checked);
								checkboxes.forEach(cb => (cb as HTMLInputElement).checked = !allChecked);
							}}>
								Pilih Semua / Batal
							</button>
						</div>
						
						<!-- Filter -->
						<div class="mb-3">
							<input type="text" placeholder="Cari nama guru..." bind:value={teacherSearch} class="input text-sm py-1.5" />
						</div>

						<div class="border border-slate-200 rounded-lg max-h-60 overflow-y-auto p-2 bg-slate-50">
							{#each allTeachers.filter(t => t.name.toLowerCase().includes(teacherSearch.toLowerCase()) || t.username.toLowerCase().includes(teacherSearch.toLowerCase())) as t}
								{@const isTeacher = examTeachers.some(et => et.user_id === t.id)}
								<label class="flex items-center gap-3 p-2 rounded transition-colors {isTeacher ? 'bg-slate-100 opacity-70' : 'hover:bg-white cursor-pointer'}">
									<input type="checkbox" name="teacher_ids" value={t.id} class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50" checked={isTeacher} disabled={isTeacher} />
									<div class="flex flex-col flex-1">
										<span class="text-sm font-medium text-slate-800">{t.name}</span>
										<span class="text-xs text-slate-500 font-mono">{t.username}</span>
									</div>
									{#if isTeacher}
										<span class="text-[10px] badge-success">Sudah Masuk</span>
									{/if}
								</label>
							{/each}
							{#if allTeachers.filter(t => t.name.toLowerCase().includes(teacherSearch.toLowerCase()) || t.username.toLowerCase().includes(teacherSearch.toLowerCase())).length === 0}
								<div class="p-4 text-center text-sm text-slate-500">Tidak ada data guru yang cocok.</div>
							{/if}
						</div>
					</div>
					<div class="mt-6 flex gap-3">
						<button type="button" class="btn-ghost flex-1" on:click={() => (showAddTeacherModal = false)}>Batal</button>
						<button type="submit" class="btn-primary flex-1">Tambahkan Terpilih</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Add Proctor Modal -->
{#if showAddProctorModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (showAddProctorModal = false)}>
		<div class="card p-6 w-full max-w-lg animate-bounce-in max-h-[90vh] flex flex-col" on:click|stopPropagation>
			<div class="flex items-center justify-between mb-4">
				<div>
					<h2 class="text-lg font-bold text-slate-800">Tambah Pengawas Ujian</h2>
					<p class="text-xs text-slate-500 mt-0.5">Pilih akun Pengawas atau Guru untuk mengawasi ujian ini.</p>
				</div>
				<button class="text-slate-400 hover:text-slate-600" on:click={() => (showAddProctorModal = false)}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>

			<!-- Filter Search -->
			<div class="mb-3">
				<input type="text" placeholder="Cari nama pengawas atau guru..." bind:value={proctorSearch} class="input text-sm py-1.5" />
			</div>
			
			<form method="POST" action="?/addProctor" use:enhance={() => { return async ({ update }) => { showAddProctorModal = false; proctorSearch = ''; await update(); }; }} class="flex flex-col flex-1 overflow-hidden">
				<div class="overflow-y-auto flex-1 mb-4 border border-slate-200 rounded-lg p-2 bg-slate-50">
					{#each data.allProctors.filter((p) => p.name.toLowerCase().includes(proctorSearch.toLowerCase()) || p.username.toLowerCase().includes(proctorSearch.toLowerCase())) as proctor}
						{@const isAdded = examProctors.some((p) => p.user_id === proctor.id)}
						<label class="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer border-b border-slate-100 last:border-0 {isAdded ? 'opacity-50' : ''}">
							<input type="checkbox" name="proctor_ids" value={proctor.id} class="w-4 h-4 text-indigo-600 rounded" disabled={isAdded} />
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<p class="text-sm font-medium text-slate-800">{proctor.name}</p>
									{#if proctor.role === 'guru'}
										<span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">Guru</span>
									{:else}
										<span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Pengawas</span>
									{/if}
								</div>
								<p class="text-xs text-slate-500 font-mono">{proctor.username}</p>
							</div>
							{#if isAdded}
								<span class="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">TERPILIH</span>
							{/if}
						</label>
					{:else}
						<div class="p-4 text-center text-sm text-slate-500">Tidak ada data pengawas / guru.</div>
					{/each}
				</div>
				
				<div class="mt-4 flex gap-3 pt-4 border-t border-slate-100">
					<button type="button" class="btn-ghost flex-1" on:click={() => (showAddProctorModal = false)}>Batal</button>
					<button type="submit" class="btn-primary flex-1">Tambahkan Terpilih</button>
				</div>
			</form>
		</div>
	</div>
{/if}
