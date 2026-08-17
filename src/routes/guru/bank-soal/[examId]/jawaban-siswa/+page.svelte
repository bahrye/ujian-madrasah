<script lang="ts">
	import { ICONS, QUESTION_TYPE_LABELS } from '$lib/utils/constants';
	import { mathRender } from '$lib/actions/mathRender';
	import { arabicRender } from '$lib/actions/arabicRender';

	export let data;

	$: exam = data.exam || {};
	$: questions = data.questions || [];
	$: attempts = data.attempts || [];
	$: answerMatrixMap = data.answerMatrixMap || {};
	$: availableClasses = data.availableClasses || [];
	$: questionDiagnostics = data.questionDiagnostics || [];
	$: topTraps = data.topTraps || [];
	$: accuracyByType = data.accuracyByType || [];
	$: totalAttempts = data.totalAttempts || 0;
	$: avgScore = data.avgScore || 0;
	$: passPercentage = data.passPercentage || 0;
	$: passCount = data.passCount || 0;

	let activeTab: 'matrix' | 'diagnostics' | 'rekap' = 'matrix';
	let selectedClass = 'ALL';
	let searchQuery = '';
	let diagnosticFilter: 'all' | 'critical' | 'medium' | 'mastered' = 'all';
	let rekapStatusFilter: 'ALL' | 'TUNTAS' | 'REMEDIAL' = 'ALL';
	let expandedQuestionId: number | null = null;
	let expandedStudentAttemptId: number | null = null;

	// Filter attempts
	$: filteredAttempts = attempts.filter((att: any) => {
		const matchClass = selectedClass === 'ALL' || att.class_name === selectedClass;
		const matchSearch = !searchQuery || (att.student_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (att.nisn || '').includes(searchQuery);
		const isPass = (att.score || 0) >= 75;
		const matchStatus = rekapStatusFilter === 'ALL' || (rekapStatusFilter === 'TUNTAS' ? isPass : !isPass);
		return matchClass && matchSearch && matchStatus;
	});

	// Filter diagnostic questions
	$: filteredDiagnostics = questionDiagnostics.filter((q: any) => {
		if (diagnosticFilter === 'critical') return q.wrongPercentage >= 50;
		if (diagnosticFilter === 'medium') return q.wrongPercentage >= 20 && q.wrongPercentage < 50;
		if (diagnosticFilter === 'mastered') return q.wrongPercentage < 20;
		return true;
	});

	function getWrongHeatColor(pct: number) {
		if (pct >= 60) return 'bg-rose-500 text-white font-bold';
		if (pct >= 40) return 'bg-rose-100 text-rose-800 font-semibold';
		if (pct >= 20) return 'bg-amber-100 text-amber-800 font-medium';
		return 'bg-emerald-50 text-emerald-700 font-normal';
	}

	function formatAnswerDisplay(type: string, val: any): string {
		if (val == null || val === '') return '-';

		let parsed = val;
		if (typeof val === 'string') {
			const trimmed = val.trim();
			if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
				try {
					parsed = JSON.parse(trimmed);
				} catch {
					parsed = trimmed;
				}
			} else {
				parsed = trimmed;
			}
		}

		if (Array.isArray(parsed)) {
			return parsed.map(item => String(item).trim().toUpperCase()).join(',');
		}

		if (typeof parsed === 'object' && parsed !== null) {
			return Object.entries(parsed).map(([k, v]) => `${k}:${v}`).join(',');
		}

		if (type === 'benar_salah') {
			const str = String(parsed).toLowerCase().trim();
			if (str === 'true' || str === 'benar' || str === 'b' || str === '1') return 'B';
			if (str === 'false' || str === 'salah' || str === 's' || str === '0') return 'S';
		}

		return String(parsed).trim().toUpperCase();
	}

	function toggleQuestionAccordion(id: number) {
		expandedQuestionId = expandedQuestionId === id ? null : id;
	}

	function toggleStudentRow(attemptId: number) {
		expandedStudentAttemptId = expandedStudentAttemptId === attemptId ? null : attemptId;
	}

	function marqueeAction(node: HTMLElement) {
		let anim: Animation | null = null;

		function updateMarquee() {
			if (anim) {
				anim.cancel();
				anim = null;
			}
			const parent = node.parentElement;
			if (!parent) return;
			const overflow = node.scrollWidth - parent.clientWidth;
			if (overflow > 4) {
				anim = node.animate(
					[
						{ transform: 'translateX(0px)', offset: 0 },
						{ transform: 'translateX(0px)', offset: 0.25 },
						{ transform: `translateX(-${overflow + 4}px)`, offset: 0.75 },
						{ transform: `translateX(-${overflow + 4}px)`, offset: 0.9 },
						{ transform: 'translateX(0px)', offset: 1.0 }
					],
					{
						duration: Math.max(4000, overflow * 50),
						iterations: Infinity,
						easing: 'ease-in-out'
					}
				);
			} else {
				node.style.transform = 'none';
			}
		}

		const timer = setTimeout(updateMarquee, 120);
		window.addEventListener('resize', updateMarquee);

		return {
			update() {
				setTimeout(updateMarquee, 60);
			},
			destroy() {
				clearTimeout(timer);
				window.removeEventListener('resize', updateMarquee);
				if (anim) anim.cancel();
			}
		};
	}
