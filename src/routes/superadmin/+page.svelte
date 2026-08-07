<script lang="ts">
	import { parseDate } from '$lib/utils/date';

	import type { PageData } from './$types';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import { ICONS } from '$lib/utils/constants';

	export let data: PageData;
	const { totalSchools, totalAdmins, recentSchools } = data;
</script>

<svelte:head>
	<title>Superadmin Dashboard - Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold text-slate-800 tracking-tight">Superadmin Dashboard</h1>
		<p class="text-slate-500 mt-1">Ringkasan penggunaan platform ujian multi-sekolah.</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<StatCard
			label="Total Sekolah"
			value={totalSchools.toString()}
			icon={ICONS.school}
			gradient="indigo"
		/>
		<StatCard
			label="Total Admin Sekolah"
			value={totalAdmins.toString()}
			icon={ICONS.users}
			gradient="cyan"
		/>
	</div>

	<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
		<div class="p-6 border-b border-slate-100">
			<h2 class="text-xl font-bold text-slate-800">Sekolah Terbaru</h2>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="bg-slate-50 text-slate-500 text-sm">
						<th class="p-4 font-semibold">Nama Sekolah</th>
						<th class="p-4 font-semibold">Alamat</th>
						<th class="p-4 font-semibold">Tanggal Daftar</th>
						<th class="p-4 font-semibold">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-100 text-slate-700">
					{#each recentSchools as school}
						<tr class="hover:bg-slate-50 transition-colors">
							<td class="p-4 font-medium text-slate-900">{school.name}</td>
							<td class="p-4">{school.address || '-'}</td>
							<td class="p-4">{parseDate(school.created_at).toLocaleDateString('id-ID')}</td>
							<td class="p-4">
								{#if school.is_active}
									<span class="badge badge-success">Aktif</span>
								{:else}
									<span class="badge badge-danger">Nonaktif</span>
								{/if}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="4" class="p-8 text-center text-slate-500">
								Belum ada data sekolah.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
