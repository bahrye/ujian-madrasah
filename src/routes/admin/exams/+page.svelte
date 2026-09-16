<script lang="ts">
	import { parseDate } from '$lib/utils/date';

	import { enhance } from '$app/forms';
	import { ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';

	export let data: any;
	export let form: { error?: string; success?: string; participants?: any[] } | null;

	let showCreateModal = false;
	let editingType: any = null;
	let deleteConfirm: number | null = null;

	// Peserta modal state
	let participantsModal: any = null; // the exam type object
	let classesLoaded: any[] = [];
	let classesLoading = false;

	// Petugas modal state
	let proctorsModal: any = null;
	let proctorsLoaded: any[] = [];
	let proctorsLoading = false;
	let selectedProctorId = '';
	let selectedProctorRole = 'pt';

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);

	async function openParticipantsModal(type: any) {
		participantsModal = type;
		await loadClasses(type.id);
	}

	async function loadClasses(examTypeId: number) {
		classesLoading = true;
		try {
			const resp = await fetch(`/api/exam-type-classes?exam_type_id=${examTypeId}`);
			if (resp.ok) {
				const json = await resp.json();
				classesLoaded = json.classes || [];
			}
		} catch {}
		classesLoading = false;
	}

	async function openProctorsModal(type: any) {
		proctorsModal = type;
		await loadTypeProctors(type.id);
	}

	async function loadTypeProctors(examTypeId: number) {
		proctorsLoading = true;
		try {
			const resp = await fetch(`/api/exam-type-proctors?exam_type_id=${examTypeId}`);
			if (resp.ok) {
				const json = await resp.json();
				proctorsLoaded = json.proctors || [];
			}
		} catch {}
		proctorsLoading = false;
	}

	let expandedClassIds: Set<number> = new Set();

	function toggleClassExpanded(classId: number) {
		if (expandedClassIds.has(classId)) {
			expandedClassIds.delete(classId);
		} else {
			expandedClassIds.add(classId);
		}
		expandedClassIds = expandedClassIds;
	}

	let searchQuery = '';

	$: filteredExamTypes = data.examTypes.filter((type: any) => {
		if (!searchQuery.trim()) return true;
		const q = searchQuery.toLowerCase().trim();
		return (type.name || '').toLowerCase().includes(q) ||
			   (type.code || '').toLowerCase().includes(q) ||
			   (type.description || '').toLowerCase().includes(q) ||
			   (type.class_names || '').toLowerCase().includes(q) ||
			   (type.proctor_names || '').toLowerCase().includes(q) ||
			   (type.committee_names || '').toLowerCase().includes(q);
	});
</script>

