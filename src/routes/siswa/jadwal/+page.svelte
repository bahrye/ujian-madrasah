<script lang="ts">
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

	function getExamStatus(exam: any) {
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

<svelte:head><title>Jadwal Ujian — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Jadwal Ujian</h1>
		<p class="text-sm text-slate-500 mt-1">Daftar ujian yang harus Anda ikuti beserta jadwalnya</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.schedules as exam}
			<div class="card-hover p-5 bg-white border border-slate-200 flex flex-col justify-between h-full">
				<div>
					<div class="flex items-start justify-between mb-3">
						<div class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.calendar} />
							</svg>
						</div>
						<span class="badge-primary text-xs font-semibold px-2.5 py-1 rounded-md">
							{formatScheduleDate(exam.start_time)}
						</span>
					</div>
					<h3 class="font-bold text-slate-800 text-lg line-clamp-1 mb-1">{exam.title}</h3>
					<p class="text-sm text-slate-500 mb-4">{exam.subject || 'Umum'}</p>
					
					<div class="space-y-2 mb-4">
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
								<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.users} />
							</svg>
							<span class="line-clamp-1" title={exam.proctors || 'Belum ada pengawas'}>Pengawas: {exam.proctors || '-'}</span>
						</div>
					</div>
				</div>
				
				<div class="pt-4 border-t border-slate-100 mt-auto">
					{#if getExamStatus(exam) === 'ended'}
						<button disabled class="btn w-full justify-center bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
							Berakhir
						</button>
					{:else if getExamStatus(exam) === 'upcoming'}
						<button disabled class="btn w-full justify-center bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
							Belum Dimulai
						</button>
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
				<h3 class="text-lg font-bold text-slate-800 mb-1">Belum Ada Jadwal</h3>
				<p class="text-slate-500 max-w-sm mx-auto">Anda belum terdaftar dalam jadwal ujian manapun saat ini. Silakan hubungi guru atau admin jika ini adalah sebuah kesalahan.</p>
			</div>
		{/each}
	</div>
</div>
