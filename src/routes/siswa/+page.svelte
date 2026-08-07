<script lang="ts">
	import { ICONS, ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS } from '$lib/utils/constants';
	import { onMount, onDestroy } from 'svelte';
	import ScoreDisplay from '$lib/components/exam/ScoreDisplay.svelte';

	export let data;
	$: activeExams = (data.activeExams as any[]).filter(exam => {
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		if (exam.end_time && parseDate(exam.end_time) <= now) return false;
		
		if (exam.start_time) {
			const start = parseDate(exam.start_time);
			const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
			if (startDate > today) return false;
		}
		
		return true;
	});
	$: myAttempts = data.myAttempts as any[];
	$: activeAttempt = data.activeAttempt as any;

	let currentTime = new Date();
	let intervalId: any;
	let submittingAttempts = new Set<number>();

	onMount(() => {
		intervalId = setInterval(() => {
			currentTime = new Date();
			
			if (myAttempts) {
				for (const a of myAttempts) {
					if (a.status === 'mengerjakan' && !submittingAttempts.has(a.id)) {
						if (isAttemptExpired(a.end_time, currentTime)) {
							submittingAttempts.add(a.id);
							submittingAttempts = submittingAttempts; // trigger reactivity
							
							const fd = new FormData();
							fetch(`/siswa/ujian/${a.id}?/submit`, {
								method: 'POST',
								body: fd,
								headers: { 'x-sveltekit-action': 'true' }
							}).then(() => {
								window.location.reload();
							}).catch(console.error);
						}
					}
				}
			}
		}, 1000);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});

	function parseDate(dateStr: string | null) {
		if (!dateStr) return new Date();
		if (dateStr.includes(' ')) {
			return new Date(dateStr.replace(' ', 'T') + (dateStr.includes(' ') && !dateStr.includes('Z') ? 'Z' : ''));
		}
		return new Date(dateStr);
	}

	function formatTimeRange(startStr: string | null, endStr: string | null) {
		if (!startStr) return '--:--';
		const start = parseDate(startStr);
		const startFormatted = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(start);
		
		if (!endStr) return `${startFormatted} - Selesai`;
		
		const end = parseDate(endStr);
		const endFormatted = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(end);

		if (
			start.getDate() === end.getDate() &&
			start.getMonth() === end.getMonth() &&
			start.getFullYear() === end.getFullYear()
		) {
			return `${startFormatted} - ${endFormatted}`;
		}

		const startDateFormatted = new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(start);
		const endDateFormatted = new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(end);

		return `${startDateFormatted} ${startFormatted} - ${endDateFormatted} ${endFormatted}`;
	}

	function getCountdownString(startStr: string, current: Date) {
		const start = parseDate(startStr);
		const diff = start.getTime() - current.getTime();
		if (diff <= 0) return null;
		
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);
		
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	function getAttemptRemainingTime(endTimeStr: string, current: Date, isPaused = false, pausedAtStr: string | null = null) {
		const end = parseDate(endTimeStr);
		
		let diff = 0;
		if (isPaused && pausedAtStr) {
			const paused = parseDate(pausedAtStr);
			diff = end.getTime() - paused.getTime();
		} else {
			diff = end.getTime() - current.getTime();
		}
		
		if (diff <= 0) return '00:00:00';
		
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);
		
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	function isAttemptExpired(endTimeStr: string, current: Date) {
		const end = parseDate(endTimeStr);
		return current.getTime() >= end.getTime();
	}

	function formatOnlyTime(dateStr: string | null) {
		if (!dateStr) return '--.--';
		const date = parseDate(dateStr);
		return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(date).replace(':', '.');
	}

	$: proctorMap = new Map<string, number>();
	$: totalExamsCount = data.schedules?.length || 0;
	$: groupedSchedules = (() => {
		const groups: { dateStr: string, exams: any[], colorIdx: number }[] = [];
		if (!data.schedules) return groups;
		
		let currentDateStr = '';
		let currentGroup: { dateStr: string, exams: any[], colorIdx: number } | null = null;
		let colorCounter = 0;
		let proctorCounter = 1;
		proctorMap.clear();

		data.schedules.forEach((exam: any) => {
			if (exam.proctor_names) {
				(exam.proctor_names || '').split('||').forEach((p: string) => {
					const name = p.trim();
					if (name && !proctorMap.has(name)) {
						proctorMap.set(name, proctorCounter++);
					}
				});
			}

			if (!exam.start_time) return;
			const date = parseDate(String(exam.start_time));
			const dateFormatted = new Intl.DateTimeFormat('id-ID', {
				weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
			}).format(date);
			
			if (dateFormatted !== currentDateStr) {
				currentDateStr = dateFormatted;
				currentGroup = { dateStr: dateFormatted, exams: [], colorIdx: colorCounter++ };
				groups.push(currentGroup);
			}
			currentGroup?.exams.push(exam);
		});
		return groups;
	})();

	function getProctorNumbers(namesStr: string | null) {
		if (!namesStr) return '-';
		const names = namesStr.split('||').map(n => n.trim()).filter(Boolean);
		if (names.length === 0) return '-';
		const numbers = names.map(n => proctorMap.get(n)).sort((a, b) => (a || 0) - (b || 0));
		return numbers.join(' & ');
	}

	const rowColors = [
		'bg-white',
		'bg-slate-50'
	];
