<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let src: string | null = null;
	export let alt: string = 'Pratinjau Gambar';
	export let isOpen: boolean = false;

	const dispatch = createEventDispatcher();

	let scale: number = 1;
	const minScale: number = 1;
	const maxScale: number = 4;
	const stepScale: number = 0.1;

	let translateX: number = 0;
	let translateY: number = 0;

	let isDragging: boolean = false;
	let startX: number = 0;
	let startY: number = 0;
	let lastTranslateX: number = 0;
	let lastTranslateY: number = 0;

	// Touch pinch state
	let initialPinchDist: number = 0;
	let initialPinchScale: number = 1;
	let lastTapTime: number = 0;

	let imgElement: HTMLImageElement | null = null;
	let containerElement: HTMLDivElement | null = null;

	function close() {
		resetZoom();
		dispatch('close');
	}

	function resetZoom() {
		scale = 1;
		translateX = 0;
		translateY = 0;
	}

	function setZoom(newScale: number) {
		scale = Math.min(Math.max(minScale, Number(newScale.toFixed(2))), maxScale);
		if (scale === 1) {
			translateX = 0;
			translateY = 0;
		}
	}

	function zoomIn() {
		setZoom(scale + 0.3);
	}

	function zoomOut() {
		setZoom(scale - 0.3);
	}

	function handleSliderChange(e: Event) {
		const target = e.target as HTMLInputElement;
		setZoom(parseFloat(target.value));
	}

	// Mouse Drag Handlers
	function handleMouseDown(e: MouseEvent) {
		if (e.button !== 0) return; // Only left click
		if (scale <= 1) return;
		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;
		lastTranslateX = translateX;
		lastTranslateY = translateY;
		e.preventDefault();
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging) return;
		e.preventDefault();
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		translateX = lastTranslateX + dx;
		translateY = lastTranslateY + dy;
	}

	function handleMouseUp() {
		isDragging = false;
	}

	// Wheel Zoom
	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const delta = e.deltaY < 0 ? 0.2 : -0.2;
		setZoom(scale + delta);
	}

	// Double Click to Zoom Toggle
	function handleDblClick(e: MouseEvent) {
		e.preventDefault();
		if (scale > 1) {
			resetZoom();
		} else {
			setZoom(2.2);
		}
	}

	// Touch Handlers for Pinch & Drag
	function getTouchDistance(touches: TouchList): number {
		const dx = touches[0].clientX - touches[1].clientX;
		const dy = touches[0].clientY - touches[1].clientY;
		return Math.sqrt(dx * dx + dy * dy);
	}

	function handleTouchStart(e: TouchEvent) {
		if (e.touches.length === 2) {
			e.preventDefault();
			initialPinchDist = getTouchDistance(e.touches);
			initialPinchScale = scale;
		} else if (e.touches.length === 1) {
			const currentTime = Date.now();
			const tapDiff = currentTime - lastTapTime;
			if (tapDiff < 300 && tapDiff > 0) {
				// Double tap
				e.preventDefault();
				if (scale > 1) {
					resetZoom();
				} else {
					setZoom(2.2);
				}
				lastTapTime = 0;
				return;
			}
			lastTapTime = currentTime;

			if (scale > 1) {
				isDragging = true;
				startX = e.touches[0].clientX;
				startY = e.touches[0].clientY;
				lastTranslateX = translateX;
				lastTranslateY = translateY;
			}
		}
	}

	function handleTouchMove(e: TouchEvent) {
		if (e.touches.length === 2) {
			e.preventDefault();
			const currentDist = getTouchDistance(e.touches);
			if (initialPinchDist > 0) {
				const factor = currentDist / initialPinchDist;
				setZoom(initialPinchScale * factor);
			}
		} else if (e.touches.length === 1 && isDragging && scale > 1) {
			e.preventDefault();
			const dx = e.touches[0].clientX - startX;
			const dy = e.touches[0].clientY - startY;
			translateX = lastTranslateX + dx;
			translateY = lastTranslateY + dy;
		}
	}

	function handleTouchEnd() {
		isDragging = false;
	}

	// Global Keydown (Escape to close)
	function handleKeydown(e: KeyboardEvent) {
		if (!isOpen) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			close();
		} else if (e.key === '+' || e.key === '=') {
			zoomIn();
		} else if (e.key === '-' || e.key === '_') {
			zoomOut();
		} else if (e.key === '0') {
			resetZoom();
		}
	}

	onMount(() => {
		if (browser) {
			window.addEventListener('keydown', handleKeydown);
			window.addEventListener('mouseup', handleMouseUp);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('mouseup', handleMouseUp);
		}
	});

	$: zoomPercentage = Math.round(scale * 100);
