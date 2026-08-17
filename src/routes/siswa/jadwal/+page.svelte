<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	import { parseProctors, formatProctorsText } from '$lib/utils/format';
	import { ICONS } from '$lib/utils/constants';
	export let data;

	function formatScheduleDate(dateString: string | null) {
		if (!dateString) return 'Belum ditentukan';
		
		const date = parseDate(dateString);
		const today = new Date();
		
		// Reset jam untuk membandingkan murni tanggal
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

	function getExamStatus(exam: any) {
		const now = new Date();
		if (exam.end_time && now > parseDate(exam.end_time)) {
			return 'ended';
		}
		if (exam.start_time && now < parseDate(exam.start_time)) {
			return 'upcoming';
		}
		return 'active';
	}

	let searchQuery = '';

	$: filteredSchedules = (data.schedules || []).filter((exam: any) => {
		if (!searchQuery.trim()) return true;
		const q = searchQuery.toLowerCase().trim();
		const titleMatch = (exam.title || '').toLowerCase().includes(q);
		const subjectMatch = (exam.subject || '').toLowerCase().includes(q);
		const roomMatch = (exam.room_name || '').toLowerCase().includes(q);
		const proctorsStr = (exam.proctors || '').toString().toLowerCase();
		return titleMatch || subjectMatch || roomMatch || proctorsStr.includes(q);
	});
</script>

<svelte:head><title>Jadwal Ujian — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-800">Jadwal Ujian</h1>
			<p class="text-sm text-slate-500 mt-1">Daftar ujian yang harus Anda ikuti beserta jadwalnya</p>
		</div>
		<div class="relative w-full sm:w-72">
			<input 
				type="text" 
				bind:value={searchQuery}
				placeholder="Cari mapel, pengawas, ruang..." 
				class="input pl-10 pr-9 py-2 w-full text-sm rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm bg-white"
			/>
			<svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			{#if searchQuery}
				<button 
					type="button" 
					class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors" 
					on:click={() => searchQuery = ''}
					title="Hapus pencarian"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			{/if}
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each filteredSchedules as exam}
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
							<span>Soal: {exam.question_count}</span>
						</div>
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
					</div>
				</div>
				
				<div class="pt-4 border-t border-slate-100 mt-auto">
					{#if exam.attempt_status && ['selesai', 'waktu_habis', 'remedial'].includes(exam.attempt_status)}
						<button disabled class="btn w-full justify-center bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed shadow-none">
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							Selesai
						</button>
					{:else if getExamStatus(exam) === 'ended'}
						<div class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 cursor-not-allowed">
							<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
							</svg>
							<span class="font-semibold text-sm">Ujian Telah Berakhir</span>
						</div>
					{:else if getExamStatus(exam) === 'upcoming'}
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
</div>
