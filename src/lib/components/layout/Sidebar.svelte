<script lang="ts">
	import { page } from '$app/stores';
	import { ICONS, ROLE_LABELS, type MenuItem } from '$lib/utils/constants';
	import { fly } from 'svelte/transition';

	export let menuItems: MenuItem[] = [];
	export let user: App.Locals['user'];
	export let isOpen: boolean = false;

	$: currentPath = $page.url.pathname;

	function isActive(href: string): boolean {
		if (href === `/${user?.role}`) {
			return currentPath === href;
		}
		return currentPath.startsWith(href);
	}

	const roleGradients: Record<string, string> = {
		admin: 'from-rose-500 to-pink-500',
		guru: 'from-indigo-500 to-violet-500',
		pengawas: 'from-amber-500 to-orange-500',
		siswa: 'from-cyan-500 to-sky-500'
	};
</script>

<!-- Desktop Sidebar -->
<aside
	class="hidden lg:flex flex-col w-64 min-h-screen bg-gradient-to-b from-primary-950 to-primary-900 text-white
		   border-r border-primary-800/50 fixed left-0 top-0 z-40"
>
	<!-- Logo -->
	<div class="p-6 border-b border-primary-800/50">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
				<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
			</div>
			<div>
				<h1 class="text-base font-bold tracking-tight">Ujian Madrasah</h1>
				<p class="text-xs text-primary-300">Sistem Ujian Online</p>
			</div>
		</div>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 p-4 space-y-1 overflow-y-auto">
		{#each menuItems as item}
			<a
				href={item.href}
				class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
					   {isActive(item.href)
						? 'bg-white/15 text-white shadow-lg shadow-white/5'
						: 'text-primary-300 hover:text-white hover:bg-white/10'}"
			>
				<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS[item.icon] || ''} />
				</svg>
				<span>{item.label}</span>
				{#if isActive(item.href)}
					<div class="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-lg shadow-white/50"></div>
				{/if}
			</a>
		{/each}
	</nav>

	<!-- User Info -->
	<div class="p-4 border-t border-primary-800/50">
		<div class="flex items-center gap-3 px-3 py-2">
			<div class="w-9 h-9 rounded-full bg-gradient-to-br {roleGradients[user?.role ?? 'siswa']} flex items-center justify-center text-sm font-bold shadow-lg">
				{user?.name?.charAt(0).toUpperCase() ?? '?'}
			</div>
			<div class="flex-1 min-w-0">
				<p class="text-sm font-semibold truncate">{user?.name ?? 'Pengguna'}</p>
				<p class="text-xs text-primary-400">{ROLE_LABELS[user?.role ?? ''] ?? ''}</p>
			</div>
			<a
				href="/api/logout"
				class="p-1.5 rounded-lg text-primary-400 hover:text-white hover:bg-white/10 transition-colors"
				title="Keluar"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.logout} />
				</svg>
			</a>
		</div>
	</div>
</aside>

<!-- Mobile Sidebar Overlay -->
{#if isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
		on:click={() => (isOpen = false)}
		transition:fly={{ duration: 200 }}
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<aside
			class="w-72 h-full bg-gradient-to-b from-primary-950 to-primary-900 text-white shadow-2xl flex flex-col"
			on:click|stopPropagation
			transition:fly={{ x: -288, duration: 300 }}
		>
			<!-- Logo -->
			<div class="p-5 border-b border-primary-800/50 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
						</svg>
					</div>
					<span class="text-base font-bold">Ujian Madrasah</span>
				</div>
				<button
					class="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
					on:click={() => (isOpen = false)}
					aria-label="Tutup menu"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.close} />
					</svg>
				</button>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 p-4 space-y-1 overflow-y-auto">
				{#each menuItems as item}
					<a
						href={item.href}
						class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
							   {isActive(item.href)
								? 'bg-white/15 text-white'
								: 'text-primary-300 hover:text-white hover:bg-white/10'}"
						on:click={() => (isOpen = false)}
					>
						<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS[item.icon] || ''} />
						</svg>
						<span>{item.label}</span>
					</a>
				{/each}
			</nav>

			<!-- User + Logout -->
			<div class="p-4 border-t border-primary-800/50">
				<div class="flex items-center gap-3 px-3 py-2">
					<div class="w-9 h-9 rounded-full bg-gradient-to-br {roleGradients[user?.role ?? 'siswa']} flex items-center justify-center text-sm font-bold">
						{user?.name?.charAt(0).toUpperCase() ?? '?'}
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold truncate">{user?.name ?? 'Pengguna'}</p>
						<p class="text-xs text-primary-400">{ROLE_LABELS[user?.role ?? ''] ?? ''}</p>
					</div>
				</div>
				<a
					href="/api/logout"
					class="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-primary-300 hover:text-white hover:bg-white/10 transition-colors"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.logout} />
					</svg>
					Keluar
				</a>
			</div>
		</aside>
	</div>
{/if}
