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
	let previewSignature: { name: string; url: string } | null = null;
	let currentTime = Date.now();
	let interval: any;

	// Monitoring Camera Photos State
	let showCameraGridModal = false;
	let cameraGridFilter = 'semua';
	$: cameraGridList = filteredAttempts.filter(a => {
		if (cameraGridFilter === 'foto') return (a.photoCount || 0) > 0;
		if (cameraGridFilter === 'pelanggaran') return (a.warnings || 0) > 0;
		return true;
	});
	let selectedStudentForPhotos: any = null;
	let selectedStudentPhotos: any[] = [];
	let loadingStudentPhotos = false;
	let previewEnlargedPhoto: { url: string; caption?: string; title?: string; time?: string } | null = null;

	async function openStudentPhotos(student: any) {
		selectedStudentForPhotos = student;
		selectedStudentPhotos = [];
		loadingStudentPhotos = true;
		try {
			const query = new URLSearchParams({
				exam_id: String(data.examFilter || ''),
				student_id: String(student.student_id)
			});
			const res = await fetch(`/api/proctor/monitoring-photos?${query.toString()}`);
			if (res.ok) {
				const json = await res.json();
				selectedStudentPhotos = json.photos || [];
			} else {
				toasts.error('Gagal memuat foto pengawasan.');
			}
		} catch (e) {
			console.error(e);
			toasts.error('Terjadi kesalahan saat memuat foto.');
		} finally {
			loadingStudentPhotos = false;
		}
	}

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

	let monitorVersion = '';
	let isPolling = false;
	$: if (data.examFilter || data.sessionFilter) {
		monitorVersion = '';
		attemptsMap.clear();
		if (data.attempts && Array.isArray(data.attempts)) {
			data.attempts.forEach(a => {
				const key = a.student_id || a.attempt_id;
				attemptsMap.set(key, a.warnings || 0);
			});
		}
	}

	$: if (data.attempts && Array.isArray(data.attempts)) {
		data.attempts.forEach(a => {
			const key = a.student_id || a.attempt_id;
			if (!attemptsMap.has(key)) {
				attemptsMap.set(key, a.warnings || 0);
			}
		});
	}

	async function pollLiveStatus() {
		if (!data.examFilter || isPolling) return;
		isPolling = true;
		try {
			const queryParams = new URLSearchParams({ exam_id: data.examFilter });
			if (data.sessionFilter) queryParams.set('session_number', data.sessionFilter);
			if (monitorVersion) queryParams.set('since', monitorVersion);
			
			const res = await fetch(`/api/monitor-live?${queryParams.toString()}`);
			if (!res.ok) return;
			const result = (await res.json()) as any;

			if (result.version) {
				monitorVersion = result.version;
			}

			// Jika data tidak berubah sama sekali, hemat proses render & komputasi
			if (result.changed === false) {
				return;
			}

			if (result.attempts && Array.isArray(result.attempts)) {
				result.attempts.forEach((newA: any) => {
					const key = newA.student_id || newA.attempt_id;
					const prevWarnings = attemptsMap.get(key) ?? (newA.warnings || 0);
					
					// HANYA bunyikan alarm suara dan munculkan notifikasi jika:
					// 1. Siswa MASIH dalam status 'mengerjakan' (bukan selesai / waktu_habis / belum_mengerjakan)
					// 2. Jumlah pelanggaran bertambah dibanding baseline sebelumnya
					if (newA.status === 'mengerjakan' && newA.warnings > prevWarnings) {
						let violationType = 'melakukan pelanggaran';
						if (newA.warningLogs && newA.warningLogs.length > 0) {
							const lastLog = newA.warningLogs[newA.warningLogs.length - 1];
							if (typeof lastLog === 'string') {
								violationType = lastLog;
							} else if (lastLog && lastLog.type) {
								violationType = lastLog.type;
							}
						}

						toasts.warning(`⚠️ Pelanggaran! ${newA.student_name || 'Siswa'} (${violationType})`);
						playViolationBeep();
						setTimeout(() => {
							speakViolationAlert(`Peringatan! Siswa ${newA.student_name || 'Siswa'}, ${violationType}.`);
						}, 350);
					}
					attemptsMap.set(key, newA.warnings || 0);
				});
				attempts = result.attempts;
			}
		} catch (e) {
			console.warn('Live monitoring poll error:', e);
		} finally {
			isPolling = false;
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
				const key = a.student_id || a.attempt_id;
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
					}, 10000);
				}
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		interval = setInterval(() => {
			if (!document.hidden) {
				currentTime = Date.now();
				pollLiveStatus();
			}
		}, 10000);

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
		<div class="flex items-center gap-2">
			<button 
				type="button" 
				class="btn-sm btn-ghost border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 text-xs text-slate-700 font-medium shadow-sm transition-colors"
				disabled={isPolling}
				on:click={() => { 
					monitorVersion = '';
					pollLiveStatus();
					toasts.info('Memperbarui data monitoring...');
				}}
				title="Segarkan data monitoring sekarang"
			>
				<svg class="w-3.5 h-3.5 text-slate-600 {isPolling ? 'animate-spin' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
				</svg>
				<span>{isPolling ? 'Menyegarkan...' : 'Segarkan Data'}</span>
			</button>
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
			<select name="exam_id" class="select flex-1 min-w-[200px]" required on:change={() => {
				const sessionEl = formElement?.querySelector('select[name="session_number"]') as unknown as HTMLSelectElement;
				if (sessionEl) sessionEl.value = '';
				formElement?.submit();
			}}>
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
			<div class="flex flex-wrap items-center justify-between gap-2 p-1.5 -m-1.5 mb-1 mt-2">
				<div class="flex gap-2 overflow-x-auto">
					<button class="btn-sm {statusFilter === 'semua' ? 'btn-primary' : 'btn-ghost border border-slate-200'}" on:click={() => statusFilter = 'semua'}>Semua</button>
					<button class="btn-sm {statusFilter === 'mengerjakan' ? 'btn-warning' : 'btn-ghost border border-slate-200 text-slate-600'}" on:click={() => statusFilter = 'mengerjakan'}>Sedang Mengerjakan</button>
					<button class="btn-sm {statusFilter === 'selesai' ? 'btn-success' : 'btn-ghost border border-slate-200 text-slate-600'}" on:click={() => statusFilter = 'selesai'}>Selesai</button>
					<button class="btn-sm {statusFilter === 'belum_mengerjakan' ? 'bg-slate-500 text-white' : 'btn-ghost border border-slate-200 text-slate-600'}" on:click={() => statusFilter = 'belum_mengerjakan'}>Belum Mengerjakan</button>
				</div>
				<button 
					type="button" 
					class="btn-secondary btn-sm flex items-center gap-1.5 shadow-sm text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100" 
					on:click={() => showCameraGridModal = true}
				>
					<svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					<span>Galeri Kamera Wajah</span>
					{#if filteredAttempts.filter(a => (a.photoCount || 0) > 0).length > 0}
						<span class="px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-bold">
							{filteredAttempts.filter(a => (a.photoCount || 0) > 0).length}
						</span>
					{/if}
				</button>
			</div>
		{/if}
	</div>

	{#if data.examFilter && data.currentExam}
		<div class="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<div>
					<div class="text-xs font-semibold uppercase tracking-wider text-amber-800">PIN Keluar Ujian (Aplikasi Exambro)</div>
					<div class="text-xs text-amber-700">Gunakan PIN ini jika pengawas ingin mengeluarkan siswa dari aplikasi ujian saat pengerjaan berlangsung.</div>
				</div>
			</div>
			<div class="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
				<div class="flex items-center gap-2 bg-white border-2 border-amber-300 px-3.5 py-1.5 rounded-lg shadow-xs">
					<span class="text-xs text-slate-500 font-medium">PIN:</span>
					<span class="font-mono text-xl font-black tracking-widest text-amber-600 select-all">{data.currentExam.exit_pin || '-----'}</span>
				</div>
				<form method="POST" action="?/regenerateExitPin" use:enhance>
					<input type="hidden" name="exam_id" value={data.currentExam.id} />
					<button 
						type="submit" 
						class="btn-sm btn-ghost border border-amber-200 bg-white hover:bg-amber-50 text-amber-800 flex items-center gap-1.5 text-xs font-medium shadow-xs"
						title="Acak PIN Keluar Baru"
					>
						<svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						<span>Acak PIN</span>
					</button>
				</form>
			</div>
		</div>
	{/if}

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
							<th class="w-20 text-center">TTD</th>
							<th class="w-24 text-center">Foto Wajah</th>
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
									{#if a.signature}
										<button
											type="button"
											class="group relative inline-flex items-center justify-center p-1 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
											on:click={() => previewSignature = { name: a.student_name, url: a.signature }}
											title="Klik untuk memperbesar tanda tangan"
										>
											<img src={a.signature} alt="TTD {a.student_name}" class="h-7 max-w-[55px] object-contain" />
											<span class="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
												🔍
											</span>
										</button>
									{:else}
										<span class="text-slate-300 text-xs">-</span>
									{/if}
								</td>
								<td class="text-center">
									{#if (a.photoCount || 0) > 0}
										<button
											type="button"
											class="group relative inline-flex items-center gap-1.5 px-2 py-1 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 hover:border-indigo-400 transition-all cursor-pointer shadow-xs"
											on:click={() => openStudentPhotos(a)}
											title="Lihat riwayat {a.photoCount} foto pengawasan"
										>
											{#if a.latestPhoto}
												<img src={a.latestPhoto} alt="Foto {a.student_name}" class="h-6 w-6 rounded-full object-cover border border-indigo-200" />
											{:else}
												<span class="text-xs">📷</span>
											{/if}
											<span class="text-[11px] font-bold text-indigo-700">{a.photoCount}</span>
										</button>
									{:else}
										<span class="text-slate-300 text-xs">-</span>
									{/if}
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
											<form method="POST" action="?/forceSubmit" use:enhance>
												<input type="hidden" name="attempt_id" value={a.attempt_id} />
												<button 
													type="submit" 
													class="btn-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs" 
													title="Selesaikan dan kumpulkan ujian siswa secara resmi (jawaban tersimpan langsung dinilai)"
													on:click={(e) => {
														if (!confirm(`Selesaikan dan kumpulkan ujian siswa "${a.student_name}"? Semua jawaban yang sudah tersimpan akan langsung dinilai secara resmi.`)) {
															e.preventDefault();
														}
													}}
												>
													<svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
														<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
													</svg>
													Selesaikan
												</button>
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

<!-- Signature Preview Modal -->
{#if previewSignature}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
		on:click={() => (previewSignature = null)}
	>
		<div
			class="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative animate-scale-up border border-slate-100"
			on:click|stopPropagation
		>
			<button
				type="button"
				class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
				on:click={() => (previewSignature = null)}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
				</svg>
			</div>

			<h3 class="text-base font-bold text-slate-800">Tanda Tangan Siswa</h3>
			<p class="text-xs text-slate-500 mt-0.5 mb-4">{previewSignature.name}</p>

			<div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-center min-h-[160px]">
				<img
					src={previewSignature.url}
					alt="Tanda Tangan {previewSignature.name}"
					class="max-h-40 max-w-full object-contain mix-blend-multiply"
				/>
			</div>

			<button
				type="button"
				class="btn btn-secondary w-full text-xs mt-5 py-2.5"
				on:click={() => (previewSignature = null)}
			>
				Tutup
			</button>
		</div>
	</div>
{/if}

<!-- Student Photo Timeline Modal -->
{#if selectedStudentForPhotos}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
		on:click={() => (selectedStudentForPhotos = null)}
	>
		<div
			class="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative animate-scale-up border border-slate-100 max-h-[90vh] flex flex-col"
			on:click|stopPropagation
		>
			<div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</div>
					<div>
						<h3 class="text-base font-bold text-slate-800 leading-tight">{selectedStudentForPhotos.student_name}</h3>
						<p class="text-xs text-slate-500">@{selectedStudentForPhotos.username} • Sesi {selectedStudentForPhotos.student_session_number || 1}</p>
					</div>
				</div>
				<button
					type="button"
					class="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
					on:click={() => (selectedStudentForPhotos = null)}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<div class="overflow-y-auto flex-1 pr-1 space-y-4">
				{#if loadingStudentPhotos}
					<div class="py-12 text-center text-slate-400">
						<svg class="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
						</svg>
						<p class="text-sm font-medium">Memuat riwayat foto...</p>
					</div>
				{:else if selectedStudentPhotos.length === 0}
					<div class="py-12 text-center text-slate-400">
						<svg class="w-12 h-12 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
						</svg>
						<p class="text-sm font-medium">Belum ada rekaman foto pengawasan untuk siswa ini.</p>
					</div>
				{:else}
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{#each selectedStudentPhotos as photo}
							{@const isStart = photo.photo_type === 'start'}
							{@const isViolation = photo.photo_type === 'violation'}
							{@const isFinish = photo.photo_type === 'finish'}
							<div class="p-3 rounded-2xl border {isViolation ? 'border-rose-200 bg-rose-50/40' : isStart ? 'border-emerald-200 bg-emerald-50/40' : 'border-indigo-200 bg-indigo-50/40'} flex flex-col justify-between">
								<div class="flex items-center justify-between mb-2">
									<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider {isViolation ? 'bg-rose-100 text-rose-700' : isStart ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}">
										{#if isStart}🟢 Absensi Awal{:else if isViolation}⚠️ Pelanggaran{:else if isFinish}🔵 Selesai Ujian{:else}📸 Inspeksi{/if}
									</span>
									<span class="text-[10px] text-slate-400 font-mono">
										{photo.created_at ? parseDate(photo.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}
									</span>
								</div>

								<!-- Photo Thumbnail with Zoom Click -->
								<button
									type="button"
									class="relative rounded-xl overflow-hidden bg-slate-900 aspect-4/3 flex items-center justify-center group cursor-pointer border border-slate-200/80 mb-2"
									on:click={() => previewEnlargedPhoto = { url: photo.photo_url, caption: photo.caption, title: selectedStudentForPhotos.student_name, time: photo.created_at }}
									title="Klik untuk memperbesar foto"
								>
									<img src={photo.photo_url} alt={photo.caption || 'Foto'} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
									<div class="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
										<span>🔍 Perbesar</span>
									</div>
								</button>

								{#if photo.caption}
									<p class="text-[11px] {isViolation ? 'text-rose-700 font-semibold' : 'text-slate-600'} line-clamp-2 leading-tight">
										{photo.caption}
									</p>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<div class="pt-4 border-t border-slate-100 mt-4">
				<button type="button" class="btn btn-secondary w-full text-xs py-2.5" on:click={() => (selectedStudentForPhotos = null)}>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Live Camera Grid Modal for All Students -->
{#if showCameraGridModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
		on:click={() => (showCameraGridModal = false)}
	>
		<div
			class="bg-white rounded-3xl p-6 w-full max-w-4xl shadow-2xl relative animate-scale-up border border-slate-100 max-h-[90vh] flex flex-col"
			on:click|stopPropagation
		>
			<div class="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</div>
					<div>
						<h3 class="text-base font-bold text-slate-800 leading-tight">Galeri Pengawasan Kamera Wajah</h3>
						<p class="text-xs text-slate-500">Monitoring snapshot wajah seluruh peserta ujian di ruangan</p>
					</div>
				</div>

				<div class="flex items-center gap-2">
					<div class="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs">
						<button class="px-2.5 py-1 rounded-lg font-medium {cameraGridFilter === 'semua' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-slate-600'}" on:click={() => cameraGridFilter = 'semua'}>Semua</button>
						<button class="px-2.5 py-1 rounded-lg font-medium {cameraGridFilter === 'foto' ? 'bg-white shadow-xs text-indigo-600 font-bold' : 'text-slate-600'}" on:click={() => cameraGridFilter = 'foto'}>Punya Foto</button>
						<button class="px-2.5 py-1 rounded-lg font-medium {cameraGridFilter === 'pelanggaran' ? 'bg-white shadow-xs text-rose-600 font-bold' : 'text-slate-600'}" on:click={() => cameraGridFilter = 'pelanggaran'}>Pelanggaran</button>
					</div>
					<button
						type="button"
						class="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
						on:click={() => (showCameraGridModal = false)}
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>

			<div class="overflow-y-auto flex-1 pr-1">
				{#if cameraGridList.length === 0}
					<div class="py-16 text-center text-slate-400">
						<svg class="w-12 h-12 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
						</svg>
						<p class="text-sm font-medium">Tidak ada siswa yang sesuai filter saat ini.</p>
					</div>
				{:else}
					<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
						{#each cameraGridList as a}
							<div class="card p-3 flex flex-col justify-between border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group">
								<div class="relative rounded-xl overflow-hidden bg-slate-900 aspect-4/3 flex items-center justify-center mb-2.5">
									{#if a.latestPhoto}
										<img src={a.latestPhoto} alt={a.student_name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
										<span class="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-slate-950/70 text-white text-[10px] font-semibold backdrop-blur-xs">
											📷 {a.photoCount || 1}
										</span>
									{:else}
										<div class="text-center p-3 text-slate-400">
											<span class="text-2xl block mb-1">👤</span>
											<span class="text-[10px]">Belum Ada Foto</span>
										</div>
									{/if}

									{#if (a.warnings || 0) > 0}
										<span class="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-xs">
											⚠️ {a.warnings}x
										</span>
									{/if}
								</div>

								<div>
									<h4 class="text-xs font-bold text-slate-800 truncate" title={a.student_name}>{a.student_name}</h4>
									<p class="text-[10px] text-slate-500 mb-2">@{a.username} • Sesi {a.student_session_number || 1}</p>
								</div>

								<div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
									<span class="text-[10px] font-semibold {a.status === 'mengerjakan' ? 'text-amber-600' : a.status === 'selesai' ? 'text-emerald-600' : 'text-slate-400'}">
										{ATTEMPT_STATUS_LABELS[a.status] || 'Belum'}
									</span>
									{#if (a.photoCount || 0) > 0}
										<button
											type="button"
											class="text-[10px] text-indigo-600 font-bold hover:text-indigo-800 hover:underline cursor-pointer"
											on:click={() => openStudentPhotos(a)}
										>
											Detail Foto →
										</button>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<div class="pt-4 border-t border-slate-100 mt-4 flex justify-end">
				<button type="button" class="btn btn-secondary text-xs px-6 py-2.5" on:click={() => (showCameraGridModal = false)}>
					Tutup
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Lightbox Modal for Enlarged Photo -->
{#if previewEnlargedPhoto}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in"
		style="z-index: 9999;"
		on:click={() => (previewEnlargedPhoto = null)}
	>
		<div
			class="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative animate-scale-up border border-slate-100 text-center"
			on:click|stopPropagation
		>
			<button
				type="button"
				class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
				on:click={() => (previewEnlargedPhoto = null)}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<h3 class="text-base font-bold text-slate-800">{previewEnlargedPhoto.title || 'Foto Pengawasan'}</h3>
			{#if previewEnlargedPhoto.caption}
				<p class="text-xs text-rose-600 font-semibold mt-0.5">{previewEnlargedPhoto.caption}</p>
			{/if}
			{#if previewEnlargedPhoto.time}
				<p class="text-[11px] text-slate-400 mt-0.5 mb-3">{parseDate(previewEnlargedPhoto.time).toLocaleString('id-ID')}</p>
			{/if}

			<div class="rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-200">
				<img src={previewEnlargedPhoto.url} alt="Foto Zoom" class="max-h-[65vh] w-auto object-contain" />
			</div>

			<button type="button" class="btn btn-secondary w-full text-xs mt-4 py-2.5" on:click={() => (previewEnlargedPhoto = null)}>
				Tutup
			</button>
		</div>
	</div>
{/if}
