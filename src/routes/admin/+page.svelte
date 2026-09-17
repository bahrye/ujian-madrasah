<script lang="ts">
	import { parseDate } from '$lib/utils/date';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import SchoolBanner from '$lib/components/dashboard/SchoolBanner.svelte';
	import { ICONS, ATTEMPT_STATUS_LABELS, ATTEMPT_STATUS_COLORS } from '$lib/utils/constants';

	export let data;

	$: stats = data.stats;
	$: recentAttempts = data.recentAttempts as Array<any>;
</script>

<svelte:head>
	<title>Dashboard Admin — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 animate-in">
	<!-- School Banner -->
	<SchoolBanner
		schoolName={data.schoolName || data.userInfo?.school_name || ''}
		userName={data.user.name}
		role={data.user.role}
	/>
	<!-- Page Header -->
	<div>
		<h1 class="text-2xl font-bold text-slate-800">{data.user.role === 'panitia' ? 'Dashboard Panitia' : 'Dashboard Admin'}</h1>
		<p class="text-sm text-slate-500 mt-1">Berikut ringkasan sistem ujian.</p>
	</div>

	<!-- Stat Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<StatCard
			label="Total Pengguna"
			value={stats.totalUsers}
			icon={ICONS.users}
			gradient="indigo"
		/>
		<StatCard
			label="Ujian Aktif"
			value="{stats.activeExams} / {stats.totalExams}"
			icon={ICONS.exam}
			gradient="cyan"
		/>
		<StatCard
			label="Sedang Mengerjakan"
			value={stats.sedangMengerjakan}
			icon={ICONS.clock}
			gradient="amber"
		/>
		<StatCard
			label="Ujian Selesai"
			value={stats.selesai}
			icon={ICONS.check}
			gradient="emerald"
		/>
	</div>

	<!-- Role breakdown -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
		<div class="card p-5">
			<h2 class="text-lg font-bold text-slate-800 mb-4">Distribusi Pengguna</h2>
			<div class="space-y-3">
				{#each [
					{ role: 'admin', label: 'Administrator', color: 'bg-rose-500', bg: 'bg-rose-100' },
					{ role: 'guru', label: 'Guru', color: 'bg-indigo-500', bg: 'bg-indigo-100' },
					{ role: 'pengawas', label: 'Pengawas', color: 'bg-amber-500', bg: 'bg-amber-100' },
					{ role: 'panitia', label: 'Panitia', color: 'bg-emerald-500', bg: 'bg-emerald-100' },
					{ role: 'siswa', label: 'Siswa', color: 'bg-cyan-500', bg: 'bg-cyan-100' }
				] as item}
					<div class="flex items-center gap-3">
						<span class="text-sm font-medium text-slate-600 w-28">{item.label}</span>
						<div class="flex-1 h-3 {item.bg} rounded-full overflow-hidden">
							<div
								class="h-full {item.color} rounded-full transition-all duration-700"
								style="width: {stats.totalUsers > 0 ? ((stats.roleCounts[item.role] || 0) / stats.totalUsers) * 100 : 0}%"
							></div>
						</div>
						<span class="text-sm font-bold text-slate-700 w-8 text-right">{stats.roleCounts[item.role] || 0}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="card p-5">
			<h2 class="text-lg font-bold text-slate-800 mb-4">Aksi Cepat</h2>
			<div class="grid grid-cols-2 gap-3">
				<a href="/admin/users" class="card-hover p-4 text-center group">
					<div class="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.users} />
						</svg>
					</div>
					<span class="text-xs font-semibold text-slate-700">Kelola Pengguna</span>
				</a>
				<a href="/admin/exams" class="card-hover p-4 text-center group">
					<div class="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
						</svg>
					</div>
					<span class="text-xs font-semibold text-slate-700">Kelola Ujian</span>
				</a>
				<a href="/admin/results" class="card-hover p-4 text-center group">
					<div class="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.results} />
						</svg>
					</div>
					<span class="text-xs font-semibold text-slate-700">Hasil Ujian</span>
				</a>
				<a href="/admin/bank-soal" class="card-hover p-4 text-center group">
					<div class="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.questions} />
						</svg>
					</div>
					<span class="text-xs font-semibold text-slate-700">Bank Soal</span>
				</a>
			</div>
		</div>
	</div>

	<!-- Recent Activity -->
	<div class="card overflow-hidden">
		<div class="p-5 border-b border-slate-100">
			<h2 class="text-lg font-bold text-slate-800">Aktivitas Ujian Terbaru</h2>
		</div>
		{#if recentAttempts.length === 0}
			<div class="p-8 text-center text-slate-400">
				<svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
				</svg>
				<p class="text-sm">Belum ada aktivitas ujian.</p>
			</div>
		{:else}
			<div class="table-container border-0 rounded-none">
				<table class="table">
					<thead>
						<tr>
							<th>Siswa</th>
							<th>Ujian</th>
							<th>Status</th>
							<th>Nilai</th>
							<th>Waktu</th>
						</tr>
					</thead>
					<tbody>
						{#each recentAttempts as attempt}
							<tr>
								<td class="font-medium text-slate-700">{attempt.student_name}</td>
								<td class="text-slate-600">{attempt.exam_title}</td>
								<td>
									<span class={ATTEMPT_STATUS_COLORS[attempt.status] || 'badge-info'}>
										{ATTEMPT_STATUS_LABELS[attempt.status] || attempt.status}
									</span>
								</td>
								<td class="font-semibold">{attempt.score != null ? attempt.score : '-'}</td>
								<td class="text-xs text-slate-500">
									{attempt.created_at ? parseDate(attempt.created_at).toLocaleDateString('id-ID') : '-'}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
