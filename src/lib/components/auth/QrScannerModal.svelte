<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import { parseQrLoginData, type ParsedQrLogin } from '$lib/utils/qrLogin';

	let Html5QrcodeClass: any = null;
	async function getHtml5QrcodeClass() {
		if (!browser) return null;
		if (!Html5QrcodeClass) {
			const mod = await import('html5-qrcode');
			Html5QrcodeClass = mod.Html5Qrcode;
		}
		return Html5QrcodeClass;
	}

	export let show = false;

	const dispatch = createEventDispatcher<{
		scan: ParsedQrLogin;
		close: void;
	}>();

	let scannerContainerId = 'qr-reader-' + Math.random().toString(36).substring(2, 9);
	let html5QrCode: any = null;
	let isScanning = false;
	let cameras: Array<{ id: string; label: string }> = [];
	let selectedCameraId: string = '';
	let errorMessage = '';
	let isProcessing = false;
	let fileInput: HTMLInputElement;
	let isTorchOn = false;
	let hasTorch = false;
	let isStarting = false;

	let isAnalyzingFile = false;

	// Audio feedback for successful scan using Web Audio API
	function playSuccessBeep() {
		try {
			const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
			if (!AudioContextClass) return;
			const ctx = new AudioContextClass();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = 'sine';
			osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
			osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6 note

			gain.gain.setValueAtTime(0.2, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start();
			osc.stop(ctx.currentTime + 0.15);
		} catch (err) {
			console.debug('Audio feedback not available:', err);
		}
	}

	async function getCameras() {
		try {
			const Html5Qrcode = await getHtml5QrcodeClass();
			const devices = await Html5Qrcode.getCameras();
			if (devices && devices.length) {
				cameras = devices;
				// Prefer back camera on mobile or default first camera
				const backCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear') || d.label.toLowerCase().includes('environment'));
				selectedCameraId = backCam ? backCam.id : devices[0].id;
			}
		} catch (err) {
			console.warn('Unable to list cameras:', err);
		}
	}

	async function startScanner() {
		if (isScanning || isStarting || isAnalyzingFile) return;
		isStarting = true;
		errorMessage = '';

		try {
			const Html5Qrcode = await getHtml5QrcodeClass();
			if (!html5QrCode) {
				html5QrCode = new Html5Qrcode(scannerContainerId);
			}

			if (cameras.length === 0) {
				await getCameras();
			}

			const cameraConfig = selectedCameraId
				? { deviceId: { exact: selectedCameraId } }
				: { facingMode: 'environment' };

			const config = {
				fps: 15,
				qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
					const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
					const size = Math.floor(minEdge * 0.72);
					return { width: size, height: size };
				},
				aspectRatio: 1.0
			};

			await html5QrCode.start(
				cameraConfig,
				config,
				onScanSuccess,
				onScanFailure
			);

			isScanning = true;

			// Check for torch capability
			try {
				const capabilities = html5QrCode.getRunningTrackCapabilities();
				hasTorch = Boolean(capabilities && (capabilities as any).torch);
			} catch {
				hasTorch = false;
			}
		} catch (err: any) {
			console.error('Start scanner error:', err);
			errorMessage = err?.message || 'Gagal mengakses kamera. Pastikan izin kamera telah diberikan.';
			isScanning = false;
		} finally {
			isStarting = false;
		}
	}

	async function stopScanner() {
		if (html5QrCode && isScanning) {
			try {
				await html5QrCode.stop();
			} catch (err) {
				console.debug('Stop scanner error:', err);
			}
			isScanning = false;
		}
	}

	function onScanSuccess(decodedText: string) {
		if (isProcessing) return;
		
		const parsed = parseQrLoginData(decodedText);
		if (parsed && parsed.username) {
			isProcessing = true;
			playSuccessBeep();
			stopScanner();
			dispatch('scan', parsed);
		} else {
			errorMessage = 'Format QR Code tidak dikenali sebagai kode login ujian.';
			// Clear error after 4 seconds
			setTimeout(() => {
				if (errorMessage.includes('Format QR Code')) {
					errorMessage = '';
				}
			}, 4000);
		}
	}

	function onScanFailure(_error: string) {
		// Frame-by-frame decoding miss - expected while searching for QR
	}

	async function handleCameraChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		selectedCameraId = target.value;
		if (isScanning) {
			await stopScanner();
			await startScanner();
		}
	}

	async function toggleTorch() {
		if (!html5QrCode || !isScanning || !hasTorch) return;
		try {
			isTorchOn = !isTorchOn;
			await html5QrCode.applyVideoConstraints({
				advanced: [{ torch: isTorchOn }] as any
			});
		} catch (err) {
			console.warn('Failed to toggle torch:', err);
			isTorchOn = false;
		}
	}

	/**
	 * Multi-strategy file decoder:
	 * 1. Native BarcodeDetector API (fastest & robust on full cards/high-res)
	 * 2. Html5Qrcode file scan in isolated container
	 * 3. Scaled canvas fallback for extreme resolution photos
	 */
	async function decodeQrFromFile(file: File): Promise<string | null> {
		// Strategy 1: Native BarcodeDetector (Supported in modern Chrome, Edge, Android)
		if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
			try {
				const formats = await (window as any).BarcodeDetector.getSupportedFormats?.() || ['qr_code'];
				if (formats.includes('qr_code')) {
					const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
					const img = new Image();
					const objectUrl = URL.createObjectURL(file);
					await new Promise<void>((resolve, reject) => {
						img.onload = () => resolve();
						img.onerror = () => reject(new Error('Image load failed'));
						img.src = objectUrl;
					});
					const barcodes = await detector.detect(img);
					URL.revokeObjectURL(objectUrl);
					if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
						return barcodes[0].rawValue;
					}
				}
			} catch (err) {
				console.debug('Native BarcodeDetector scan failed, falling back:', err);
			}
		}

		// Strategy 2: Isolated Html5Qrcode instance on detached container
		const tempContainerId = 'qr-isolated-file-' + Math.random().toString(36).substring(2, 9);
		const tempDiv = document.createElement('div');
		tempDiv.id = tempContainerId;
		tempDiv.style.position = 'fixed';
		tempDiv.style.left = '-9999px';
		tempDiv.style.width = '300px';
		tempDiv.style.height = '300px';
		tempDiv.style.visibility = 'hidden';
		document.body.appendChild(tempDiv);

		let tempScanner: any = null;
		try {
			const Html5Qrcode = await getHtml5QrcodeClass();
			tempScanner = new Html5Qrcode(tempContainerId);
			const decodedText = await tempScanner.scanFile(file, false);
			if (decodedText) {
				return decodedText;
			}
		} catch (err) {
			console.debug('Isolated Html5Qrcode file scan error:', err);
		} finally {
			if (tempScanner) {
				try {
					await tempScanner.clear();
				} catch {}
			}
			if (tempDiv.parentNode) {
				tempDiv.parentNode.removeChild(tempDiv);
			}
		}

		// Strategy 3: Canvas downscaling fallback (for high-res phone cameras > 2000px)
		try {
			const img = new Image();
			const objectUrl = URL.createObjectURL(file);
			await new Promise<void>((resolve, reject) => {
				img.onload = () => resolve();
				img.onerror = () => reject(new Error('Image load failed'));
				img.src = objectUrl;
			});

			const maxDim = 1000;
			if (img.width > maxDim || img.height > maxDim) {
				const canvas = document.createElement('canvas');
				const scale = Math.min(maxDim / img.width, maxDim / img.height);
				canvas.width = Math.round(img.width * scale);
				canvas.height = Math.round(img.height * scale);
				const ctx = canvas.getContext('2d');
				if (ctx) {
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					URL.revokeObjectURL(objectUrl);

					// Try Native BarcodeDetector on downscaled canvas if available
					if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
						try {
							const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
							const barcodes = await detector.detect(canvas);
							if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
								return barcodes[0].rawValue;
							}
						} catch {}
					}

					// Try Html5Qrcode on downscaled canvas blob
					const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg', 0.92));
					const QrClass = await getHtml5QrcodeClass();
					if (blob && QrClass) {
						const resizedFile = new File([blob], 'resized-qr.jpg', { type: 'image/jpeg' });
						const fallbackContainerId = 'qr-fallback-file-' + Math.random().toString(36).substring(2, 9);
						const fallbackDiv = document.createElement('div');
						fallbackDiv.id = fallbackContainerId;
						fallbackDiv.style.position = 'fixed';
						fallbackDiv.style.left = '-9999px';
						document.body.appendChild(fallbackDiv);
						const fallbackScanner = new QrClass(fallbackContainerId);
						try {
							const res = await fallbackScanner.scanFile(resizedFile, false);
							if (res) return res;
						} finally {
							try { await fallbackScanner.clear(); } catch {}
							if (fallbackDiv.parentNode) fallbackDiv.parentNode.removeChild(fallbackDiv);
						}
					}
				}
			} else {
				URL.revokeObjectURL(objectUrl);
			}
		} catch (err) {
			console.debug('Scaled canvas decoding failed:', err);
		}

		return null;
	}

	async function handleFileUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (!files || files.length === 0) return;

		const file = files[0];
		errorMessage = '';
		isAnalyzingFile = true;
		const wasScanning = isScanning;

		try {
			// Stop active camera scanner to avoid hardware/resource conflicts
			if (isScanning) {
				await stopScanner();
			}

			const decodedText = await decodeQrFromFile(file);

			if (decodedText) {
				onScanSuccess(decodedText);
			} else {
				errorMessage = 'Tidak dapat menemukan kode QR yang jelas pada gambar yang diunggah. Pastikan foto QR terlihat fokus dan tidak terpotong.';
				// Resume camera if still modal open
				if (show && wasScanning && !isProcessing) {
					startScanner();
				}
			}
		} catch (err: any) {
			console.error('Scan file error:', err);
			errorMessage = 'Terjadi kesalahan saat memproses gambar. Silakan coba lagi.';
			if (show && wasScanning && !isProcessing) {
				startScanner();
			}
		} finally {
			isAnalyzingFile = false;
			if (target) target.value = '';
		}
	}

	function handleClose() {
		stopScanner();
		isProcessing = false;
		isAnalyzingFile = false;
		errorMessage = '';
		dispatch('close');
	}

	$: if (show) {
		setTimeout(() => {
			if (!isAnalyzingFile) {
				startScanner();
			}
		}, 100);
	} else {
		stopScanner();
	}

	onDestroy(() => {
		stopScanner();
		if (html5QrCode) {
			try {
				html5QrCode.clear();
			} catch {}
		}
	});

	function portal(node: HTMLElement) {
		let destroyed = false;
		setTimeout(() => {
			if (!destroyed && node && node.parentNode !== document.body) {
				document.body.appendChild(node);
			}
		}, 0);
		return {
			destroy() {
				destroyed = true;
				if (node && node.parentNode) node.parentNode.removeChild(node);
			}
		};
	}
