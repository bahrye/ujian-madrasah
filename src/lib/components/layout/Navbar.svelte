<script lang="ts">
	import { ICONS, ROLE_LABELS } from '$lib/utils/constants';
	import { createEventDispatcher } from 'svelte';

	export let user: App.Locals['user'];
	export let userInfo: any = null;

	let showProfileMenu = false;

	const dispatch = createEventDispatcher();

	function formatBirth(place: string, dateStr: string) {
		if (!place && !dateStr) return '-';
		let formattedDate = '';
		if (dateStr) {
			try {
				formattedDate = new Date(String(dateStr).replace(' ', 'T')).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
			} catch {
				formattedDate = dateStr;
			}
		}
		if (place && formattedDate) return `${place}, ${formattedDate}`;
		return place || formattedDate || '-';
	}

	const roleGradients: Record<string, string> = {
		admin: 'from-rose-500 to-pink-500',
		guru: 'from-indigo-500 to-violet-500',
		pengawas: 'from-amber-500 to-orange-500',
		siswa: 'from-cyan-500 to-sky-500'
	};
</script>

<header class="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 py-3">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<button
				class="p-2 -ml-1 rounded-xl hover:bg-slate-100 transition-colors"
				on:click={() => dispatch('toggle')}
				aria-label="Buka menu"
			>
				<svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.menu} />
				</svg>
			</button>
			<div class="flex items-center gap-2">
				<div class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
					<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
				<span class="font-bold text-sm text-slate-800">Ujian Madrasah</span>
			</div>
		</div>
		<div class="flex items-center gap-2 relative">
			<span class="text-xs font-medium text-slate-500 hidden sm:block">
				{ROLE_LABELS[user?.role ?? ''] ?? ''}
			</span>
			<button
				class="w-8 h-8 rounded-full bg-gradient-to-br {roleGradients[user?.role ?? 'siswa']} flex items-center justify-center text-xs font-bold text-white shadow-md hover:ring-2 ring-offset-1 ring-indigo-500 transition-all focus:outline-none"
				on:click={() => (showProfileMenu = !showProfileMenu)}
				aria-label="Toggle profile menu"
			>
				{user?.name?.charAt(0).toUpperCase() ?? '?'}
			</button>

			{#if showProfileMenu}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="fixed inset-0 z-40" on:click={() => (showProfileMenu = false)}></div>
				<div class="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-xl z-50 p-4 border border-slate-100 animate-in fade-in slide-in-from-top-2">
					{#if user?.role === 'admin'}
						<p class="text-xs text-slate-500 font-medium">Administrator Sekolah</p>
						<p class="font-bold text-slate-800 text-sm mb-1 truncate">{user?.name}</p>
						<p class="text-xs text-slate-600 truncate">{userInfo?.school_name ?? '-'}</p>
					{:else if user?.role === 'siswa'}
						<p class="text-xs text-slate-500 font-medium">Siswa</p>
						<p class="font-bold text-slate-800 text-sm mb-1 truncate">{user?.name}</p>
						<p class="text-xs text-slate-600 truncate mb-1">{userInfo?.school_name ?? '-'}</p>
						<p class="text-xs text-slate-600">NISN: {user?.username}</p>
						<p class="text-xs text-slate-600 truncate">TTL: {formatBirth(userInfo?.place_of_birth, userInfo?.date_of_birth)}</p>
					{:else}
						<p class="text-xs text-slate-500 font-medium">{ROLE_LABELS[user?.role ?? '']}</p>
						<p class="font-bold text-slate-800 text-sm mb-1 truncate">{user?.name}</p>
						<p class="text-xs text-slate-600 truncate">{userInfo?.school_name ?? '-'}</p>
					{/if}
					
					<div class="h-px bg-slate-100 my-3"></div>
					
					<a href="/api/logout" class="flex items-center gap-2 text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors text-sm font-medium">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.logout} />
						</svg>
						Keluar
					</a>
				</div>
			{/if}
		</div>
	</div>
</header>
