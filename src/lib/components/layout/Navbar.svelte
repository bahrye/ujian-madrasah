<script lang="ts">
	import { ICONS, ROLE_LABELS } from '$lib/utils/constants';
	import { createEventDispatcher } from 'svelte';

	export let user: App.Locals['user'];

	const dispatch = createEventDispatcher();

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
		<div class="flex items-center gap-2">
			<span class="text-xs font-medium text-slate-500 hidden sm:block">
				{ROLE_LABELS[user?.role ?? ''] ?? ''}
			</span>
			<div class="w-8 h-8 rounded-full bg-gradient-to-br {roleGradients[user?.role ?? 'siswa']} flex items-center justify-center text-xs font-bold text-white shadow-md">
				{user?.name?.charAt(0).toUpperCase() ?? '?'}
			</div>
		</div>
	</div>
</header>
