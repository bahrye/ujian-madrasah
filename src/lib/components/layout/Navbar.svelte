<script lang="ts">
	import { ICONS, ROLE_LABELS } from '$lib/utils/constants';
	import { createEventDispatcher } from 'svelte';
	import { parseDate } from '$lib/utils/date';
	import MyQrLoginModal from '$lib/components/auth/MyQrLoginModal.svelte';

	export let user: App.Locals['user'];
	export let userInfo: any = null;

	let showProfileMenu = false;
	let showMyQrModal = false;

	const dispatch = createEventDispatcher();

	function formatBirth(place: string, dateStr: string) {
		if (!place && !dateStr) return '-';
		let formattedDate = '';
		if (dateStr) {
			try {
				formattedDate = parseDate(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
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
	let profileContainerEl: HTMLElement;

	function handleOutsideInteraction(event: Event) {
		if (!showProfileMenu) return;
		const target = event.target as Node;
		if (profileContainerEl && !profileContainerEl.contains(target)) {
			showProfileMenu = false;
		}
	}
</script>

<svelte:window 
	on:pointerdown={handleOutsideInteraction}
	on:touchstart={handleOutsideInteraction}
	on:click={handleOutsideInteraction}
	on:keydown={(e) => { if (e.key === 'Escape') showProfileMenu = false; }}
/>

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
		<div class="flex items-center gap-2 relative" bind:this={profileContainerEl}>
			<span class="text-xs font-medium text-slate-500 hidden sm:block">
				{ROLE_LABELS[user?.role ?? ''] ?? ''}
			</span>
			<button
				class="w-8 h-8 rounded-full bg-gradient-to-br {roleGradients[user?.role ?? 'siswa']} flex items-center justify-center text-xs font-bold text-white shadow-md hover:ring-2 ring-offset-1 ring-indigo-500 transition-all focus:outline-none overflow-hidden cursor-pointer"
				on:click={() => (showProfileMenu = !showProfileMenu)}
				aria-label="Toggle profile menu"
			>
				{#if user?.photo}
					<img src={user.photo} alt={user.name} class="w-full h-full object-cover" />
				{:else}
					{user?.name?.charAt(0).toUpperCase() ?? '?'}
				{/if}
			</button>

			{#if showProfileMenu}
				<div class="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl shadow-indigo-500/10 z-50 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right duration-200">
					<!-- Header Section -->
					<div class="bg-gradient-to-r {roleGradients[user?.role ?? 'siswa']} p-5 text-white relative overflow-hidden">
						<!-- Decorative Elements -->
						<div class="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
						<div class="absolute -bottom-6 -left-6 w-20 h-20 bg-black/10 rounded-full blur-lg"></div>
						
						<div class="relative z-10 flex items-center gap-4">
							<div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-xl font-bold shadow-inner overflow-hidden">
								{#if user?.photo}
									<img src={user.photo} alt={user.name} class="w-full h-full object-cover" />
								{:else}
									{user?.name?.charAt(0).toUpperCase() ?? '?'}
								{/if}
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-[10px] font-bold text-white/90 uppercase tracking-widest mb-0.5">{ROLE_LABELS[user?.role ?? '']}</p>
								<p class="font-bold text-base truncate leading-tight">{user?.name}</p>
							</div>
						</div>
					</div>

					<!-- Details Section -->
					<div class="p-4 bg-slate-50/50 space-y-3">
						<!-- School -->
						{#if userInfo?.school_name}
							<div class="flex items-start gap-3 text-sm group">
								<div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300 shadow-sm">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1v1H9V7zm5 0h1v1h-1V7zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1zm-5 4h1v1H9v-1zm5 0h1v1h-1v-1z" /></svg>
								</div>
								<div class="min-w-0 flex-1 pt-0.5">
									<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Sekolah</p>
									<p class="font-semibold text-slate-700 text-xs truncate">{userInfo.school_name}</p>
								</div>
							</div>
						{/if}

						{#if user?.role === 'siswa'}
							<!-- Nomor Peserta -->
							{#if userInfo?.nomor_peserta || user?.username}
								<div class="flex items-start gap-3 text-sm group">
									<div class="w-8 h-8 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300 shadow-sm">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
									</div>
									<div class="min-w-0 flex-1 pt-0.5">
										<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Nomor Peserta</p>
										<p class="font-semibold text-slate-700 text-xs truncate">{userInfo?.nomor_peserta || user?.username}</p>
									</div>
								</div>
							{/if}

							<!-- NISN -->
							<div class="flex items-start gap-3 text-sm group">
								<div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300 shadow-sm">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
								</div>
								<div class="min-w-0 flex-1 pt-0.5">
									<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">NISN</p>
									<p class="font-semibold text-slate-700 text-xs truncate font-mono">{userInfo?.nisn || '-'}</p>
								</div>
							</div>
							
							<!-- TTL -->
							<div class="flex items-start gap-3 text-sm group">
								<div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
								</div>
								<div class="min-w-0 flex-1 pt-0.5">
									<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tempat, Tanggal Lahir</p>
									<p class="font-semibold text-slate-700 text-xs truncate">{formatBirth(userInfo?.place_of_birth, userInfo?.date_of_birth)}</p>
								</div>
							</div>
						{:else if (user?.role === 'guru' || user?.role === 'pengawas') && userInfo?.nip}
							<!-- NIP -->
							<div class="flex items-start gap-3 text-sm group">
								<div class="w-8 h-8 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300 shadow-sm">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
								</div>
								<div class="min-w-0 flex-1 pt-0.5">
									<p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">NIP</p>
									<p class="font-semibold text-slate-700 text-xs truncate font-mono">{userInfo.nip}</p>
								</div>
							</div>
						{/if}
					</div>
					
					<!-- Footer Action -->
					<div class="p-3 border-t border-slate-100 bg-white space-y-2">
						<button
							type="button"
							class="flex items-center justify-center gap-2 w-full text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white p-2.5 rounded-xl transition-all duration-200 font-semibold text-xs group shadow-sm"
							on:click={() => {
								showProfileMenu = false;
								showMyQrModal = true;
							}}
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
							</svg>
							QR Akses Login Saya
						</button>
						<a href="/api/logout" class="flex items-center justify-center gap-2 w-full text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 font-semibold text-xs group shadow-sm">
							<svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.logout} />
							</svg>
							Keluar Aplikasi
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</header>

<MyQrLoginModal
	show={showMyQrModal}
	user={user}
	schoolName={userInfo?.school_name || ''}
	on:close={() => (showMyQrModal = false)}
/>
