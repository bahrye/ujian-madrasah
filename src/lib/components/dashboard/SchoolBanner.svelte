<script lang="ts">
	export let schoolName: string = '';
	export let userName: string = '';
	export let role: string = '';

	const roleConfig: Record<string, { label: string; gradient: string; icon: string }> = {
		guru: {
			label: 'Guru',
			gradient: 'from-indigo-600 via-violet-600 to-purple-700',
			icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
		},
		pengawas: {
			label: 'Pengawas',
			gradient: 'from-amber-500 via-orange-500 to-rose-500',
			icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
		},
		siswa: {
			label: 'Siswa',
			gradient: 'from-cyan-500 via-sky-500 to-blue-600',
			icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222'
		},
		admin: {
			label: 'Administrator',
			gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
			icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
		},
		panitia: {
			label: 'Panitia Ujian',
			gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
			icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
		}
	};

	$: config = roleConfig[role] ?? roleConfig['admin'];

	function getGreeting(): string {
		const hour = new Date().getHours();
		if (hour >= 5 && hour < 12) return 'Selamat Pagi';
		if (hour >= 12 && hour < 15) return 'Selamat Siang';
		if (hour >= 15 && hour < 18) return 'Selamat Sore';
		return 'Selamat Malam';
	}
</script>

<div class="school-banner relative overflow-hidden rounded-2xl bg-gradient-to-r {config.gradient} p-5 sm:p-6 text-white shadow-xl">
	<!-- Decorative circles -->
	<div class="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5"></div>
	<div class="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5"></div>
	<div class="absolute top-4 right-28 w-20 h-20 rounded-full bg-white/10"></div>
	<div class="absolute bottom-2 right-8 w-14 h-14 rounded-full bg-white/10"></div>
	<!-- Dot pattern overlay -->
	<div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px;"></div>
	<!-- Shine overlay -->
	<div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

	<div class="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
		<!-- Role icon badge -->
		<div class="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-lg">
			<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d={config.icon} />
			</svg>
		</div>

		<!-- Text content -->
		<div class="flex-1 min-w-0">
			<p class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-0.5">Madrasah</p>
			<h2 class="text-lg sm:text-2xl font-extrabold leading-tight tracking-tight drop-shadow school-name-text">
				{schoolName || 'Madrasah'}
			</h2>
			<p class="text-sm text-white/85 mt-1.5 font-medium flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
				<span>{getGreeting()},</span>
				<span class="text-white font-bold">{userName}</span>
				<span class="text-white/40">·</span>
				<span class="inline-flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 text-xs font-semibold border border-white/20">
					{config.label}
				</span>
			</p>
		</div>

		<!-- Right badge -->
		<div class="hidden sm:flex flex-col items-center justify-center flex-shrink-0">
			<div class="px-4 py-2 rounded-xl bg-white/15 border border-white/20 backdrop-blur-sm text-center">
				<p class="text-xs font-extrabold text-white uppercase tracking-wider">Sistem Ujian</p>
				<p class="text-[10px] text-white/60 tracking-wide">Online Madrasah</p>
			</div>
		</div>
	</div>
</div>

<style>
	.school-name-text {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-shadow: 0 1px 4px rgba(0,0,0,0.2);
	}
</style>
