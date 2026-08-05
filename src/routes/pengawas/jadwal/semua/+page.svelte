<script lang="ts">
	import { ICONS } from '$lib/utils/constants';
	export let data;

	let selectedClass = '';

	$: filteredSchedules = selectedClass
		? data.schedules.filter((exam: any) => exam.class_names && exam.class_names.includes(selectedClass))
		: data.schedules;

	function formatScheduleDate(dateString: string | null) {
		if (!dateString) return 'Belum ditentukan';
		
		const date = new Date(dateString);
		const today = new Date();
		
		date.setHours(0, 0, 0, 0);
		today.setHours(0, 0, 0, 0);
		
		const diffTime = date.getTime() - today.getTime();
		const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) return 'Hari ini';
		if (diffDays === 1) return 'Besok';
		if (diffDays === 2) return 'Lusa';
		if (diffDays > 2) return `${diffDays} hari lagi`;
		
		if (diffDays === -1) return 'Kemarin';
		if (diffDays < -1) return `${Math.abs(diffDays)} hari yang lalu`;

		return new Intl.DateTimeFormat('id-ID', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(date);
	}

	function formatTimeRange(startStr: string | null, endStr: string | null) {
		if (!startStr) return '--:--';
		const start = new Date(startStr);
		const startFormatted = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(start);
		
		if (!endStr) return `${startFormatted} - Selesai`;
		
		const end = new Date(endStr);
		const endFormatted = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(end);

		if (
			start.getDate() === end.getDate() &&
			start.getMonth() === end.getMonth() &&
			start.getFullYear() === end.getFullYear()
		) {
			return `${startFormatted} - ${endFormatted}`;
		}

		return `${startFormatted} - ${endFormatted}`;
	}

	function getExamStatus(exam: any) {
		if (!exam.is_active) return 'inactive';
		const now = new Date();
		if (exam.end_time && now > new Date(exam.end_time)) {
			return 'ended';
		}
		if (exam.start_time && now < new Date(exam.start_time)) {
			return 'upcoming';
		}
		return 'active';
	}
</script>

<svelte:head>
	<title>Semua Jadwal — Pengawas</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800 tracking-tight">Semua Jadwal Ujian</h1>
			<p class="text-sm text-slate-500 mt-1">Daftar semua jadwal ujian yang aktif di sekolah.</p>
		</div>
		<div class="flex items-center gap-2">
			<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
			</svg>
			<select bind:value={selectedClass} class="input max-w-xs">
				<option value="">Semua Kelas</option>
				{#each data.classes as cls}
					<option value={cls.name}>{cls.name}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
		{#each filteredSchedules as exam}
			<div class="card p-5 bg-white border border-slate-200 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
				<div>
					<div class="flex items-start justify-between mb-4">
						<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center text-indigo-600 shadow-sm">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.calendar} />
							</svg>
						</div>
						
						{#if getExamStatus(exam) === 'active'}
							<span class="badge-success text-xs font-semibold px-2.5 py-1 rounded-md animate-pulse">Sedang Berlangsung</span>
						{:else if getExamStatus(exam) === 'upcoming'}
							<span class="badge-warning text-xs font-semibold px-2.5 py-1 rounded-md">Akan Datang</span>
						{:else}
							<span class="badge-danger text-xs font-semibold px-2.5 py-1 rounded-md">Telah Berakhir</span>
						{/if}
					</div>
					
					<h3 class="font-bold text-slate-800 text-lg leading-tight mb-1" title={exam.title}>
						{exam.title.length > 35 ? exam.title.substring(0, 35) + '...' : exam.title}
					</h3>
					
					<div class="flex items-center gap-2 mb-4">
						<span class="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">{exam.exam_type_name || 'Ujian'}</span>
						{#if exam.subject_name}
							<span class="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 truncate max-w-[120px]" title={exam.subject_name}>{exam.subject_name}</span>
						{/if}
					</div>
				</div>

				<div class="mt-auto space-y-3 pt-4 border-t border-slate-100">
					<div class="flex flex-col gap-2">
						<div class="flex items-center gap-2 text-sm text-slate-600">
							<svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span class="font-medium">{formatScheduleDate(exam.start_time)}</span>
						</div>
						<div class="flex items-center gap-2 text-sm text-slate-600">
							<svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span class="font-medium">{formatTimeRange(exam.start_time, exam.end_time)} ({exam.duration_minutes} mnt)</span>
						</div>
						{#if exam.class_names}
							<div class="flex items-start gap-2 text-sm text-slate-600">
								<svg class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.school} />
								</svg>
								<span class="font-medium line-clamp-2" title={exam.class_names}>{exam.class_names}</span>
							</div>
						{/if}
						<div class="flex items-start gap-2 text-sm text-slate-600">
							<svg class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.users} />
							</svg>
							<span class="font-medium line-clamp-2 text-indigo-600" title={exam.proctor_names || 'Tidak ada pengawas'}>
								{exam.proctor_names || 'Tidak ada pengawas'}
							</span>
						</div>
					</div>

					<a href="/pengawas/monitor?exam_id={exam.id}" class="btn-primary w-full py-2.5 text-sm font-semibold mt-2 group relative overflow-hidden flex items-center justify-center gap-2">
						<span>Monitoring Ujian</span>
						<svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
						</svg>
					</a>
				</div>
			</div>
		{:else}
			<div class="col-span-full">
				<div class="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
					<div class="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4">
						<svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<h3 class="text-lg font-bold text-slate-700 mb-1">Tidak Ada Ujian</h3>
					<p class="text-sm">Tidak ada jadwal ujian aktif yang ditemukan berdasarkan filter Anda.</p>
				</div>
			</div>
		{/each}
	</div>
</div>
