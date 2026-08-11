<script lang="ts">
	import { enhance } from '$app/forms';
	import { ICONS } from '$lib/utils/constants';

	export let data;
	export let form: { error?: string, success?: boolean, tokenCode?: string } | null;

	let loading = false;
	let starting = false;
	let showModal = false;
	let tokenCode = '';
	let agreed = false;

	// Signature Pad Logic
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let isDrawing = false;
	let signatureEmpty = true;
	let signatureData = '';

	$: if (canvas && showModal) {
		ctx = canvas.getContext('2d')!;
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 2;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	}

	function getCoordinates(e: MouseEvent | TouchEvent) {
		const rect = canvas.getBoundingClientRect();
		if (e.type.includes('touch')) {
			const touch = (e as TouchEvent).touches[0];
			return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
		} else {
			return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
		}
	}

	function startDrawing(e: MouseEvent | TouchEvent) {
		isDrawing = true;
		signatureEmpty = false;
		const { x, y } = getCoordinates(e);
		ctx.beginPath();
		ctx.moveTo(x, y);
	}

	function startDrawingTouch(e: TouchEvent) {
		startDrawing(e);
	}

	function draw(e: MouseEvent | TouchEvent) {
		if (!isDrawing) return;
		const { x, y } = getCoordinates(e);
		ctx.lineTo(x, y);
		ctx.stroke();
	}

	function drawTouch(e: TouchEvent) {
		draw(e);
	}

	function stopDrawing() {
		if (!isDrawing) return;
		isDrawing = false;
		ctx.closePath();
	}

	function clearSignature() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		signatureEmpty = true;
	}
</script>

<svelte:head><title>Mulai Ujian — Ujian Online Madrasah</title></svelte:head>