</script>

{#if show}
	<div use:portal class="fixed inset-0 z-[100] flex items-center justify-center p-4">
		<!-- Backdrop -->
		<div
			class="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in"
			on:click={handleClose}
			role="button"
			tabindex="-1"
			aria-label="Tutup pemindai QR"
		></div>

		<!-- Modal Dialog -->
		<div class="bg-slate-900 text-white w-full max-w-md rounded-3xl shadow-2xl shadow-indigo-950/50 border border-slate-700/60 relative z-10 flex flex-col max-h-[92vh] overflow-hidden qr-modal-anim">
			
			<!-- Modal Header -->
			<div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 backdrop-blur">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
						</svg>
					</div>
					<div>
						<h2 class="text-base font-bold text-white leading-tight">Scan QR Kartu Ujian</h2>
						<p class="text-xs text-slate-400">Arahkan kamera ke QR kartu ujian Anda</p>
					</div>
				</div>
				<button
					class="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors"
					on:click={handleClose}
					aria-label="Tutup"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Scanner Viewport Area -->
			<div class="p-6 flex-1 flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
				
				<!-- Video Viewport Container -->
				<div class="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden bg-black border-2 border-indigo-500/40 shadow-inner flex items-center justify-center">
					
					<!-- html5-qrcode target element -->
					<div id={scannerContainerId} class="w-full h-full object-cover"></div>

					<!-- Visual Overlay Viewfinder (Guide Frame & Laser) -->
					<div class="absolute inset-0 pointer-events-none flex items-center justify-center">
						<!-- Viewfinder Target Box -->
						<div class="relative w-3/4 h-3/4 border-2 border-dashed border-indigo-400/50 rounded-2xl overflow-hidden">
							
							<!-- Corner Highlights -->
							<div class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg"></div>
							<div class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg"></div>
							<div class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg"></div>
							<div class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-lg"></div>

							<!-- Animated Scanning Laser Line -->
							{#if isScanning && !isProcessing}
								<div class="scan-laser absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]"></div>
							{/if}
						</div>
					</div>

					<!-- Loading / Processing indicator -->
					{#if isAnalyzingFile}
						<div class="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-3 text-white z-20">
							<svg class="w-8 h-8 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
							</svg>
							<p class="text-xs font-semibold text-cyan-300">Menganalisis file gambar QR...</p>
						</div>
					{:else if isStarting}
						<div class="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-3 text-slate-300">
							<svg class="w-8 h-8 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
							</svg>
							<p class="text-xs font-medium tracking-wide">Menyiapkan kamera...</p>
						</div>
					{:else if isProcessing}
						<div class="absolute inset-0 bg-indigo-950/90 flex flex-col items-center justify-center gap-3 text-white">
							<div class="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
								<svg class="w-6 h-6 text-emerald-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<p class="text-sm font-bold text-emerald-300">QR Terdeteksi! Memproses login...</p>
						</div>
					{/if}
				</div>

				<!-- Error alert -->
				{#if errorMessage}
					<div class="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs font-medium flex items-center gap-2 max-w-sm text-center">
						<svg class="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						<span class="flex-1">{errorMessage}</span>
					</div>
				{/if}

				<!-- Camera Controls & Switcher -->
				<div class="mt-4 flex items-center justify-center gap-2 flex-wrap w-full max-w-sm">
					{#if cameras.length > 1}
						<div class="relative flex-1 min-w-[140px]">
							<select
								class="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
								bind:value={selectedCameraId}
								on:change={handleCameraChange}
								disabled={isAnalyzingFile || isProcessing}
							>
								{#each cameras as cam}
									<option value={cam.id}>{cam.label || `Kamera ${cam.id.slice(0, 5)}`}</option>
								{/each}
							</select>
						</div>
					{/if}

					{#if hasTorch}
						<button
							type="button"
							class="p-2 rounded-xl border transition-colors {isTorchOn ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}"
							on:click={toggleTorch}
							title="Senter"
							disabled={isAnalyzingFile || !isScanning}
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						</button>
					{/if}

					<!-- Upload Image Fallback -->
					<input
						type="file"
						accept="image/*"
						class="hidden"
						bind:this={fileInput}
						on:change={handleFileUpload}
					/>

					<button
						type="button"
						class="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
						disabled={isAnalyzingFile || isProcessing}
						on:click={() => fileInput.click()}
					>
						{#if isAnalyzingFile}
							<svg class="w-4 h-4 text-cyan-400 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
							</svg>
							<span>Menganalisis...</span>
						{:else}
							<svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<span>Unggah Foto QR</span>
						{/if}
					</button>
				</div>
			</div>

			<!-- Modal Footer -->
			<div class="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400">
				<div class="flex items-center gap-1.5">
					<span class="w-2 h-2 rounded-full {isScanning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}"></span>
					<span>{isScanning ? 'Kamera aktif' : 'Kamera nonaktif'}</span>
				</div>
				<button
					type="button"
					class="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
					on:click={handleClose}
				>
					Batal
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.qr-modal-anim {
		animation: modalZoomIn 0.24s cubic-bezier(0.34, 1.56, 0.64, 1) both;
	}

	@keyframes modalZoomIn {
		from {
			opacity: 0;
			transform: scale(0.93) translateY(12px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.scan-laser {
		animation: laserScan 2s ease-in-out infinite alternate;
	}

	@keyframes laserScan {
		0% {
			top: 5%;
		}
		100% {
			top: 92%;
		}
	}

	/* Force html5-qrcode video element to fit nicely */
	:global(#qr-reader-container video),
	:global([id^='qr-reader-'] video) {
		width: 100% !important;
		height: 100% !important;
		object-fit: cover !important;
		border-radius: 1rem !important;
	}

	:global([id^='qr-reader-']) {
		border: none !important;
	}
</style>
