<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { parseWordHtmlToQuestions } from '$lib/utils/wordParser';
	import { env } from '$env/dynamic/public';
	import { toasts } from '$lib/stores/toast';

	export let show = false;

	const dispatch = createEventDispatcher();

	let fileInput: HTMLInputElement;
	let selectedFile: File | null = null;
	let isParsing = false;
	let parsedData: any[] = [];
	let errorMsg = '';
	let isImporting = false;
	
	const cloudName = env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfhtjgwcz';
	const uploadPreset = env.PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ujian-madrasah';

	interface DocxImageTask {
		id: string;
		base64: string;
		mimeType: string;
		status: 'pending' | 'uploading' | 'success' | 'error';
		url?: string;
		error?: string;
		retryCount: number;
	}

	let imageTasks: Map<string, DocxImageTask> = new Map();
	let isUploadingImages = false;
	let uploadedCount = 0;
	let totalImages = 0;
	let uploadErrorsCount = 0;

	// Generator placeholder SVG Data URI dengan ikon IMAGE dan teks
	function createPlaceholderSvgUri(status: 'pending' | 'uploading' | 'error' = 'pending'): string {
		const isError = status === 'error';
		const isUploading = status === 'uploading';
		const bg = isError ? '#FFF1F2' : isUploading ? '#EEF2FF' : '#F8FAFC';
		const border = isError ? '#FDA4AF' : isUploading ? '#818CF8' : '#CBD5E1';
		const iconBoxBg = isError ? '#FFE4E6' : isUploading ? '#E0E7FF' : '#EEF2FF';
		const iconColor = isError ? '#E11D48' : '#6366F1';
		const textColor = isError ? '#E11D48' : '#4F46E5';
		const subtextColor = isError ? '#BE123C' : isUploading ? '#4338CA' : '#64748B';
		const label = isError 
			? 'Gagal diunggah' 
			: isUploading 
				? 'Mengunggah ke cloud...' 
				: 'Gambar terdeteksi (siap diunggah)';

		const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 76" width="220" height="76" fill="none">
  <rect width="220" height="76" rx="10" fill="${bg}" stroke="${border}" stroke-width="1.5" stroke-dasharray="${isError ? 'none' : '4 3'}"/>
  <g transform="translate(14, 18)">
    <rect width="40" height="40" rx="8" fill="${iconBoxBg}" stroke="${iconColor}" stroke-width="1.5"/>
    <circle cx="13" cy="14" r="3.5" fill="${iconColor}"/>
    <path d="M6 32 L16 20 L24 28 L30 22 L36 32" fill="none" stroke="${iconColor}" stroke-width="1.5" stroke-linejoin="round"/>
  </g>
  <text x="64" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="${textColor}" letter-spacing="0.5">IMAGE</text>
  <text x="64" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="500" fill="${subtextColor}">${label}</text>
</svg>`;

		return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
	}

	// Kompresi gambar sisi klien menggunakan Canvas (WebP/JPEG 0.82, max dimension 1200px)
	async function compressImageToBlob(base64Data: string, mimeType: string): Promise<Blob> {
		const dataUri = base64Data.startsWith('data:') ? base64Data : `data:${mimeType};base64,${base64Data}`;
		
		const img = new Image();
		await new Promise((resolve, reject) => {
			img.onload = resolve;
			img.onerror = () => reject(new Error('Gagal memuat gambar untuk kompresi'));
			img.src = dataUri;
		});

		const maxDim = 1200;
		let width = img.naturalWidth || img.width;
		let height = img.naturalHeight || img.height;

		if (width > maxDim || height > maxDim) {
			if (width > height) {
				height = Math.round((height * maxDim) / width);
				width = maxDim;
			} else {
				width = Math.round((width * maxDim) / height);
				height = maxDim;
			}
		}

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error('Canvas 2D context tidak tersedia');

		ctx.drawImage(img, 0, 0, width, height);

		return new Promise((resolve, reject) => {
			// Coba export sebagai WebP untuk efisiensi maksimal, fallback ke JPEG
			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(blob);
					} else {
						canvas.toBlob(
							(fallbackBlob) => {
								if (fallbackBlob) resolve(fallbackBlob);
								else reject(new Error('Gagal mengompres gambar'));
							},
							'image/jpeg',
							0.82
						);
					}
				},
				'image/webp',
				0.82
			);
		});
	}

	// Unggah binary Blob langsung ke Cloudinary
	async function uploadBlobToCloudinary(blob: Blob): Promise<string> {
		if (!cloudName || !uploadPreset) {
			throw new Error('Sistem belum dikonfigurasi untuk unggah media.');
		}

		const formData = new FormData();
		formData.append('file', blob, 'image.webp');
		formData.append('upload_preset', uploadPreset);
		formData.append('folder', 'ujian-madrasah/media');

		const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			const errJson = await response.json().catch(() => null);
			throw new Error(errJson?.error?.message || 'Gagal mengunggah gambar ke server.');
		}

		const data = (await response.json()) as any;
		const secureUrl = data?.secure_url;
		if (!secureUrl) throw new Error('URL gambar tidak diterima dari server.');

		// Simpan pelacakan media di database (latar belakang)
		try {
			fetch('/api/track-media', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: secureUrl, media_type: 'image' })
			}).catch(() => {});
		} catch {}

		return secureUrl;
	}

	// Mengganti placeholder gambar dengan URL Cloudinary yang berhasil terunggah
	function replaceImageInQuestions(imgId: string, cloudUrl: string) {
		const placeholderRegex = new RegExp(`<img[^>]*data-img-id=["']${imgId}["'][^>]*>`, 'g');
		const replacementHtml = `<img src="${cloudUrl}" alt="Gambar Soal" class="max-h-64 object-contain rounded-lg border border-slate-200 my-2" loading="lazy" />`;

		for (const q of parsedData) {
			if (q.question_text && q.question_text.includes(`data-img-id="${imgId}"`)) {
				q.question_text = q.question_text.replace(placeholderRegex, replacementHtml);
			}
			if (Array.isArray(q.options)) {
				let changed = false;
				for (let j = 0; j < q.options.length; j++) {
					if (q.options[j] && q.options[j].includes(`data-img-id="${imgId}"`)) {
						q.options[j] = q.options[j].replace(placeholderRegex, replacementHtml);
						changed = true;
					}
				}
				if (changed) {
					q.options_json = JSON.stringify(q.options);
				}
			}
		}
		parsedData = parsedData; // Reaktivitas Svelte agar preview terupdate seketika
	}

	function markImageErrorInQuestions(imgId: string) {
		const placeholderRegex = new RegExp(`<img[^>]*data-img-id=["']${imgId}["'][^>]*>`, 'g');
		const errorPlaceholder = `<img src="${createPlaceholderSvgUri('error')}" data-img-id="${imgId}" class="docx-img-placeholder my-2 rounded-xl border border-rose-200 bg-rose-50/50 p-2 max-h-24 inline-block object-contain" alt="[IMAGE - Gagal diunggah]" />`;

		for (const q of parsedData) {
			if (q.question_text && q.question_text.includes(`data-img-id="${imgId}"`)) {
				q.question_text = q.question_text.replace(placeholderRegex, errorPlaceholder);
			}
			if (Array.isArray(q.options)) {
				let changed = false;
				for (let j = 0; j < q.options.length; j++) {
					if (q.options[j] && q.options[j].includes(`data-img-id="${imgId}"`)) {
						q.options[j] = q.options[j].replace(placeholderRegex, errorPlaceholder);
						changed = true;
					}
				}
				if (changed) {
					q.options_json = JSON.stringify(q.options);
				}
			}
		}
		parsedData = parsedData;
	}

	// Proses unggah satu item dengan auto-retry
	async function processTask(task: DocxImageTask) {
		task.status = 'uploading';
		imageTasks.set(task.id, task);

		try {
			const compressedBlob = await compressImageToBlob(task.base64, task.mimeType);
			const url = await uploadBlobToCloudinary(compressedBlob);
			task.url = url;
			task.status = 'success';
			replaceImageInQuestions(task.id, url);
			uploadedCount++;
		} catch (err: any) {
			console.error(`Gagal mengunggah gambar ${task.id}:`, err);
			if (task.retryCount < 2) {
				task.retryCount++;
				await new Promise((r) => setTimeout(r, 700));
				return processTask(task);
			}
			task.status = 'error';
			task.error = err.message || 'Gagal mengunggah gambar';
			markImageErrorInQuestions(task.id);
			uploadErrorsCount++;
		}
	}

	// Memulai unggah paralel di latar belakang (concurrency 4)
	async function startBackgroundUpload() {
		if (isUploadingImages || imageTasks.size === 0) return;
		isUploadingImages = true;
		uploadedCount = Array.from(imageTasks.values()).filter((t) => t.status === 'success').length;
		uploadErrorsCount = 0;
		totalImages = imageTasks.size;

		const pendingTasks = Array.from(imageTasks.values()).filter((t) => t.status !== 'success');
		const concurrencyLimit = 4;
		let taskIndex = 0;

		async function worker() {
			while (taskIndex < pendingTasks.length) {
				const currentTask = pendingTasks[taskIndex++];
				await processTask(currentTask);
			}
		}

		const workers = Array.from({ length: Math.min(concurrencyLimit, pendingTasks.length) }, () => worker());
		await Promise.all(workers);

		isUploadingImages = false;
	}

	function retryFailedUploads() {
		for (const [id, task] of imageTasks.entries()) {
			if (task.status === 'error') {
				task.status = 'pending';
				task.retryCount = 0;
				task.error = undefined;
				
				// Kembalikan placeholder loading
				const placeholderRegex = new RegExp(`<img[^>]*data-img-id=["']${id}["'][^>]*>`, 'g');
				const loadingPlaceholder = `<img src="${createPlaceholderSvgUri('loading')}" data-img-id="${id}" class="docx-img-placeholder my-2 rounded-xl border border-indigo-200 bg-slate-50 p-2 max-h-32 inline-block object-contain" alt="[IMAGE - Memproses gambar...]" />`;
				for (const q of parsedData) {
					if (q.question_text && q.question_text.includes(`data-img-id="${id}"`)) {
						q.question_text = q.question_text.replace(placeholderRegex, loadingPlaceholder);
					}
					if (Array.isArray(q.options)) {
						for (let j = 0; j < q.options.length; j++) {
							if (q.options[j] && q.options[j].includes(`data-img-id="${id}"`)) {
								q.options[j] = q.options[j].replace(placeholderRegex, loadingPlaceholder);
							}
						}
					}
				}
			}
		}
		parsedData = parsedData;
		uploadErrorsCount = 0;
		startBackgroundUpload();
	}

	function close(force = false) {
		if (isImporting && !force) return;
		show = false;
		selectedFile = null;
		parsedData = [];
		errorMsg = '';
		isImporting = false;
		isUploadingImages = false;
		imageTasks.clear();
		uploadedCount = 0;
		totalImages = 0;
		uploadErrorsCount = 0;
		if (fileInput) fileInput.value = '';
		dispatch('close');
	}

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
				if (node && node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}
		};
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			selectedFile = input.files[0];
			errorMsg = '';
			parsedData = [];
			imageTasks.clear();
			uploadedCount = 0;
			totalImages = 0;
			uploadErrorsCount = 0;
		}
	}

	async function parseWord() {
		if (!selectedFile) return;
		isParsing = true;
		errorMsg = '';
		parsedData = [];
		imageTasks.clear();
		uploadedCount = 0;
		totalImages = 0;
		uploadErrorsCount = 0;

		try {
			const [mammothModule, jszipModule] = await Promise.all([
				import('mammoth'),
				import('jszip')
			]);
			const mammoth: any = (mammothModule as any).default || mammothModule;
			const JSZip: any = (jszipModule as any).default || jszipModule;

			const arrayBuffer = await selectedFile.arrayBuffer();

			// --- PREPROCESS DOCX FOR OMML (Math Equations) ---
			const zip = await JSZip.loadAsync(arrayBuffer);
			const docXmlFile = zip.file("word/document.xml");
			let modifiedArrayBuffer = arrayBuffer;
			
			if (docXmlFile) {
				let xml = await docXmlFile.async("string");
				xml = xml.replace(/<m:t>/g, '<w:t>');
				xml = xml.replace(/<m:t ([^>]+)>/g, '<w:t $1>');
				xml = xml.replace(/<\/m:t>/g, '</w:t>');

				xml = xml.replace(/<m:r>/g, '<w:r>');
				xml = xml.replace(/<m:r ([^>]+)>/g, '<w:r $1>');
				xml = xml.replace(/<\/m:r>/g, '</w:r>');

				xml = xml.replace(/<\/?m:[^>]+>/g, '');
				
				zip.file("word/document.xml", xml);
				modifiedArrayBuffer = await zip.generateAsync({type: "arraybuffer"});
			}
			// --- END PREPROCESS ---
			
			let imgCounter = 0;
			const imageMap = new Map<string, { id: string; base64: string; mimeType: string }>();

			// Konfigurasi Mammoth.js: Gambar langsung diberi placeholder ikon IMAGE dan diunggah di latar belakang
			const options = {
				convertImage: (mammoth as any).images.imgElement(async function(image: any) {
					const imageBuffer = await image.read("base64");
					const mimeType = image.contentType || 'image/png';
					const fingerprint = `${imageBuffer.length}_${imageBuffer.slice(0, 100)}_${imageBuffer.slice(-100)}`;

					let imgId: string;
					if (imageMap.has(fingerprint)) {
						imgId = imageMap.get(fingerprint)!.id;
					} else {
						imgId = `docx_img_${imgCounter++}`;
						imageMap.set(fingerprint, { id: imgId, base64: imageBuffer, mimeType });
					}

					return {
						src: `data:${mimeType};base64,${imageBuffer}`,
						'data-img-id': imgId,
						class: 'inline-block align-middle max-h-48 object-contain my-0.5 mx-1',
						style: 'vertical-align: middle;',
						alt: 'Gambar Soal'
					};
				})
			};

			const result = await mammoth.convertToHtml({ arrayBuffer: modifiedArrayBuffer }, options);
			const html = result.value; 
			
			if (result.messages && result.messages.length > 0) {
				console.warn("Mammoth messages:", result.messages);
			}

			// Menggunakan parser utilitas untuk memecah HTML menjadi soal
			const questions = parseWordHtmlToQuestions(html);

			if (questions.length === 0) {
				throw new Error('Tidak ada soal yang ditemukan. Pastikan format penulisan benar (diawali dengan "1. ", lalu opsi "A. ", dan diakhiri "KUNCI: A").');
			}

			parsedData = questions.map((q, i) => {
				if (!q.correct_answer && q.type !== 'essay') {
					throw new Error(`Soal nomor ${i+1} kehilangan Kunci Jawaban. Pastikan ada tulisan "KUNCI: A" (atau jawaban lainnya) di bawah opsi.`);
				}
				if (q.type.startsWith('pilihan_ganda') && q.options.length < 2) {
					throw new Error(`Soal nomor ${i+1} (Pilihan Ganda) tidak memiliki opsi jawaban yang cukup. Pastikan diawali huruf kapital dan titik/kurung (misal "A. " atau "a) ").`);
				}

				return {
					type: q.type,
					question_text: q.question_text,
					options: q.options,
					options_json: JSON.stringify(q.options),
					correct_answer: q.correct_answer,
					correct_answer_json: JSON.stringify(q.correct_answer),
					points: 1
				};
			});

			// Daftarkan tugas unggah gambar di memori lokal (TIDAK langsung diunggah ke Cloudinary agar tidak jadi sampah jika dibatalkan)
			for (const item of imageMap.values()) {
				imageTasks.set(item.id, {
					id: item.id,
					base64: item.base64,
					mimeType: item.mimeType,
					status: 'pending',
					retryCount: 0
				});
			}

			totalImages = imageTasks.size;
			uploadedCount = 0;
			uploadErrorsCount = 0;
			// Solusi 1: Gambar disiapkan di memori browser. Unggah Cloudinary baru dipicu saat klik 'Import Soal'
			
		} catch (error: any) {
			errorMsg = error.message || 'Terjadi kesalahan saat memproses file.';
			console.error("Error parsing Word:", error);
		} finally {
			isParsing = false;
		}
	}

	async function confirmImport() {
		if (parsedData.length === 0 || isImporting) return;

		isImporting = true;
		errorMsg = '';

		// Jika ada gambar yang perlu diunggah ke Cloudinary, unggah paralel sekarang
		if (imageTasks.size > 0 && uploadedCount < totalImages) {
			await startBackgroundUpload();

			if (uploadErrorsCount > 0) {
				isImporting = false;
				errorMsg = `Terdapat ${uploadErrorsCount} gambar yang gagal diunggah ke server. Silakan periksa koneksi internet Anda atau coba lagi.`;
				return;
			}
		}

		try {
			dispatch('import', { questions: parsedData });
			close(true);
		} catch (error: any) {
			errorMsg = error.message || "Gagal memproses import soal.";
			console.error("Error confirming import:", error);
			isImporting = false;
		}
	}
