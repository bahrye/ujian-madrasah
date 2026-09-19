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
	$: pagination = data.pagination || { page: 1, pageSize: 50, totalCount: logs.length, totalPages: 1 };
	$: startItem = pagination.totalCount === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1;
	$: endItem = Math.min(pagination.page * pagination.pageSize, pagination.totalCount);
	$: pageNumbers = getPageNumbers(pagination.page, pagination.totalPages);

	function handleSearch(e?: Event) {
		if (e) e.preventDefault();
		isSearching = true;
		const queryParams = new URLSearchParams($page.url.searchParams);
		if (searchInput.trim()) {
			queryParams.set('q', searchInput.trim());
		} else {
			queryParams.delete('q');
		}
		queryParams.delete('page'); // Reset ke halaman 1 setiap melakukan pencarian baru
		goto(`?${queryParams.toString()}`, { keepFocus: true, noScroll: true }).finally(() => {
			isSearching = false;
		});
	}

	function goToPage(targetPage: number) {
		if (targetPage < 1 || targetPage > pagination.totalPages || targetPage === pagination.page) return;
		const queryParams = new URLSearchParams($page.url.searchParams);
		if (targetPage === 1) {
			queryParams.delete('page');
		} else {
			queryParams.set('page', targetPage.toString());
		}
		goto(`?${queryParams.toString()}`, { noScroll: true });
	}

	function getPageNumbers(current: number, total: number): (number | string)[] {
		if (total <= 7) {
			return Array.from({ length: total }, (_, i) => i + 1);
		}
		const pages: (number | string)[] = [];
		if (current <= 4) {
			for (let i = 1; i <= 5; i++) pages.push(i);
			pages.push('...');
			pages.push(total);
		} else if (current >= total - 3) {
			pages.push(1);
			pages.push('...');
			for (let i = total - 4; i <= total; i++) pages.push(i);
		} else {
			pages.push(1);
			pages.push('...');
			pages.push(current - 1);
			pages.push(current);
			pages.push(current + 1);
			pages.push('...');
			pages.push(total);
		}
		return pages;
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
				Mencatat login, perubahan data, token, dan aksi penting lainnya (50 per halaman).
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

		<!-- Footer count & Pagination -->
		{#if logs.length > 0}
			<div class="px-4 py-3.5 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
				<!-- Item count info -->
				<div class="flex items-center gap-2 flex-wrap">
					<span>
						Menampilkan <b>{startItem} - {endItem}</b> dari <b>{pagination.totalCount.toLocaleString('id-ID')}</b> log
					</span>
					<span class="text-slate-300">•</span>
					<span class="text-slate-500">50 per halaman</span>
					{#if data.searchQuery}
						<span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
							Filter: "{data.searchQuery}"
						</span>
					{/if}
				</div>

				<!-- Pagination controls -->
				{#if pagination.totalPages > 1}
					<div class="flex items-center gap-1 flex-wrap justify-center">
						<!-- First Page -->
						<button
							type="button"
							on:click={() => goToPage(1)}
							disabled={pagination.page <= 1}
							class="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors {pagination.page <= 1 ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-2xs'}"
							title="Halaman Pertama"
						>
							«
						</button>

						<!-- Prev Page -->
						<button
							type="button"
							on:click={() => goToPage(pagination.page - 1)}
							disabled={pagination.page <= 1}
							class="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors {pagination.page <= 1 ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-2xs'}"
							title="Halaman Sebelumnya"
						>
							‹
						</button>

						<!-- Page Numbers -->
						{#each pageNumbers as p}
							{#if p === '...'}
								<span class="px-2 py-1 text-slate-400 font-medium">...</span>
							{:else}
								<button
									type="button"
									on:click={() => goToPage(Number(p))}
									class="min-w-[32px] px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors {p === pagination.page ? 'bg-blue-600 border-blue-600 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}"
								>
									{p}
								</button>
							{/if}
						{/each}

						<!-- Next Page -->
						<button
							type="button"
							on:click={() => goToPage(pagination.page + 1)}
							disabled={pagination.page >= pagination.totalPages}
							class="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors {pagination.page >= pagination.totalPages ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-2xs'}"
							title="Halaman Berikutnya"
						>
							›
						</button>

						<!-- Last Page -->
						<button
							type="button"
							on:click={() => goToPage(pagination.totalPages)}
							disabled={pagination.page >= pagination.totalPages}
							class="px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors {pagination.page >= pagination.totalPages ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-2xs'}"
							title="Halaman Terakhir"
						>
							»
						</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
