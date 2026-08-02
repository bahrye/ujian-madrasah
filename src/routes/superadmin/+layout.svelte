<script lang="ts">
	import type { PageData } from './$types';
	import AppShell from '$lib/components/layout/AppShell.svelte';

	export let data: PageData;
</script>

<AppShell user={data.user}>
	<slot />
</AppShell>