</script>

<svelte:window on:keydown={(e) => { if (show && e.key === 'Escape' && !isImporting) close(); }} />

{#if show}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div use:portal class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" on:click={() => { if (!isImporting) close(); }}>
		<div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" on:click|stopPropagation>
			<!-- Header -->
			<div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
				<h3 class="font-bold text-slate-800 flex items-center gap-2">
					<svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
					</svg>
					Import dari Word (.docx)
				</h3>
				<button 
					type="button" 
					class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent" 
					disabled={isImporting} 
					title={isImporting ? 'Proses unggah dan import sedang berjalan...' : 'Tutup'}
					on:click={() => close()}
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>

			<!-- Body -->
			<div class="p-6 flex-1 overflow-y-auto">
				<!-- Petunjuk & Template -->
				<div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
					<h4 class="font-bold text-indigo-800 mb-2 flex items-center gap-2">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
						Petunjuk Import
					</h4>
					<p class="text-sm text-indigo-700 mb-2">Pastikan file Word (.docx) Anda mengikuti format penulisan baku agar sistem dapat membacanya dengan tepat.</p>
					<ul class="text-xs text-indigo-700 list-disc list-inside mb-3 space-y-1">
						<li><b>Pilihan Ganda:</b> Opsi A,B,C,D dan <code>KUNCI: A</code></li>
						<li><b>Pilihan Ganda Kompleks:</b> Kunci lebih dari satu (pisahkan koma) <code>KUNCI: A, B</code></li>
						<li><b>Benar Salah:</b> Opsi tidak perlu ditulis, cukup <code>KUNCI: Benar</code> atau <code>KUNCI: Salah</code></li>
						<li><b>Isian Singkat:</b> Opsi tidak perlu ditulis, cukup <code>KUNCI: [jawaban Anda]</code></li>
						<li><b>Esai:</b> Opsi tidak perlu ditulis, cukup <code>KUNCI: ESSAY</code></li>
						<li><b>Pernyataan Bersusun:</b> Apit pernyataan bernomor dengan kurung kurawal <code>&#123;</code> dan <code>&#125;</code> di baris tersendiri agar formatnya tidak rusak (contoh lihat template).</li>
						<li><b>Tips Kualitas Gambar:</b> Di Word: <b>File > Options > Advanced > Image Size and Quality</b> centang <b>"Do not compress images in file"</b>.</li>
						<li><b>Rumus & Teks Arab:</b> Fitur <i>Equation</i> tidak didukung. Untuk rumus, gunakan LaTeX (contoh: <code>$$ x = \frac{1}{2} $$</code>) atau jadikan gambar. Untuk teks Arab, gunakan font Unicode biasa (Arial/Times New Roman), jangan gunakan <i>Equation</i>.</li>
					</ul>
					
					<div class="bg-white p-3 rounded-lg border border-indigo-100 text-sm text-slate-600 font-mono mb-3 max-h-48 overflow-y-auto">
						1. Siapa penemu lampu?<br>
						A. Thomas Alfa Edison<br>
						B. Alexander Graham Bell<br>
						C. Nikola Tesla<br>
						D. Albert Einstein<br>
						KUNCI: A<br>
						<br>
						2. Ibukota Indonesia adalah...<br>
						KUNCI: Jakarta<br>
						<br>
						3. Jelaskan proses terjadinya hujan!<br>
						KUNCI: ESSAY<br>
						<br>
						4. Perhatikan pernyataan berikut!<br>
						&#123;<br>
						1. Pernyataan satu<br>
						2. Pernyataan dua<br>
						&#125;<br>
						Pernyataan yang benar adalah...<br>
						A. 1<br>
						B. 2<br>
						KUNCI: A
					</div>

					<a href="/template_soal_ujian.docx" download class="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm transition-all hover:shadow">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
						Download Template Word
					</a>
				</div>

				<!-- File Input -->
				<div class="mb-6">
					<label class="block mb-2 font-medium text-slate-700">Pilih File (.docx)</label>
					<div class="flex items-center gap-3">
						<input
							bind:this={fileInput}
							type="file"
							accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
							class="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-slate-200 rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isParsing || isImporting}
							on:change={handleFileChange}
						/>
						<button 
							type="button" 
							class="btn btn-primary whitespace-nowrap min-w-[120px] shadow-sm rounded-xl"
							disabled={!selectedFile || isParsing || isImporting}
							on:click={parseWord}
						>
							{#if isParsing}
								<span class="flex items-center gap-2">
									<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
									Membaca...
								</span>
							{:else}
								Baca File
							{/if}
						</button>
					</div>
					{#if errorMsg}
						<div class="mt-3 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm border border-rose-100 flex items-start gap-2">
							<svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
							<span>{errorMsg}</span>
						</div>
					{/if}
				</div>

				<!-- Preview -->
				{#if parsedData.length > 0}
					<div>
						<div class="flex items-center justify-between mb-3">
							<h4 class="font-bold text-slate-800">Preview Data ({parsedData.length} Soal)</h4>
							{#if totalImages > 0}
								{#if isUploadingImages}
									<span class="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1.5">
										<span class="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
										Mengunggah ({uploadedCount}/{totalImages})
									</span>
								{:else if uploadedCount === totalImages}
									<span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
										<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
										Siap Diimport ({totalImages} Gambar Terunggah)
									</span>
								{:else}
									<span class="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1.5">
										📷 {totalImages} Gambar Terdeteksi
									</span>
								{/if}
							{:else}
								<span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Siap Diimport</span>
							{/if}
						</div>

						<!-- Status Unggah Gambar -->
						{#if totalImages > 0}
							{#if isUploadingImages}
								<div class="bg-indigo-50 border border-indigo-200/80 rounded-xl p-3.5 mb-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
									<div class="flex items-center gap-3">
										<div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
											<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
												<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										</div>
										<div>
											<p class="text-xs font-bold text-indigo-900 flex items-center gap-2">
												Mengunggah gambar ke cloud storage...
												<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700">Paralel & Terkompresi</span>
											</p>
											<p class="text-[11px] text-indigo-700 mt-0.5">
												{uploadedCount} dari {totalImages} gambar selesai ({totalImages > 0 ? Math.round((uploadedCount / totalImages) * 100) : 0}%).
											</p>
										</div>
									</div>
									<div class="w-full sm:w-44 shrink-0">
										<div class="w-full bg-indigo-200/70 rounded-full h-2.5 overflow-hidden">
											<div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style="width: {totalImages > 0 ? Math.round((uploadedCount / totalImages) * 100) : 0}%"></div>
										</div>
									</div>
								</div>
							{:else if uploadedCount === totalImages && totalImages > 0}
								<div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 shadow-xs flex items-center justify-between text-emerald-800 text-xs font-medium">
									<div class="flex items-center gap-2.5">
										<span class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
										</span>
										<span>Semua {totalImages} gambar berhasil diunggah ke cloud storage dan siap disimpan ke bank soal.</span>
									</div>
									<span class="px-2 py-0.5 rounded bg-emerald-100/80 text-emerald-700 text-[10px] font-bold">100% Selesai</span>
								</div>
							{:else if uploadErrorsCount > 0}
								<div class="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 shadow-xs flex items-center justify-between gap-3 text-rose-800 text-xs">
									<div class="flex items-center gap-2.5">
										<svg class="w-5 h-5 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
										<span>{uploadErrorsCount} dari {totalImages} gambar gagal diunggah karena kendala koneksi.</span>
									</div>
									<button type="button" class="btn btn-sm bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap shadow-xs" on:click={retryFailedUploads}>
										Coba Lagi Unggah
									</button>
								</div>
							{:else}
								<div class="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 mb-4 shadow-xs flex items-center justify-between text-indigo-900 text-xs">
									<div class="flex items-center gap-2.5">
										<span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
											📷
										</span>
										<span>Terdeteksi <b>{totalImages} gambar</b> pada dokumen. Gambar asli ditampilkan agar Anda dapat memastikan kesesuaian soal, dan akan otomatis dikompresi serta diunggah ke cloud saat Anda menekan tombol <b>Import</b>.</span>
									</div>
									<span class="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium shrink-0">Bebas File Sampah</span>
								</div>
							{/if}
						{/if}
						
						<div class="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
							<div class="max-h-[300px] overflow-y-auto bg-slate-50">
								<table class="w-full text-left text-sm">
									<thead class="bg-white border-b border-slate-200 sticky top-0 shadow-sm z-10">
										<tr>
											<th class="p-3 font-semibold text-slate-600 w-16 text-center">No</th>
											<th class="p-3 font-semibold text-slate-600">Soal & Opsi</th>
											<th class="p-3 font-semibold text-slate-600 w-24 text-center">Kunci</th>
										</tr>
									</thead>
									<tbody class="divide-y divide-slate-200">
										{#each parsedData as row, i}
											<tr class="hover:bg-white transition-colors">
												<td class="p-3 text-center text-slate-500 font-medium align-top">{i + 1}</td>
												<td class="p-3 align-top">
													<div class="text-slate-800 font-medium mb-2 prose prose-sm max-w-none">{@html row.question_text}</div>
													<div class="text-xs text-slate-500 space-y-1">
														{#each row.options as opt, optIdx}
															<div class="flex gap-1.5">
																<span class="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
																<div class="prose prose-sm max-w-none">{@html opt}</div>
															</div>
														{/each}
													</div>
												</td>
												<td class="p-3 text-center align-top">
													<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">
														{row.correct_answer}
													</span>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-b-2xl">
				{#if isImporting}
					<div class="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg shadow-2xs">
						<svg class="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
						<span>Proses import & unggah terkunci (batal dinonaktifkan).</span>
					</div>
				{:else}
					<div></div>
				{/if}
				<div class="flex items-center gap-3 w-full sm:w-auto justify-end">
					<button 
						type="button" 
						class="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-400" 
						disabled={isImporting}
						title={isImporting ? 'Tidak dapat membatalkan saat proses unggah dan import sedang berlangsung' : 'Batal'}
						on:click={() => close()}
					>
						Batal
					</button>
					<button 
						type="button" 
						class="btn btn-primary rounded-xl px-6 py-2.5 shadow-sm flex items-center gap-2" 
						disabled={parsedData.length === 0 || isImporting}
						on:click={confirmImport}
					>
						{#if isImporting && isUploadingImages}
							<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
							Menyelesaikan Unggah ({uploadedCount}/{totalImages})...
						{:else if isImporting}
							<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
							Menyimpan Soal...
						{:else}
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
							Import {parsedData.length > 0 ? `${parsedData.length} Soal` : ''}
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
