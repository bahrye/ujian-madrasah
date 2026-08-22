<script lang="ts">
	import { onMount } from 'svelte';
	import { parseDate } from '$lib/utils/date';
	import { parseProctors } from '$lib/utils/format';
	import { ICONS } from '$lib/utils/constants';

	export let data;

	type ViewMode = 'calendar' | 'cards';
	let viewMode: ViewMode = 'calendar';

	const MONTH_NAMES = [
		'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
		'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
	];

	const DAY_NAMES_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

	const today = new Date();
	let currentMonth = today.getMonth();
	let currentYear = today.getFullYear();
	let selectedDateKey = toDateKey(today);
	let searchQuery = '';

	function toDateKey(date: Date): string {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return `${y}-${m}-${d}`;
	}

	function formatScheduleDate(dateString: string | null) {
		if (!dateString) return 'Belum ditentukan';
		
		const date = parseDate(dateString);
		const todayClone = new Date();
		
		date.setHours(0, 0, 0, 0);
		todayClone.setHours(0, 0, 0, 0);
		
		const diffTime = date.getTime() - todayClone.getTime();
		const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) return 'Hari ini';
		if (diffDays === 1) return 'Besok';
		if (diffDays === 2) return 'Lusa';
		if (diffDays > 2) return `${diffDays} hari lagi`;
		
		if (diffDays === -1) return 'Kemarin';
		if (diffDays < -1) return `${Math.abs(diffDays)} hari lalu`;

		return new Intl.DateTimeFormat('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}

	function formatFullDate(dateKey: string) {
		const parts = dateKey.split('-');
		if (parts.length !== 3) return dateKey;
		const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
		return new Intl.DateTimeFormat('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}

	function getDateRelativeLabel(dateKey: string) {
		const parts = dateKey.split('-');
		if (parts.length !== 3) return null;
		const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
		const todayClone = new Date();
		date.setHours(0, 0, 0, 0);
		todayClone.setHours(0, 0, 0, 0);

		const diffTime = date.getTime() - todayClone.getTime();
		const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return { text: 'Hari Ini', class: 'badge-primary' };
		if (diffDays === 1) return { text: 'Besok', class: 'badge-primary' };
		if (diffDays === 2) return { text: 'Lusa', class: 'badge-primary' };
		if (diffDays > 2) return { text: `${diffDays} hari lagi`, class: 'badge-primary' };
		if (diffDays === -1) return { text: 'Kemarin', class: 'badge-secondary' };
		if (diffDays < -1) return { text: `${Math.abs(diffDays)} hari lalu`, class: 'badge-secondary' };
		return null;
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
			month: 'short'
		}).format(start);
		const endDateFormatted = new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'short'
		}).format(end);

		return `${startDateFormatted} ${startFormatted} - ${endDateFormatted} ${endFormatted}`;
	}

	function getExamStatus(exam: any): 'active' | 'upcoming' | 'ended' {
		const now = new Date();
		if (exam.end_time && now > parseDate(exam.end_time)) {
			return 'ended';
		}
		if (exam.start_time && now < parseDate(exam.start_time)) {
			return 'upcoming';
		}
		return 'active';
	}

	function getExamDisplayStatus(exam: any) {
		const isDone = exam.attempt_status && ['selesai', 'waktu_habis', 'remedial'].includes(exam.attempt_status);
		if (isDone) {
			return {
				type: 'done',
				label: 'Selesai',
				bgClass: 'bg-emerald-50 hover:bg-emerald-100/70',
				textClass: 'text-emerald-700',
				dotClass: 'bg-emerald-500',
				borderClass: 'border-emerald-200',
				badgeClass: 'badge-success'
			};
		}

		if (exam.attempt_status === 'mengerjakan') {
			return {
				type: 'active',
				label: 'Sedang Mengerjakan',
				bgClass: 'bg-amber-50 hover:bg-amber-100/70',
				textClass: 'text-amber-800 font-bold',
				dotClass: 'bg-amber-500 animate-pulse',
				borderClass: 'border-amber-300',
				badgeClass: 'badge-warning'
			};
		}

		const timing = getExamStatus(exam);
		if (timing === 'active') {
			return {
				type: 'active',
				label: 'Sedang Berlangsung',
				bgClass: 'bg-amber-50 hover:bg-amber-100/70',
				textClass: 'text-amber-800 font-bold',
				dotClass: 'bg-amber-500 animate-pulse',
				borderClass: 'border-amber-300',
				badgeClass: 'badge-warning'
			};
		}

		if (timing === 'ended') {
			return {
				type: 'ended',
				label: 'Berakhir',
				bgClass: 'bg-rose-50 hover:bg-rose-100/70',
				textClass: 'text-rose-700',
				dotClass: 'bg-rose-500',
				borderClass: 'border-rose-200',
				badgeClass: 'badge-danger'
			};
		}

		return {
			type: 'upcoming',
			label: 'Akan Datang',
			bgClass: 'bg-indigo-50 hover:bg-indigo-100/70',
			textClass: 'text-indigo-700',
			dotClass: 'bg-indigo-500',
			borderClass: 'border-indigo-200',
			badgeClass: 'badge-primary'
		};
	}

	function getCellDominantStatus(exams: any[]) {
		if (!exams || exams.length === 0) return null;
		
		// 1. Any active / ongoing exam
		const hasActive = exams.some(e => {
			if (e.attempt_status === 'mengerjakan') return true;
			const isDone = e.attempt_status && ['selesai', 'waktu_habis', 'remedial'].includes(e.attempt_status);
			return !isDone && getExamStatus(e) === 'active';
		});
		if (hasActive) {
			return {
				type: 'active',
				dotClass: 'bg-amber-500 ring-2 ring-amber-200 animate-pulse',
				badgeClass: 'bg-amber-500 text-white',
				cellBorder: 'border-amber-300 bg-amber-50/30'
			};
		}

		// 2. Any upcoming exam
		const hasUpcoming = exams.some(e => {
			const isDone = e.attempt_status && ['selesai', 'waktu_habis', 'remedial'].includes(e.attempt_status);
			return !isDone && getExamStatus(e) === 'upcoming';
		});
		if (hasUpcoming) {
			return {
				type: 'upcoming',
				dotClass: 'bg-indigo-500 ring-2 ring-indigo-200',
				badgeClass: 'bg-indigo-600 text-white',
				cellBorder: 'border-indigo-200 bg-indigo-50/20'
			};
		}

		// 3. All completed
		const allDone = exams.every(e => e.attempt_status && ['selesai', 'waktu_habis', 'remedial'].includes(e.attempt_status));
		if (allDone) {
			return {
				type: 'done',
				dotClass: 'bg-emerald-500 ring-2 ring-emerald-200',
				badgeClass: 'bg-emerald-600 text-white',
				cellBorder: 'border-emerald-200 bg-emerald-50/20'
			};
		}

		// 4. All ended
		return {
			type: 'ended',
			dotClass: 'bg-rose-500 ring-2 ring-rose-200',
			badgeClass: 'bg-rose-500 text-white',
			cellBorder: 'border-rose-200 bg-rose-50/20'
		};
	}

	$: filteredSchedules = (data.schedules || []).filter((exam: any) => {
		if (!searchQuery.trim()) return true;
		const q = searchQuery.toLowerCase().trim();
		const titleMatch = (exam.title || '').toLowerCase().includes(q);
		const subjectMatch = (exam.subject || '').toLowerCase().includes(q);
		const subjectCodeMatch = (exam.subject_code || '').toLowerCase().includes(q);
		const roomMatch = (exam.room_name || '').toLowerCase().includes(q);
		const proctorsStr = (exam.proctors || '').toString().toLowerCase();
		return titleMatch || subjectMatch || subjectCodeMatch || roomMatch || proctorsStr.includes(q);
	});

	// Map of exams keyed by 'YYYY-MM-DD'
	$: examsByDate = (() => {
		const map = new Map<string, any[]>();
		for (const exam of filteredSchedules) {
			if (exam.start_time) {
				const date = parseDate(exam.start_time);
				const key = toDateKey(date);
				if (!map.has(key)) {
					map.set(key, []);
				}
				map.get(key)!.push(exam);
			}
		}
		return map;
	})();

	$: unscheduledExams = filteredSchedules.filter((exam: any) => !exam.start_time);

	interface CalendarCell {
		date: Date;
		dateKey: string;
		dayNumber: number;
		isCurrentMonth: boolean;
		isToday: boolean;
		isSelected: boolean;
		exams: any[];
	}

	function buildCalendarGrid(year: number, month: number, selectedKey: string, examsMap: Map<string, any[]>): CalendarCell[] {
		const todayKey = toDateKey(new Date());
		const firstDay = new Date(year, month, 1);
		// Monday is 0, Sunday is 6
		const startingDay = (firstDay.getDay() + 6) % 7;
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const daysInPrevMonth = new Date(year, month, 0).getDate();

		const cells: CalendarCell[] = [];

		// Previous month days
		for (let i = startingDay - 1; i >= 0; i--) {
			const dayNum = daysInPrevMonth - i;
			const cellDate = new Date(year, month - 1, dayNum);
			const dateKey = toDateKey(cellDate);
			cells.push({
				date: cellDate,
				dateKey,
				dayNumber: dayNum,
				isCurrentMonth: false,
				isToday: dateKey === todayKey,
				isSelected: dateKey === selectedKey,
				exams: examsMap.get(dateKey) || []
			});
		}

		// Current month days
		for (let d = 1; d <= daysInMonth; d++) {
			const cellDate = new Date(year, month, d);
			const dateKey = toDateKey(cellDate);
			cells.push({
				date: cellDate,
				dateKey,
				dayNumber: d,
				isCurrentMonth: true,
				isToday: dateKey === todayKey,
				isSelected: dateKey === selectedKey,
				exams: examsMap.get(dateKey) || []
			});
		}

		// Next month days to make complete 35 or 42 grid cells
		const totalCells = cells.length > 35 ? 42 : 35;
		const remaining = totalCells - cells.length;
		for (let d = 1; d <= remaining; d++) {
			const cellDate = new Date(year, month + 1, d);
			const dateKey = toDateKey(cellDate);
			cells.push({
				date: cellDate,
				dateKey,
				dayNumber: d,
				isCurrentMonth: false,
				isToday: dateKey === todayKey,
				isSelected: dateKey === selectedKey,
				exams: examsMap.get(dateKey) || []
			});
		}

		return cells;
	}

	$: calendarGrid = buildCalendarGrid(currentYear, currentMonth, selectedDateKey, examsByDate);
	$: selectedDateExams = examsByDate.get(selectedDateKey) || [];

	// Count total exams in currently viewed month
	$: totalMonthExams = calendarGrid
		.filter(c => c.isCurrentMonth)
		.reduce((sum, c) => sum + c.exams.length, 0);

	// Swipe gestures for touch screens
	let touchStartX = 0;
	let touchStartY = 0;
	let touchStartTime = 0;

	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length !== 1) return;
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		touchStartTime = Date.now();
	}

	function handleTouchEnd(e: TouchEvent) {
		if (e.changedTouches.length !== 1) return;
		const deltaX = e.changedTouches[0].clientX - touchStartX;
		const deltaY = e.changedTouches[0].clientY - touchStartY;
		const deltaTime = Date.now() - touchStartTime;

		// Must be within 500ms, minimum horizontal swipe of 40px, and horizontal dominance
		if (deltaTime < 500 && Math.abs(deltaX) >= 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
			if (deltaX < 0) {
				nextMonth();
			} else {
				prevMonth();
			}
		}
	}

	function prevMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear -= 1;
		} else {
			currentMonth -= 1;
		}
	}

	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear += 1;
		} else {
			currentMonth += 1;
		}
	}

	function goToToday() {
		const now = new Date();
		currentMonth = now.getMonth();
		currentYear = now.getFullYear();
		selectedDateKey = toDateKey(now);
	}

	function handleSelectDay(cell: CalendarCell, shouldScroll = true) {
		selectedDateKey = cell.dateKey;
		if (!cell.isCurrentMonth) {
			currentMonth = cell.date.getMonth();
			currentYear = cell.date.getFullYear();
		}

		// Focus and smoothly scroll to the exam details section on mobile screens (< 1024px) ONLY when the selected date has exams
		const hasExams = cell.exams && cell.exams.length > 0;
		if (shouldScroll && hasExams && typeof window !== 'undefined' && window.innerWidth < 1024) {
			setTimeout(() => {
				const targetEl = document.getElementById('selected-date-details-section');
				if (targetEl) {
					targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}, 60);
		}
	}

	function goToNearestExam(shouldScroll = true) {
		const allExams = [...(data.schedules || [])].filter((e: any) => e.start_time);
		if (allExams.length === 0) return;

		const now = new Date().getTime();
		// Find upcoming exam first
		const upcoming = allExams
			.map((e: any) => ({ exam: e, time: parseDate(e.start_time).getTime() }))
			.filter(item => item.time >= now)
			.sort((a, b) => a.time - b.time);

		let targetDate: Date;
		if (upcoming.length > 0) {
			targetDate = new Date(upcoming[0].time);
		} else {
			// Find most recent exam
			const past = allExams
				.map((e: any) => ({ exam: e, time: parseDate(e.start_time).getTime() }))
				.sort((a, b) => b.time - a.time);
			targetDate = new Date(past[0].time);
		}

		currentMonth = targetDate.getMonth();
		currentYear = targetDate.getFullYear();
		selectedDateKey = toDateKey(targetDate);

		if (shouldScroll && typeof window !== 'undefined' && window.innerWidth < 1024) {
			setTimeout(() => {
				const targetEl = document.getElementById('selected-date-details-section');
				if (targetEl) {
					targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}, 60);
		}
	}

	onMount(() => {
		// If today doesn't have any exams, auto select nearest exam date if available without scrolling
		const todayKey = toDateKey(new Date());
		if (!examsByDate.has(todayKey) && (data.schedules || []).some((e: any) => e.start_time)) {
			goToNearestExam(false);
		}
	});
</script>

<svelte:head>
	<title>Jadwal Ujian — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<!-- Page Header & Controls -->
	<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
		<div>
			<div class="flex items-center gap-2.5">
				<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.calendar} />
					</svg>
				</div>
				<div>
					<h1 class="text-2xl font-bold text-slate-800">Jadwal Ujian</h1>
					<p class="text-xs sm:text-sm text-slate-500">Daftar jadwal ujian yang harus Anda ikuti</p>
				</div>
			</div>
		</div>

		<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
			<!-- View Mode Switcher -->
			<div class="inline-flex bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-inner self-start sm:self-auto">
				<button 
					type="button" 
					class="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 {viewMode === 'calendar' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
					on:click={() => viewMode = 'calendar'}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.calendar} />
					</svg>
					<span>Kalender</span>
				</button>
				<button 
					type="button" 
					class="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 {viewMode === 'cards' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
					on:click={() => viewMode = 'cards'}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
					</svg>
					<span>Kartu</span>
				</button>
			</div>

			<!-- Search Input -->
			<div class="relative w-full sm:w-64">
				<input 
					type="text" 
					bind:value={searchQuery}
					placeholder="Cari mapel, ruang, pengawas..." 
					class="input pl-9 pr-8 py-2 w-full text-xs sm:text-sm rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm bg-white"
				/>
				<svg class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				{#if searchQuery}
					<button 
						type="button" 
						class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors" 
						on:click={() => searchQuery = ''}
						title="Hapus pencarian"
					>
						<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- TAB 1: CALENDAR VIEW (DEFAULT) -->
	{#if viewMode === 'calendar'}
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
			<!-- Calendar Grid Column (7 cols on lg, 8 cols on xl) -->
			<div 
				class="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-6 select-none touch-pan-y"
				on:touchstart={handleTouchStart}
				on:touchend={handleTouchEnd}
			>
				<!-- Calendar Navigation Header -->
				<div class="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
					<div class="flex items-center gap-2">
						<h2 class="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
							{MONTH_NAMES[currentMonth]} {currentYear}
						</h2>
						{#if totalMonthExams > 0}
							<span class="badge-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
								{totalMonthExams} Ujian
							</span>
						{/if}
					</div>

					<div class="flex items-center gap-1.5 self-end sm:self-auto">
						<button 
							type="button" 
							class="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
							on:click={goToToday}
							title="Kembali ke hari ini"
						>
							Hari Ini
						</button>
						<div class="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
							<button 
								type="button" 
								class="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors shadow-none hover:shadow-sm"
								on:click={prevMonth}
								title="Bulan sebelumnya"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<button 
								type="button" 
								class="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors shadow-none hover:shadow-sm"
								on:click={nextMonth}
								title="Bulan berikutnya"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</div>
					</div>
				</div>

				<!-- Weekday Headers -->
				<div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
					{#each DAY_NAMES_SHORT as dayName, idx}
						<div class="py-2 text-xs font-bold uppercase tracking-wider {idx >= 5 ? 'text-rose-500 bg-rose-50/50' : 'text-slate-500 bg-slate-50'} rounded-lg">
							{dayName}
						</div>
					{/each}
				</div>

				<!-- Calendar Days Grid -->
				<div class="grid grid-cols-7 gap-1 sm:gap-2">
					{#each calendarGrid as cell}
						{@const hasExams = cell.exams.length > 0}
						{@const dominant = getCellDominantStatus(cell.exams)}
						
						<button
							type="button"
							on:click={() => handleSelectDay(cell, true)}
							class="text-left rounded-xl p-1.5 sm:p-2 transition-all flex flex-col justify-between min-h-[64px] sm:min-h-[88px] border relative group focus:outline-none cursor-pointer
								{cell.isSelected 
									? 'ring-2 ring-indigo-600 bg-indigo-50/80 border-indigo-300 shadow-sm z-10' 
									: cell.isToday 
										? 'ring-2 ring-indigo-400/80 bg-indigo-50/30 border-indigo-200' 
										: hasExams && dominant
											? `${dominant.cellBorder} hover:shadow-sm`
											: cell.isCurrentMonth 
												? 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700' 
												: 'bg-slate-50/50 border-slate-100 text-slate-300 opacity-60'}"
						>
							<!-- Top of cell: Day Number & Indicators -->
							<div class="flex items-center justify-between w-full">
								<span class="text-xs sm:text-sm font-bold {cell.isSelected ? 'text-indigo-900 font-black' : cell.isToday ? 'text-indigo-600 font-extrabold' : cell.isCurrentMonth ? 'text-slate-800' : 'text-slate-400'}">
									{cell.dayNumber}
								</span>

								{#if cell.isToday}
									<span class="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.2 bg-indigo-600 text-white rounded-md uppercase tracking-tight">
										Hari ini
									</span>
									{#if dominant}
										<span class="sm:hidden w-2 h-2 rounded-full {dominant.dotClass}"></span>
									{:else}
										<span class="sm:hidden w-2 h-2 rounded-full bg-indigo-600"></span>
									{/if}
								{:else if hasExams && dominant}
									<span class="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full {dominant.dotClass}"></span>
								{/if}
							</div>

							<!-- Cell Exam List / Badges -->
							<div class="w-full mt-1 space-y-1">
								{#if hasExams && dominant}
									<!-- Mobile View: status-colored count badge -->
									<div class="sm:hidden flex items-center justify-center">
										<span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md {dominant.badgeClass} leading-none shadow-xs">
											{cell.exams.length}
										</span>
									</div>

									<!-- Desktop View: item badges -->
									<div class="hidden sm:block space-y-1">
										{#each cell.exams.slice(0, 2) as exam}
											{@const display = getExamDisplayStatus(exam)}
											<div 
												class="text-[10px] font-semibold truncate px-1.5 py-0.5 rounded flex items-center gap-1 border {display.bgClass} {display.textClass} {display.borderClass}"
												title="{exam.title} ({display.label})"
											>
												<span class="w-1.5 h-1.5 rounded-full flex-shrink-0 {display.dotClass}"></span>
												<span class="truncate">{exam.subject_code || exam.subject || exam.title}</span>
											</div>
										{/each}

										{#if cell.exams.length > 2}
											<div class="text-[9px] font-bold text-slate-500 text-center">
												+{cell.exams.length - 2} lainnya
											</div>
										{/if}
									</div>
								{/if}
							</div>
						</button>
					{/each}
				</div>

				<!-- Calendar Legend -->
				<div class="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
					<div class="flex items-center gap-4 flex-wrap">
						<div class="flex items-center gap-1.5">
							<span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
							<span class="text-slate-600 font-medium">Akan Datang</span>
						</div>
						<div class="flex items-center gap-1.5">
							<span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
							<span class="text-slate-600 font-medium">Sedang Berlangsung</span>
						</div>
						<div class="flex items-center gap-1.5">
							<span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
							<span class="text-slate-600 font-medium">Selesai</span>
						</div>
						<div class="flex items-center gap-1.5">
							<span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
							<span class="text-slate-600 font-medium">Telah Berakhir</span>
						</div>
					</div>

					<div class="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
						<span class="sm:hidden text-[11px] text-slate-400 font-medium flex items-center gap-1">
							<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
							</svg>
							Geser ↔ ganti bulan
						</span>
						<button 
							type="button" 
							class="text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs transition-colors"
							on:click={() => goToNearestExam(true)}
						>
							Lompat ke Ujian Terdekat
						</button>
					</div>
				</div>
			</div>

			<!-- Selected Date Details Panel (5 cols on lg, 4 cols on xl) -->
			<div id="selected-date-details-section" class="lg:col-span-5 xl:col-span-4 space-y-4 scroll-mt-20">
				<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sticky top-6">
					<!-- Panel Header -->
					<div class="flex items-start justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
						<div>
							<div class="flex items-center gap-1.5 text-indigo-600 font-semibold text-xs uppercase tracking-wider mb-1">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.calendar} />
								</svg>
								<span>Informasi Jadwal Ujian</span>
							</div>
							<h3 class="font-black text-slate-800 text-lg sm:text-xl leading-tight">
								{formatFullDate(selectedDateKey)}
							</h3>
						</div>
						{#if getDateRelativeLabel(selectedDateKey)}
							{@const rel = getDateRelativeLabel(selectedDateKey)}
							{#if rel}
								<span class="{rel.class} font-bold text-xs px-2.5 py-1 rounded-lg flex-shrink-0">
									{rel.text}
								</span>
							{/if}
						{/if}
					</div>

					<!-- Exams List on Selected Date -->
					{#if selectedDateExams.length > 0}
						<div class="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
							{#each selectedDateExams as exam}
								{@const status = getExamStatus(exam)}
								{@const display = getExamDisplayStatus(exam)}
								{@const isCompleted = exam.attempt_status && ['selesai', 'waktu_habis', 'remedial'].includes(exam.attempt_status)}
								
								<div class="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-indigo-200 space-y-3">
									<!-- Top Row: Subject Code Badge & Status Badge -->
									<div class="flex items-center justify-between gap-2">
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wide">
											{exam.subject_code || exam.subject || 'UMUM'}
										</span>

										<span class="{display.badgeClass} text-xs font-semibold px-2.5 py-0.5 rounded-md flex-shrink-0 {display.type === 'active' ? 'animate-pulse' : ''}">
											{display.label}
										</span>
									</div>

									<!-- Exam Full Title (Now on full width line) -->
									<h4 class="font-bold text-slate-800 text-sm sm:text-base leading-snug break-words">
										{exam.title}
									</h4>

									<!-- Badges for Room & Session -->
									{#if exam.room_name || exam.session_number}
										<div class="flex items-center gap-2 flex-wrap">
											{#if exam.room_name}
												<span class="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md">
													{exam.room_name}
												</span>
											{/if}
											{#if exam.session_number}
												<span class="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md">
													Sesi {exam.session_number}
												</span>
											{/if}
										</div>
									{/if}

									<!-- Exam details info -->
									<div class="space-y-1.5 text-xs sm:text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100">
										<div class="flex items-center gap-2">
											<svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} />
											</svg>
											<span>
												<strong>Pukul:</strong> {formatTimeRange(exam.start_time, exam.end_time)}
												{#if exam.has_sessions && exam.session_number}
													<span class="text-[11px] font-semibold px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded ml-1">
														Sesi {exam.session_number}
													</span>
												{/if}
											</span>
										</div>
										<div class="flex items-center gap-2">
											<svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
											</svg>
											<span><strong>Durasi:</strong> {exam.duration_minutes} menit</span>
										</div>
										<div class="flex items-center gap-2">
											<svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
											<span><strong>Jumlah Soal:</strong> {exam.question_count} butir</span>
										</div>
										{#if exam.proctors}
											<div class="flex items-start gap-2 pt-1 border-t border-slate-100">
												<svg class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.users} />
												</svg>
												<div class="space-y-0.5">
													{#each parseProctors(exam.proctors) as p}
														<div>
															<span class="font-medium text-slate-700">{p.label}:</span> {p.name}
														</div>
													{/each}
												</div>
											</div>
										{/if}
									</div>

									<!-- Action Button -->
									<div class="pt-1">
										{#if isCompleted}
											<button disabled class="btn w-full justify-center bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed shadow-none text-xs sm:text-sm py-2.5 font-bold">
												<svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.check} />
												</svg>
												Ujian Selesai Dikerjakan
											</button>
										{:else if status === 'ended'}
											<div class="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-bold cursor-not-allowed">
												<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.warning} />
												</svg>
												<span>Ujian Telah Berakhir</span>
											</div>
										{:else if status === 'upcoming'}
											<button disabled class="btn w-full justify-center bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed text-xs sm:text-sm py-2.5">
												Belum Dimulai
											</button>
										{:else if exam.attempt_status === 'mengerjakan'}
											<a href="/siswa/ujian?exam_id={exam.id}" class="btn btn-warning w-full justify-center text-xs sm:text-sm py-2.5 shadow-md">
												Lanjutkan Ujian
											</a>
										{:else}
											<a href="/siswa/ujian?exam_id={exam.id}" class="btn btn-primary w-full justify-center text-xs sm:text-sm py-2.5 shadow-md">
												Buka Halaman Ujian
											</a>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<!-- Empty state for selected date -->
						<div class="py-10 px-4 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
							<div class="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center text-slate-400 mb-3 shadow-xs border border-slate-100">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.calendar} />
								</svg>
							</div>
							<h4 class="font-bold text-slate-800 text-sm mb-1">Tidak Ada Ujian</h4>
							<p class="text-xs text-slate-500 max-w-xs mx-auto mb-4">
								Tidak ada jadwal ujian pada tanggal yang dipilih. Silakan klik tanggal lain yang bertanda titik untuk melihat jadwal ujian.
							</p>
							<button 
								type="button" 
								class="btn btn-outline btn-sm text-xs"
								on:click={() => goToNearestExam(true)}
							>
								Lihat Jadwal Terdekat
							</button>
						</div>
					{/if}
				</div>

				<!-- Unscheduled Exams if any -->
				{#if unscheduledExams.length > 0}
					<div class="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4">
						<div class="flex items-center gap-2 mb-2">
							<svg class="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.warning} />
							</svg>
							<h4 class="font-bold text-amber-900 text-xs sm:text-sm">Jadwal Belum Ditentukan ({unscheduledExams.length})</h4>
						</div>
						<div class="space-y-2">
							{#each unscheduledExams as exam}
								<div class="bg-white p-2.5 rounded-lg border border-amber-100 text-xs flex items-center justify-between gap-2">
									<div>
										<p class="font-bold text-slate-800">{exam.title}</p>
										<p class="text-slate-500">{exam.subject_code || exam.subject || 'Umum'}</p>
									</div>
									<span class="badge-secondary text-[10px]">Menunggu Jadwal</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

	<!-- TAB 2: CARDS VIEW -->
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredSchedules as exam}
				{@const status = getExamStatus(exam)}
				{@const display = getExamDisplayStatus(exam)}
				{@const isCompleted = exam.attempt_status && ['selesai', 'waktu_habis', 'remedial'].includes(exam.attempt_status)}

				<div class="card-hover p-5 bg-white border border-slate-200 flex flex-col justify-between h-full">
					<div>
						<div class="flex items-start justify-between mb-3 gap-2">
							<div class="flex items-center gap-2">
								<div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
										<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.calendar} />
									</svg>
								</div>
								{#if exam.subject_code}
									<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
										{exam.subject_code}
									</span>
								{/if}
							</div>
							<div class="flex items-center gap-1.5 flex-shrink-0">
								<span class="{display.badgeClass} text-xs font-semibold px-2.5 py-1 rounded-md {display.type === 'active' ? 'animate-pulse' : ''}">
									{display.label}
								</span>
							</div>
						</div>
						<h3 class="font-bold text-slate-800 text-lg mb-1 leading-snug break-words">{exam.title}</h3>
						<p class="text-sm text-slate-500 mb-2">{exam.subject || 'Umum'}</p>
						
						{#if exam.room_name || exam.session_number}
							<div class="mb-4 flex items-center gap-2">
								{#if exam.room_name}
									<span class="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md">
										{exam.room_name}
									</span>
								{/if}
								{#if exam.session_number}
									<span class="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md">
										Sesi {exam.session_number}
									</span>
								{/if}
							</div>
						{/if}
						
						<div class="space-y-2 mb-4">
							<div class="flex items-center text-sm text-slate-600">
								<svg class="w-4 h-4 mr-2 text-slate-400 min-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.calendar} />
								</svg>
								<span>Tanggal: {formatScheduleDate(exam.start_time)}</span>
							</div>
							<div class="flex items-center text-sm text-slate-600">
								<svg class="w-4 h-4 mr-2 text-slate-400 min-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.clock} />
								</svg>
								<span>
									Pukul: {formatTimeRange(exam.start_time, exam.end_time)}
									{#if exam.has_sessions && exam.session_number}
										<span class="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md ml-1.5 inline-block">
											Sesi {exam.session_number}
										</span>
									{/if}
								</span>
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
								<span>Soal: {exam.question_count} butir</span>
							</div>
							{#if exam.proctors}
								<div class="flex items-start text-sm text-slate-600">
									<svg class="w-4 h-4 mr-2 text-slate-400 min-w-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.users} />
									</svg>
									<div class="space-y-0.5">
										{#each parseProctors(exam.proctors) as p}
											<div>
												<span class="font-medium text-slate-700">{p.label}:</span> {p.name}
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
					
					<div class="pt-4 border-t border-slate-100 mt-auto">
						{#if isCompleted}
							<button disabled class="btn w-full justify-center bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed shadow-none">
								<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.check} />
								</svg>
								Selesai
							</button>
						{:else if status === 'ended'}
							<div class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 cursor-not-allowed">
								<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.warning} />
								</svg>
								<span class="font-semibold text-sm">Ujian Telah Berakhir</span>
							</div>
						{:else if status === 'upcoming'}
							<button disabled class="btn w-full justify-center bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
								Belum Dimulai
							</button>
						{:else if exam.attempt_status === 'mengerjakan'}
							<a href="/siswa/ujian?exam_id={exam.id}" class="btn btn-warning w-full justify-center">Lanjutkan Ujian</a>
						{:else}
							<a href="/siswa/ujian?exam_id={exam.id}" class="btn btn-primary w-full justify-center">Buka Halaman Ujian</a>
						{/if}
					</div>
				</div>
			{:else}
				<div class="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
					<div class="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.calendar} />
						</svg>
					</div>
					{#if searchQuery}
						<h3 class="text-lg font-bold text-slate-800 mb-1">Hasil Pencarian Kosong</h3>
						<p class="text-slate-500 max-w-sm mx-auto">Tidak ada jadwal ujian, mapel, atau pengawas yang cocok dengan kata kunci "{searchQuery}".</p>
					{:else}
						<h3 class="text-lg font-bold text-slate-800 mb-1">Belum Ada Jadwal</h3>
						<p class="text-slate-500 max-w-sm mx-auto">Anda belum terdaftar dalam jadwal ujian manapun saat ini. Silakan hubungi guru atau admin jika ini adalah sebuah kesalahan.</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
