<script lang="ts">
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { SIDEBAR_MENUS } from '$lib/utils/constants';
	export let data;

	$: menuItems = (() => {
		if (data.user?.role === 'guru') {
			return [
				...SIDEBAR_MENUS.guru,
				{
					label: 'Pengawasan Ujian',
					icon: 'monitor',
					subItems: [
						{ label: 'Dashboard Pengawas', href: '/pengawas' },
						{ label: 'Tata Tertib', href: '/pengawas/tata-tertib' },
						{ label: 'Jadwal Saya', href: '/pengawas/jadwal/saya' },
						{ label: 'Jadwal Semua', href: '/pengawas/jadwal/semua' },
						{ label: 'Generate Token', href: '/pengawas/tokens' },
						{ label: 'Monitoring Siswa', href: '/pengawas/monitor' },
						{ label: 'Reset Login Siswa', href: '/pengawas/reset-login' }
					]
				}
			];
		}
		return SIDEBAR_MENUS.pengawas;
	})();
</script>

<AppShell user={data.user} userInfo={data.userInfo} {menuItems}>
	<slot />
</AppShell>
