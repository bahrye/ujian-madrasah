<script lang="ts">
	import { onMount } from 'svelte';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { SIDEBAR_MENUS } from '$lib/utils/constants';
	export let data;

	onMount(() => {
		// Send heartbeat every 45s to maintain active status while tab is open
		const interval = setInterval(() => {
			fetch('/api/heartbeat').catch(() => {});
		}, 45000);

		return () => clearInterval(interval);
	});
</script>

<AppShell user={data.user} userInfo={data.userInfo} menuItems={SIDEBAR_MENUS.siswa}>
	<slot />
</AppShell>
