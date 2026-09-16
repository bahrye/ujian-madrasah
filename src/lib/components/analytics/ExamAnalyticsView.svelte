<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { mathRender } from '$lib/actions/mathRender';
	import { toasts } from '$lib/stores/toast';
	import type { ExamAnalytics, ItemAnalysisResult } from '$lib/server/analytics';

	export let analytics: ExamAnalytics | null = null;
	export let exams: { id: number; title: string; class_name?: string; subject_name?: string; exam_type_code?: string }[] = [];
	export let selectedExamId: number | null = null;
	export let role: 'admin' | 'guru' | 'panitia' | 'superadmin' = 'admin';

	// Tab management
	let activeTab: 'hasil' | 'butir' | 'lainnya' | 'rekap' = 'hasil';

	// Dynamic KKM
	let kkm = analytics?.kkm ?? 75;
	let kkmInputValue = kkm;

	function handleKkmChange() {
		const parsed = Number(kkmInputValue);
		if (isNaN(parsed) || parsed < 0 || parsed > 100) {
			toasts.error('Nilai KKM harus antara 0 sampai 100');
			kkmInputValue = kkm;
			return;
		}
		const url = new URL($page.url);
		url.searchParams.set('kkm', String(parsed));
		goto(url.toString(), { keepFocus: true, noScroll: true });
	}

	function handleExamSelect(examId: number) {
		const url = new URL($page.url);
		url.searchParams.set('exam_id', String(examId));
		goto(url.toString());
	}

	// Item Analysis Filter
	let itemSearch = '';
	let itemDifficultyFilter = 'all';
	let itemStatusFilter = 'all';
	let itemTypeFilter = 'all';

	$: filteredItems = (analytics?.itemAnalysis.items || []).filter((item) => {
		const matchSearch =
			!itemSearch ||
			item.plain_text.toLowerCase().includes(itemSearch.toLowerCase()) ||
			String(item.question_number).includes(itemSearch);
		const matchDiff = itemDifficultyFilter === 'all' || item.pCategory === itemDifficultyFilter;
		const matchStatus = itemStatusFilter === 'all' || item.status === itemStatusFilter;
		const matchType = itemTypeFilter === 'all' || item.type === itemTypeFilter;
		return matchSearch && matchDiff && matchStatus && matchType;
	});

	// Roster Filter
	let rosterSearch = '';
	let rosterClassFilter = 'all';
	let rosterStatusFilter = 'all';

	$: filteredRoster = (analytics?.studentRoster || []).filter((s) => {
		const matchSearch =
			!rosterSearch ||
			s.studentName.toLowerCase().includes(rosterSearch.toLowerCase()) ||
			s.nisn.toLowerCase().includes(rosterSearch.toLowerCase()) ||
			s.nomorPeserta.toLowerCase().includes(rosterSearch.toLowerCase());
		const matchClass = rosterClassFilter === 'all' || s.className === rosterClassFilter;
		const matchStatus =
			rosterStatusFilter === 'all' ||
			(rosterStatusFilter === 'passed' && s.isPassed) ||
			(rosterStatusFilter === 'failed' && !s.isPassed);
		return matchSearch && matchClass && matchStatus;
	});

	$: availableClasses = Array.from(
		new Set((analytics?.studentRoster || []).map((s) => s.className).filter(Boolean))
	);

	// Modal detail item
	let selectedItemModal: ItemAnalysisResult | null = null;

	let isExporting = false;
	async function handleExportExcel() {
		if (!selectedExamId) return;
		isExporting = true;
		try {
			const res = await fetch(`/api/export-analytics/${selectedExamId}?kkm=${kkm}`);
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error || 'Gagal mengekspor laporan');
			}
			const blob = await res.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = downloadUrl;
			a.download = `Analisis_Ujian_${analytics?.exam.title.replace(/[^a-zA-Z0-9]/g, '_') || 'Hasil'}.xlsx`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(downloadUrl);
			a.remove();
			toasts.success('Laporan analisis Excel berhasil diunduh!');
		} catch (e: any) {
			toasts.error(e.message || 'Terjadi kesalahan saat mengunduh Excel.');
		} finally {
			isExporting = false;
		}
	}
</script>

