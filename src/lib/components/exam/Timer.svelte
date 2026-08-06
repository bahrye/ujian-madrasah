<script lang="ts">
	import { onDestroy, onMount, createEventDispatcher } from 'svelte';

	export let endTime: string; // ISO datetime string
	export let isPaused: boolean = false;
	export let showWarning: boolean = true;
	export let warningThreshold: number = 300; // 5 menit dalam detik

	const dispatch = createEventDispatcher();

	let remainingSeconds = 0;
	let interval: ReturnType<typeof setInterval>;
	let isWarning = false;
	let isCritical = false;

	$: minutes = Math.floor(remainingSeconds / 60);
	$: seconds = remainingSeconds % 60;

	$: formattedTime = `${pad(minutes)}:${pad(seconds)}`;

	$: if (showWarning) {
		isWarning = remainingSeconds <= warningThreshold && remainingSeconds > 60;
		isCritical = remainingSeconds <= 60 && remainingSeconds > 0;
	}

	function pad(n: number): string {
		return n.toString().padStart(2, '0');
	}

	function calculateRemaining() {
		if (isPaused) return; // Bekukan timer saat ujian ditahan
		const end = new Date(endTime).getTime();
		const now = Date.now();
		const diff = Math.max(0, Math.floor((end - now) / 1000));
		remainingSeconds = diff;

		if (diff <= 0) {
			clearInterval(interval);
			dispatch('timeup');
		}
	}

	onMount(() => {
		calculateRemaining();
		interval = setInterval(calculateRemaining, 1000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});
</script>

<div
	class="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold transition-all duration-500
		   {isCritical ? 'bg-rose-100 text-rose-700 animate-pulse' :
			isWarning ? 'bg-amber-100 text-amber-700' :
			'bg-slate-100 text-slate-700'}"
>
	<svg
		class="w-5 h-5 {isCritical ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-slate-500'}"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		stroke-width="2"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
	<span>{formattedTime}</span>
</div>
