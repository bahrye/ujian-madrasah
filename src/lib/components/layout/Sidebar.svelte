<script lang="ts">
	import { page } from '$app/stores';
	import { ICONS, ROLE_LABELS, type MenuItem } from '$lib/utils/constants';
	import { fly } from 'svelte/transition';
	import { toasts } from '$lib/stores/toast';
	import PasswordInput from '$lib/components/ui/PasswordInput.svelte';
	import { invalidateAll } from '$app/navigation';

	export let menuItems: MenuItem[] = [];
	export let user: App.Locals['user'];
	export let isOpen: boolean = false;

	$: currentPath = $page.url.pathname;

	function isActive(href: string, path: string): boolean {
		if (href === `/${user?.role}`) {
			return path === href;
		}
		return path.startsWith(href);
	}

	const roleGradients: Record<string, string> = {
		admin: 'from-rose-500 to-pink-500',
		guru: 'from-indigo-500 to-violet-500',
		pengawas: 'from-amber-500 to-orange-500',
		siswa: 'from-cyan-500 to-sky-500'
	};

	let showProfileModal = false;
	let profileName = '';
	let profileUsername = '';
	let profilePassword = '';
	let isUpdatingProfile = false;

	function openProfileModal() {
		profileName = user?.name || '';
		profileUsername = user?.username || '';
		profilePassword = '';
		showProfileModal = true;
	}

	async function handleUpdateProfile() {
		isUpdatingProfile = true;
		try {
			const res = await fetch('/api/profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: profileName, username: profileUsername, password: profilePassword })
			});
			const data = await res.json();
			if (!res.ok) {
				toasts.error(data.error || 'Terjadi kesalahan.');
			} else {
				toasts.success(data.message);
				showProfileModal = false;
				await invalidateAll(); // Refresh data to update locals.user
			}
		} catch(e: any) {
			toasts.error(e.message);
		} finally {
			isUpdatingProfile = false;
		}
	}
</script>

