<script lang="ts">
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import { ICONS } from '$lib/utils/constants';
	export let data;

	function formatScheduleDate(dateString: string | null) {
		if (!dateString) return 'Belum ditentukan';
		
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		
		if (
			date.getDate() === tomorrow.getDate() &&
			date.getMonth() === tomorrow.getMonth() &&
			date.getFullYear() === tomorrow.getFullYear()
		) {
			return 'Besok';
		}
		
		if (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		) {
			return 'Hari ini';
		}

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
</script>

<svelte:head><title>Dashboard Pengawas — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Dashboard Pengawas</h1>
		<p class="text-sm text-slate-500 mt-1">Selamat datang, {data.user.name}.</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		<StatCard label="Ujian Aktif" value={data.stats.activeExams} icon={ICONS.exam} gradient="indigo" />
		<StatCard label="Total Token" value={data.stats.totalTokens} icon={ICONS.token} gradient="amber" />
		<StatCard label="Sedang Mengerjakan" value={data.stats.activeAttempts} icon={ICONS.monitor} gradient="cyan" />
	</div>	<!-- Jadwal Mengawas -->
	<div class="mt-8">
		<h2 class="text-xl font-bold text-slate-800 mb-4">Jadwal Mengawas</h2>
		{#if data.schedules && data.schedules.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each data.schedules as schedule}
					<div class="card p-5 border border-slate-100 relative overflow-hidden group">
						<div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
						
						<div class="flex items-start justify-between gap-4 mb-3">
							<div class="flex-1">
								<h3 class="font-bold text-slate-800 text-lg leading-tight mb-1">{schedule.title}</h3>
								<div class="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
									</svg>
									{schedule.subject_name || 'Umum'}
								</div>
							</div>
							{#if schedule.is_active}
								<span class="badge-success whitespace-nowrap">Aktif</span>
							{:else}
								<span class="badge bg-slate-100 text-slate-500 whitespace-nowrap">Selesai/Non-aktif</span>
							{/if}
						</div>
						
						<div class="space-y-2 mt-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
							<div class="flex items-center gap-2.5 text-sm text-slate-600">
								<div class="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
								<div>
									<p class="text-xs text-slate-400 font-medium leading-none mb-1">Tanggal</p>
									<p class="font-medium text-slate-700">{formatScheduleDate(schedule.start_time)}</p>
								</div>
							</div>
							
							<div class="flex items-center gap-2.5 text-sm text-slate-600">
								<div class="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div>
									<p class="text-xs text-slate-400 font-medium leading-none mb-1">Waktu & Durasi</p>
									<p class="font-medium text-slate-700">{formatTimeRange(schedule.start_time, schedule.end_time)} <span class="text-slate-400 font-normal">({schedule.duration_minutes} menit)</span></p>
								</div>
							</div>
						</div>

						<div class="mt-4">
							{#if schedule.token_code}
								<a href="/pengawas/monitor?exam_id={schedule.exam_id}" class="btn-primary w-full shadow-md shadow-indigo-500/20 py-2.5 justify-center gap-2">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.monitor} />
									</svg>
									Monitoring Ujian
								</a>
							{:else}
								<a href="/pengawas/tokens?exam_id={schedule.exam_id}&generate=1" class="btn-secondary w-full py-2.5 justify-center gap-2 hover:bg-slate-100 hover:text-slate-800 border-dashed border-2">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
									</svg>
									Generate Token
								</a>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
				<div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
					<svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
				<p class="text-slate-500">Belum ada jadwal mengawas untuk Anda.</p>
			</div>
		{/if}
	</div>

	<h2 class="text-xl font-bold text-slate-800 mb-2 mt-8">Akses Cepat</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<a href="/pengawas/tokens" class="card-hover p-6 text-center group">
			<div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
				<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.token} />
				</svg>
			</div>
			<h3 class="font-bold text-slate-800">Kelola Token Ujian</h3>
			<p class="text-sm text-slate-500 mt-1">Generate dan rilis token untuk siswa</p>
		</a>
		<a href="/pengawas/monitor" class="card-hover p-6 text-center group">
			<div class="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
				<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.monitor} />
				</svg>
			</div>
			<h3 class="font-bold text-slate-800">Monitoring Ujian</h3>
			<p class="text-sm text-slate-500 mt-1">Pantau siswa yang sedang mengerjakan</p>
		</a>
	</div>
</div>
