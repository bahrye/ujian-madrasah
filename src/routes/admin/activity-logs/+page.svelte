<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ROLE_LABELS } from '$lib/utils/constants';
	import { parseDate } from '$lib/utils/date';
	import type { PageData } from './$types';

	export let data: PageData;

	let searchInput = data.searchQuery || '';
	let isSearching = false;

	$: logs = data.logs || [];

	function handleSearch(e?: Event) {
		if (e) e.preventDefault();
		isSearching = true;
		const queryParams = new URLSearchParams($page.url.searchParams);
		if (searchInput.trim()) {
			queryParams.set('q', searchInput.trim());
		} else {
			queryParams.delete('q');
		}
		goto(`?${queryParams.toString()}`, { keepFocus: true, noScroll: true }).finally(() => {
			isSearching = false;
		});
	}

	function handleReset() {
		searchInput = '';
		handleSearch();
	}

	function formatLogTime(dateStr: string): string {
		if (!dateStr) return '-';
		try {
			const d = parseDate(dateStr);
			const day = String(d.getDate()).padStart(2, '0');
			const month = String(d.getMonth() + 1).padStart(2, '0');
			const year = d.getFullYear();
			const hours = String(d.getHours()).padStart(2, '0');
			const minutes = String(d.getMinutes()).padStart(2, '0');
			const seconds = String(d.getSeconds()).padStart(2, '0');
			return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
		} catch {
			return String(dateStr);
		}
	}

	function getRoleName(role: string | null): string {
		if (!role) return '-';
		return ROLE_LABELS[role] || (role.charAt(0).toUpperCase() + role.slice(1));
	}

	function getActionBadgeStyle(action: string): string {
		const act = (action || '').toLowerCase();
		if (act === 'login') {
			return 'bg-sky-50 text-sky-700 border-sky-200/80';
		} else if (act === 'logout') {
			return 'bg-slate-100 text-slate-600 border-slate-200';
		} else if (act.includes('token')) {
			return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
		} else if (act.includes('reset')) {
			return 'bg-amber-50 text-amber-700 border-amber-200/80';
		} else if (act.includes('selesai')) {
			return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
		}
		return 'bg-blue-50 text-blue-700 border-blue-200/80';
	}
</script>

<svelte:head>
	<title>Log Aktivitas Sistem — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6 pb-12">
	<!-- Header Section -->
	<div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-slate-900 tracking-tight">Log aktivitas sistem</h1>
			<p class="text-sm text-slate-500 mt-1">
				Mencatat login, perubahan data, token, dan aksi penting lainnya (300 terbaru).
			</p>
		</div>

		<!-- Search Form -->
		<form on:submit|preventDefault={handleSearch} class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start md:self-auto w-full sm:w-auto">
			<div class="relative min-w-[240px] md:min-w-[280px]">
				<input
					type="text"
					bind:value={searchInput}
					placeholder="Cari aksi / detail / nama"
					class="w-full pl-3.5 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
				/>
				{#if searchInput}
					<button
						type="button"
						on:click={handleReset}
						class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full transition-colors"
						title="Hapus pencarian"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				{/if}
			</div>

			<button
				type="submit"
				disabled={isSearching}
				class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
			>
				{#if isSearching}
					<div class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
				{/if}
				<span>Cari</span>
			</button>
		</form>
	</div>

	<!-- Table Container -->
	<div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
						<th class="py-3.5 px-4 font-semibold">WAKTU</th>
						<th class="py-3.5 px-4 font-semibold">PENGGUNA</th>
						<th class="py-3.5 px-4 font-semibold">ROLE</th>
						<th class="py-3.5 px-4 font-semibold">AKSI</th>
						<th class="py-3.5 px-4 font-semibold">DETAIL</th>
						<th class="py-3.5 px-4 font-semibold">IP</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-sm">
					{#if logs.length === 0}
						<tr>
							<td colspan="6" class="py-12 text-center text-slate-400">
								<div class="flex flex-col items-center justify-center gap-2">
									<svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<p class="font-medium text-slate-600">Belum ada log aktivitas yang tercatat</p>
									{#if data.searchQuery}
										<p class="text-xs text-slate-400">Tidak ada log yang cocok dengan kata kunci "{data.searchQuery}"</p>
										<button on:click={handleReset} class="mt-2 text-xs font-semibold text-blue-600 hover:underline">
											Bersihkan Filter Pencarian
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{:else}
						{#each logs as log (log.id)}
							<tr class="hover:bg-slate-50/70 transition-colors">
								<!-- Waktu -->
								<td class="py-3.5 px-4 whitespace-nowrap text-slate-700 text-xs font-medium">
									{formatLogTime(log.created_at)}
								</td>

								<!-- Pengguna -->
								<td class="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
									{log.user_name || 'Sistem'}
								</td>

								<!-- Role -->
								<td class="py-3.5 px-4 whitespace-nowrap text-slate-600 text-xs font-medium">
									{getRoleName(log.user_role)}
								</td>

								<!-- Aksi Badge -->
								<td class="py-3.5 px-4 whitespace-nowrap">
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border {getActionBadgeStyle(log.action)}">
										{log.action}
									</span>
								</td>

								<!-- Detail -->
								<td class="py-3.5 px-4 text-slate-600 text-xs max-w-md break-words">
									{log.detail || '-'}
								</td>

								<!-- IP -->
								<td class="py-3.5 px-4 whitespace-nowrap font-mono text-xs font-bold text-slate-800">
									{log.ip_address || '-'}
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Footer count -->
		{#if logs.length > 0}
			<div class="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
				<span>Menampilkan <b>{logs.length}</b> log aktivitas terbaru</span>
				{#if data.searchQuery}
					<span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
						Filter: "{data.searchQuery}"
					</span>
				{/if}
			</div>
		{/if}
	</div>
</div>
