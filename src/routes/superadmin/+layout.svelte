<script lang="ts">
	import type { PageData } from './$types';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { SIDEBAR_MENUS } from '$lib/utils/constants';

	export let data: PageData;
</script>

<AppShell user={data.user} menuItems={SIDEBAR_MENUS.superadmin}>
	<slot />
</AppShell>