</script>

{#if isOpen && src}
	<div
		class="fixed inset-0 z-[999999] bg-slate-950/90 backdrop-blur-md flex flex-col justify-between select-none overflow-hidden animate-in fade-in duration-200"
		role="dialog"
		aria-modal="true"
		aria-label="Penampil Gambar"
		on:click|stopPropagation
		on:keydown|stopPropagation
		tabindex="-1"
	>
		<!-- Top Bar -->
		<div class="relative z-20 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent">
			<div class="flex items-center gap-2.5 text-white">
				<div class="p-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
					</svg>
				</div>
				<div>
					<h3 class="text-sm sm:text-base font-semibold text-slate-100 leading-tight">Perbesar Gambar Soal</h3>
					<p class="text-[11px] sm:text-xs text-slate-400 hidden sm:block">Gunakan slider zoom di bawah atau geser gambar untuk melihat detail</p>
				</div>
			</div>

			<!-- Close Button (Silang di Sudut Kanan Atas) -->
			<button
				type="button"
				class="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-rose-600/80 active:bg-rose-700 text-white/80 hover:text-white border border-white/20 hover:border-rose-400 transition-all duration-150 shadow-lg cursor-pointer"
				on:click={close}
				title="Tutup (Esc)"
				aria-label="Tutup penampil gambar"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<!-- Main Image Viewport Area -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			bind:this={containerElement}
			class="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden p-2 sm:p-6"
			class:cursor-grab={scale > 1 && !isDragging}
			class:cursor-grabbing={scale > 1 && isDragging}
			class:cursor-zoom-in={scale === 1}
			on:mousedown={handleMouseDown}
			on:mousemove={handleMouseMove}
			on:wheel={handleWheel}
			on:dblclick={handleDblClick}
			on:touchstart={handleTouchStart}
			on:touchmove={handleTouchMove}
			on:touchend={handleTouchEnd}
		>
			<img
				bind:this={imgElement}
				{src}
				{alt}
				draggable="false"
				class="max-w-[92vw] max-h-[72vh] sm:max-h-[76vh] object-contain shadow-2xl rounded-lg pointer-events-none select-none transition-transform duration-75 ease-out"
				style="transform: translate({translateX}px, {translateY}px) scale({scale}); transform-origin: center center;"
			/>
		</div>

		<!-- Bottom Floating Zoom Bar / Toolbar -->
		<div class="relative z-20 pb-4 sm:pb-6 px-3 flex flex-col items-center gap-2">
			<!-- Floating Control Bar -->
			<div class="flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-lg max-w-full overflow-x-auto">
				<!-- Zoom Out Button (-) -->
				<button
					type="button"
					class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
					on:click={zoomOut}
					disabled={scale <= minScale}
					title="Perkecil (-)"
				>
					<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" />
					</svg>
				</button>

				<!-- Zoom Slider (Digeser Kiri / Kanan) -->
				<div class="flex items-center gap-2 min-w-[120px] sm:min-w-[180px] md:min-w-[220px]">
					<input
						type="range"
						min={minScale}
						max={maxScale}
						step={stepScale}
						value={scale}
						on:input={handleSliderChange}
						class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 focus:outline-none"
						aria-label="Tingkat Zoom Gambar"
					/>
				</div>

				<!-- Zoom In Button (+) -->
				<button
					type="button"
					class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
					on:click={zoomIn}
					disabled={scale >= maxScale}
					title="Perbesar (+)"
				>
					<svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
					</svg>
				</button>

				<!-- Divider -->
				<div class="h-6 w-px bg-slate-700/80 shrink-0"></div>

				<!-- Zoom Percentage & Reset -->
				<button
					type="button"
					class="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-indigo-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
					on:click={resetZoom}
					title="Reset Zoom ke 100%"
				>
					<span>{zoomPercentage}%</span>
					{#if scale !== 1}
						<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					{/if}
				</button>

				<!-- Divider -->
				<div class="h-6 w-px bg-slate-700/80 shrink-0"></div>

				<!-- Tombol Tutup -->
				<button
					type="button"
					class="px-3 sm:px-4 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 active:bg-rose-700 text-rose-300 hover:text-white text-xs sm:text-sm font-semibold border border-rose-500/30 hover:border-rose-500 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
					on:click={close}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
					<span>Tutup</span>
				</button>
			</div>

			<div class="text-[11px] text-slate-400 font-medium text-center flex items-center gap-2">
				<span>💡 Klik ganda untuk zoom cepat</span>
				<span class="text-slate-600">•</span>
				<span>Geser gambar saat diperbesar</span>
			</div>
		</div>
	</div>
{/if}
