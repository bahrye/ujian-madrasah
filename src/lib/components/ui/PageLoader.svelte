<script lang="ts">
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';
	
	let progress = 0;
	let visible = false;
	let timer: any;
	
	$: if ($navigating) {
		visible = true;
		progress = 10; // Start at 10%
		clearInterval(timer);
		timer = setInterval(() => {
			progress += (95 - progress) * 0.1; // Ease towards 95%
		}, 100);
	} else {
		progress = 100;
		clearInterval(timer);
		setTimeout(() => {
			visible = false;
			setTimeout(() => {
				progress = 0;
			}, 300); // Wait for fade out
		}, 300); // Stay at 100% briefly before hiding
	}
	
	onMount(() => {
		return () => clearInterval(timer);
	});
</script>

{#if visible}
	<div class="fixed top-0 left-0 w-full h-1 z-[100] transition-opacity duration-300" style="opacity: {visible ? '1' : '0'}">
		<div 
			class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 transition-all ease-out"
			style="width: {progress}%; transition-duration: {progress === 100 ? '300ms' : '100ms'};"
		></div>
		<!-- Glow effect -->
		<div class="absolute top-0 right-0 h-full w-20 bg-white/40 blur-sm mix-blend-overlay animate-pulse transform translate-x-1/2" style="left: {progress}%;"></div>
	</div>
{/if}
