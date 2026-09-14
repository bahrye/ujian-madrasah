<script lang="ts">
	import { onMount } from 'svelte';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { SIDEBAR_MENUS } from '$lib/utils/constants';
	export let data;

	onMount(() => {
		// Send heartbeat every 120s to maintain active status while tab is open
		// Skip if tab is in background or if student is actively taking an exam
		const interval = setInterval(() => {
			if (typeof document !== 'undefined' && document.hidden) return;
			if (typeof window !== 'undefined' && window.location.pathname.startsWith('/siswa/ujian')) return;
			fetch('/api/heartbeat').catch(() => {});
		}, 120000);

		return () => clearInterval(interval);
	});
</script>

<AppShell user={data.user} userInfo={data.userInfo} menuItems={SIDEBAR_MENUS.siswa}>
	<slot />
</AppShell>