</script>

<svelte:head>
	<title>Analisis Jawaban Siswa — {exam.display_title || exam.title}</title>
</svelte:head>

<div class="space-y-4 sm:space-y-6 animate-in pb-12 px-1 sm:px-0">
	<!-- Top Bar -->
	<div class="flex items-center justify-between flex-wrap gap-2.5 sm:gap-3">
		<button type="button" on:click={() => history.back()} class="btn-ghost btn-sm text-xs sm:text-sm">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
			</svg>
			Kembali
		</button>

		<div class="flex items-center gap-2">
			<a
				href={`/api/export/jawaban-siswa/${exam.id}`}
				class="btn-sm btn-success shadow-md shadow-emerald-500/20 text-xs gap-1 sm:gap-1.5 px-2.5 sm:px-3"
				title="Download Rekap Jawaban Siswa (Excel .xlsx)"
			>
				<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
				</svg>
				<span class="hidden sm:inline">Export</span> Excel
			</a>

			<a
				href={`/print/jawaban-siswa/${exam.id}`}
				target="_blank"
				class="btn-sm btn-primary shadow-md shadow-indigo-500/20 text-xs gap-1 sm:gap-1.5 px-2.5 sm:px-3"
				title="Buka Lembar Cetak / Export PDF Resmi Analisis Jawaban"
			>
				<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
				</svg>
				Cetak / PDF
			</a>
		</div>
	</div>

	<!-- Header Card -->
	<div class="card p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
		<div class="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
		<div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-2 mb-1 flex-wrap">
					<span class="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] sm:text-xs font-semibold uppercase tracking-wider border border-indigo-400/20">
						Diagnosa Pola Jawaban
					</span>
					{#if exam.class_name}
						<span class="text-xs text-slate-300">· {exam.class_name}</span>
					{/if}
				</div>
				<h1 class="text-lg sm:text-2xl font-bold tracking-tight text-white break-words">{exam.display_title || exam.title}</h1>
				<p class="text-xs sm:text-sm text-slate-300 mt-1">
					Mata Pelajaran: <strong>{exam.subject_name || 'Umum'}</strong> · Total Soal: <strong>{questions.length} Butir</strong>
				</p>
			</div>

			<!-- Stats Grid Responsive -->
			<div class="w-full md:w-auto grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md p-2.5 sm:p-3 sm:px-5 rounded-2xl border border-white/10">
				<div class="text-center">
					<p class="text-[9px] sm:text-[11px] text-slate-300 uppercase font-bold tracking-wider">Peserta</p>
					<p class="text-base sm:text-2xl font-extrabold text-white">{totalAttempts}</p>
				</div>
				<div class="text-center border-x border-white/15 px-1 sm:px-3">
					<p class="text-[9px] sm:text-[11px] text-slate-300 uppercase font-bold tracking-wider">Rata-Rata</p>
					<p class="text-base sm:text-2xl font-extrabold text-amber-300">{avgScore}</p>
				</div>
				<div class="text-center">
					<p class="text-[9px] sm:text-[11px] text-slate-300 uppercase font-bold tracking-wider">Tuntas</p>
					<p class="text-base sm:text-2xl font-extrabold text-emerald-300">{passPercentage}%</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Top Insights Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-5">
		<!-- 🚨 Alert Box: Top Traps / Soal Paling Banyak Salah -->
		<div class="card p-4 sm:p-5 lg:col-span-2 border-l-4 border-l-rose-500 bg-rose-50/40 border-rose-200">
			<div class="flex items-center justify-between mb-2.5 flex-wrap gap-1">
				<h2 class="text-xs sm:text-sm font-bold text-rose-900 flex items-center gap-1.5 sm:gap-2">
					<svg class="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					🚨 Soal Paling Banyak Salah (Miskonsepsi Utama)
				</h2>
				<span class="text-[10px] sm:text-xs font-semibold text-rose-700 bg-rose-200/70 px-2 py-0.5 rounded-full">
					{topTraps.length} Prioritas
				</span>
			</div>

			{#if topTraps.length === 0 || totalAttempts === 0}
				<p class="text-xs text-slate-500 py-3">Belum ada data pengerjaan siswa yang dapat dianalisis.</p>
			{:else}
				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 mt-2">
					{#each topTraps.slice(0, 3) as trap}
						<div class="bg-white p-3 rounded-xl border border-rose-200 shadow-xs flex flex-col justify-between">
							<div>
								<div class="flex items-center justify-between mb-1">
									<span class="font-bold text-slate-800 text-xs sm:text-sm">Soal #{trap.question_number}</span>
									<span class="text-[10px] sm:text-xs font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
										{trap.wrongPercentage}% Salah
									</span>
								</div>
								<p class="text-xs text-slate-600 line-clamp-2 mb-2" title={trap.text}>
									{trap.text}
								</p>
							</div>

							<div class="text-[10px] sm:text-[11px] border-t border-slate-100 pt-1.5 space-y-1 bg-slate-50/80 -mx-3 -mb-3 p-2.5 rounded-b-xl">
								<div class="flex justify-between text-slate-600">
									<span>Kunci:</span>
									<strong class="text-emerald-700 font-bold">{trap.correctKey}</strong>
								</div>
								{#if trap.dominantDistractor !== '-'}
									<div class="flex justify-between text-slate-600">
										<span>Pengecoh:</span>
										<strong class="text-rose-600 font-bold">Opsi {trap.dominantDistractor} ({trap.dominantDistractorPct}%)</strong>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Akurasi per Tipe Soal -->
		<div class="card p-4 sm:p-5 bg-white border border-slate-200 flex flex-col justify-between">
			<h2 class="text-xs sm:text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5 sm:gap-2">
				<svg class="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
				</svg>
				Akurasi per Tipe Soal
			</h2>

			{#if accuracyByType.length === 0 || totalAttempts === 0}
				<p class="text-xs text-slate-400 py-4">Belum ada data akurasi.</p>
			{:else}
				<div class="space-y-2.5 sm:space-y-3">
					{#each accuracyByType as item}
						<div>
							<div class="flex justify-between text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">
								<span class="truncate pr-1">{QUESTION_TYPE_LABELS[item.type] || item.type} ({item.questionCount})</span>
								<span class={item.accuracy >= 70 ? 'text-emerald-600' : (item.accuracy >= 40 ? 'text-amber-600' : 'text-rose-600')}>
									{item.accuracy}%
								</span>
							</div>
							<div class="w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
								<div
									class="h-full rounded-full transition-all duration-500 {item.accuracy >= 70 ? 'bg-emerald-500' : (item.accuracy >= 40 ? 'bg-amber-500' : 'bg-rose-500')}"
									style="width: {item.accuracy}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
				<span>KKM:</span>
				<strong class="text-slate-800">75 Poin</strong>
			</div>
		</div>
	</div>

	<!-- Tab Navigation (3 Tabs) -->
	<div class="flex items-center justify-between border-b border-slate-200 pt-1 overflow-x-auto scrollbar-none">
		<div class="flex gap-1.5 sm:gap-2 whitespace-nowrap">
			<button
				type="button"
				class="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 sm:gap-2 {activeTab === 'matrix' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}"
				on:click={() => (activeTab = 'matrix')}
			>
				<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
				</svg>
				<span>🗺️ Matriks Jawaban</span>
			</button>

			<button
				type="button"
				class="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 sm:gap-2 {activeTab === 'diagnostics' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}"
				on:click={() => (activeTab = 'diagnostics')}
			>
				<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
				</svg>
				<span>🔍 Diagnosa per Soal</span>
			</button>

			<button
				type="button"
				class="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 sm:gap-2 {activeTab === 'rekap' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}"
				on:click={() => (activeTab = 'rekap')}
			>
				<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>📊 Rekap & Status Nilai</span>
			</button>
		</div>

		<div class="text-[11px] sm:text-xs text-slate-400 hidden sm:block whitespace-nowrap pl-2">
			{filteredAttempts.length} Siswa Terpilih
		</div>
	</div>

	<!-- TAB 1: MATRIKS JAWABAN SISWA -->
	{#if activeTab === 'matrix'}
		<div class="card overflow-hidden">
			<!-- Filters & Legend Responsive -->
			<div class="p-3 sm:p-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div class="flex items-center gap-2 sm:gap-3 flex-wrap">
					<!-- Filter Kelas -->
					{#if availableClasses.length > 0}
						<div class="flex items-center gap-1.5">
							<span class="text-[11px] sm:text-xs font-semibold text-slate-600">Kelas:</span>
							<select
								bind:value={selectedClass}
								class="select select-sm bg-white border border-slate-300 text-xs rounded-lg px-2 py-1 max-w-[130px] sm:max-w-none"
							>
								<option value="ALL">Semua ({attempts.length})</option>
								{#each availableClasses as c}
									<option value={c}>{c}</option>
								{/each}
							</select>
						</div>
					{/if}

					<!-- Search Siswa -->
					<div class="relative flex-1 sm:flex-initial min-w-[140px]">
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Cari siswa / NISN..."
							class="input input-sm pl-7 sm:pl-8 pr-2 text-xs w-full sm:w-56 rounded-lg bg-white border-slate-300"
						/>
						<svg class="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
				</div>

				<!-- Legend & Petunjuk Klik Kunci -->
				<div class="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-xs font-medium text-slate-600 flex-wrap">
					<span class="text-indigo-600 font-semibold hidden md:inline">💡 Klik baris siswa untuk melihat Kunci Jawaban</span>
					<div class="flex items-center gap-1">
						<span class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 text-[9px] sm:text-[10px] font-bold flex items-center justify-center">A</span>
						<span>Benar</span>
					</div>
					<div class="flex items-center gap-1">
						<span class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-rose-50 text-rose-700 border border-rose-300 text-[9px] sm:text-[10px] font-bold flex items-center justify-center">B</span>
						<span>Salah</span>
					</div>
					<div class="flex items-center gap-1">
						<span class="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-slate-100 text-slate-400 border border-slate-200 text-[9px] sm:text-[10px] font-bold flex items-center justify-center">-</span>
						<span>Kosong</span>
					</div>
				</div>
			</div>

			<!-- Matrix Table with Expandable Answer Key Row -->
			{#if filteredAttempts.length === 0}
				<div class="p-8 sm:p-12 text-center text-slate-400 text-xs sm:text-sm">
					Tidak ada data siswa yang cocok dengan filter.
				</div>
			{:else}
				<div class="overflow-x-auto max-h-[600px] relative touch-pan-x touch-pan-y" style="-webkit-overflow-scrolling: touch;">
					<table class="table min-w-full text-xs text-left border-collapse">
						<thead class="sticky top-0 z-20 bg-slate-100 text-slate-700 shadow-sm border-b border-slate-300">
							<tr>
								<th class="w-8 sm:w-10 text-center sticky left-0 z-30 bg-slate-100 border-r border-slate-300 px-1 py-2 text-[10px] sm:text-xs">No</th>
								<th class="w-32 sm:min-w-[170px] max-w-[135px] sm:max-w-none sticky left-8 sm:left-10 z-30 bg-slate-100 border-r border-slate-300 px-1.5 sm:px-2 py-2 text-[10px] sm:text-xs">
									Nama Siswa
								</th>
								<th class="w-14 sm:w-20 text-center border-r border-slate-300 px-1 py-2 text-[10px] sm:text-xs">Kelas</th>
								<th class="w-12 sm:w-16 text-center border-r border-slate-300 px-1 py-2 text-[10px] sm:text-xs">Nilai</th>
								{#each questions as q, idx}
									<th class="w-8 sm:w-11 min-w-[32px] sm:min-w-[40px] text-center border-r border-slate-200 px-0.5 sm:px-1 py-2 font-mono hover:bg-slate-200 cursor-pointer text-[10px] sm:text-xs whitespace-nowrap" title="Soal #{q.question_number} ({q.type})">
										S{q.question_number || idx + 1}
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each filteredAttempts as att, attIdx (att.id)}
								<!-- Student Row -->
								<tr 
									class="hover:bg-indigo-50/40 transition-colors border-b border-slate-100 cursor-pointer {expandedStudentAttemptId === att.id ? 'bg-indigo-50/60' : ''}"
									on:click={() => toggleStudentRow(att.id)}
									title="Klik untuk melihat Kunci Jawaban Resmi"
								>
									<td class="text-center font-bold text-slate-600 sticky left-0 z-10 bg-white border-r border-slate-200 px-1 py-1.5 text-[10px] sm:text-xs">
										<div class="flex items-center justify-center gap-0.5">
											<span>{attIdx + 1}</span>
											<svg class="w-2.5 h-2.5 text-slate-400 transition-transform {expandedStudentAttemptId === att.id ? 'rotate-180 text-indigo-600' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
											</svg>
										</div>
									</td>
									
									<!-- Student Name with Dynamic Marquee Action on mobile -->
									<td class="sticky left-8 sm:left-10 z-10 bg-white border-r border-slate-200 py-1.5 px-1.5 sm:px-2 max-w-[135px] sm:max-w-none">
										<div class="overflow-hidden max-w-[125px] sm:max-w-none">
											<span 
												use:marqueeAction
												class="font-semibold text-slate-800 text-[11px] sm:text-xs whitespace-nowrap inline-block"
												title={att.student_name}
											>
												{att.student_name}
											</span>
										</div>
										<p class="text-[9px] sm:text-[10px] text-slate-400 font-mono truncate">{att.nisn || att.username}</p>
									</td>

									<td class="text-center text-slate-600 border-r border-slate-200 px-1 py-1.5 text-[10px] sm:text-xs whitespace-nowrap">{att.class_name || '-'}</td>
									<td class="text-center font-bold border-r border-slate-200 px-1 py-1.5 text-[10px] sm:text-xs {att.score >= 75 ? 'text-emerald-600' : 'text-rose-600'}">
										{att.score != null ? att.score : 0}
									</td>

									<!-- Answer cells per question -->
									{#each questions as q}
										{@const ans = answerMatrixMap[`${att.id}_${q.id}`]}
										{@const displayAns = formatAnswerDisplay(q.type, ans?.answer_given)}
										{#if !ans || ans.answer_given == null || ans.answer_given === ''}
											<td class="text-center p-0.5 sm:p-1 border-r border-slate-100 bg-slate-50 text-slate-400 text-[9px] sm:text-[10px] min-w-[32px] sm:min-w-[40px] whitespace-nowrap" title="Tidak Menjawab">
												-
											</td>
										{:else if ans.is_correct === 1 || ans.is_correct === true}
											<td class="text-center p-0.5 sm:p-1 border-r border-slate-100 bg-emerald-50 text-emerald-700 font-bold text-[10px] sm:text-[11px] min-w-[32px] sm:min-w-[40px] whitespace-nowrap" title="Benar: {ans.answer_given}">
												{displayAns}
											</td>
										{:else}
											<td class="text-center p-0.5 sm:p-1 border-r border-slate-100 bg-rose-50 text-rose-700 font-bold text-[9px] sm:text-[10px] min-w-[32px] sm:min-w-[40px] whitespace-nowrap" title="Salah (Siswa: {ans.answer_given})">
												{displayAns}
											</td>
										{/if}
									{/each}
								</tr>

								<!-- Expandable Dropdown Row: Kunci Jawaban Resmi -->
								{#if expandedStudentAttemptId === att.id}
									<tr class="bg-indigo-50/90 border-b-2 border-indigo-300 animate-in fade-in">
										<td class="sticky left-0 z-10 bg-indigo-100 border-r border-indigo-200 text-center py-1 font-bold text-[9px] text-indigo-700">
											KUNCI
										</td>
										<td class="sticky left-8 sm:left-10 z-10 bg-indigo-100 border-r border-indigo-200 py-1 px-1.5 sm:px-2 max-w-[135px] sm:max-w-none">
											<div class="flex items-center gap-1 font-bold text-indigo-900 text-[10px] sm:text-xs whitespace-nowrap overflow-hidden text-ellipsis">
												<span>🔑</span>
												<span>Kunci Resmi</span>
											</div>
										</td>
										<td class="text-center border-r border-indigo-200 bg-indigo-50/90 py-1 text-indigo-300 font-mono text-[10px]">-</td>
										<td class="text-center border-r border-indigo-200 bg-indigo-50/90 py-1 text-indigo-300 font-mono text-[10px]">-</td>
										{#each questions as q}
											{@const diag = questionDiagnostics.find(d => d.id === q.id)}
											<td class="text-center p-0.5 sm:p-1 border-r border-indigo-200 bg-indigo-50/80 font-bold text-indigo-900 text-[10px] sm:text-[11px] min-w-[32px] sm:min-w-[40px] whitespace-nowrap" title="Kunci Soal #{q.question_number}: {diag?.correctKey || '-'}">
												{diag?.correctKey || '-'}
											</td>
										{/each}
									</tr>
								{/if}
							{/each}
						</tbody>

						<!-- Summary Footer Row: Tingkat Kesalahan (%) per Soal -->
						<tfoot class="sticky bottom-0 z-20 bg-slate-900 text-white font-bold text-[10px] sm:text-xs shadow-lg">
							<tr>
								<td class="py-2 sm:py-2.5 px-1 sticky left-0 z-30 bg-slate-900 text-center border-r border-slate-700 text-slate-500">
									#
								</td>
								<td class="py-2 sm:py-2.5 px-1.5 sm:px-2 sticky left-8 sm:left-10 z-30 bg-slate-900 text-left tracking-wider uppercase border-r border-slate-700 whitespace-nowrap text-[10px] sm:text-xs max-w-[135px] sm:max-w-none">
									% SALAH
								</td>
								<td class="text-center py-2 px-1 border-r border-slate-700 bg-slate-900 text-slate-500">-</td>
								<td class="text-center py-2 px-1 border-r border-slate-700 bg-slate-900 text-slate-500">-</td>
								{#each questionDiagnostics as q}
									<td class="text-center py-1.5 sm:py-2 px-0.5 sm:px-1 border-r border-slate-700 {getWrongHeatColor(q.wrongPercentage)}" title="Soal #{q.question_number}: {q.wrongPercentage}% salah">
										{q.wrongPercentage}%
									</td>
								{/each}
							</tr>
						</tfoot>
					</table>
				</div>
			{/if}
		</div>
	{/if}

	<!-- TAB 2: DIAGNOSA MISKONSEPSI PER BUTIR SOAL -->
	{#if activeTab === 'diagnostics'}
		<div class="space-y-3.5 sm:space-y-4">
			<!-- Diagnostic Filter Bar Responsive -->
			<div class="card p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 bg-white">
				<div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
					<span class="text-[11px] sm:text-xs font-semibold text-slate-600">Filter:</span>
					<div class="flex gap-1 flex-wrap">
						<button
							type="button"
							class="px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all {diagnosticFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
							on:click={() => (diagnosticFilter = 'all')}
						>
							Semua ({questionDiagnostics.length})
						</button>
						<button
							type="button"
							class="px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all {diagnosticFilter === 'critical' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}"
							on:click={() => (diagnosticFilter = 'critical')}
						>
							🚨 Kritis (&gt;50%) ({questionDiagnostics.filter(q => q.wrongPercentage >= 50).length})
						</button>
						<button
							type="button"
							class="px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all {diagnosticFilter === 'medium' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}"
							on:click={() => (diagnosticFilter = 'medium')}
						>
							Sedang ({questionDiagnostics.filter(q => q.wrongPercentage >= 20 && q.wrongPercentage < 50).length})
						</button>
						<button
							type="button"
							class="px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all {diagnosticFilter === 'mastered' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}"
							on:click={() => (diagnosticFilter = 'mastered')}
						>
							Dikuasai ({questionDiagnostics.filter(q => q.wrongPercentage < 20).length})
						</button>
					</div>
				</div>

				<p class="text-[11px] sm:text-xs text-slate-400">
					Menampilkan {filteredDiagnostics.length} dari {questionDiagnostics.length} Butir Soal
				</p>
			</div>

			<!-- Question Cards List with Keyed Loop -->
			{#if filteredDiagnostics.length === 0}
				<div class="card p-8 sm:p-12 text-center text-slate-400 text-xs sm:text-sm">
					Tidak ada soal yang memenuhi kriteria filter ini.
				</div>
			{:else}
				<div class="space-y-3">
					{#each filteredDiagnostics as q (q.id)}
						<div class="card overflow-hidden border transition-all duration-200 {q.wrongPercentage >= 50 ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200 bg-white'}">
							<div class="p-3.5 sm:p-5 flex flex-col md:flex-row items-start justify-between gap-3.5 sm:gap-4">
								<div class="flex-1 min-w-0 w-full">
									<div class="flex items-center gap-2 mb-2 flex-wrap">
										<span class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
											#{q.question_number}
										</span>
										<span class="text-[10px] sm:text-xs badge-info">{QUESTION_TYPE_LABELS[q.type] || q.type}</span>
										<span class="text-[10px] sm:text-xs text-slate-400 font-semibold">{q.points} Poin</span>

										<!-- Status Badge -->
										{#if q.wrongPercentage >= 50}
											<span class="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
												<span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
												Tinggi ({q.wrongPercentage}% Salah)
											</span>
										{:else if q.wrongPercentage >= 20}
											<span class="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
												Sedang ({q.wrongPercentage}% Salah)
											</span>
										{:else}
											<span class="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
												Dikuasai ({q.correctPercentage}% Benar)
											</span>
										{/if}
									</div>

									<!-- Question Text -->
									<div 
										class="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium mb-3 prose prose-sm max-w-none overflow-x-auto"
										use:mathRender={q.raw_text} 
										use:arabicRender={q.raw_text}
									>
										{@html q.raw_text}
									</div>

									<!-- Key vs Traps Breakdown -->
									<div class="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px] sm:text-xs bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200/80">
										<div>
											<span class="text-slate-500">Kunci:</span>
											<span class="ml-1 font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">{q.correctKey}</span>
										</div>

										{#if q.dominantDistractor !== '-'}
											<div>
												<span class="text-slate-500">Pengecoh Jebakan:</span>
												<span class="ml-1 font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
													Opsi {q.dominantDistractor} ({q.dominantDistractorCount} / {q.dominantDistractorPct}%)
												</span>
											</div>
										{/if}

										<div>
											<span class="text-slate-500">Benar:</span>
											<strong class="ml-1 text-slate-700">{q.correctCount} / {totalAttempts}</strong>
										</div>
									</div>

									<!-- Option Distribution Bars (For Multiple Choice) -->
									{#if Object.keys(q.distribution).length > 0}
										<div class="mt-2.5 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs flex-wrap">
											<span class="text-slate-500 font-semibold text-[10px] sm:text-[11px]">Opsi:</span>
											{#each ['A', 'B', 'C', 'D', 'E'] as opt}
												{@const count = q.distribution[opt] || 0}
												{@const isKey = q.correctKey === opt}
												{@const pct = totalAttempts > 0 ? Math.round((count / totalAttempts) * 100) : 0}
												<div class="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border {isKey ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'}">
													<strong class="font-mono">{opt}:</strong>
													<span>{count} ({pct}%)</span>
												</div>
											{/each}
										</div>
									{/if}
								</div>

								<!-- Button to Toggle Wrong Students List -->
								<div class="shrink-0 flex md:flex-col items-end gap-2 w-full md:w-auto mt-2 md:mt-0">
									<button
										type="button"
										class="btn-sm btn-outline text-xs gap-1.5 w-full md:w-auto justify-center"
										on:click={() => toggleQuestionAccordion(q.id)}
									>
										<svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
											<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
										</svg>
										{expandedQuestionId === q.id ? 'Tutup' : `Siswa Salah (${q.wrongStudents.length})`}
									</button>
								</div>
							</div>

							<!-- Accordion: List of Students who answered wrong on this question -->
							{#if expandedQuestionId === q.id}
								<div class="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 animate-in fade-in">
									<h3 class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
										Daftar Siswa yang Keliru pada Soal #{q.question_number}
									</h3>
									{#if q.wrongStudents.length === 0}
										<p class="text-xs text-emerald-600 font-semibold">Luar biasa! Seluruh siswa menjawab benar pada butir soal ini.</p>
									{:else}
										<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
											{#each q.wrongStudents as s}
												<div class="p-2 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center shadow-xs">
													<div class="min-w-0 pr-2">
														<p class="font-semibold text-slate-800 truncate text-[11px] sm:text-xs">{s.student_name}</p>
														<p class="text-[9px] sm:text-[10px] text-slate-400">{s.class_name}</p>
													</div>
													<span class="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
														{s.answer_given}
													</span>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- TAB 3: REKAP & STATUS NILAI SISWA -->
	{#if activeTab === 'rekap'}
		<div class="space-y-4">
			<!-- Rekap Summary Cards -->
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<div class="card p-3.5 bg-white border border-slate-200 text-center">
					<p class="text-[10px] sm:text-xs text-slate-500 uppercase font-semibold">Total Peserta</p>
					<p class="text-lg sm:text-2xl font-bold text-slate-800 mt-0.5">{filteredAttempts.length}</p>
				</div>
				<div class="card p-3.5 bg-emerald-50/70 border border-emerald-200 text-center">
					<p class="text-[10px] sm:text-xs text-emerald-700 uppercase font-semibold">Tuntas (&ge;75)</p>
					<p class="text-lg sm:text-2xl font-bold text-emerald-700 mt-0.5">
						{filteredAttempts.filter(a => (a.score || 0) >= 75).length} Siswa
					</p>
				</div>
				<div class="card p-3.5 bg-rose-50/70 border border-rose-200 text-center">
					<p class="text-[10px] sm:text-xs text-rose-700 uppercase font-semibold">Remedial (&lt;75)</p>
					<p class="text-lg sm:text-2xl font-bold text-rose-700 mt-0.5">
						{filteredAttempts.filter(a => (a.score || 0) < 75).length} Siswa
					</p>
				</div>
				<div class="card p-3.5 bg-indigo-50/70 border border-indigo-200 text-center">
					<p class="text-[10px] sm:text-xs text-indigo-700 uppercase font-semibold">Rata-Rata Nilai</p>
					<p class="text-lg sm:text-2xl font-bold text-indigo-700 mt-0.5">{avgScore}</p>
				</div>
			</div>

			<!-- Filters Bar -->
			<div class="card p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
				<div class="flex items-center gap-2 sm:gap-3 flex-wrap">
					<!-- Filter Status -->
					<div class="flex items-center gap-1.5">
						<span class="text-[11px] sm:text-xs font-semibold text-slate-600">Status:</span>
						<div class="flex gap-1">
							<button
								type="button"
								class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all {rekapStatusFilter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}"
								on:click={() => (rekapStatusFilter = 'ALL')}
							>
								Semua
							</button>
							<button
								type="button"
								class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all {rekapStatusFilter === 'TUNTAS' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}"
								on:click={() => (rekapStatusFilter = 'TUNTAS')}
							>
								Tuntas
							</button>
							<button
								type="button"
								class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all {rekapStatusFilter === 'REMEDIAL' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}"
								on:click={() => (rekapStatusFilter = 'REMEDIAL')}
							>
								Remedial
							</button>
						</div>
					</div>

					<!-- Filter Kelas -->
					{#if availableClasses.length > 0}
						<div class="flex items-center gap-1.5">
							<span class="text-[11px] sm:text-xs font-semibold text-slate-600">Kelas:</span>
							<select
								bind:value={selectedClass}
								class="select select-sm bg-white border border-slate-300 text-xs rounded-lg px-2 py-1 max-w-[130px] sm:max-w-none"
							>
								<option value="ALL">Semua Kelas</option>
								{#each availableClasses as c}
									<option value={c}>{c}</option>
								{/each}
							</select>
						</div>
					{/if}

					<!-- Search Siswa -->
					<div class="relative min-w-[140px]">
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Cari siswa..."
							class="input input-sm pl-7 pr-2 text-xs w-full sm:w-48 rounded-lg bg-white border-slate-300"
						/>
						<svg class="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
				</div>

				<p class="text-[11px] sm:text-xs text-slate-400">
					{filteredAttempts.length} Siswa
				</p>
			</div>

			<!-- Rekapitulasi Table -->
			{#if filteredAttempts.length === 0}
				<div class="card p-8 sm:p-12 text-center text-slate-400 text-xs sm:text-sm">
					Tidak ada data siswa yang cocok dengan kriteria filter.
				</div>
			{:else}
				<div class="card overflow-hidden">
					<div class="overflow-x-auto">
						<table class="table min-w-full text-xs text-left border-collapse">
							<thead class="bg-slate-100 text-slate-700 border-b border-slate-200">
								<tr>
									<th class="w-12 text-center py-2.5 px-2">Peringkat</th>
									<th class="py-2.5 px-3">Nama Siswa</th>
									<th class="w-24 text-center py-2.5 px-2">Kelas</th>
									<th class="w-28 text-center py-2.5 px-2">Skor Ujian</th>
									<th class="w-32 text-center py-2.5 px-2 whitespace-nowrap">Status</th>
									<th class="w-24 text-center py-2.5 px-2">Aksi</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-100">
								{#each filteredAttempts as att, idx (att.id)}
									<tr class="hover:bg-slate-50 transition-colors">
										<td class="text-center font-bold text-slate-500 py-2.5 px-2">
											{#if idx === 0}
												<span class="badge-warning font-bold">🥇 1</span>
											{:else if idx === 1}
												<span class="badge-neutral font-bold">🥈 2</span>
											{:else if idx === 2}
												<span class="badge-neutral font-bold">🥉 3</span>
											{:else}
												<span>{idx + 1}</span>
											{/if}
										</td>
										<td class="py-2.5 px-3">
											<p class="font-semibold text-slate-800">{att.student_name}</p>
											<p class="text-[10px] text-slate-400 font-mono">{att.nisn || att.username}</p>
										</td>
										<td class="text-center text-slate-600 py-2.5 px-2">{att.class_name || '-'}</td>
										<td class="text-center py-2.5 px-2 font-bold text-sm {(att.score || 0) >= 75 ? 'text-emerald-600' : 'text-rose-600'}">
											{att.score != null ? att.score : 0}
										</td>
										<td class="text-center py-2.5 px-2 whitespace-nowrap">
											{#if (att.score || 0) >= 75}
												<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap inline-flex items-center gap-1">
													✓ Tuntas
												</span>
											{:else}
												<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 whitespace-nowrap inline-flex items-center gap-1">
													⚠ Remedial
												</span>
											{/if}
										</td>
										<td class="text-center py-2.5 px-2">
											<a
												href={`/guru/results/${att.id}`}
												class="btn-xs btn-outline text-indigo-600 hover:bg-indigo-50"
												title="Lihat Detail Lembar Jawaban Siswa"
											>
												Detail
											</a>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
