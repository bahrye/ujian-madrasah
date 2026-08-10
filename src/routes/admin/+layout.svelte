<script lang="ts">
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { SIDEBAR_MENUS } from '$lib/utils/constants';

	export let data;

	$: menuItems = data.user?.role === 'panitia' 
		? SIDEBAR_MENUS.admin.filter(item => !['Profil Sekolah', 'Pengguna', 'Siswa', 'Kelas'].includes(item.label))
		: SIDEBAR_MENUS.admin;
</script>

<AppShell user={data.user} userInfo={data.userInfo} {menuItems}>
	<slot />
</AppShell>
