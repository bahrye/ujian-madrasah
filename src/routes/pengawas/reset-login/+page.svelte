<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import { ICONS } from '$lib/utils/constants';
	import { parseDate } from '$lib/utils/date';

	export let data;
	export let form;

	let searchQuery = data.filters.q || '';
	let selectedExam = data.filters.exam_id || '';
	let selectedSession = data.filters.session_number || '';

	// Reactive synchronization with data.filters on navigation/reload
	$: searchQuery = data.filters.q || '';
	$: selectedExam = data.filters.exam_id || '';
	$: selectedSession = data.filters.session_number || '';

	let showConfirmModal = false;
	let targetStudent: { id: number; name: string } | null = null;
	let isResetAll = false;
	let isSubmitting = false;

	function applyFilters() {
		const params = new URLSearchParams();
		if (searchQuery.trim()) params.set('q', searchQuery.trim());
		if (selectedExam) params.set('exam_id', selectedExam);
		if (selectedSession) params.set('session_number', selectedSession);

		goto(`?${params.toString()}`, { keepFocus: true, replaceState: true });
	}

	function handleSearchInput() {
		applyFilters();
	}

	function confirmResetStudent(student: { id: number; name: string }) {
		targetStudent = student;
		isResetAll = false;
		showConfirmModal = true;
	}

	function confirmResetAll() {
		targetStudent = null;
		isResetAll = true;
		showConfirmModal = true;
	}

	function formatTime(timeStr: string | null) {
		if (!timeStr) return 'Belum pernah';
		try {
			const date = parseDate(timeStr);
			if (isNaN(date.getTime())) return timeStr;
			return new Intl.DateTimeFormat('id-ID', {
				day: 'numeric',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			}).format(date);
		} catch (e) {
			return timeStr;
		}
	}

	function getDeviceLabel(device: string | null) {
		if (!device) return '-';
		if (device.includes('Mobile') || device.includes('Android') || device.includes('iPhone')) {
			return '📱 Smartphone';
		}
		if (device.includes('Windows') || device.includes('Macintosh') || device.includes('Linux')) {
			return '💻 Komputer/Laptop';
		}
		return '🌐 Browser';
	}
</script>