</script>

<svelte:head><title>Dashboard Siswa — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Dashboard Siswa</h1>
		<p class="text-sm text-slate-500 mt-1">Selamat datang, {data.user.name}.</p>
	</div>

	<!-- Active Attempt Banner -->
	{#if activeAttempt}
		<div class="card p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-pulse">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} />
					</svg>
				</div>
				<div class="flex-1">
					<h3 class="font-bold text-amber-800">Ujian Sedang Berlangsung</h3>
					<p class="text-sm text-amber-600">{activeAttempt.exam_title}</p>
				</div>
				<a href="/siswa/ujian?exam_id={activeAttempt.exam_id}" class="btn-warning">
					Lanjutkan
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronRight} />
					</svg>
				</a>
			</div>
		</div>
	{/if}

	<!-- Active Exams -->
	<div>
		<h2 class="text-lg font-bold text-slate-800 mb-3">Ujian Tersedia</h2>
		{#if activeExams.length === 0}
			<div class="card p-8 text-center text-slate-400">
				<svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
				</svg>
				<p>Tidak ada ujian yang tersedia saat ini.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each activeExams as exam (exam.id)}
					<div class="card-hover p-5 flex flex-col h-full">
						<div class="flex items-start justify-between mb-3">
							<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
								<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
								</svg>
							</div>
							<span class="badge-success">Tersedia</span>
						</div>
						<h3 class="font-bold text-slate-800">{exam.title}</h3>
						<p class="text-sm text-slate-500 mt-1 mb-4">{exam.subject || 'Umum'}</p>
						
						<div class="space-y-2 mb-4 mt-auto">
							<div class="flex items-center text-sm text-slate-600">
								<svg class="w-4 h-4 mr-2 text-slate-400 min-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} />
								</svg>
								<span>Pukul: {formatTimeRange(exam.start_time, exam.end_time)}</span>
							</div>
							<div class="flex items-center text-sm text-slate-600">
								<svg class="w-4 h-4 mr-2 text-slate-400 min-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
								</svg>
								<span>Durasi: {exam.duration_minutes} menit</span>
							</div>
							<div class="flex items-center text-sm text-slate-600">
								<svg class="w-4 h-4 mr-2 text-slate-400 min-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								<span>Soal: {exam.question_count}</span>
							</div>
							<div class="flex items-center text-sm text-slate-600">
								<svg class="w-4 h-4 mr-2 text-slate-400 min-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.users} />
								</svg>
								<span class="line-clamp-1" title={exam.proctors || 'Belum ada pengawas'}>Pengawas: {exam.proctors || '-'}</span>
							</div>
						</div>
						
						<div class="pt-4 border-t border-slate-100 mt-auto">
							{#if myAttempts.some(a => a.exam_id === exam.id && ['selesai', 'waktu_habis'].includes(a.status))}
								<button disabled class="btn w-full justify-center bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed shadow-none">
									<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
									</svg>
									Selesai
								</button>
							{:else if exam.start_time && getCountdownString(exam.start_time, currentTime)}
								<button disabled class="btn w-full justify-center bg-slate-800 text-white cursor-not-allowed flex gap-2 border-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_2px_4px_rgba(0,0,0,0.3)]">
									<svg class="w-5 h-5 animate-spin-slow opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
										<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} />
									</svg>
									<span class="font-mono text-lg tracking-widest font-bold">{getCountdownString(exam.start_time, currentTime)}</span>
								</button>
							{:else}
								<a href="/siswa/ujian?exam_id={exam.id}" class="btn btn-primary w-full justify-center shadow-lg shadow-indigo-500/30">Buka Halaman Ujian</a>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Jadwal Ujian Table -->
	{#if data.schedules && data.schedules.length > 0}
	<div class="mt-8 mb-4">
		<h2 class="text-lg font-bold text-slate-800 mb-3">Jadwal Ujian</h2>
		<div class="card overflow-x-auto bg-white !rounded-none !shadow-none border-2 border-slate-300 p-0">
			<table class="w-full text-sm border-collapse border-slate-300 whitespace-nowrap">
				<thead>
					<tr class="bg-slate-100 text-slate-700">
						<th class="border-2 border-slate-300 px-3 py-2 uppercase">NO</th>
						<th class="border-2 border-slate-300 px-3 py-2 uppercase">HARI, TANGGAL</th>
						<th class="border-2 border-slate-300 px-3 py-2 uppercase">JAM KE</th>
						<th class="border-2 border-slate-300 px-3 py-2 uppercase">WAKTU</th>
						<th class="border-2 border-slate-300 px-3 py-2 uppercase">MATA PELAJARAN</th>
						<th class="border-2 border-slate-300 px-3 py-2 uppercase">PENGAWAS</th>
						<th class="border-2 border-slate-300 px-3 py-2">Daftar Pengawas</th>
					</tr>
				</thead>
				<tbody>
					{#each groupedSchedules as group, gIdx}
						{#each group.exams as exam, eIdx}
							<tr class="{rowColors[group.colorIdx % rowColors.length]}">
								{#if eIdx === 0}
									<td class="border-2 border-slate-300 px-3 py-2 text-center" rowspan={group.exams.length}>{gIdx + 1}</td>
									<td class="border-2 border-slate-300 px-3 py-2 text-center" rowspan={group.exams.length}>{group.dateStr}</td>
								{/if}
								<td class="border-2 border-slate-300 px-3 py-2 text-center">{eIdx + 1}</td>
								<td class="border-2 border-slate-300 px-3 py-2 text-center tracking-wider">
									{formatOnlyTime(exam.start_time || '')} - {formatOnlyTime(exam.end_time || '')}
								</td>
								<td class="border-2 border-slate-300 px-3 py-2 text-center">{exam.subject_name || exam.title || ''}</td>
								<td class="border-2 border-slate-300 px-3 py-2 text-center font-medium">
									{getProctorNumbers(exam.proctor_names || '')}
								</td>
								{#if gIdx === 0 && eIdx === 0}
									<td class="border-2 border-slate-300 px-4 py-2 align-top bg-white" rowspan={totalExamsCount}>
										<div class="space-y-0.5">
											{#each Array.from(proctorMap.entries()) as [name, num]}
												<div class="text-xs">
													<span class="inline-block w-4">{num}.</span> {name}
												</div>
											{/each}
										</div>
									</td>
								{/if}
							</tr>
						{/each}
					{/each}
				</tbody>
			</table>
		</div>
	</div>
	{/if}

	<!-- History -->
	<div>
		<h2 class="text-lg font-bold text-slate-800 mb-3">Riwayat Ujian</h2>
		{#if myAttempts.length === 0}
			<div class="card p-6 text-center text-slate-400 text-sm">Belum ada riwayat ujian.</div>
		{:else}
			<div class="card overflow-hidden">
				<div class="table-container border-0 rounded-none">
					<table class="table">
						<thead><tr><th>Ujian</th><th>Mapel</th><th>Status</th><th>Sisa Waktu</th><th>Nilai Otomatis</th><th>Nilai Manual</th><th>Nilai Akhir</th><th>Tanggal</th></tr></thead>
						<tbody>
							{#each myAttempts as a}
								<tr>
									<td class="font-medium">{a.exam_title}</td>
									<td class="text-slate-500">{a.subject || '-'}</td>
									<td><span class={ATTEMPT_STATUS_COLORS[a.status]}>{ATTEMPT_STATUS_LABELS[a.status]}</span></td>
									<td class="font-mono text-sm">
										{#if a.status === 'mengerjakan'}
											<span class="inline-flex items-center gap-1">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} />
												</svg>
												{getAttemptRemainingTime(a.end_time, currentTime, a.is_paused === 1, a.paused_at)}
											</span>
										{:else}
											{@const startStr = String(a.start_time).replace(' ', 'T') + (String(a.start_time).includes(' ') && !String(a.start_time).includes('Z') ? 'Z' : '')}
											{@const submitStr = a.submit_time ? (String(a.submit_time).replace(' ', 'T') + (String(a.submit_time).includes(' ') && !String(a.submit_time).includes('Z') ? 'Z' : '')) : (a.updated_at ? (String(a.updated_at).replace(' ', 'T') + (String(a.updated_at).includes(' ') && !String(a.updated_at).includes('Z') ? 'Z' : '')) : startStr)}
											{@const submitMs = new Date(submitStr).getTime()}
											{@const endMs = new Date(String(a.end_time).replace(' ', 'T') + (String(a.end_time).includes(' ') && !String(a.end_time).includes('Z') ? 'Z' : '')).getTime()}
											{@const remainingMs = endMs - submitMs}
											{#if remainingMs > 0}
												{@const totalS = Math.floor(remainingMs / 1000)}
												{@const h = Math.floor(totalS / 3600)}
												{@const m = Math.floor((totalS % 3600) / 60)}
												{@const s = totalS % 60}
												<span class="text-slate-400" title="Sisa waktu saat ujian diselesaikan">
													{h.toString().padStart(2, '0')}:{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
												</span>
											{:else}
												<span class="text-slate-400">00:00:00</span>
											{/if}
										{/if}
									</td>
									<td class="font-bold bg-slate-50/50">
										<ScoreDisplay attempt={a} {currentTime} type="otomatis" />
									</td>
									<td class="font-bold bg-slate-50/50">
										<ScoreDisplay attempt={a} {currentTime} type="manual" />
									</td>
									<td class="font-bold bg-indigo-50/30">
										<ScoreDisplay attempt={a} {currentTime} type="akhir" />
									</td>
									<td class="text-xs text-slate-500">{new Date(String(a.created_at).replace(' ', 'T') + (String(a.created_at).includes(' ') && !String(a.created_at).includes('Z') ? 'Z' : '')).toLocaleDateString('id-ID')}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>
</div>
