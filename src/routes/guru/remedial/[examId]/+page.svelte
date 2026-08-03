<script lang="ts">
	import { enhance } from '$app/forms';
	import { ICONS, ATTEMPT_STATUS_COLORS, ATTEMPT_STATUS_LABELS } from '$lib/utils/constants';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	export let data;

	$: exam = data.exam;
	$: participants = data.participants as any[];
	$: allStudents = data.allStudents as any[];
	$: activeToken = data.activeToken as any;
	$: attempts = data.attempts as any[];

	let showAddParticipantModal = false;
	let searchTerm = '';
	let currentTime = Date.now();
	let timerInterval: ReturnType<typeof setInterval>;

	$: filteredStudents = allStudents.filter(
		(s) =>
			!participants.some((p) => p.student_name === s.name) &&
			(s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			 s.nisn.includes(searchTerm) ||
			 (s.class_name && s.class_name.toLowerCase().includes(searchTerm.toLowerCase())))
	);

	onMount(() => {
		// Update timer for token expiration
		timerInterval = setInterval(() => {
			currentTime = Date.now();
		}, 1000);

		// Auto-refresh data for live monitoring every 10 seconds
		const refreshInterval = setInterval(() => {
			invalidateAll();
		}, 10000);

		return () => {
			clearInterval(timerInterval);
			clearInterval(refreshInterval);
		};
	});

	function isTokenExpired(expiresAt: string) {
		return new Date(expiresAt).getTime() < currentTime;
	}

	function getCountdownString(expiresAt: string, currentMs: number) {
		const diff = new Date(expiresAt).getTime() - currentMs;
		if (diff <= 0) return 'Kadaluwarsa';
		
		const h = Math.floor(diff / (1000 * 60 * 60));
		const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const s = Math.floor((diff % (1000 * 60)) / 1000);
		
		return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	}
</script>