<div class="max-w-md mx-auto mt-8 animate-in">
	<div class="card p-8 text-center">
		<div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-6">
			<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.token} />
			</svg>
		</div>

		<h1 class="text-2xl font-bold text-slate-800 mb-2">Masukkan Token Ujian</h1>
		<div class="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
			<p class="font-bold text-slate-700 text-lg">{data.exam.title}</p>
			<p class="text-sm text-slate-500">{data.exam.subject || 'Umum'}</p>
		</div>
		<p class="text-sm text-slate-500 mb-6">Dapatkan token dari pengawas ujian Anda untuk memulai</p>

		{#if form?.error}
			<div class="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium text-left flex items-center gap-2">
				<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.warning} />
				</svg>
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			action="?/validateToken"
			use:enhance={() => {
				loading = true;
				return async ({ result, update }) => { 
					loading = false;
					if (result.type === 'success' && result.data?.success) {
						tokenCode = String(result.data.tokenCode);
						showModal = true;
					} else {
						await update();
					}
				};
			}}
			class="space-y-4"
		>
			<input
				name="token"
				type="text"
				required
				class="input text-center text-2xl font-mono tracking-[0.3em] uppercase py-4"
				placeholder="_ _ _ _ _ _"
				maxlength="10"
				autocomplete="off"
			/>
			<input type="hidden" name="exam_id" value={data.exam.id} />

			<button type="submit" disabled={loading} class="btn-primary w-full py-3 text-base justify-center">
				{#if loading}
					<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
					Memvalidasi...
				{:else}
					Mulai Ujian
				{/if}
			</button>
		</form>

		<p class="text-xs text-slate-400 mt-4">Token bersifat sekali pakai dan memiliki batas waktu.</p>
	</div>
</div>

<!-- Pre-Exam Modal -->
{#if showModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" on:click={() => (showModal = false)}>
		<div class="max-h-[90vh] overflow-y-auto card p-6 w-full max-w-lg animate-in fade-in zoom-in duration-200" on:click|stopPropagation>
			<div class="w-14 h-14 mx-auto rounded-full bg-indigo-100 flex items-center justify-center mb-4">
				<svg class="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
				</svg>
			</div>
			
			<h2 class="text-xl font-bold text-slate-800 text-center mb-2">Konfirmasi Ujian</h2>
			<p class="text-slate-500 text-sm text-center mb-6">Harap baca informasi dan tata tertib ujian berikut sebelum memulai.</p>
			
			<div class="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 mb-6">
				<div class="flex justify-between">
					<span class="text-sm text-slate-500">Mata Pelajaran</span>
					<span class="text-sm font-semibold text-slate-800">{data.exam.subject || 'Umum'}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-sm text-slate-500">Jumlah Soal</span>
					<span class="text-sm font-semibold text-slate-800">{data.exam.question_count} Soal</span>
				</div>
				<div class="flex justify-between">
					<span class="text-sm text-slate-500">Durasi</span>
					<span class="text-sm font-semibold text-slate-800">{data.exam.duration_minutes} Menit</span>
				</div>
				<div class="flex justify-between">
					<span class="text-sm text-slate-500">Pengawas</span>
					<span class="text-sm font-semibold text-slate-800 text-right max-w-[200px]">{data.exam.proctors || '-'}</span>
				</div>
			</div>

			<div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6">
				<h3 class="text-sm font-bold text-rose-800 mb-2 flex items-center gap-2">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.warning} />
					</svg>
					Peringatan Keras Pengawasan Ketat
				</h3>
				<ul class="text-sm text-rose-700 space-y-2 list-disc pl-5">
					<li>Ujian ini menggunakan <strong>Sistem Anti-Kecurangan Otomatis</strong>.</li>
					<li>Dilarang keras <strong class="bg-rose-200 px-1 rounded">Membuka Tab Lain</strong> atau <strong class="bg-rose-200 px-1 rounded">Keluar dari Halaman Ujian</strong>.</li>
					<li>Dilarang <strong class="bg-rose-200 px-1 rounded">Memperkecil Layar / Membuka Aplikasi Lain</strong>.</li>
					<li>Jika Anda melakukan pelanggaran batas maksimum, ujian akan <strong>Dihentikan Paksa</strong> dan jawaban otomatis dikirim!</li>
				</ul>
			</div>

			<label class="flex items-start gap-3 p-3 mb-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
				<input type="checkbox" bind:checked={agreed} class="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
				<span class="text-sm font-medium text-slate-700 leading-tight">
					Saya telah membaca peraturan ujian dan paham bahwa segala bentuk kecurangan akan tercatat secara otomatis.
				</span>
			</label>

			<!-- Signature Pad -->
			<div class="mb-6">
				<p class="text-sm font-bold text-slate-700 mb-2">Tanda Tangan (Wajib)</p>
				<p class="text-xs text-slate-500 mb-2">Silakan tanda tangan pada kotak di bawah ini menggunakan mouse atau jari (layar sentuh) sebagai bukti kehadiran.</p>
				<div class="border-2 border-dashed border-slate-300 rounded-lg overflow-hidden bg-white relative">
					<canvas 
						bind:this={canvas} 
						width="400" 
						height="150" 
						class="w-full h-[150px] cursor-crosshair touch-none"
						on:mousedown={startDrawing}
						on:mousemove={draw}
						on:mouseup={stopDrawing}
						on:mouseleave={stopDrawing}
						on:touchstart|preventDefault={startDrawingTouch}
						on:touchmove|preventDefault={drawTouch}
						on:touchend|preventDefault={stopDrawing}
						on:touchcancel|preventDefault={stopDrawing}
					></canvas>
					{#if signatureEmpty}
						<div class="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-sm">
							Tanda Tangan di sini
						</div>
					{/if}
					<button type="button" class="absolute top-2 right-2 p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 text-xs font-medium" on:click={clearSignature}>Hapus</button>
				</div>
			</div>

			<form method="POST" action="?/startExam" use:enhance={() => { 
				starting = true; 
				signatureData = canvas.toDataURL('image/png');
				return async ({ update }) => { 
					starting = false; 
					await update(); 
				}; 
			}}>
				<input type="hidden" name="token" value={tokenCode} />
				<input type="hidden" name="exam_id" value={data.exam.id} />
				<input type="hidden" name="signature" value={signatureData} />
				
				<div class="flex gap-3">
					<button type="button" class="btn-ghost flex-1 justify-center" on:click={() => (showModal = false)} disabled={starting}>Batal</button>
					<button type="submit" class="btn-primary flex-1 justify-center" disabled={!agreed || starting || signatureEmpty}>
						{#if starting}
							Memulai...
						{:else}
							Mulai Ujian
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
