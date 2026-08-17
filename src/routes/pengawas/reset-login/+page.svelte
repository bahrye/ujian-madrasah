<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import { ICONS } from '$lib/utils/constants';

	export let data;
	export let form;

	let searchQuery = data.filters.q || '';
	let selectedExam = data.filters.exam_id || '';
	let selectedSession = data.filters.session_number || '';
	let selectedRoom = data.filters.room_id || '';
	let selectedClass = data.filters.class_id || '';
	let selectedStatus = data.filters.status || '';

	let showConfirmModal = false;
	let targetStudent: { id: number; name: string } | null = null;
	let isResetAll = false;
	let isSubmitting = false;

	function applyFilters() {
		const params = new URLSearchParams();
		if (searchQuery.trim()) params.set('q', searchQuery.trim());
		if (selectedExam) params.set('exam_id', selectedExam);
		if (selectedSession) params.set('session_number', selectedSession);
		if (selectedRoom) params.set('room_id', selectedRoom);
		if (selectedClass) params.set('class_id', selectedClass);
		if (selectedStatus) params.set('status', selectedStatus);

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
			const date = new Date(timeStr);
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
				Kelola dan reset status login siswa yang sudah aktif di perangkat lain untuk mencegah joki / kecurangan ujian.
			</p>
		</div>

		{#if data.stats.active > 0}
			<button 
				on:click={confirmResetAll}
				class="btn-danger flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 py-2.5 px-4 font-semibold text-sm"
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

	<!-- Statistics Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		<StatCard 
			label="Total Peserta Diawasi" 
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

	<!-- Filters & Search Toolbar -->
	<div class="card p-4 border border-slate-100 bg-white space-y-3">
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
			<!-- Search Box -->
			<div class="relative">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.search} />
					</svg>
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					on:input={handleSearchInput}
					placeholder="Cari nama, username, atau NISN..."
					class="input-field pl-9 text-sm"
				/>
			</div>

			<!-- Filter Ujian -->
			<div>
				<select 
					bind:value={selectedExam} 
					on:change={applyFilters}
					class="input-field text-sm font-medium text-slate-700"
				>
					<option value="">-- Semua Ujian --</option>
					{#each data.exams as e}
						<option value={e.id}>{e.title}</option>
					{/each}
				</select>
			</div>

			<!-- Filter Sesi Ujian -->
			<div>
				<select 
					bind:value={selectedSession} 
					on:change={applyFilters}
					class="input-field text-sm"
				>
					<option value="">-- Semua Sesi Ujian --</option>
					<option value="1">Sesi 1</option>
					<option value="2">Sesi 2</option>
					<option value="3">Sesi 3</option>
					<option value="4">Sesi 4</option>
					<option value="5">Sesi 5</option>
				</select>
			</div>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
			<!-- Filter Ruang -->
			<div>
				<select 
					bind:value={selectedRoom} 
					on:change={applyFilters}
					class="input-field text-sm"
				>
					<option value="">-- Semua Ruang --</option>
					{#each data.rooms as r}
						<option value={r.id}>{r.name}</option>
					{/each}
				</select>
			</div>

			<!-- Filter Kelas -->
			<div>
				<select 
					bind:value={selectedClass} 
					on:change={applyFilters}
					class="input-field text-sm"
				>
					<option value="">-- Semua Kelas --</option>
					{#each data.classes as c}
						<option value={c.id}>{c.name}</option>
					{/each}
				</select>
			</div>

			<!-- Filter Status -->
			<div>
				<select 
					bind:value={selectedStatus} 
					on:change={applyFilters}
					class="input-field text-sm font-medium"
				>
					<option value="">-- Semua Status Login --</option>
					<option value="active">🔴 Sedang Logged In (Aktif)</option>
					<option value="offline">⚪ Offline / Reset</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Student Table -->
	<div class="card border border-slate-100 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-slate-600">
				<thead class="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
					<tr>
						<th class="px-4 py-3 text-center w-12">No</th>
						<th class="px-4 py-3">Nama Siswa</th>
						<th class="px-4 py-3">Username / NISN</th>
						<th class="px-4 py-3">Ujian & Sesi</th>
						<th class="px-4 py-3">Kelas & Ruang</th>
						<th class="px-4 py-3 text-center">Status Login</th>
						<th class="px-4 py-3">Waktu Aktif</th>
						<th class="px-4 py-3">Perangkat</th>
						<th class="px-4 py-3 text-right">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 bg-white">
					{#if data.students && data.students.length > 0}
						{#each data.students as student, i}
							<tr class="hover:bg-slate-50/60 transition-colors">
								<td class="px-4 py-3 text-center text-slate-400 font-mono text-xs">{i + 1}</td>
								<td class="px-4 py-3">
									<div class="font-bold text-slate-800">{student.name}</div>
								</td>
								<td class="px-4 py-3 font-mono text-xs text-slate-600">
									<div>{student.username}</div>
									{#if student.nisn && student.nisn !== student.username}
										<div class="text-slate-400">NISN: {student.nisn}</div>
									{/if}
								</td>
								<td class="px-4 py-3">
									<div class="flex flex-col gap-0.5">
										<span class="font-medium text-slate-800 text-xs truncate max-w-[160px]" title={student.exam_title || '-'}>{student.exam_title || '-'}</span>
										<span class="inline-flex items-center gap-1 w-fit px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
											Sesi {student.student_session_number || 1}
										</span>
									</div>
								</td>
								<td class="px-4 py-3">
									<div class="flex flex-col gap-0.5">
										<span class="font-medium text-slate-700">{student.class_name}</span>
										{#if student.room_name}
											<span class="text-xs text-emerald-600 font-medium">Ruang: {student.room_name}</span>
										{/if}
									</div>
								</td>
								<td class="px-4 py-3 text-center">
									{#if student.is_logged_in === 1}
										<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
											<span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
											Aktif Login
										</span>
									{:else}
										<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
											<span class="w-2 h-2 rounded-full bg-slate-300"></span>
											Offline / Reset
										</span>
									{/if}
								</td>
								<td class="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
									{formatTime(student.last_active_at)}
								</td>
								<td class="px-4 py-3 text-xs text-slate-600 max-w-[160px] truncate" title={student.login_device || '-'}>
									{getDeviceLabel(student.login_device)}
								</td>
								<td class="px-4 py-3 text-right">
									{#if student.is_logged_in === 1}
										<button
											on:click={() => confirmResetStudent(student)}
											class="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border border-amber-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1 ml-auto"
										>
											<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.refresh} />
											</svg>
											Reset Login
										</button>
									{:else}
										<form method="POST" action="?/resetLogin" use:enhance={() => {
											isSubmitting = true;
											return async ({ update }) => {
												isSubmitting = false;
												await update();
											};
										}}>
											<input type="hidden" name="student_id" value={student.id} />
											<button
												type="submit"
												disabled={isSubmitting}
												class="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1 ml-auto"
												title="Paksa Reset ulang session"
											>
												<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.refresh} />
												</svg>
												Paksa Reset
											</button>
										</form>
									{/if}
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="9" class="px-4 py-12 text-center text-slate-400">
								<div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
									<svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={ICONS.users} />
									</svg>
								</div>
								<p class="font-medium text-slate-600">Tidak ada data siswa diawasi yang sesuai filter.</p>
								<p class="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian, filter ujian, atau sesi ujian.</p>
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
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
			class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in" 
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
							class="btn-danger text-sm py-2 px-4 font-semibold"
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
							class="btn-primary text-sm py-2 px-4 font-semibold"
						>
							{isSubmitting ? 'Memproses...' : 'Ya, Reset Login'}
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/if}