<!-- Desktop Sidebar -->
<aside
	class="hidden lg:flex flex-col w-64 h-screen bg-gradient-to-b from-primary-950 to-primary-900 text-white
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
					   {isActive(item.href, currentPath)
						? 'bg-white/15 text-white shadow-lg shadow-white/5'
						: 'text-primary-300 hover:text-white hover:bg-white/10'}"
			>
				<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS[item.icon] || ''} />
				</svg>
				<span>{item.label}</span>
				{#if isActive(item.href, currentPath)}
					<div class="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-lg shadow-white/50"></div>
				{/if}
			</a>
		{/each}
	</nav>

	<!-- User Info -->
	<div class="p-4 border-t border-primary-800/50">
		<div class="flex items-center gap-3 px-3 py-2">
			{#if user?.role === 'admin'}
				<button class="flex-1 flex items-center gap-3 min-w-0 hover:bg-white/10 p-1.5 -ml-1.5 rounded-xl transition-colors text-left" on:click={openProfileModal} title="Edit Profil">
					<div class="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br {roleGradients[user?.role ?? 'siswa']} flex items-center justify-center text-sm font-bold shadow-lg overflow-hidden">
						{#if user?.photo}
							<img src={user.photo} alt={user.name} class="w-full h-full object-cover" />
						{:else}
							{user?.name?.charAt(0).toUpperCase() ?? '?'}
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold truncate group-hover:text-white">{user?.name ?? 'Pengguna'}</p>
						<div class="flex items-center gap-1 text-xs text-primary-400">
							<span>{ROLE_LABELS[user?.role ?? ''] ?? ''}</span>
							<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.edit} /></svg>
						</div>
					</div>
				</button>
			{:else}
				<div class="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br {roleGradients[user?.role ?? 'siswa']} flex items-center justify-center text-sm font-bold shadow-lg overflow-hidden">
					{#if user?.photo}
						<img src={user.photo} alt={user.name} class="w-full h-full object-cover" />
					{:else}
						{user?.name?.charAt(0).toUpperCase() ?? '?'}
					{/if}
				</div>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-semibold truncate">{user?.name ?? 'Pengguna'}</p>
					<div class="flex flex-col gap-0.5 mt-0.5">
						{#if user?.role === 'siswa'}
							<p class="text-[11px] text-primary-300 font-mono leading-none">{user?.username}</p>
						{/if}
						<p class="text-xs text-primary-400 leading-none">{ROLE_LABELS[user?.role ?? ''] ?? ''}</p>
					</div>
				</div>
			{/if}
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
							   {isActive(item.href, currentPath)
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
					{#if user?.role === 'admin'}
						<button class="flex-1 flex items-center gap-3 min-w-0 hover:bg-white/10 p-1.5 -ml-1.5 rounded-xl transition-colors text-left" on:click={openProfileModal} title="Edit Profil">
							<div class="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br {roleGradients[user?.role ?? 'siswa']} flex items-center justify-center text-sm font-bold overflow-hidden">
								{#if user?.photo}
									<img src={user.photo} alt={user.name} class="w-full h-full object-cover" />
								{:else}
									{user?.name?.charAt(0).toUpperCase() ?? '?'}
								{/if}
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-semibold truncate">{user?.name ?? 'Pengguna'}</p>
								<div class="flex items-center gap-1 text-xs text-primary-400">
									<span>{ROLE_LABELS[user?.role ?? ''] ?? ''}</span>
									<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.edit} /></svg>
								</div>
							</div>
						</button>
					{:else}
						<div class="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br {roleGradients[user?.role ?? 'siswa']} flex items-center justify-center text-sm font-bold overflow-hidden">
							{#if user?.photo}
								<img src={user.photo} alt={user.name} class="w-full h-full object-cover" />
							{:else}
								{user?.name?.charAt(0).toUpperCase() ?? '?'}
							{/if}
						</div>
						<div class="flex-1 min-w-0">
							<p class="text-sm font-semibold truncate">{user?.name ?? 'Pengguna'}</p>
							<div class="flex flex-col gap-0.5 mt-0.5">
								{#if user?.role === 'siswa'}
									<p class="text-[11px] text-primary-300 font-mono leading-none">{user?.username}</p>
								{/if}
								<p class="text-xs text-primary-400 leading-none">{ROLE_LABELS[user?.role ?? ''] ?? ''}</p>
							</div>
						</div>
					{/if}
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

<!-- Profile Modal (Admin Only) -->
{#if showProfileModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" on:click={() => (showProfileModal = false)}>
		<div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-bounce-in text-slate-800" on:click|stopPropagation>
			<h2 class="text-lg font-bold text-slate-800 mb-4">Edit Profil Administrator</h2>
			<form on:submit|preventDefault={handleUpdateProfile} class="space-y-4">
				<div>
					<label for="profile-name" class="label">Nama Lengkap</label>
					<input id="profile-name" type="text" required class="input" bind:value={profileName} />
				</div>
				<div>
					<label for="profile-username" class="label">Username</label>
					<input id="profile-username" type="text" required class="input" bind:value={profileUsername} />
				</div>
				<div>
					<label for="profile-password" class="label">Kata Sandi Baru <span class="text-slate-400 font-normal">(kosongkan jika tidak diubah)</span></label>
					<PasswordInput id="profile-password" name="password" required={false} placeholder="Kata sandi baru" bind:value={profilePassword} />
				</div>
				<div class="flex gap-3 pt-2">
					<button type="button" class="btn btn-secondary flex-1" on:click={() => (showProfileModal = false)}>Batal</button>
					<button type="submit" class="btn btn-primary flex-1" disabled={isUpdatingProfile}>
						{#if isUpdatingProfile}
							Menyimpan...
						{:else}
							Simpan Perubahan
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
