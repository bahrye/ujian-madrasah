<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import type { MenuItem } from '$lib/utils/constants';

	export let user: App.Locals['user'];
	export let userInfo: any = null;
	export let menuItems: MenuItem[] = [];

	let sidebarOpen = false;
</script>

<div class="min-h-screen bg-slate-50">
	<Sidebar {menuItems} {user} bind:isOpen={sidebarOpen} />
	<Navbar {user} {userInfo} on:toggle={() => (sidebarOpen = !sidebarOpen)} />

	<main class="lg:ml-64 min-h-screen">
		<div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
			<slot />
		</div>
	</main>

	<Toast />
</div>
