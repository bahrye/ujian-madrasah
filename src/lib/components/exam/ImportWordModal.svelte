<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import * as mammoth from 'mammoth';
	import JSZip from 'jszip';
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

	function close() {
		show = false;
		selectedFile = null;
		parsedData = [];
		errorMsg = '';
		isImporting = false;
		if (fileInput) fileInput.value = '';
		dispatch('close');
	}

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				if (node.parentNode) {
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
		}
	}

	// Upload image to Cloudinary and return the URL
	async function uploadImageToCloudinary(base64Data: string, mimeType: string): Promise<string> {
		if (!cloudName || !uploadPreset) {
			throw new Error('Sistem belum dikonfigurasi untuk unggah media.');
		}

		// Mammoth returns base64 without the data URI prefix.
		const dataUri = `data:${mimeType};base64,${base64Data}`;

		const formData = new FormData();
		formData.append('file', dataUri);
		formData.append('upload_preset', uploadPreset);
		formData.append('folder', 'ujian-madrasah/media');

		const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error('Gagal mengunggah gambar ke server.');
		}

		const data = await response.json();
		return data.secure_url;
	}

	async function processHtmlForImages(html: string): Promise<string> {
		if (!html) return html;
		
		const dataUriRegex = /src="data:(image\/[^;]+);base64,([^"]+)"/g;
		let match;
		let processedHtml = html;
		
		const matches = [];
		while ((match = dataUriRegex.exec(html)) !== null) {
			matches.push({
				fullMatch: match[0],
				mimeType: match[1],
				base64Data: match[2]
			});
		}
		
		for (const m of matches) {
			try {
				const url = await uploadImageToCloudinary(m.base64Data, m.mimeType);
				processedHtml = processedHtml.replace(m.fullMatch, `src="${url}"`);
			} catch (e) {
				console.error("Failed to upload image during import", e);
			}
		}
		
		return processedHtml;
	}

	async function parseWord() {
		if (!selectedFile) return;
		isParsing = true;
		errorMsg = '';
		parsedData = [];

		try {
			const arrayBuffer = await selectedFile.arrayBuffer();

			// --- PREPROCESS DOCX FOR OMML (Math Equations) ---
			// MS Word Equation Editor uses OMML (<m:oMath>). Mammoth ignores these tags.
			// We use JSZip to read document.xml, extract the plain text from <m:t> tags,
			// and convert them to standard Word text runs (<w:r><w:t>) so Mammoth can read them.
			const zip = await JSZip.loadAsync(arrayBuffer);
			const docXmlFile = zip.file("word/document.xml");
			let modifiedArrayBuffer = arrayBuffer;
			
			if (docXmlFile) {
				let xml = await docXmlFile.async("string");
				
				// 1. Convert <m:t> to <w:t>
				xml = xml.replace(/<m:t>/g, '<w:t>');
				xml = xml.replace(/<m:t ([^>]+)>/g, '<w:t $1>');
				xml = xml.replace(/<\/m:t>/g, '</w:t>');

				// 2. Convert <m:r> to <w:r>
				xml = xml.replace(/<m:r>/g, '<w:r>');
				xml = xml.replace(/<m:r ([^>]+)>/g, '<w:r $1>');
				xml = xml.replace(/<\/m:r>/g, '</w:r>');

				// 3. Remove all remaining m: tags (like m:oMath, m:f, m:num, etc)
				xml = xml.replace(/<\/?m:[^>]+>/g, '');
				
				zip.file("word/document.xml", xml);
				modifiedArrayBuffer = await zip.generateAsync({type: "arraybuffer"});
			}
			// --- END PREPROCESS ---
			
			// Konfigurasi Mammoth.js untuk mengonversi dokumen Word ke HTML
			// Gambar di-render sebagai Base64 untuk preview, upload ditunda ke fase Import
			const options = {
				convertImage: mammoth.images.imgElement(function(image) {
					return image.read("base64").then(function(imageBuffer) {
						return {
							src: `data:${image.contentType};base64,${imageBuffer}`
						};
					});
				})
			};

			const result = await mammoth.convertToHtml({ arrayBuffer: modifiedArrayBuffer }, options);
			const html = result.value; 
			
			if (result.messages && result.messages.length > 0) {
				console.warn("Mammoth messages:", result.messages);
			}

			// Menggunakan parser utilitas kita untuk memecah HTML menjadi objek-objek JSON
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
			
		} catch (error: any) {
			errorMsg = error.message || 'Terjadi kesalahan saat memproses file.';
			console.error("Error parsing Word:", error);
		} finally {
			isParsing = false;
		}
	}

	async function confirmImport() {
		if (parsedData.length > 0) {
			isImporting = true;
			try {
				// Proses upload gambar ke Cloudinary sebelum dispatch
				for (let i = 0; i < parsedData.length; i++) {
					const q = parsedData[i];
					
					q.question_text = await processHtmlForImages(q.question_text);
					
					for (let j = 0; j < q.options.length; j++) {
						q.options[j] = await processHtmlForImages(q.options[j]);
					}
					q.options_json = JSON.stringify(q.options);
				}
				
				dispatch('import', { questions: parsedData });
				close();
			} catch (error: any) {
				errorMsg = error.message || "Gagal memproses gambar saat import.";
				console.error("Error uploading images during import:", error);
			} finally {
				isImporting = false;
			}
		}
	}
</script>

{#if show}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div use:portal class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" on:click={close}>
		<div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden" on:click|stopPropagation>
			<!-- Header -->
			<div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
				<h3 class="font-bold text-slate-800 flex items-center gap-2">
					<svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
					</svg>
					Import dari Word (.docx)
				</h3>
				<button type="button" class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors" on:click={close}>
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
							class="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-slate-200 rounded-xl cursor-pointer"
							on:change={handleFileChange}
						/>
						<button 
							type="button"
							class="btn btn-primary whitespace-nowrap min-w-[120px] shadow-sm rounded-xl"
							disabled={!selectedFile || isParsing}
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
							<span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">Siap Diimport</span>
						</div>
						
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
			<div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-2xl">
				<button type="button" class="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors" on:click={close}>
					Batal
				</button>
				<button 
					type="button" 
					class="btn btn-primary rounded-xl px-6 py-2.5 shadow-sm flex items-center gap-2" 
					disabled={parsedData.length === 0 || isImporting}
					on:click={confirmImport}
				>
					{#if isImporting}
						<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
						Memproses Gambar...
					{:else}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
						Import {parsedData.length > 0 ? `${parsedData.length} Soal` : ''}
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
