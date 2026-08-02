<script lang="ts">
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { SIDEBAR_MENUS } from '$lib/utils/constants';
	export let data;
</script>

<AppShell user={data.user} menuItems={SIDEBAR_MENUS.guru}>
	<slot />
</AppShell>