<svelte:head>
	<title>Kelola Remedial - {exam.title}</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between animate-in">
	<div class="flex items-center gap-3">
		<a href="/guru/remedial" class="btn-sm btn-ghost p-2 text-slate-400 hover:text-slate-600">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} /></svg>
		</a>
		<div>
			<h1 class="text-2xl font-bold text-slate-800">{exam.title}</h1>
			<p class="text-slate-500 text-sm mt-1">{exam.subject_name || 'Tanpa Mata Pelajaran'} • Durasi: {exam.duration_minutes} menit</p>
		</div>
	</div>
	<a href="/guru/bank-soal/{exam.id}" class="btn btn-outline">
		<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.questions} /></svg>
		Soal Ujian
	</a>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in" style="animation-delay: 50ms;">
	<!-- Token & Info Card (Left Column) -->
	<div class="space-y-6">
		<div class="card overflow-hidden">
			<div class="bg-indigo-600 p-6 text-white text-center relative overflow-hidden">
				<div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px;"></div>
				<h2 class="text-indigo-100 font-medium text-sm mb-2 relative z-10">TOKEN UJIAN AKTIF</h2>
				
				{#if activeToken && !isTokenExpired(activeToken.expires_at)}
					<div class="text-5xl font-mono font-bold tracking-widest mb-3 relative z-10 drop-shadow-md">{activeToken.token}</div>
					<div class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
						<svg class="w-4 h-4 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.clock} /></svg>
						{getCountdownString(activeToken.expires_at, currentTime)}
					</div>
					
					<div class="mt-6 relative z-10 flex justify-center">
						<ConfirmForm 
							action="?/deleteToken"
							confirmTitle="Cabut Token"
							confirmMessage="Yakin ingin mencabut token ini? Siswa tidak akan bisa masuk ujian lagi menggunakan token ini."
							buttonClass="btn-sm bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
							buttonTitle="Cabut Token"
						>
							<svelte:fragment slot="inputs">
								<input type="hidden" name="id" value={activeToken.id} />
							</svelte:fragment>
							<svelte:fragment slot="buttonContent">Cabut Token Saat Ini</svelte:fragment>
						</ConfirmForm>
					</div>
				{:else}
					<div class="text-2xl font-bold mb-4 relative z-10 opacity-80 mt-2">Belum Ada Token</div>
					
					<form method="POST" action="?/generateToken" use:enhance class="relative z-10 mt-6 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
						<div class="flex gap-2">
							<button type="submit" class="btn w-full bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-lg shadow-black/10">Buat Token (Berlaku 15 Menit)</button>
						</div>
					</form>
				{/if}
			</div>
		</div>

		<div class="card p-5">
			<h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
				<svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.calendar} /></svg>
				Jadwal & Pengaturan
			</h3>
			<div class="space-y-3 text-sm">
				<div class="flex justify-between py-2 border-b border-slate-50">
					<span class="text-slate-500">Mulai</span>
					<span class="font-medium text-slate-700">{exam.start_time ? new Date(exam.start_time).toLocaleString('id-ID') : '-'}</span>
				</div>
				<div class="flex justify-between py-2 border-b border-slate-50">
					<span class="text-slate-500">Selesai</span>
					<span class="font-medium text-slate-700">{exam.end_time ? new Date(exam.end_time).toLocaleString('id-ID') : '-'}</span>
				</div>
				<div class="flex justify-between py-2 border-b border-slate-50">
					<span class="text-slate-500">Soal Diacak</span>
					<span class="font-medium text-slate-700">{exam.shuffle_questions ? 'Ya' : 'Tidak'}</span>
				</div>
				<div class="flex justify-between py-2">
					<span class="text-slate-500">Rilis Nilai</span>
					<span class="font-medium text-slate-700">{exam.show_score_type === 'manual' ? 'Manual' : 'Otomatis'}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Participants & Monitoring (Right Column) -->
	<div class="lg:col-span-2 space-y-6">
		
		<!-- Monitoring Siswa -->
		<div class="card overflow-hidden flex flex-col h-[400px]">
			<div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
				<h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
					<span class="relative flex h-3 w-3">
					  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
					  <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
					</span>
					Live Monitoring
				</h2>
			</div>
			
			<div class="flex-1 overflow-y-auto p-0">
				{#if attempts.length === 0}
					<div class="h-full flex flex-col items-center justify-center text-slate-400 p-8">
						<svg class="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={ICONS.monitor} /></svg>
						<p class="text-sm">Belum ada siswa yang sedang/sudah mengerjakan ujian ini.</p>
					</div>
				{:else}
					<table class="table w-full">
						<thead class="sticky top-0 bg-white shadow-sm z-10">
							<tr>
								<th class="pl-5">Siswa</th>
								<th>Waktu Mulai</th>
								<th>Status</th>
								<th class="text-right pr-5">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{#each attempts as attempt}
								<tr class="hover:bg-slate-50">
									<td class="pl-5">
										<div class="font-bold text-slate-800">{attempt.student_name}</div>
										<div class="text-xs text-slate-500">{attempt.class_name || '-'}</div>
									</td>
									<td class="text-xs font-mono text-slate-600">
										{new Date(attempt.start_time).toLocaleTimeString('id-ID')}
									</td>
									<td>
										<span class="badge {ATTEMPT_STATUS_COLORS[attempt.status] || 'badge-slate'}">
											{ATTEMPT_STATUS_LABELS[attempt.status] || attempt.status}
										</span>
									</td>
									<td class="text-right pr-5">
										{#if attempt.status === 'mengerjakan'}
											<ConfirmForm 
												action="?/forceSubmit"
												confirmTitle="Paksa Selesai?"
												confirmMessage="Jawaban {attempt.student_name} sejauh ini akan tersimpan permanen."
												buttonClass="btn-sm btn-ghost text-rose-500 hover:bg-rose-50"
												buttonTitle="Hentikan pengerjaan siswa"
											>
												<svelte:fragment slot="inputs">
													<input type="hidden" name="attempt_id" value={attempt.id} />
												</svelte:fragment>
												<svelte:fragment slot="buttonContent">Paksa Selesai</svelte:fragment>
											</ConfirmForm>
										{:else}
											<span class="text-xs text-slate-400">-</span>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</div>

		<!-- Daftar Peserta Remedial -->
		<div class="card overflow-hidden">
			<div class="p-4 border-b border-slate-100 flex items-center justify-between">
				<h2 class="text-lg font-bold text-slate-800">Daftar Peserta Remedial ({participants.length})</h2>
				<button class="btn-sm btn-primary" on:click={() => (showAddParticipantModal = true)}>
					<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} /></svg>
					Tambah Siswa
				</button>
			</div>
			
			{#if participants.length === 0}
				<div class="p-8 text-center text-slate-400 text-sm">
					Belum ada peserta. Silakan tambahkan siswa yang butuh remedial.
				</div>
			{:else}
				<div class="table-container border-0 rounded-none max-h-80 overflow-y-auto">
					<table class="table">
						<thead class="sticky top-0 bg-white z-10">
							<tr>
								<th class="w-10 text-center">#</th>
								<th>Nama Siswa</th>
								<th>Kelas</th>
								<th class="text-right">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{#each participants as p, i}
								<tr>
									<td class="text-center text-slate-400 text-sm">{i + 1}</td>
									<td class="font-medium text-slate-700">{p.student_name}</td>
									<td class="text-slate-500">{p.class_name || '-'}</td>
									<td class="text-right">
										<ConfirmForm 
											action="?/removeParticipant"
											confirmTitle="Hapus Peserta"
											confirmMessage="Keluarkan {p.student_name} dari ujian remedial ini?"
											buttonClass="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-rose-50 transition-colors"
											buttonTitle="Keluarkan siswa"
										>
											<svelte:fragment slot="inputs">
												<input type="hidden" name="participant_id" value={p.participant_id} />
											</svelte:fragment>
											<svelte:fragment slot="buttonContent">
												<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} /></svg>
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

	</div>
</div>

<!-- Modal Tambah Peserta -->
{#if showAddParticipantModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" on:click={() => (showAddParticipantModal = false)}>
		<div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200" on:click|stopPropagation>
			
			<div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
				<h2 class="text-lg font-bold text-slate-800">Tambah Peserta Remedial</h2>
				<button class="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50" on:click={() => (showAddParticipantModal = false)}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d={ICONS.close} /></svg>
				</button>
			</div>
			
			<div class="p-6 border-b border-slate-100 bg-slate-50/50">
				<div class="relative">
					<svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.search} /></svg>
					<input type="text" bind:value={searchTerm} placeholder="Cari nama, NISN, atau kelas..." class="input pl-10 bg-white" />
				</div>
			</div>

			<form method="POST" action="?/addParticipants" use:enhance={() => { return async ({ update }) => { showAddParticipantModal = false; await update(); }; }} class="flex flex-col flex-1 min-h-0">
				<div class="flex-1 overflow-y-auto p-6">
					{#if filteredStudents.length === 0}
						<div class="text-center py-12 text-slate-500">
							{searchTerm ? 'Siswa tidak ditemukan.' : 'Semua siswa sudah masuk di ujian ini.'}
						</div>
					{:else}
						<div class="flex items-center justify-between mb-3 px-1">
							<label class="text-sm font-medium text-slate-700">Pilih Siswa</label>
							<button type="button" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium" on:click={() => {
								const checkboxes = document.querySelectorAll('input[name="student_ids"]:not(:disabled)');
								const allChecked = Array.from(checkboxes).every(cb => (cb as HTMLInputElement).checked);
								checkboxes.forEach(cb => (cb as HTMLInputElement).checked = !allChecked);
							}}>Pilih Semua / Batal</button>
						</div>
						
						<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
							{#each filteredStudents as s}
								<label class="flex items-start gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-colors has-[:checked]:bg-indigo-50/50 has-[:checked]:border-indigo-200">
									<input type="checkbox" name="student_ids" value={s.id} class="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
									<div>
										<div class="font-medium text-slate-800 text-sm leading-tight">{s.name}</div>
										<div class="text-xs text-slate-500 mt-0.5">{s.nisn} • {s.class_name || 'Tanpa Kelas'}</div>
									</div>
								</label>
							{/each}
						</div>
					{/if}
				</div>
				
				<div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
					<button type="button" class="btn bg-white border border-slate-300 text-slate-700 hover:bg-slate-50" on:click={() => (showAddParticipantModal = false)}>Batal</button>
					<button type="submit" class="btn btn-primary" disabled={filteredStudents.length === 0}>Tambahkan Terpilih</button>
				</div>
			</form>
		</div>
	</div>
{/if}