<svelte:head>
	<title>Reset Login Siswa — Ujian Online</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
				<div class="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.refresh} />
					</svg>
				</div>
				Reset Login Siswa
			</h1>
			<p class="text-sm text-slate-500 mt-1">
				Kelola dan reset status login siswa yang aktif untuk mencegah kecurangan & joki ujian.
			</p>
		</div>

		{#if data.hasExamSelected && data.stats.active > 0}
			<button 
				on:click={confirmResetAll}
				class="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-rose-200 inline-flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.refresh} />
				</svg>
				Reset Semua Login Active ({data.stats.active})
			</button>
		{/if}
	</div>

	<!-- Alert Messages -->
	{#if data.error}
		<div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-3 animate-in">
			<svg class="w-5 h-5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.warning} />
			</svg>
			<p>Gagal memuat data: {data.error}</p>
		</div>
	{/if}

	{#if form?.error}
		<div class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 animate-in">
			<svg class="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.warning} />
			</svg>
			<p>{form.error}</p>
		</div>
	{/if}

	{#if form?.success}
		<div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in">
			<svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.check} />
			</svg>
			<p class="font-medium">{form.success}</p>
		</div>
	{/if}

	<!-- Filters & Search Toolbar -->
	<div class="card p-5 border border-slate-200 bg-white shadow-xs rounded-2xl space-y-4">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
			<!-- Filter Ujian (Primary Requirement) -->
			<div>
				<label class="label text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5 mb-1.5">
					<svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					Pilih Ujian
				</label>
				<select 
					bind:value={selectedExam} 
					on:change={applyFilters}
					class="select text-sm font-bold text-slate-800 border-slate-300 hover:border-indigo-400 focus:border-indigo-500 bg-white shadow-xs"
				>
					<option value="">-- Pilih Ujian --</option>
					{#each data.exams as e}
						<option value={String(e.id)}>{e.title}</option>
					{/each}
				</select>
			</div>

			<!-- Dynamic Filter Sesi Ujian (Shown ONLY if selected exam has sessions) -->
			{#if data.hasExamSelected && data.availableSessions && data.availableSessions.length > 0}
				<div>
					<label class="label text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5 mb-1.5">
						<svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Pilih Sesi Ujian
					</label>
					<select 
						bind:value={selectedSession} 
						on:change={applyFilters}
						class="select text-sm font-semibold text-slate-800 border-slate-300 hover:border-indigo-400 focus:border-indigo-500 bg-white shadow-xs"
					>
						<option value="">-- Semua Sesi --</option>
						{#each data.availableSessions as s}
							<option value={String(s)}>Sesi {s}</option>
						{/each}
					</select>
				</div>
			{/if}

			<!-- Search Box (Shown when exam is selected) -->
			{#if data.hasExamSelected}
				<div class={data.availableSessions && data.availableSessions.length > 0 ? '' : 'md:col-span-2'}>
					<label class="label text-xs uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5 mb-1.5">
						<svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.search} />
						</svg>
						Cari Peserta
					</label>
					<div class="relative w-full">
						<div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
							<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.search} />
							</svg>
						</div>
						<input
							type="text"
							bind:value={searchQuery}
							on:input={handleSearchInput}
							placeholder="Cari nama siswa, username, atau NISN..."
							class="input pl-10 pr-4 text-sm font-medium text-slate-800 border-slate-300 hover:border-indigo-400 focus:border-indigo-500 bg-white shadow-xs"
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>

	{#if !data.hasExamSelected}
		<!-- Prompt Card when No Exam Selected -->
		<div class="card p-12 border border-slate-200 bg-white text-center shadow-xs space-y-4 animate-in rounded-2xl">
			<div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner border border-indigo-100">
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
			</div>
			<div class="max-w-md mx-auto">
				<h3 class="text-lg font-bold text-slate-800">Silakan Pilih Ujian Terlebih Dahulu</h3>
				<p class="text-sm text-slate-500 mt-1">
					Pilih salah satu ujian pada dropdown <strong>"-- Pilih Ujian --"</strong> di atas untuk menampilkan daftar peserta dan mengelola status login siswa.
				</p>
			</div>
		</div>
	{:else}
		<!-- Statistics Cards (Shown only after selecting exam) -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<StatCard 
				label="Total Peserta Ujian" 
				value={String(data.stats.total)} 
				icon={ICONS.users} 
				gradient="indigo" 
			/>
			<StatCard 
				label="Sedang Logged In (Aktif)" 
				value={String(data.stats.active)} 
				icon={ICONS.monitor} 
				gradient="amber" 
			/>
			<StatCard 
				label="Offline / Session Reset" 
				value={String(data.stats.offline)} 
				icon={ICONS.check} 
				gradient="emerald" 
			/>
		</div>

		<!-- Student Table -->
		<div class="card border border-slate-200 overflow-hidden shadow-xs rounded-2xl">
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm text-slate-600">
					<thead class="bg-slate-50/90 text-xs uppercase font-bold text-slate-600 border-b border-slate-200">
						<tr>
							<th class="px-4 py-3.5 text-center w-12 border-r border-slate-100">No</th>
							<th class="px-4 py-3.5 border-r border-slate-100">Nama Siswa</th>
							<th class="px-4 py-3.5 border-r border-slate-100">Username / NISN</th>
							<th class="px-4 py-3.5 border-r border-slate-100">Kelas & Ruang</th>
							<th class="px-4 py-3.5 text-center border-r border-slate-100">Status Login</th>
							<th class="px-4 py-3.5 border-r border-slate-100">Waktu Aktif</th>
							<th class="px-4 py-3.5 border-r border-slate-100">Perangkat</th>
							<th class="px-4 py-3.5 text-center w-36">Aksi</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100 bg-white">
						{#if data.students && data.students.length > 0}
							{#each data.students as student, i}
								<tr class="hover:bg-slate-50/60 transition-colors">
									<td class="px-4 py-3.5 text-center text-slate-400 font-mono text-xs border-r border-slate-100">{i + 1}</td>
									<td class="px-4 py-3.5 border-r border-slate-100">
										<div class="font-bold text-slate-800">{student.name}</div>
										{#if student.student_session_number}
											<div class="mt-0.5">
												<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
													Sesi {student.student_session_number}
												</span>
											</div>
										{/if}
									</td>
									<td class="px-4 py-3.5 font-mono text-xs text-slate-600 border-r border-slate-100">
										<div class="font-semibold text-slate-700">{student.username}</div>
										{#if student.nisn && student.nisn !== student.username}
											<div class="text-slate-400 text-[11px]">NISN: {student.nisn}</div>
										{/if}
									</td>
									<td class="px-4 py-3.5 border-r border-slate-100">
										<div class="flex flex-col gap-0.5">
											<span class="font-semibold text-slate-700">{student.class_name}</span>
											{#if student.room_name}
												<span class="text-xs text-emerald-600 font-medium">Ruang: {student.room_name}</span>
											{/if}
										</div>
									</td>
									<td class="px-4 py-3.5 text-center border-r border-slate-100">
										{#if student.is_logged_in === 1}
											<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
												<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
												Aktif Login
											</span>
										{:else}
											<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
												<span class="w-2 h-2 rounded-full bg-slate-300"></span>
												Offline
											</span>
										{/if}
									</td>
									<td class="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap border-r border-slate-100">
										{formatTime(student.last_active_at)}
									</td>
									<td class="px-4 py-3.5 text-xs text-slate-600 max-w-[160px] truncate border-r border-slate-100" title={student.login_device || '-'}>
										{getDeviceLabel(student.login_device)}
									</td>
									<td class="px-4 py-3.5 text-center">
										{#if student.is_logged_in === 1}
											<button
												on:click={() => confirmResetStudent(student)}
												class="w-full px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs transition-all shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
											>
												<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.refresh} />
												</svg>
												Reset Login
											</button>
										{:else}
											<span class="w-full px-3 py-1.5 rounded-lg bg-slate-100 text-slate-400 text-xs font-medium inline-flex items-center justify-center gap-1 whitespace-nowrap select-none">
												Offline
											</span>
										{/if}
									</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan="8" class="px-4 py-12 text-center text-slate-400">
									<div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 border border-slate-100">
										<svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={ICONS.users} />
										</svg>
									</div>
									<p class="font-medium text-slate-600">Tidak ada data siswa yang sesuai dengan filter.</p>
									<p class="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter sesi.</p>
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<!-- Confirmation Modal -->
{#if showConfirmModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div 
		class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
		on:click={() => showConfirmModal = false}
	>
		<div 
			class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in border border-slate-100" 
			on:click|stopPropagation
		>
			<div class="p-6">
				<div class="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.warning} />
					</svg>
				</div>

				{#if isResetAll}
					<h3 class="font-bold text-lg text-slate-800 text-center">Reset Semua Login Active?</h3>
					<p class="text-sm text-slate-500 text-center mt-2">
						Aksi ini akan me-reset status login seluruh <strong class="text-slate-700">{data.stats.active} siswa</strong> dalam pengawasan Anda yang saat ini terdeteksi aktif. Siswa akan diwajibkan untuk login kembali pada perangkat mereka.
					</p>
				{:else if targetStudent}
					<h3 class="font-bold text-lg text-slate-800 text-center">Konfirmasi Reset Login</h3>
					<p class="text-sm text-slate-500 text-center mt-2">
						Apakah Anda yakin ingin me-reset status login siswa <strong class="text-slate-800">"{targetStudent.name}"</strong>?
					</p>
					<p class="text-xs text-slate-400 text-center mt-1">
						Siswa dapat melakukan login kembali di perangkat baru setelah status di-reset.
					</p>
				{/if}
			</div>

			<div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
				<button 
					type="button" 
					class="btn-secondary text-sm" 
					on:click={() => showConfirmModal = false}
				>
					Batal
				</button>

				{#if isResetAll}
					<form method="POST" action="?/resetAllActive" use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							showConfirmModal = false;
							await update();
						};
					}}>
						<button 
							type="submit" 
							disabled={isSubmitting} 
							class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
						>
							{isSubmitting ? 'Memproses...' : 'Ya, Reset Semua'}
						</button>
					</form>
				{:else if targetStudent}
					<form method="POST" action="?/resetLogin" use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							showConfirmModal = false;
							await update();
						};
					}}>
						<input type="hidden" name="student_id" value={targetStudent.id} />
						<button 
							type="submit" 
							disabled={isSubmitting} 
							class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
						>
							{isSubmitting ? 'Memproses...' : 'Ya, Reset Login'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/if}
