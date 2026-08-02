<script lang="ts">
	import { onMount } from 'svelte';

	export let src: string;
	export let maxPlays: number = 3;

	let audio: HTMLAudioElement;
	let playCount = 0;
	let isPlaying = false;
	let currentTime = 0;
	let duration = 0;
	let progress = 0;
	let canPlay = true;

	$: canPlay = playCount < maxPlays;
	$: if (duration > 0) {
		progress = (currentTime / duration) * 100;
	}

	function togglePlay() {
		if (!canPlay) return;
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
	}

	function handlePlay() {
		isPlaying = true;
	}

	function handlePause() {
		isPlaying = false;
	}

	function handleEnded() {
		isPlaying = false;
		playCount++;
		currentTime = 0;
		progress = 0;
	}

	function handleTimeUpdate() {
		currentTime = audio.currentTime;
	}

	function handleLoadedMetadata() {
		duration = audio.duration;
	}

	function formatTime(secs: number): string {
		const m = Math.floor(secs / 60);
		const s = Math.floor(secs % 60);
		return `${m}:${s.toString().padStart(2, '0')}`;
	}

	onMount(() => {
		audio = new Audio(src);
		audio.addEventListener('play', handlePlay);
		audio.addEventListener('pause', handlePause);
		audio.addEventListener('ended', handleEnded);
		audio.addEventListener('timeupdate', handleTimeUpdate);
		audio.addEventListener('loadedmetadata', handleLoadedMetadata);

		return () => {
			audio.pause();
			audio.removeEventListener('play', handlePlay);
			audio.removeEventListener('pause', handlePause);
			audio.removeEventListener('ended', handleEnded);
			audio.removeEventListener('timeupdate', handleTimeUpdate);
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
		};
	});
</script>

<div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-3">
	<div class="flex items-center gap-3">
		<!-- Play/Pause Button -->
		<button
			class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0
				   {canPlay
					? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105'
					: 'bg-slate-300 text-slate-500 cursor-not-allowed'}"
			on:click={togglePlay}
			disabled={!canPlay}
			title={canPlay ? (isPlaying ? 'Jeda' : 'Putar') : 'Batas putar tercapai'}
		>
			{#if isPlaying}
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
					<rect x="6" y="4" width="4" height="16" rx="1" />
					<rect x="14" y="4" width="4" height="16" rx="1" />
				</svg>
			{:else}
				<svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
					<path d="M8 5v14l11-7z" />
				</svg>
			{/if}
		</button>

		<!-- Progress Bar -->
		<div class="flex-1 min-w-0">
			<div class="h-2 bg-slate-200 rounded-full overflow-hidden">
				<div
					class="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-150"
					style="width: {progress}%"
				></div>
			</div>
			<div class="flex justify-between mt-1.5">
				<span class="text-xs text-slate-500 font-medium">{formatTime(currentTime)}</span>
				<span class="text-xs text-slate-500 font-medium">{formatTime(duration)}</span>
			</div>
		</div>

		<!-- Play Count -->
		<div class="flex-shrink-0 text-center">
			<div class="text-xs font-bold {canPlay ? 'text-indigo-600' : 'text-rose-500'}">
				{playCount}/{maxPlays}
			</div>
			<div class="text-[10px] text-slate-400">putar</div>
		</div>
	</div>
</div>
