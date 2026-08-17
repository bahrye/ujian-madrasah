<script lang="ts">
	import { parseDate } from '$lib/utils/date';

	import { enhance } from '$app/forms';
	import { ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS, ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';
	import { onMount, onDestroy } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	export let data;
	export let form: any;

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
	$: if (data.loadError) toasts.error('Terjadi kesalahan data: ' + data.loadError);
	$: attempts = data.attempts as any[];

	let formElement: HTMLFormElement;
	let statusFilter = 'semua';
	$: filteredAttempts = statusFilter === 'semua' ? attempts : attempts.filter(a => a.status === statusFilter);

	let resetConfirm: string | null = null;
	let selectedLogs: { time: number, type: string }[] | null = null;
	let currentTime = Date.now();
	let interval: any;

	let attemptsMap = new Map<string | number, number>();

	let audioCtx: AudioContext | null = null;

	function enableAudio() {
		if (typeof window === 'undefined') return;
		if (!audioCtx) {
			const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
			if (AudioCtxClass) {
				audioCtx = new AudioCtxClass();
			}
		}
		if (audioCtx && audioCtx.state === 'suspended') {
			audioCtx.resume();
		}
	}

	function playViolationBeep() {
		try {
			enableAudio();
			if (!audioCtx) return;
			if (audioCtx.state === 'suspended') {
				audioCtx.resume();
			}

			const now = audioCtx.currentTime;

			// Tone 1 (880Hz)
			const osc1 = audioCtx.createOscillator();
			const gain1 = audioCtx.createGain();
			osc1.type = 'sine';
			osc1.frequency.setValueAtTime(880, now);
			gain1.gain.setValueAtTime(0.3, now);
			gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
			osc1.connect(gain1);
			gain1.connect(audioCtx.destination);
			osc1.start(now);
			osc1.stop(now + 0.2);

			// Tone 2 (1174Hz)
			const osc2 = audioCtx.createOscillator();
			const gain2 = audioCtx.createGain();
			osc2.type = 'sine';
			osc2.frequency.setValueAtTime(1174, now + 0.15);
			gain2.gain.setValueAtTime(0.3, now + 0.15);
			gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
			osc2.connect(gain2);
			gain2.connect(audioCtx.destination);
			osc2.start(now + 0.15);
			osc2.stop(now + 0.4);
		} catch (e) {
			console.warn('Audio play error:', e);
		}
	}

	function speakViolationAlert(text: string) {
		if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
		try {
			window.speechSynthesis.cancel();
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = 'id-ID';
			utterance.rate = 1.0;
			utterance.pitch = 1.0;
			utterance.volume = 1.0;

			const voices = window.speechSynthesis.getVoices();
			const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesi'));
			if (idVoice) {
				utterance.voice = idVoice;
			}

			window.speechSynthesis.speak(utterance);
		} catch (e) {
			console.warn('Speech synthesis error:', e);
		}
	}

	async function pollLiveStatus() {
		if (!data.examFilter) return;
		try {
			const queryParams = new URLSearchParams({ exam_id: data.examFilter });
			if (data.sessionFilter) queryParams.set('session_number', data.sessionFilter);
			
			const res = await fetch(`/api/monitor-live?${queryParams.toString()}`);
			if (!res.ok) return;
			const result = (await res.json()) as any;
			if (result.attempts && Array.isArray(result.attempts)) {
				result.attempts.forEach((newA: any) => {
					const key = newA.attempt_id || newA.student_id;
					const prevWarnings = attemptsMap.get(key) ?? (newA.warnings || 0);
					
					if (newA.warnings > prevWarnings) {
						let violationType = 'melakukan pelanggaran';
						if (newA.warningLogs && newA.warningLogs.length > 0) {
							const lastLog = newA.warningLogs[newA.warningLogs.length - 1];
							if (typeof lastLog === 'string') {
								violationType = lastLog;
							} else if (lastLog && lastLog.type) {
								violationType = lastLog.type;
							}
						}

						toasts.warning(`⚠️ Pelanggaran! ${newA.student_name} (${violationType})`);
						playViolationBeep();
						setTimeout(() => {
							speakViolationAlert(`Peringatan! Siswa ${newA.student_name}, ${violationType}.`);
						}, 350);
					}
					attemptsMap.set(key, newA.warnings || 0);
				});
				attempts = result.attempts;
			}
		} catch (e) {
			console.warn('Live monitoring poll error:', e);
		}
	}

	onMount(() => {
		const handleUserInteraction = () => {
			enableAudio();
			window.removeEventListener('click', handleUserInteraction);
			window.removeEventListener('keydown', handleUserInteraction);
			window.removeEventListener('touchstart', handleUserInteraction);
		};
		window.addEventListener('click', handleUserInteraction);
		window.addEventListener('keydown', handleUserInteraction);
		window.addEventListener('touchstart', handleUserInteraction);

		if (attempts && Array.isArray(attempts)) {
			attempts.forEach(a => {
				const key = a.attempt_id || a.student_id;
				attemptsMap.set(key, a.warnings || 0);
			});
		}

		const handleVisibilityChange = () => {
			if (document.hidden) {
				if (interval) {
					clearInterval(interval);
					interval = null;
				}
			} else {
				pollLiveStatus();
				if (!interval) {
					interval = setInterval(() => {
						currentTime = Date.now();
						pollLiveStatus();
					}, 3000);
				}
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		interval = setInterval(() => {
			if (!document.hidden) {
				currentTime = Date.now();
				pollLiveStatus();
			}
		}, 3000);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<svelte:head><title>Monitoring Ujian — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Monitoring Ujian</h1>
			<p class="text-sm text-slate-500 mt-1">Pantau seluruh siswa yang terdaftar dalam ujian</p>
		</div>
		<div>
			<button 
				type="button" 
				class="btn-sm btn-ghost border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 text-xs text-slate-700 font-medium shadow-sm transition-colors"
				on:click={() => { 
					enableAudio(); 
					playViolationBeep(); 
					speakViolationAlert("Tes notifikasi suara. Perangkat siap menyebutkan nama siswa dan jenis pelanggarannya.");
					toasts.info('🔊 Suara & Panggilan Nama Aktif!'); 
				}}
			>
				<svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
				</svg>
				Tes Suara & Panggilan Nama
			</button>
		</div>
	</div>

	<!-- Filter -->
	<div class="card p-4">
		<form method="GET" class="flex flex-wrap gap-3 mb-4" bind:this={formElement}>
			<select name="exam_id" class="select flex-1 min-w-[200px]" required on:change={() => formElement?.submit()}>
				<option value="">-- Pilih Ujian --</option>
				{#each data.exams as exam}
					<option value={exam.id} selected={String(data.examFilter) === String(exam.id)}>{exam.title}</option>
				{/each}
			</select>

			{#if data.examFilter && data.availableSessions && data.availableSessions.length > 0}
				<select name="session_number" class="select w-44" on:change={() => formElement?.submit()}>
					<option value="">Semua Sesi</option>
					{#each data.availableSessions as sn}
						<option value={sn} selected={data.sessionFilter === String(sn)}>Sesi {sn}</option>
					{/each}
				</select>
			{/if}

			<noscript>
				<button type="submit" class="btn-secondary btn-sm">Tampilkan</button>
			</noscript>
		</form>
		
		{#if data.examFilter}
			<div class="flex gap-2 overflow-x-auto p-1.5 -m-1.5 mb-1 mt-2">
				<button class="btn-sm {statusFilter === 'semua' ? 'btn-primary' : 'btn-ghost border border-slate-200'}" on:click={() => statusFilter = 'semua'}>Semua</button>
				<button class="btn-sm {statusFilter === 'mengerjakan' ? 'btn-warning' : 'btn-ghost border border-slate-200 text-slate-600'}" on:click={() => statusFilter = 'mengerjakan'}>Sedang Mengerjakan</button>
				<button class="btn-sm {statusFilter === 'selesai' ? 'btn-success' : 'btn-ghost border border-slate-200 text-slate-600'}" on:click={() => statusFilter = 'selesai'}>Selesai</button>
				<button class="btn-sm {statusFilter === 'belum_mengerjakan' ? 'bg-slate-500 text-white' : 'btn-ghost border border-slate-200 text-slate-600'}" on:click={() => statusFilter = 'belum_mengerjakan'}>Belum Mengerjakan</button>
			</div>
		{/if}
	</div>

	<!-- Monitor Table -->
	<div class="card overflow-hidden">
		{#if !data.examFilter}
			<div class="p-12 text-center text-slate-400">
				<svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
				</svg>
				<p class="text-lg font-medium">Silakan pilih ujian terlebih dahulu</p>
			</div>
		{:else if filteredAttempts.length === 0}
			<div class="p-12 text-center text-slate-400">
				<svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.monitor} />
				</svg>
				<p class="text-lg font-medium">Tidak ada siswa yang sesuai filter</p>
			</div>
		{:else}
			<div class="table-container border-0 rounded-none">
				<table class="table">
					<thead>
						<tr>
							<th>Siswa</th>
							<th>Username</th>
							<th>Status</th>
							<th class="w-24 text-center">Pelanggaran</th>
							<th class="w-32">Progress</th>
							<th>Sisa Waktu</th>
							<th class="text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredAttempts as a (a.id)}
							<tr>
								<td class="font-semibold text-slate-800">
									<div>{a.student_name}</div>
									<span class="inline-block px-1.5 py-0.5 mt-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 rounded border border-indigo-100">Sesi {a.student_session_number || 1}</span>
								</td>
								<td class="text-slate-500">@{a.username}</td>
								<td>
									<div class="flex flex-col gap-1 items-start">
										<span class={ATTEMPT_STATUS_COLORS[a.status] || 'badge-secondary'}>
											{#if a.status === 'mengerjakan'}
												<span class="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-1"></span>
											{/if}
											{ATTEMPT_STATUS_LABELS[a.status] || 'Belum Mengerjakan'}
										</span>
										{#if a.is_paused}
											<span class="badge bg-amber-100 text-amber-700 text-[10px] font-bold tracking-wide">DITAHAN</span>
										{/if}
									</div>
								</td>
								<td class="text-center">
									{#if a.status === 'belum_mengerjakan'}
										<span class="text-slate-400 text-xs">-</span>
									{:else if a.warnings > 0}
										<div class="flex items-center justify-center gap-1">
											<span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-xs">{a.warnings} kali</span>
											{#if a.warningLogs && a.warningLogs.length > 0}
												<button class="btn-ghost btn-sm p-1 rounded-full text-slate-400 hover:text-slate-600" aria-label="Lihat Log Pelanggaran" title="Lihat Log Pelanggaran" on:click={() => selectedLogs = a.warningLogs}>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
														<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
														<path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</button>
											{/if}
										</div>
									{:else}
										<span class="text-slate-400 text-xs">-</span>
									{/if}
								</td>
								<td class="w-32">
									{#if a.status === 'belum_mengerjakan'}
										<span class="text-xs text-slate-400">0%</span>
									{:else if a.question_count > 0}
										{@const pct = Math.round((a.answeredCount / a.question_count) * 100)}
										{@const color = pct < 30 ? 'bg-slate-300' : pct < 60 ? 'bg-rose-400' : pct < 90 ? 'bg-amber-400' : 'bg-emerald-500'}
										<div class="flex items-center gap-2">
											<div class="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
												<div class="h-full {color} transition-all duration-500" style="width: {pct}%"></div>
											</div>
											<span class="text-xs font-semibold text-slate-600 w-8 text-right">{pct}%</span>
										</div>
									{:else}
										<span class="text-xs text-slate-400">0%</span>
									{/if}
								</td>
								<td class="text-xs">
									{#if a.status === 'belum_mengerjakan' || !a.end_time}
										<span class="text-slate-400 font-medium opacity-80">-</span>
									{:else if a.status === 'mengerjakan'}
										{@const endStr = a.end_time ? (a.end_time.replace(' ', 'T') + (a.end_time.includes(' ') && !a.end_time.includes('Z') ? 'Z' : '')) : ''}
										{@const end = endStr ? parseDate(endStr).getTime() : 0}
										{@const compareTime = a.is_paused && a.paused_at ? parseDate(a.paused_at).getTime() : currentTime}
										{@const remainingMs = end > 0 ? end - compareTime : 0}
										{#if end > 0 && remainingMs > 0}
											{@const totalM = Math.floor(remainingMs / 60000)}
											{@const h = Math.floor(totalM / 60)}
											{@const m = totalM % 60}
											<span class="text-slate-600 font-medium">
												{#if h > 0}{h} jam {/if}{m} mnt
											</span>
										{:else if end > 0}
											<span class="text-rose-500 font-bold">Habis</span>
										{:else}
											<span class="text-slate-400 font-medium opacity-80">-</span>
										{/if}
									{:else}
										{@const endStr = a.end_time ? (a.end_time.replace(' ', 'T') + (a.end_time.includes(' ') && !a.end_time.includes('Z') ? 'Z' : '')) : ''}
										{@const submitStr = a.submit_time ? (a.submit_time.replace(' ', 'T') + (a.submit_time.includes(' ') && !a.submit_time.includes('Z') ? 'Z' : '')) : endStr}
										{@const end = endStr ? parseDate(endStr).getTime() : 0}
										{@const submit = submitStr ? parseDate(submitStr).getTime() : 0}
										{@const remainingMs = (end > 0 && submit > 0) ? end - submit : 0}
										{#if end > 0 && remainingMs > 0}
											{@const totalM = Math.floor(remainingMs / 60000)}
											{@const h = Math.floor(totalM / 60)}
											{@const m = totalM % 60}
											<span class="text-slate-500 font-medium" title="Sisa Waktu Saat Selesai">
												{#if h > 0}{h} jam {/if}{m} mnt
											</span>
										{:else if end > 0}
											<span class="text-slate-400 font-medium opacity-80">Habis</span>
										{:else}
											<span class="text-slate-400 font-medium opacity-80">-</span>
										{/if}
									{/if}
								</td>
								<td class="text-right">
									{#if a.status === 'mengerjakan'}
										<div class="flex items-center justify-end gap-2">
											<form method="POST" action="?/togglePause" use:enhance>
												<input type="hidden" name="attempt_id" value={a.attempt_id} />
												{#if a.is_paused}
													<input type="hidden" name="action" value="resume" />
													<button type="submit" class="btn-sm btn-success" title="Lanjutkan Ujian">
														<svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
															<path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
															<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
														</svg>
														Lanjutkan
													</button>
												{:else}
													<input type="hidden" name="action" value="pause" />
													<button type="submit" class="btn-sm btn-warning text-white" title="Tahan Sementara">
														<svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
															<path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
														</svg>
														Tahan
													</button>
												{/if}
											</form>
											<button
												class="btn-sm btn-danger"
												on:click={() => (resetConfirm = a.attempt_id)}
											>
												<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.refresh} />
												</svg>
												Reset
											</button>
										</div>
									{:else}
										<span class="text-slate-300">-</span>
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

<!-- Reset Confirmation -->
{#if resetConfirm !== null}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (resetConfirm = null)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-sm animate-bounce-in text-center" on:click|stopPropagation>
			<div class="w-14 h-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
				<svg class="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.warning} />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-slate-800 mb-2">Reset Sesi Ujian?</h3>
			<p class="text-sm text-slate-500 mb-5">Jawaban siswa akan dihapus dan siswa bisa memulai ulang.</p>
			<form method="POST" action="?/resetAttempt" use:enhance={() => { return async ({ update }) => { resetConfirm = null; await update(); }; }}>
				<input type="hidden" name="attempt_id" value={resetConfirm} />
				<div class="flex gap-3">
					<button type="button" class="btn-ghost flex-1" on:click={() => (resetConfirm = null)}>Batal</button>
					<button type="submit" class="btn-danger flex-1">Reset</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Violation Logs Modal -->
{#if selectedLogs !== null}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => selectedLogs = null}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-md animate-bounce-in" on:click|stopPropagation>
			<div class="flex items-center gap-3 mb-4">
				<div class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				</div>
				<h3 class="text-lg font-bold text-slate-800">Riwayat Pelanggaran</h3>
			</div>
			
			{#if selectedLogs.length === 0}
				<p class="text-slate-500 text-sm text-center py-4">Tidak ada riwayat detail pelanggaran.</p>
			{:else}
				<ul class="space-y-3 max-h-64 overflow-y-auto pr-2">
					{#each selectedLogs as log}
						<li class="flex flex-col border-b border-slate-100 pb-2 last:border-0">
							<span class="font-medium text-rose-600 text-sm">{log.type}</span>
							<span class="text-xs text-slate-400">{parseDate(log.time).toLocaleString('id-ID')}</span>
						</li>
					{/each}
				</ul>
			{/if}
			
			<div class="mt-5">
				<button class="btn-primary w-full" on:click={() => selectedLogs = null}>Tutup</button>
			</div>
		</div>
	</div>
{/if}
