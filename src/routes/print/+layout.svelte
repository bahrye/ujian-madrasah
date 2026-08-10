<script lang="ts">
	import { onMount } from 'svelte';
	
	onMount(() => {
		// Automatically trigger print dialog when page loads, but give it a small delay 
		// so fonts and layouts have time to render properly.
		setTimeout(() => {
			window.print();
		}, 500);
	});
</script>

<svelte:head>
	<style>
		@page {
			margin: 1cm;
			size: A4;
		}
		@media print {
			html, body {
				height: initial !important;
				overflow: initial !important;
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
			}
			/* Hide everything that is not meant for printing */
			.no-print {
				display: none !important;
			}
		}
		
		body {
			background-color: white !important;
			color: black !important;
		}
	</style>
</svelte:head>

<div class="bg-white min-h-screen text-slate-900 print:bg-white print:text-black">
	<!-- A print button that only shows on screen, hidden on print -->
	<div class="no-print p-4 bg-white border-b border-slate-200 flex flex-wrap justify-end gap-2 shadow-sm relative z-50">
		<button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow font-medium flex items-center gap-2 transition-colors" on:click={() => window.print()}>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
			</svg>
			Cetak Dokumen
		</button>
		<button class="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg shadow font-medium transition-colors" on:click={() => window.close()}>
			Tutup
		</button>
	</div>
	
	<!-- Main print container -->
	<div class="max-w-[21cm] mx-auto print:max-w-none print:mx-0 print:w-full">
		<slot />
	</div>
</div>