<div class="space-y-6 animate-in">
	<!-- Top Bar: Selector & Header -->
	<div class="card p-5 bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 border-slate-200 shadow-sm">
		<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
			<div>
				<div class="flex items-center gap-2 mb-1">
					<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
						<svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
						Evaluasi Pembelajaran & CBT
					</span>
					<span class="text-xs text-slate-400 font-medium">Standard Kemendikbud & Kemenag</span>
				</div>
				<h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">
					Laporan & Analisis Ujian
				</h1>
				<p class="text-xs sm:text-sm text-slate-500 mt-0.5">
					Analisis komprehensif hasil evaluasi, psikometri butir soal (anates), reliabilitas instrumen, dan ketuntasan belajar
				</p>
			</div>

			<!-- Select Exam & KKM Controls -->
			<div class="flex flex-wrap items-center gap-2 sm:gap-3">
				<!-- Exam Selector -->
				<div class="min-w-[240px] sm:min-w-[280px]">
					<select
						class="select w-full font-medium text-xs sm:text-sm border-slate-300 shadow-xs focus:ring-indigo-500"
						value={selectedExamId || ''}
						on:change={(e) => handleExamSelect(Number(e.currentTarget.value))}
					>
						<option value="" disabled>-- Pilih Ujian untuk Dianalisis --</option>
						{#each exams as ex}
							<option value={ex.id}>
								{ex.title} {ex.class_name ? `(${ex.class_name})` : ''}
							</option>
						{/each}
					</select>
				</div>

				<!-- KKM Control -->
				{#if analytics}
					<div class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-xs">
						<span class="text-xs font-bold text-slate-600">KKM:</span>
						<input
							type="number"
							min="0"
							max="100"
							class="w-14 text-center font-bold text-xs sm:text-sm py-1 px-1 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
							bind:value={kkmInputValue}
							on:blur={handleKkmChange}
							on:keydown={(e) => e.key === 'Enter' && handleKkmChange()}
							title="Tekan Enter untuk menerapkan KKM baru"
						/>
					</div>
				{/if}

				<!-- Export & Print Actions -->
				{#if selectedExamId && analytics}
					<div class="flex items-center gap-2">
						<button
							type="button"
							class="btn btn-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5"
							on:click={handleExportExcel}
							disabled={isExporting}
							title="Unduh rekap nilai & analisis butir soal dalam format Excel"
						>
							{#if isExporting}
								<span class="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
							{:else}
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
								</svg>
							{/if}
							<span>Ekspor Excel</span>
						</button>

						<a
							href="/print/analisis/{selectedExamId}"
							target="_blank"
							class="btn btn-sm btn-secondary flex items-center gap-1.5"
							title="Buka lembar cetak analisis butir soal resmi"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
							</svg>
							<span>Cetak Butir Soal</span>
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>

	{#if !analytics}
		<!-- Empty State when no exam selected or no data -->
		<div class="card p-12 text-center bg-white border-slate-200">
			<div class="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
			</div>
			<h3 class="text-lg font-bold text-slate-800">Pilih Ujian untuk Melihat Laporan & Analisis</h3>
			<p class="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
				Pilih salah satu jadwal ujian pada menu pilihan di atas untuk meninjau statistik evaluasi, analisis butir soal, daya pembeda, serta rekap ketuntasan siswa.
			</p>
			{#if exams.length > 0}
				<button
					type="button"
					class="btn btn-primary text-xs"
					on:click={() => handleExamSelect(exams[0].id)}
				>
					Buka Ujian Terkini: {exams[0].title}
				</button>
			{/if}
		</div>
	{:else}
		<!-- Executive Summary Metrics Cards -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<!-- Metric 1: Kehadiran & Partisipasi -->
			<div class="card p-5 border-slate-200/80 bg-white hover:border-indigo-300 transition-all shadow-xs relative overflow-hidden group">
				<div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Partisipasi Peserta</span>
					<span class="p-2 rounded-xl bg-indigo-50 text-indigo-600">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</span>
				</div>
				<div class="mt-3 flex items-baseline gap-2">
					<span class="text-3xl font-black text-slate-800">{analytics.summary.completedCount}</span>
					<span class="text-xs font-semibold text-slate-400">/ {analytics.summary.totalParticipants} Peserta</span>
				</div>
				<div class="mt-3">
					<div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
						<div class="bg-indigo-600 h-2 rounded-full transition-all duration-500" style="width: {analytics.summary.attendanceRate}%"></div>
					</div>
					<div class="flex justify-between text-[11px] font-semibold text-slate-500 mt-1.5">
						<span>Tingkat Kehadiran</span>
						<span class="text-indigo-600 font-bold">{analytics.summary.attendanceRate}%</span>
					</div>
				</div>
			</div>

			<!-- Metric 2: Rata-rata & Range Nilai -->
			<div class="card p-5 border-slate-200/80 bg-white hover:border-cyan-300 transition-all shadow-xs relative overflow-hidden group">
				<div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-50 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Statistik Nilai</span>
					<span class="p-2 rounded-xl bg-cyan-50 text-cyan-600">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
						</svg>
					</span>
				</div>
				<div class="mt-3 flex items-baseline gap-2">
					<span class="text-3xl font-black text-slate-800">{analytics.summary.meanScore}</span>
					<span class="text-xs font-bold text-slate-400">Rata-rata (Mean)</span>
				</div>
				<div class="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 font-medium">
					<div class="text-emerald-700">
						<span class="text-[10px] text-slate-400 block font-semibold">TERTINGGI</span>
						<span class="font-bold">{analytics.summary.maxScore}</span>
					</div>
					<div class="text-rose-600">
						<span class="text-[10px] text-slate-400 block font-semibold">TERENDAH</span>
						<span class="font-bold">{analytics.summary.minScore}</span>
					</div>
					<div class="text-slate-600">
						<span class="text-[10px] text-slate-400 block font-semibold">DEV. BAKU (SD)</span>
						<span class="font-bold">{analytics.summary.standardDeviation}</span>
					</div>
				</div>
			</div>

			<!-- Metric 3: Ketuntasan Belajar Klasikal -->
			<div class="card p-5 border-slate-200/80 bg-white hover:border-emerald-300 transition-all shadow-xs relative overflow-hidden group">
				<div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Ketuntasan Klasikal</span>
					<span class="p-2 rounded-xl bg-emerald-50 text-emerald-600">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</span>
				</div>
				<div class="mt-3 flex items-baseline gap-2">
					<span class="text-3xl font-black {analytics.summary.isClassicalMastered ? 'text-emerald-600' : 'text-amber-600'}">
						{analytics.summary.passRate}%
					</span>
					<span class="badge {analytics.summary.isClassicalMastered ? 'badge-success' : 'badge-warning'} text-[10px] px-2 py-0.5">
						{analytics.summary.isClassicalMastered ? 'Tuntas Klasikal' : 'Belum Tuntas'}
					</span>
				</div>
				<div class="mt-3">
					<div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
						<div class="bg-emerald-500 h-2 transition-all duration-500" style="width: {analytics.summary.passRate}%"></div>
						<div class="bg-rose-400 h-2 transition-all duration-500" style="width: {100 - analytics.summary.passRate}%"></div>
					</div>
					<div class="flex justify-between text-[11px] font-semibold text-slate-500 mt-1.5">
						<span class="text-emerald-600">Tuntas: {analytics.summary.passedCount}</span>
						<span class="text-rose-500">Remedial: {analytics.summary.failedCount}</span>
					</div>
				</div>
			</div>

			<!-- Metric 4: Kualitas Soal & Reliabilitas -->
			<div class="card p-5 border-slate-200/80 bg-white hover:border-violet-300 transition-all shadow-xs relative overflow-hidden group">
				<div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-50 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Reliabilitas Tes</span>
					<span class="p-2 rounded-xl bg-violet-50 text-violet-600">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
					</span>
				</div>
				<div class="mt-3 flex items-baseline gap-2">
					<span class="text-3xl font-black text-violet-700">r₁₁ = {analytics.summary.cronbachAlpha}</span>
				</div>
				<div class="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
					<span class="font-bold text-slate-600 truncate mr-2" title={analytics.summary.reliabilityCategory}>
						{analytics.summary.reliabilityCategory.split(' ')[0]}
					</span>
					<div class="flex items-center gap-1.5 font-bold">
						<span class="text-emerald-600" title="Soal Diterima">{analytics.itemAnalysis.summary.acceptedCount} Baik</span>
						<span class="text-slate-300">•</span>
						<span class="text-amber-600" title="Soal Perlu Revisi">{analytics.itemAnalysis.summary.reviseCount} Rev</span>
						<span class="text-slate-300">•</span>
						<span class="text-rose-500" title="Soal Ditolak">{analytics.itemAnalysis.summary.rejectedCount} Tolak</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Tab Navigation -->
		<div class="border-b border-slate-200">
			<nav class="flex space-x-2 sm:space-x-4 overflow-x-auto pb-1" aria-label="Tabs">
				<button
					type="button"
					class="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap {activeTab === 'hasil' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}"
					on:click={() => (activeTab = 'hasil')}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					1. Hasil Ujian & Statistik
				</button>

				<button
					type="button"
					class="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap {activeTab === 'butir' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}"
					on:click={() => (activeTab = 'butir')}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
					</svg>
					2. Analisis Butir Soal (Anates)
					<span class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-700">
						{analytics.itemAnalysis.summary.totalQuestions} Soal
					</span>
				</button>

				<button
					type="button"
					class="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap {activeTab === 'lainnya' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}"
					on:click={() => (activeTab = 'lainnya')}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
					3. Analisis Lainnya & Remedial
				</button>

				<button
					type="button"
					class="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap {activeTab === 'rekap' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'}"
					on:click={() => (activeTab = 'rekap')}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
					4. Rekapitulasi Nilai Siswa
					<span class="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
						{analytics.studentRoster.length}
					</span>
				</button>
			</nav>
		</div>

		<!-- TAB 1: HASIL UJIAN & STATISTIK -->
		{#if activeTab === 'hasil'}
			<div class="space-y-6 animate-in">
				<!-- Histogram Distribusi Frekuensi Nilai -->
				<div class="card p-6 bg-white border-slate-200 shadow-xs">
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
						<div>
							<h3 class="text-base font-bold text-slate-900">Distribusi Frekuensi Nilai Ujian</h3>
							<p class="text-xs text-slate-500">Rentang sebaran perolehan nilai siswa dari total {analytics.summary.completedCount} peserta ujian</p>
						</div>
						<div class="flex items-center gap-3 text-xs font-semibold">
							<span class="inline-flex items-center gap-1 text-slate-500">
								<span class="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Rendah
							</span>
							<span class="inline-flex items-center gap-1 text-slate-500">
								<span class="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Cukup
							</span>
							<span class="inline-flex items-center gap-1 text-slate-500">
								<span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Baik & Tinggi
							</span>
						</div>
					</div>

					<!-- Visual Bar Chart -->
					<div class="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 sm:h-56 pt-6 pb-2 border-b border-slate-200">
						{#each analytics.frequencyDistribution as dist}
							{@const maxPct = Math.max(...analytics.frequencyDistribution.map((d) => d.percentage), 1)}
							{@const barHeight = Math.max(8, Math.round((dist.percentage / maxPct) * 100))}
							<div class="flex flex-col items-center h-full justify-end group relative">
								<!-- Tooltip on hover -->
								<div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg pointer-events-none z-10 whitespace-nowrap">
									{dist.count} Siswa ({dist.percentage}%)
								</div>

								<!-- Bar count above -->
								<span class="text-[11px] font-bold text-slate-600 mb-1.5">{dist.count}</span>

								<!-- Bar fill -->
								<div
									class="w-full rounded-t-xl transition-all duration-500 hover:brightness-110 shadow-xs cursor-pointer"
									style="height: {barHeight}%; background-color: {dist.color};"
								></div>
							</div>
						{/each}
					</div>

					<!-- Labels under bars -->
					<div class="grid grid-cols-6 gap-2 sm:gap-4 mt-2 text-center">
						{#each analytics.frequencyDistribution as dist}
							<div>
								<span class="block text-xs font-bold text-slate-800">{dist.label}</span>
								<span class="text-[10px] text-slate-400 font-medium hidden sm:block">{dist.category}</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Two Columns: Descriptive Stats & Top/Bottom Students -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<!-- Table of Descriptive Statistics -->
					<div class="card p-6 bg-white border-slate-200 shadow-xs">
						<h3 class="text-base font-bold text-slate-900 mb-1">Parameter Statistik Deskriptif</h3>
						<p class="text-xs text-slate-500 mb-4">Pengukuran tendensi sentral dan dispersi hasil asesmen</p>

						<div class="table-container border border-slate-100">
							<table class="table text-xs">
								<tbody>
									<tr class="border-b border-slate-100">
										<td class="font-semibold text-slate-600 w-1/2">Jumlah Peserta Teruji (N)</td>
										<td class="font-bold text-slate-800 text-right">{analytics.summary.completedCount} Siswa</td>
									</tr>
									<tr class="border-b border-slate-100 bg-slate-50/50">
										<td class="font-semibold text-slate-600">Rata-rata Hitung (Mean)</td>
										<td class="font-bold text-indigo-600 text-right text-sm">{analytics.summary.meanScore}</td>
									</tr>
									<tr class="border-b border-slate-100">
										<td class="font-semibold text-slate-600">Median (Nilai Tengah)</td>
										<td class="font-bold text-slate-800 text-right">{analytics.summary.medianScore}</td>
									</tr>
									<tr class="border-b border-slate-100 bg-slate-50/50">
										<td class="font-semibold text-slate-600">Modus (Nilai Terbanyak)</td>
										<td class="font-bold text-slate-800 text-right">{analytics.summary.modeScore.join(', ')}</td>
									</tr>
									<tr class="border-b border-slate-100">
										<td class="font-semibold text-slate-600">Nilai Tertinggi (Max)</td>
										<td class="font-bold text-emerald-600 text-right">{analytics.summary.maxScore}</td>
									</tr>
									<tr class="border-b border-slate-100 bg-slate-50/50">
										<td class="font-semibold text-slate-600">Nilai Terendah (Min)</td>
										<td class="font-bold text-rose-600 text-right">{analytics.summary.minScore}</td>
									</tr>
									<tr class="border-b border-slate-100">
										<td class="font-semibold text-slate-600">Rentang Nilai (Range)</td>
										<td class="font-bold text-slate-800 text-right">{analytics.summary.scoreRange}</td>
									</tr>
									<tr class="border-b border-slate-100 bg-slate-50/50">
										<td class="font-semibold text-slate-600">Standar Deviasi (Simpangan Baku)</td>
										<td class="font-bold text-slate-800 text-right">{analytics.summary.standardDeviation}</td>
									</tr>
									<tr>
										<td class="font-semibold text-slate-600">Varians Skor</td>
										<td class="font-bold text-slate-800 text-right">{analytics.summary.variance}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- Highlights: Top 5 Highest & Bottom 5 Lowest -->
					<div class="space-y-4">
						<!-- Top 5 -->
						<div class="card p-5 bg-gradient-to-br from-emerald-50/40 via-white to-white border-emerald-200/80 shadow-xs">
							<div class="flex items-center gap-2 mb-3">
								<span class="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
									</svg>
								</span>
								<h4 class="text-sm font-bold text-slate-900">5 Peringkat Tertinggi (Siswa Berprestasi)</h4>
							</div>
							<div class="space-y-2">
								{#each analytics.studentRoster.slice(0, 5) as top, i}
									<div class="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100 shadow-2xs">
										<div class="flex items-center gap-2.5 min-w-0">
											<span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
												{i + 1}
											</span>
											<div class="truncate">
												<p class="text-xs font-bold text-slate-800 truncate">{top.studentName}</p>
												<p class="text-[10px] text-slate-400">{top.className} • {top.nisn || top.nomorPeserta || '-'}</p>
											</div>
										</div>
										<span class="text-sm font-black text-emerald-600 ml-2">{top.score}</span>
									</div>
								{/each}
							</div>
						</div>

						<!-- Bottom 5 -->
						<div class="card p-5 bg-gradient-to-br from-rose-50/40 via-white to-white border-rose-200/80 shadow-xs">
							<div class="flex items-center gap-2 mb-3">
								<span class="p-1.5 rounded-lg bg-rose-100 text-rose-700">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
								</span>
								<h4 class="text-sm font-bold text-slate-900">Perlu Pendampingan Khusus (Skor Terendah)</h4>
							</div>
							<div class="space-y-2">
								{#each [...analytics.studentRoster].reverse().slice(0, 5) as low}
									<div class="flex items-center justify-between p-2 rounded-xl bg-white border border-rose-100 shadow-2xs">
										<div class="flex items-center gap-2.5 min-w-0">
											<span class="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
												!
											</span>
											<div class="truncate">
												<p class="text-xs font-bold text-slate-800 truncate">{low.studentName}</p>
												<p class="text-[10px] text-slate-400">{low.className} • Gap KKM: -{(kkm - low.score).toFixed(1)}</p>
											</div>
										</div>
										<span class="text-sm font-black text-rose-600 ml-2">{low.score}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- Komparasi Antar Kelas (Jika lebih dari 1 kelas) -->
				{#if analytics.classComparison.length > 1}
					<div class="card p-6 bg-white border-slate-200 shadow-xs">
						<h3 class="text-base font-bold text-slate-900 mb-1">Perbandingan Capaian Antar Kelas</h3>
						<p class="text-xs text-slate-500 mb-4">Komparasi nilai rata-rata dan tingkat ketuntasan per rombel kelas</p>

						<div class="table-container">
							<table class="table">
								<thead>
									<tr>
										<th>Rombel Kelas</th>
										<th class="text-center">Jumlah Siswa</th>
										<th class="text-center">Nilai Rata-rata</th>
										<th class="text-center">Tertinggi</th>
										<th class="text-center">Terendah</th>
										<th class="text-center">Tuntas (≥ KKM)</th>
										<th>Persentase Ketuntasan</th>
									</tr>
								</thead>
								<tbody>
									{#each analytics.classComparison as cls}
										<tr>
											<td class="font-bold text-slate-800">{cls.className}</td>
											<td class="text-center">{cls.studentCount} Siswa</td>
											<td class="text-center font-bold text-indigo-600 text-sm">{cls.meanScore}</td>
											<td class="text-center text-emerald-600 font-semibold">{cls.maxScore}</td>
											<td class="text-center text-rose-600 font-semibold">{cls.minScore}</td>
											<td class="text-center font-semibold">{cls.passCount} / {cls.studentCount}</td>
											<td>
												<div class="flex items-center gap-2">
													<div class="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
														<div
															class="h-2 rounded-full {cls.passRate >= 85 ? 'bg-emerald-500' : cls.passRate >= 65 ? 'bg-amber-500' : 'bg-rose-500'}"
															style="width: {cls.passRate}%"
														></div>
													</div>
													<span class="text-xs font-bold">{cls.passRate}%</span>
												</div>
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

		<!-- TAB 2: ANALISIS BUTIR SOAL (ANATES) -->
		{#if activeTab === 'butir'}
			<div class="space-y-6 animate-in">
				<!-- Summary of Item Analysis Categories -->
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<!-- Tingkat Kesukaran -->
					<div class="card p-4 bg-white border-slate-200">
						<span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
							Tingkat Kesukaran (P)
						</span>
						<div class="grid grid-cols-3 gap-2 text-center">
							<div class="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
								<span class="text-lg font-black text-emerald-700">{analytics.itemAnalysis.summary.easyCount}</span>
								<span class="block text-[10px] font-semibold text-emerald-800">Mudah (&gt;0.7)</span>
							</div>
							<div class="p-2 rounded-xl bg-sky-50 border border-sky-100">
								<span class="text-lg font-black text-sky-700">{analytics.itemAnalysis.summary.moderateCount}</span>
								<span class="block text-[10px] font-semibold text-sky-800">Sedang (0.3-0.7)</span>
							</div>
							<div class="p-2 rounded-xl bg-rose-50 border border-rose-100">
								<span class="text-lg font-black text-rose-700">{analytics.itemAnalysis.summary.hardCount}</span>
								<span class="block text-[10px] font-semibold text-rose-800">Sukar (&lt;0.3)</span>
							</div>
						</div>
					</div>

					<!-- Daya Pembeda -->
					<div class="card p-4 bg-white border-slate-200">
						<span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
							Daya Pembeda (D)
						</span>
						<div class="grid grid-cols-4 gap-1.5 text-center">
							<div class="p-1.5 rounded-xl bg-emerald-50">
								<span class="text-base font-black text-emerald-700">{analytics.itemAnalysis.summary.veryGoodD}</span>
								<span class="block text-[9px] font-bold text-emerald-800">Sangat Baik</span>
							</div>
							<div class="p-1.5 rounded-xl bg-teal-50">
								<span class="text-base font-black text-teal-700">{analytics.itemAnalysis.summary.goodD}</span>
								<span class="block text-[9px] font-bold text-teal-800">Baik</span>
							</div>
							<div class="p-1.5 rounded-xl bg-amber-50">
								<span class="text-base font-black text-amber-700">{analytics.itemAnalysis.summary.fairD}</span>
								<span class="block text-[9px] font-bold text-amber-800">Cukup</span>
							</div>
							<div class="p-1.5 rounded-xl bg-rose-50">
								<span class="text-base font-black text-rose-700">{analytics.itemAnalysis.summary.poorD}</span>
								<span class="block text-[9px] font-bold text-rose-800">Buruk</span>
							</div>
						</div>
					</div>

					<!-- Rekomendasi Keputusan Soal -->
					<div class="card p-4 bg-white border-slate-200">
						<span class="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
							Keputusan Rekomendasi Soal
						</span>
						<div class="grid grid-cols-3 gap-2 text-center">
							<div class="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
								<span class="text-lg font-black text-emerald-700">{analytics.itemAnalysis.summary.acceptedCount}</span>
								<span class="block text-[10px] font-semibold text-emerald-800">Diterima</span>
							</div>
							<div class="p-2 rounded-xl bg-amber-50 border border-amber-100">
								<span class="text-lg font-black text-amber-700">{analytics.itemAnalysis.summary.reviseCount}</span>
								<span class="block text-[10px] font-semibold text-amber-800">Revisi</span>
							</div>
							<div class="p-2 rounded-xl bg-rose-50 border border-rose-100">
								<span class="text-lg font-black text-rose-700">{analytics.itemAnalysis.summary.rejectedCount}</span>
								<span class="block text-[10px] font-semibold text-rose-800">Ditolak</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Item Analysis Filters & Search -->
				<div class="card p-4 bg-white border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
					<div class="relative w-full sm:w-72">
						<input
							type="text"
							placeholder="Cari teks soal / nomor..."
							class="input text-xs pl-9"
							bind:value={itemSearch}
						/>
						<svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>

					<div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
						<select class="select text-xs py-1.5" bind:value={itemDifficultyFilter}>
							<option value="all">Semua Kesukaran</option>
							<option value="Mudah">Mudah</option>
							<option value="Sedang">Sedang</option>
							<option value="Sukar">Sukar</option>
						</select>

						<select class="select text-xs py-1.5" bind:value={itemStatusFilter}>
							<option value="all">Semua Rekomendasi</option>
							<option value="Diterima">Diterima</option>
							<option value="Revisi">Revisi</option>
							<option value="Ditolak">Ditolak</option>
						</select>

						<select class="select text-xs py-1.5" bind:value={itemTypeFilter}>
							<option value="all">Semua Tipe Soal</option>
							<option value="pilihan_ganda">Pilihan Ganda</option>
							<option value="pilihan_ganda_kompleks">PG Kompleks</option>
							<option value="essay">Essay / Uraian</option>
							<option value="isian_singkat">Isian Singkat</option>
							<option value="menjodohkan">Menjodohkan</option>
							<option value="benar_salah">Benar / Salah</option>
						</select>
					</div>
				</div>

				<!-- Item Analysis Table -->
				<div class="card overflow-hidden bg-white border-slate-200">
					{#if filteredItems.length === 0}
						<div class="p-8 text-center text-slate-400 text-sm">Tidak ada butir soal yang sesuai filter pencarian.</div>
					{:else}
						<div class="table-container border-0 rounded-none">
							<table class="table">
								<thead>
									<tr>
										<th class="w-12 text-center">No</th>
										<th>Teks Soal & Bentuk</th>
										<th class="w-20 text-center">Kunci</th>
										<th class="w-32 text-center">Kesukaran (P)</th>
										<th class="w-32 text-center">Daya Beda (D)</th>
										<th class="text-center">Distraktor (PG)</th>
										<th class="w-28 text-center">Rekomendasi</th>
										<th class="w-20 text-center">Aksi</th>
									</tr>
								</thead>
								<tbody>
									{#each filteredItems as item}
										<tr class="hover:bg-slate-50/70 transition-colors">
											<td class="text-center font-bold text-slate-700">{item.question_number}</td>
											<td class="max-w-md">
												<span class="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 mb-1">
													{item.type.replace('_', ' ').toUpperCase()} • {item.points} Poin
												</span>
												<p class="text-xs text-slate-800 line-clamp-2" use:mathRender>
													{item.plain_text}
												</p>
											</td>
											<td class="text-center">
												<span class="font-mono font-extrabold text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
													{item.correct_answer}
												</span>
											</td>
											<td class="text-center">
												<div class="inline-flex flex-col items-center">
													<span class="font-mono font-extrabold text-xs {item.pColor} px-2 py-0.5 rounded-md border">
														{item.pIndex} ({item.pCategory})
													</span>
													<span class="text-[10px] text-slate-400 mt-0.5">
														{item.correctCount} / {item.answeredCount} Benar
													</span>
												</div>
											</td>
											<td class="text-center">
												<div class="inline-flex flex-col items-center">
													<span class="font-mono font-extrabold text-xs {item.dColor} px-2 py-0.5 rounded-md border">
														{item.dIndex} ({item.dCategory})
													</span>
													<span class="text-[10px] text-slate-400 mt-0.5">
														Atas: {item.upperCorrect} | Bawah: {item.lowerCorrect}
													</span>
												</div>
											</td>
											<td class="text-center">
												{#if item.type === 'pilihan_ganda'}
													<div class="flex items-center justify-center gap-1">
														{#each ['A', 'B', 'C', 'D', 'E'] as optKey}
															{@const dInfo = item.distribution[optKey]}
															{@const isCorrect = item.correct_answer.split(',').map((x) => x.trim()).includes(optKey)}
															{@const isNonFunc = item.nonFunctioningDistractors.includes(optKey)}
															<span
																class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold {isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 ring-1 ring-emerald-400' : isNonFunc ? 'bg-rose-50 text-rose-500 border border-rose-200' : 'bg-slate-100 text-slate-600'}"
																title="{optKey}: {dInfo ? dInfo.total : 0} siswa ({dInfo ? dInfo.percentage : 0}%){isCorrect ? ' [KUNCI]' : ''}{isNonFunc ? ' [DISTRAKTOR MATI <5%]' : ''}"
															>
																{optKey}:{dInfo ? dInfo.percentage : 0}%
															</span>
														{/each}
													</div>
												{:else}
													<span class="text-slate-300 text-xs">-</span>
												{/if}
											</td>
											<td class="text-center">
												<span class="badge {item.statusColor} text-[11px] font-bold px-2.5 py-1">
													{item.status}
												</span>
											</td>
											<td class="text-center">
												<button
													type="button"
													class="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
													on:click={() => (selectedItemModal = item)}
													title="Lihat Detail Butir Soal"
												>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
														<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</button>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- TAB 3: ANALISIS LAINNYA & REMEDIAL -->
		{#if activeTab === 'lainnya'}
			<div class="space-y-6 animate-in">
				<!-- Reliability Assessment Card -->
				<div class="card p-6 bg-gradient-to-br from-violet-50/50 via-white to-white border-violet-200/80 shadow-xs">
					<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
						<div class="max-w-2xl">
							<div class="flex items-center gap-2 mb-2">
								<span class="p-1.5 rounded-lg bg-violet-100 text-violet-700">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
								</span>
								<h3 class="text-lg font-bold text-slate-900">Uji Reliabilitas Instrumen (KR-20 / Cronbach's Alpha)</h3>
							</div>
							<p class="text-sm text-slate-600 leading-relaxed">
								{analytics.summary.reliabilityDescription}
							</p>
							<div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
								<span class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
									Koefisien r₁₁ = <strong class="text-violet-700">{analytics.summary.cronbachAlpha}</strong>
								</span>
								<span class="px-2.5 py-1 rounded-lg bg-violet-100 font-bold text-violet-800">
									Kategori: {analytics.summary.reliabilityCategory}
								</span>
							</div>
						</div>

						<div class="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-violet-100 shadow-sm min-w-[200px]">
							<span class="text-xs text-slate-400 font-bold uppercase tracking-wider">SKOR RELIABILITAS</span>
							<span class="text-4xl font-black text-violet-600 my-1">{analytics.summary.cronbachAlpha}</span>
							<span class="text-[11px] font-semibold text-slate-500 text-center">Skala -1.0 s/d 1.0</span>
						</div>
					</div>
				</div>

				<!-- Capaian Rata-Rata per Bentuk Soal -->
				<div class="card p-6 bg-white border-slate-200 shadow-xs">
					<h3 class="text-base font-bold text-slate-900 mb-1">Capaian Berdasarkan Bentuk Soal</h3>
					<p class="text-xs text-slate-500 mb-5">Persentase skor yang diraih peserta berdasarkan tipe butir soal</p>

					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{#each analytics.typeBreakdown as tp}
							<div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
								<div class="flex items-center justify-between mb-2">
									<span class="text-xs font-bold text-slate-800">{tp.label}</span>
									<span class="text-xs font-black text-indigo-600">{tp.averageScorePercentage}%</span>
								</div>
								<div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
									<div
										class="h-2 rounded-full {tp.averageScorePercentage >= 75 ? 'bg-emerald-500' : tp.averageScorePercentage >= 60 ? 'bg-sky-500' : 'bg-amber-500'}"
										style="width: {tp.averageScorePercentage}%"
									></div>
								</div>
								<div class="flex justify-between text-[11px] text-slate-400 font-medium">
									<span>{tp.questionCount} Butir Soal</span>
									<span>Bobot: {tp.totalPoints} Poin</span>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Program Tindak Lanjut: Remedial & Pengayaan -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<!-- Kelompok Remedial -->
					<div class="card p-6 bg-white border-rose-200/80 shadow-xs">
						<div class="flex items-center justify-between mb-4">
							<div>
								<div class="flex items-center gap-2">
									<span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
									<h3 class="text-base font-bold text-slate-900">Peserta Remedial (&lt; KKM {kkm})</h3>
								</div>
								<p class="text-xs text-slate-500 mt-0.5">Siswa yang belum mencapai kriteria ketuntasan minimal</p>
							</div>
							<span class="badge badge-danger text-xs px-2.5 py-1">
								{analytics.remedialEnrichment.remedialStudents.length} Siswa
							</span>
						</div>

						{#if analytics.remedialEnrichment.remedialStudents.length === 0}
							<div class="p-8 text-center text-emerald-600 font-semibold text-xs bg-emerald-50/50 rounded-xl">
								🎉 Luar biasa! Seluruh siswa telah tuntas mencapai KKM.
							</div>
						{:else}
							<div class="space-y-2.5 max-h-96 overflow-y-auto pr-1">
								{#each analytics.remedialEnrichment.remedialStudents as rem}
									<div class="p-3 rounded-xl border border-rose-100 bg-rose-50/20 hover:bg-rose-50/40 transition-colors">
										<div class="flex items-center justify-between mb-1">
											<span class="text-xs font-bold text-slate-800">{rem.studentName} ({rem.className})</span>
											<span class="text-xs font-black text-rose-600">Nilai: {rem.score}</span>
										</div>
										<p class="text-[11px] text-slate-500">
											Kekurangan: -{rem.gap} poin • Salah di no:
											<span class="font-mono text-rose-700 font-semibold">
												{rem.wrongQuestionNumbers.slice(0, 8).join(', ')}{rem.wrongQuestionNumbers.length > 8 ? '...' : ''}
											</span>
										</p>
									</div>
								{/each}
							</div>
						{/if}

						<!-- Soal Prioritas Remedial -->
						{#if analytics.remedialEnrichment.priorityRemedialQuestions.length > 0}
							<div class="mt-5 pt-4 border-t border-slate-100">
								<h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
									Soal Prioritas untuk Dibahas Ulang di Kelas
								</h4>
								<div class="space-y-1.5">
									{#each analytics.remedialEnrichment.priorityRemedialQuestions as pr}
										<div class="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
											<span class="font-bold text-slate-800">No. {pr.questionNumber}</span>
											<span class="text-rose-600 font-semibold">Gagal: {pr.wrongPercentage}% siswa remedial</span>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<!-- Kelompok Pengayaan -->
					<div class="card p-6 bg-white border-emerald-200/80 shadow-xs">
						<div class="flex items-center justify-between mb-4">
							<div>
								<div class="flex items-center gap-2">
									<span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
									<h3 class="text-base font-bold text-slate-900">Peserta Pengayaan (≥ KKM {kkm})</h3>
								</div>
								<p class="text-xs text-slate-500 mt-0.5">Siswa tuntas yang memenuhi syarat pengayaan materi</p>
							</div>
							<span class="badge badge-success text-xs px-2.5 py-1">
								{analytics.remedialEnrichment.enrichmentStudents.length} Siswa
							</span>
						</div>

						{#if analytics.remedialEnrichment.enrichmentStudents.length === 0}
							<div class="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
								Belum ada siswa yang mencapai KKM {kkm}.
							</div>
						{:else}
							<div class="space-y-2.5 max-h-96 overflow-y-auto pr-1">
								{#each analytics.remedialEnrichment.enrichmentStudents as enr}
									<div class="p-3 rounded-xl border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors flex items-center justify-between">
										<div>
											<span class="text-xs font-bold text-slate-800 block">{enr.studentName}</span>
											<span class="text-[11px] text-slate-400">{enr.className}</span>
										</div>
										<span class="text-xs font-black text-emerald-600">{enr.score}</span>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- TAB 4: REKAPITULASI NILAI SISWA -->
		{#if activeTab === 'rekap'}
			<div class="space-y-4 animate-in">
				<!-- Filters for Roster -->
				<div class="card p-4 bg-white border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
					<div class="relative w-full sm:w-80">
						<input
							type="text"
							placeholder="Cari nama, NISN, no peserta..."
							class="input text-xs pl-9"
							bind:value={rosterSearch}
						/>
						<svg class="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>

					<div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
						{#if availableClasses.length > 1}
							<select class="select text-xs py-1.5" bind:value={rosterClassFilter}>
								<option value="all">Semua Kelas</option>
								{#each availableClasses as cName}
									<option value={cName}>{cName}</option>
								{/each}
							</select>
						{/if}

						<select class="select text-xs py-1.5" bind:value={rosterStatusFilter}>
							<option value="all">Semua Status Ketuntasan</option>
							<option value="passed">Tuntas (≥ KKM {kkm})</option>
							<option value="failed">Remedial (&lt; KKM {kkm})</option>
						</select>
					</div>
				</div>

				<!-- Student Roster Table -->
				<div class="card overflow-hidden bg-white border-slate-200">
					{#if filteredRoster.length === 0}
						<div class="p-8 text-center text-slate-400 text-sm">Tidak ada siswa yang sesuai filter.</div>
					{:else}
						<div class="table-container border-0 rounded-none">
							<table class="table">
								<thead>
									<tr>
										<th class="w-12 text-center">Rank</th>
										<th>Nama Siswa</th>
										<th>No. Peserta / NISN</th>
										<th>Kelas</th>
										<th class="text-center">Benar / Salah / Kosong</th>
										<th class="text-center">Nilai</th>
										<th class="text-center">Status</th>
										<th class="text-center">Durasi</th>
										<th class="w-20 text-center">Aksi</th>
									</tr>
								</thead>
								<tbody>
									{#each filteredRoster as r}
										<tr class="hover:bg-slate-50/70 transition-colors">
											<td class="text-center font-bold text-slate-600">{r.rank}</td>
											<td class="font-bold text-slate-800">{r.studentName}</td>
											<td class="text-xs font-mono text-slate-500">
												<div>{r.nomorPeserta || '-'}</div>
												<div class="text-[10px] text-slate-400">{r.nisn || `@${r.username}`}</div>
											</td>
											<td><span class="badge bg-slate-100 text-slate-700 text-xs">{r.className}</span></td>
											<td class="text-center text-xs font-mono">
												<span class="text-emerald-600 font-bold">{r.correctCount}B</span>
												<span class="text-slate-300">/</span>
												<span class="text-rose-600 font-bold">{r.incorrectCount}S</span>
												<span class="text-slate-300">/</span>
												<span class="text-slate-400">{r.unansweredCount}K</span>
											</td>
											<td class="text-center">
												<span class="text-base font-black {r.isPassed ? 'text-emerald-600' : 'text-rose-600'}">
													{r.score}
												</span>
											</td>
											<td class="text-center">
												<span class="badge {r.isPassed ? 'badge-success' : 'badge-danger'} text-[10px] font-bold">
													{r.isPassed ? 'TUNTAS' : 'REMEDIAL'}
												</span>
											</td>
											<td class="text-center text-xs text-slate-500">
												{r.durationMinutes != null ? `${r.durationMinutes} menit` : '-'}
											</td>
											<td class="text-center">
												<a
													href="/{role === 'guru' ? 'guru' : 'admin'}/results/{r.attemptId}"
													class="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 inline-block transition-colors"
													title="Tinjau Jawaban Siswa"
												>
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
														<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
													</svg>
												</a>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div>

<!-- Question Detail Modal -->
{#if selectedItemModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
		on:click={() => (selectedItemModal = null)}
	>
		<div
			class="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-up border border-slate-100"
			on:click|stopPropagation
		>
			<button
				type="button"
				class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
				on:click={() => (selectedItemModal = null)}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<div class="flex items-center gap-2 mb-4">
				<span class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-sm">
					{selectedItemModal.question_number}
				</span>
				<div>
					<h3 class="text-base font-bold text-slate-800">Detail Analisis Butir Soal</h3>
					<p class="text-xs text-slate-400">
						Tipe: {selectedItemModal.type.replace('_', ' ')} • Bobot: {selectedItemModal.points} Poin
					</p>
				</div>
			</div>

			<!-- Question Text with KaTeX -->
			<div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 prose text-sm" use:mathRender>
				{@html selectedItemModal.question_text}
			</div>

			<!-- Options if available -->
			{#if selectedItemModal.options && selectedItemModal.options.length > 0}
				<div class="mb-5">
					<h4 class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Pilihan Jawaban:</h4>
					<div class="space-y-1.5">
						{#each selectedItemModal.options as opt}
							<div class="p-2 rounded-xl border {opt.isCorrect ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-300' : 'bg-white border-slate-200'} flex items-start gap-2 text-xs">
								<span class="font-mono font-bold px-1.5 py-0.5 rounded {opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}">
									{opt.key}
								</span>
								<div class="flex-1 font-medium text-slate-800" use:mathRender>
									{opt.text}
								</div>
								{#if opt.isCorrect}
									<span class="text-[10px] font-bold text-emerald-700 px-2 py-0.5 bg-emerald-100 rounded-full">
										Kunci Jawaban
									</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Metrics Grid -->
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5 text-center text-xs">
				<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
					<span class="text-[10px] text-slate-400 block font-semibold">KESUKARAN (P)</span>
					<span class="font-extrabold text-sm {selectedItemModal.pColor} px-1.5 py-0.5 rounded inline-block mt-0.5">
						{selectedItemModal.pIndex} ({selectedItemModal.pCategory})
					</span>
				</div>

				<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
					<span class="text-[10px] text-slate-400 block font-semibold">DAYA BEDA (D)</span>
					<span class="font-extrabold text-sm {selectedItemModal.dColor} px-1.5 py-0.5 rounded inline-block mt-0.5">
						{selectedItemModal.dIndex} ({selectedItemModal.dCategory})
					</span>
				</div>

				<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
					<span class="text-[10px] text-slate-400 block font-semibold">KEL. ATAS / BAWAH</span>
					<span class="font-extrabold text-sm text-slate-700 block mt-0.5">
						{selectedItemModal.upperCorrect} / {selectedItemModal.lowerCorrect} Benar
					</span>
				</div>

				<div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
					<span class="text-[10px] text-slate-400 block font-semibold">REKOMENDASI</span>
					<span class="font-extrabold text-sm {selectedItemModal.statusColor} px-2 py-0.5 rounded-full inline-block mt-0.5">
						{selectedItemModal.status}
					</span>
				</div>
			</div>

			<!-- Distractor Analysis if PG -->
			{#if selectedItemModal.type === 'pilihan_ganda'}
				<div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-5">
					<h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
						Analisis Pemilih Jawaban (Efektivitas Distraktor):
					</h4>
					<div class="grid grid-cols-5 gap-2 text-center text-xs">
						{#each ['A', 'B', 'C', 'D', 'E'] as optKey}
							{@const dist = selectedItemModal.distribution[optKey]}
							{@const isCorrect = selectedItemModal.correct_answer.split(',').map((x) => x.trim()).includes(optKey)}
							<div class="p-2 rounded-xl {isCorrect ? 'bg-emerald-100 border border-emerald-300' : 'bg-white border border-slate-200'}">
								<span class="font-mono font-black text-sm block {isCorrect ? 'text-emerald-800' : 'text-slate-700'}">
									{optKey} {isCorrect ? '★' : ''}
								</span>
								<span class="text-xs font-bold block mt-0.5">{dist ? dist.total : 0} Siswa</span>
								<span class="text-[10px] text-slate-400 block">{dist ? dist.percentage : 0}%</span>
							</div>
						{/each}
					</div>
					{#if selectedItemModal.nonFunctioningDistractors.length > 0}
						<p class="text-[11px] text-rose-600 font-semibold mt-2.5 flex items-center gap-1">
							⚠️ Opsi pengecoh {selectedItemModal.nonFunctioningDistractors.join(', ')} kurang efektif karena dipilih kurang dari 5% peserta.
						</p>
					{/if}
				</div>
			{/if}

			<button
				type="button"
				class="btn btn-secondary w-full text-xs py-2.5"
				on:click={() => (selectedItemModal = null)}
			>
				Tutup Detail
			</button>
		</div>
	</div>
{/if}