<svelte:head>
	<title>Manajemen Tipe Ujian — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Manajemen Ujian</h1>
			<p class="text-sm text-slate-500 mt-1">Kelola tipe ujian (contoh: UAS, UM) beserta rentang waktunya</p>
		</div>
		<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
			<div class="relative w-full sm:w-64">
				<input 
					type="text" 
					bind:value={searchQuery}
					placeholder="Cari ujian, pengawas, kelas..." 
					class="input pl-10 pr-9 py-2 w-full text-sm rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
				/>
				<svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				{#if searchQuery}
					<button 
						type="button" 
						class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors" 
						on:click={() => searchQuery = ''}
						title="Hapus pencarian"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>
			<button class="btn-primary shrink-0" on:click={() => (showCreateModal = true)}>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
				</svg>
				Buat Tipe Ujian Baru
			</button>
		</div>
	</div>

	<!-- Exam Types Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each filteredExamTypes as type (type.id)}
			<div class="card-hover p-5 flex flex-col border-t-4 border-t-indigo-500">
				<div class="flex items-start justify-between mb-3">
					<div class="flex-1 min-w-0">
						<h3 class="font-bold text-slate-800 truncate">{type.name}</h3>
						<p class="text-xs text-indigo-500 font-mono font-semibold tracking-wider mt-0.5">{type.code}</p>
					</div>
				</div>

				{#if type.description}
					<p class="text-sm text-slate-500 mb-4 line-clamp-2">{type.description}</p>
				{/if}

				<div class="flex flex-col gap-1 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
					<div class="flex items-start gap-2">
						<svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
						<div class="flex flex-col gap-0.5 min-w-0">
							<span class="text-slate-400 font-medium">Rentang Pelaksanaan:</span>
							<span class="truncate font-medium text-slate-700">
								{type.start_time && type.end_time 
									? `${parseDate(type.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} s.d. ${parseDate(type.end_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
									: type.start_time ? parseDate(type.start_time).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Belum diatur'}
							</span>
						</div>
					</div>
					<div class="flex items-center gap-3 mt-1">
						<div class="flex items-center gap-1.5">
							<svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
							</svg>
							<span>{type.exam_count} Ujian</span>
						</div>
						<div class="flex items-center gap-1.5">
							<svg class="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<span class="text-indigo-600 font-semibold">{type.participant_count} Peserta</span>
						</div>
					</div>
					{#if type.class_names}
						<div class="mt-2 text-slate-500 flex items-start gap-1.5 pt-2 border-t border-slate-100 border-dashed text-xs">
							<svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
							</svg>
							<span class="leading-snug line-clamp-2" title={type.class_names}>{type.class_names}</span>
						</div>
					{/if}

					{#if type.proctor_names || type.committee_names}
						<div class="mt-2 text-slate-600 flex flex-col gap-1.5 pt-2 border-t border-slate-100 border-dashed">
							{#if type.proctor_names}
								<div class="flex items-center gap-1.5 text-[11px]">
									<span class="font-semibold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">Proktor:</span>
									<span class="leading-snug truncate font-medium text-slate-700" title={type.proctor_names}>{type.proctor_names}</span>
								</div>
							{/if}
							{#if type.committee_names}
								<div class="flex items-center gap-1.5 text-[11px]">
									<span class="font-semibold text-indigo-800 bg-indigo-100/80 px-1.5 py-0.5 rounded border border-indigo-200 shrink-0">Panitia:</span>
									<span class="leading-snug truncate font-medium text-slate-700" title={type.committee_names}>{type.committee_names}</span>
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<div class="mt-auto flex items-center gap-2 pt-3 border-t border-slate-100">
					<a href="/admin/exams/type/{type.id}" class="btn-sm btn-outline flex-1 text-center">Lihat Ujian</a>
					
					<a href="/print/jadwal-rekap/type/{type.id}" target="_blank" class="btn-sm btn-ghost text-amber-600 hover:text-amber-800 hover:bg-amber-50" title="Cetak Jadwal Ujian">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</a>

					<!-- Tombol Peserta -->
					<button class="btn-sm btn-ghost text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50" on:click={() => openParticipantsModal(type)} title="Kelola Peserta Default">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</button>

					<!-- Tombol Petugas Ujian (Proktor / Panitia / Pengawas) -->
					<button class="btn-sm btn-ghost text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50" on:click={() => openProctorsModal(type)} title="Kelola Petugas Default (Proktor / Panitia / Pengawas)">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</button>

					<button class="btn-sm btn-ghost" on:click={() => (editingType = { ...type })} title="Edit Tipe">
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.edit} />
						</svg>
					</button>

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
				{#if searchQuery}
					<p>Tidak ada ujian atau pengawas yang cocok dengan pencarian "{searchQuery}".</p>
				{:else}
					<p>Belum ada tipe ujian. Klik "Buat Tipe Ujian Baru" untuk memulai.</p>
				{/if}
			</div>
		{/each}
	</div>
</div>	<!-- ── Participants Modal ─────────────────────────────────────────────── -->
{#if participantsModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => { participantsModal = null; }}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-2xl animate-bounce-in" on:click|stopPropagation>
			<div class="flex items-center justify-between mb-5">
				<div>
					<h2 class="text-lg font-bold text-slate-800">Peserta Default — {participantsModal.name}</h2>
					<p class="text-xs text-slate-500 mt-0.5">Peserta ini akan otomatis ditambahkan saat ujian baru dibuat di tipe ini.</p>
				</div>
				<button class="text-slate-400 hover:text-slate-600" on:click={() => { participantsModal = null; }}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Form Tambah Kelas -->
				<div>
					<h3 class="font-bold text-slate-700 mb-3 text-sm">Tambahkan Kelas</h3>
					<form method="POST" action="?/addTypeClass"
						use:enhance={() => { return async ({ update }) => { await update(); await loadClasses(participantsModal.id); }; }}
						class="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
						<input type="hidden" name="exam_type_id" value={participantsModal.id} />
						
						<div class="max-h-60 overflow-y-auto space-y-1 bg-white p-2 rounded-lg border border-indigo-100 mb-3">
							{#each data.classes.filter((c: any) => !classesLoaded.some((cl: any) => cl.id === c.id)) as cls}
								<label class="flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors">
									<input type="checkbox" name="class_ids" value={cls.id} class="rounded border-slate-300 text-indigo-600" />
									<span class="text-sm font-medium text-slate-700">{cls.name}</span>
								</label>
							{/each}
							{#if data.classes.filter((c: any) => !classesLoaded.some((cl: any) => cl.id === c.id)).length === 0}
								<p class="text-xs text-slate-400 text-center py-4">Semua kelas sudah ditambahkan.</p>
							{/if}
						</div>
						
						<button type="submit" class="btn-primary w-full" disabled={data.classes.filter((c: any) => !classesLoaded.some((cl: any) => cl.id === c.id)).length === 0}>
							Tambahkan Kelas Terpilih
						</button>
					</form>
				</div>

				<!-- Daftar Kelas Saat Ini -->
				<div>
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-bold text-slate-700 text-sm">Kelas Terdaftar ({classesLoaded.length})</h3>
						{#if classesLoaded.length > 0}
							<form method="POST" action="?/clearTypeClasses"
								use:enhance={() => { return async ({ update }) => { await update(); await loadClasses(participantsModal.id); }; }}>
								<input type="hidden" name="exam_type_id" value={participantsModal.id} />
								<button type="submit" class="text-xs text-rose-500 hover:text-rose-700 font-medium">Hapus Semua</button>
							</form>
						{/if}
					</div>

					{#if classesLoading}
						<div class="text-center py-6 text-slate-400 text-sm">Memuat...</div>
					{:else if classesLoaded.length === 0}
						<div class="text-center py-6 text-slate-400 text-sm bg-slate-50 rounded-xl border border-slate-100">
							Belum ada kelas terdaftar.
						</div>
					{:else}
						<div class="max-h-72 overflow-y-auto space-y-2">
							{#each classesLoaded as cls}
								<div class="border border-slate-200 rounded-xl overflow-hidden bg-white">
									<div class="flex items-center justify-between px-4 py-3 bg-slate-50">
										<button class="flex-1 text-left font-semibold text-slate-800 flex items-center gap-2" on:click={() => toggleClassExpanded(cls.id)}>
											<svg class="w-4 h-4 text-slate-400 transition-transform {expandedClassIds.has(cls.id) ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
											</svg>
											{cls.name} <span class="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{cls.student_count} siswa</span>
										</button>
										<form method="POST" action="?/removeTypeClass"
											use:enhance={() => { return async ({ update }) => { await update(); await loadClasses(participantsModal.id); }; }}>
											<input type="hidden" name="id" value={cls.relation_id} />
											<button type="submit" class="text-rose-400 hover:text-rose-600 p-1 bg-white rounded-md shadow-sm border border-slate-200" title="Hapus Kelas">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
											</button>
										</form>
									</div>
									
									{#if expandedClassIds.has(cls.id)}
										<div class="p-3 border-t border-slate-100 max-h-48 overflow-y-auto bg-slate-50/50">
											{#if cls.students && cls.students.length > 0}
												<ul class="space-y-1">
													{#each cls.students as student}
														<li class="flex items-center justify-between text-sm p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-colors">
															<span class="font-medium text-slate-700">{student.name}</span>
															<span class="text-xs text-slate-400 font-mono">{student.nisn}</span>
														</li>
													{/each}
												</ul>
											{:else}
												<p class="text-xs text-slate-400 text-center py-2">Tidak ada siswa aktif di kelas ini.</p>
											{/if}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

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
						<input id="c-code" name="code" type="text" required class="input font-mono" placeholder="Contoh: UAS" />
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
						<p class="text-xs text-slate-500 mb-2">Pilih tanggal mulai dan selesai pelaksanaan. Jadwal ujian di dalamnya bebas diatur pada jam berapa saja selama tidak melebihi tanggal selesai.</p>
					</div>
					<div>
						<label class="label" for="c-start">Tanggal Mulai</label>
						<input id="c-start" name="start_time" type="date" class="input bg-white" required />
					</div>
					<div>
						<label class="label" for="c-end">Tanggal Selesai</label>
						<input id="c-end" name="end_time" type="date" class="input bg-white" required />
					</div>
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
						<input id="e-code" name="code" type="text" required class="input font-mono" value={editingType.code} />
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
						<p class="text-xs text-slate-500 mb-2">Pilih tanggal mulai dan selesai pelaksanaan. Jadwal ujian di dalamnya bebas diatur pada jam berapa saja selama tidak melebihi tanggal selesai.</p>
					</div>
					<div>
						<label class="label" for="e-start">Tanggal Mulai</label>
						<input id="e-start" name="start_time" type="date" class="input bg-white" required value={editingType.start_time?.slice(0, 10) || ''} />
					</div>
					<div>
						<label class="label" for="e-end">Tanggal Selesai</label>
						<input id="e-end" name="end_time" type="date" class="input bg-white" required value={editingType.end_time?.slice(0, 10) || ''} />
					</div>
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

<!-- ── Proctors Modal (Petugas Default) ─────────────────────────────────── -->
{#if proctorsModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => { proctorsModal = null; }}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-xl animate-bounce-in" on:click|stopPropagation>
			<div class="flex items-center justify-between mb-5">
				<div>
					<h2 class="text-lg font-bold text-slate-800">Petugas Default — {proctorsModal.name}</h2>
					<p class="text-xs text-slate-500 mt-0.5">Proktor dan Panitia ini akan otomatis terisi pada Berita Acara & Daftar Hadir seluruh ujian tipe ini.</p>
				</div>
				<button class="text-slate-400 hover:text-slate-600" on:click={() => { proctorsModal = null; }}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>

			<!-- Form Tambah Petugas -->
			<form method="POST" action="?/addTypeProctor"
				use:enhance={() => { return async ({ update }) => { await update(); await loadTypeProctors(proctorsModal.id); }; }}
				class="bg-emerald-50 rounded-xl p-4 border border-emerald-100 mb-6">
				<input type="hidden" name="exam_type_id" value={proctorsModal.id} />
				<h3 class="font-bold text-slate-700 mb-2.5 text-sm flex items-center gap-2">
					<svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
					</svg>
					Tambah Petugas Default
				</h3>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
					<div>
						<label class="label-text mb-1 block">Pilih Guru / Pengawas:</label>
						<select name="proctor_id" bind:value={selectedProctorId} class="select select-sm select-bordered w-full bg-white text-xs" required>
							<option value="">-- Pilih Petugas --</option>
							{#each (data.teachers || []) as t}
								<option value={t.id}>{t.name} {t.nip ? `(NIP. ${t.nip})` : ''}</option>
							{/each}
						</select>
					</div>

					<div>
						<label class="label-text mb-1 block">Penetapan Peran:</label>
						<select name="proctor_role" bind:value={selectedProctorRole} class="select select-sm select-bordered w-full bg-white text-xs">
							<option value="pt">Proktor / Teknisi</option>
							<option value="cm">Panitia Ujian</option>
						</select>
					</div>
				</div>

				<button type="submit" disabled={!selectedProctorId} class="btn-sm btn-primary w-full bg-emerald-600 hover:bg-emerald-700 border-emerald-600">
					+ Tambahkan Petugas
				</button>
			</form>

			<!-- Daftar Petugas Terdaftar -->
			<div>
				<h3 class="font-bold text-slate-700 mb-3 text-sm flex items-center justify-between">
					<span>Petugas Terdaftar</span>
					<span class="badge badge-sm badge-neutral">{proctorsLoaded.length} Petugas</span>
				</h3>

				{#if proctorsLoading}
					<div class="text-center py-6 text-slate-400 text-xs">Memuat data petugas...</div>
				{:else if proctorsLoaded.length === 0}
					<div class="text-center py-6 bg-slate-50 rounded-xl text-slate-400 text-xs">
						Belum ada petugas default. Silakan tambahkan proktor atau panitia di atas.
					</div>
				{:else}
					<div class="space-y-2">
						{#each proctorsLoaded as p}
							<div class="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors shadow-sm">
								<div>
									<div class="font-medium text-slate-800 text-sm">{p.name}</div>
									<div class="text-xs text-slate-500 font-mono">{p.nip ? `NIP. ${p.nip}` : 'Non-NIP'}</div>
								</div>
								<div class="flex items-center gap-3">
									<span class={`badge text-xs px-2.5 py-1 ${
										p.proctor_role === 'pt' ? 'bg-amber-100 text-amber-800 border-amber-200' :
										p.proctor_role === 'cm' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
										p.proctor_role === 'p2' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
										'bg-blue-100 text-blue-800 border-blue-200'
									}`}>
										{p.proctor_role === 'pt' ? 'Proktor / Teknisi' :
										 p.proctor_role === 'cm' ? 'Panitia Ujian' :
										 p.proctor_role === 'p2' ? 'Pengawas 2' : 'Pengawas 1'}
									</span>

									<form method="POST" action="?/removeTypeProctor"
										use:enhance={() => { return async ({ update }) => { await update(); await loadTypeProctors(proctorsModal.id); }; }}>
										<input type="hidden" name="id" value={p.id} />
										<button type="submit" class="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors" title="Hapus">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
											</svg>
										</button>
									</form>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
