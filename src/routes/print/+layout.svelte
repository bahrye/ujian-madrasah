<svelte:head>
	<style>
		@page {
			margin: 0;
			size: A4;
		}
		@media print {
			html, body {
				height: initial !important;
				overflow: initial !important;
				-webkit-print-color-adjust: exact;
				print-color-adjust: exact;
			}
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
	<!-- Main print container -->
	<div class="max-w-[21cm] mx-auto print:max-w-none print:mx-0 print:w-full">
		<slot />
	</div>
</div>
