<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';
	import MediaUploader from '$lib/components/admin/MediaUploader.svelte';
	import QuestionRenderer from '$lib/components/exam/QuestionRenderer.svelte';
	import ImportExcelModal from '$lib/components/exam/ImportExcelModal.svelte';
	import { fade, slide } from 'svelte/transition';
	import { QUESTION_TYPE_LABELS, ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';
	import { tick } from 'svelte';
	import { mathRender } from '$lib/actions/mathRender';
	import { arabicRender } from '$lib/actions/arabicRender';
	import { env } from '$env/dynamic/public';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';

	export let data: PageData;
	export let form: ActionData;

	let showCreateForm = false;
	let showImportModal = false;
	let selectedType = 'pilihan_ganda';
	let optionCount = 4;
	let editOptionCount = 4;
	let options: string[] = ['', '', '', ''];
	let createQuestionText = '';
	
	let previewQuestionId: string | null = null;
	let qEditorComponent: any;
	let eqEditorComponent: any;

	// Image paste support
	const cloudName = env.PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfhtjgwcz';
	const uploadPreset = env.PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ujian-madrasah';
	let isPastingImage = false;

	async function uploadPastedImage(file: File): Promise<string | null> {
		if (!cloudName || !uploadPreset) {
			toasts.error('Sistem belum dikonfigurasi untuk unggah media.');
			return null;
		}

		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', uploadPreset);

		isPastingImage = true;
		try {
			const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
				method: 'POST',
				body: formData
			});

			if (!response.ok) throw new Error('Gagal mengunggah gambar');

			const data = await response.json();
			
			try {
				await fetch('/api/track-media', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url: data.secure_url, media_type: 'image' })
				});
			} catch (e) {
				console.error(e);
			}

			return data.secure_url;
		} catch (e: any) {
			toasts.error(e.message || 'Terjadi kesalahan saat mengunggah gambar paste.');
			return null;
		} finally {
			isPastingImage = false;
		}
	}

	async function handlePaste(e: ClipboardEvent, targetComponent: any) {
		const items = e.clipboardData?.items;
		if (!items) return;

		let hasImage = false;
		let hasText = false;
		let imageItem = null;

		for (let i = 0; i < items.length; i++) {
			if (items[i].type.indexOf('image') !== -1) {
				hasImage = true;
				imageItem = items[i];
			}
			if (items[i].type === 'text/plain') {
				hasText = true;
			}
		}

		if (hasText) {
			const textData = e.clipboardData?.getData('text/plain');
			const htmlData = e.clipboardData?.getData('text/html');
			
			if (textData && textData.trim().length > 0) {
				let textToPaste = textData;

				// Fitur Smart Paste: Deteksi opsi A, B, C, D jika paste di Teks Soal
				const isPilihanGanda = selectedType === 'pilihan_ganda' || selectedType === 'pilihan_ganda_kompleks';
				const isMainEditor = targetComponent === qEditorComponent || targetComponent === eqEditorComponent;
				
				if (isMainEditor && isPilihanGanda) {
					const lines = textData.split('\n');
					let questionLines = [];
					let parsedOptions = [];

					for (let i = 0; i < lines.length; i++) {
						const line = lines[i].trim();
						const optionMatch = line.match(/^([a-eA-E])[\.\)]\s*(.*)/);
						
						if (optionMatch) {
							const letter = optionMatch[1].toLowerCase();
							const expectedLetter = String.fromCharCode(97 + parsedOptions.length);
							
							if (letter === 'a') {
								parsedOptions = [optionMatch[2]];
							} else if (letter === expectedLetter) {
								parsedOptions.push(optionMatch[2]);
							} else if (parsedOptions.length > 0) {
								parsedOptions[parsedOptions.length - 1] += (parsedOptions[parsedOptions.length - 1] ? '\n' : '') + line;
							} else {
								questionLines.push(lines[i]);
							}
						} else {
							if (parsedOptions.length > 0) {
								if (line !== '') parsedOptions[parsedOptions.length - 1] += '\n' + line;
							} else {
								questionLines.push(lines[i]);
							}
						}
					}

					if (parsedOptions.length >= 2) {
						// Hapus nomor soal (misal "5. ") dari baris pertama pertanyaan
						if (questionLines.length > 0) {
							questionLines[0] = questionLines[0].replace(/^\d+[\.\)]\s+/, '');
						}
						
						textToPaste = questionLines.join('\n').trim();
						
						// Masukkan opsi ke input
						if (targetComponent === qEditorComponent) {
							for(let i=0; i<parsedOptions.length; i++) {
								if (i < 5) options[i] = parsedOptions[i].trim();
							}
							if (parsedOptions.length > optionCount && parsedOptions.length <= 5) {
								optionCount = parsedOptions.length;
							}
						} else if (targetComponent === eqEditorComponent && editingQuestion) {
							let currentOpts = [];
							try { currentOpts = JSON.parse(editingQuestion.options_json || '[]'); } catch(e) {}
							for(let i=0; i<parsedOptions.length; i++) {
								if (i < 5) currentOpts[i] = parsedOptions[i].trim();
							}
							editingQuestion.options_json = JSON.stringify(currentOpts);
							editOptionCount = Math.max(currentOpts.length, 2);
						}
					}
				}

				// Jika copy dari MS Word mengandung rumus/gambar (file:///) ATAU kita melakukan Smart Paste
				// Kita paksa paste sebagai teks murni agar rumus/opsi terformat dengan baik
				if ((htmlData && htmlData.includes('file:///')) || textToPaste !== textData) {
					e.preventDefault();
					const escapedText = textToPaste
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/\n/g, '<br>');
					if (targetComponent && escapedText) {
						targetComponent.insertHtml(escapedText);
					}
					toasts.success('Smart Paste: Teks dan opsi berhasil diekstrak!');
					return;
				}

				// Jika tidak ada gambar lokal dan bukan smart paste, biarkan browser paste HTML-nya.
				return; 
			}
		}

		if (hasImage && imageItem) {
			const file = imageItem.getAsFile();
			if (!file) return;

			e.preventDefault();

			const url = await uploadPastedImage(file);
			if (url) {
				const imgHtml = `<img src="${url}" class="max-h-64 object-contain rounded-lg border border-slate-200 mt-2 mb-2">&nbsp;`;
				if (targetComponent) {
					targetComponent.insertHtml(imgHtml);
				}
			}
		}
	}

	async function handlePasteButtonClick(targetComponent: any) {
		try {
			const clipboardItems = await navigator.clipboard.read();
			for (const clipboardItem of clipboardItems) {
				const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
				for (const imageType of imageTypes) {
					const blob = await clipboardItem.getType(imageType);
					const file = new File([blob], "pasted-image.png", { type: imageType });
					
					const url = await uploadPastedImage(file);
					if (url) {
						const imgHtml = `<img src="${url}" class="max-h-64 object-contain rounded-lg border border-slate-200 mt-2 mb-2">&nbsp;`;
						if (targetComponent) {
							targetComponent.insertHtml(imgHtml);
						}
					}
					return;
				}
			}
			toasts.error('Tidak ada gambar di clipboard (copy/salin gambar terlebih dahulu).');
		} catch (err) {
			console.error(err);
			toasts.error('Gagal mengakses clipboard. Pastikan browser memberi izin akses.');
		}
	}

	// Media picker for options and editor
	let showMediaPicker = false;
	let activeMediaTarget: { type: 'editor' | 'option', target: any, form?: string, index?: number } | null = null;

	function openMediaPickerForOption(form: 'create' | 'edit', type: 'pilihan_ganda' | 'pilihan_ganda_kompleks' | 'menjodohkan_left' | 'menjodohkan_right', index: number) {
		activeMediaTarget = { type: 'option', target: type, form, index };
		showMediaPicker = true;
	}

	function openMediaPickerForEditor(editorComponent: any) {
		activeMediaTarget = { type: 'editor', target: editorComponent };
		showMediaPicker = true;
	}

	function insertMedia(url: string, mediaType: string) {
		if (!activeMediaTarget) return;

		const htmlToInsert = mediaType === 'image' 
			? `<img src="${url}" class="max-h-64 object-contain rounded-lg border border-slate-200 mt-2 mb-2">&nbsp;`
			: `<audio controls src="${url}" class="w-full mt-2 mb-2"></audio>&nbsp;`;

		if (activeMediaTarget.type === 'editor' && activeMediaTarget.target) {
			activeMediaTarget.target.insertHtml(htmlToInsert);
		} else if (activeMediaTarget.type === 'option') {
			const { form, target: type, index } = activeMediaTarget;
			let inputId = `${form}_`;
			if (type.startsWith('pilihan_ganda')) inputId += `option_${index}`;
			else if (type === 'menjodohkan_left') inputId += `left_${index}`;
			else if (type === 'menjodohkan_right') inputId += `right_${index}`;
			
			const inputEl = document.getElementById(inputId) as HTMLInputElement;
			if (inputEl) {
				const prefix = inputEl.value.trim() !== '' ? '<br>' : '';
				inputEl.value = inputEl.value + prefix + htmlToInsert;
				inputEl.dispatchEvent(new Event('input', { bubbles: true }));
			}
		}
		
		showMediaPicker = false;
		activeMediaTarget = null;
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
	
	let editingQuestion: any = null;
	let createMenjodohkanCount = 4;
	let editMenjodohkanCount = 4;

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
	$: exam = data.exam as any;

	$: if (editingQuestion && editingQuestion.type === 'menjodohkan') {
		const opts = editingQuestion.options_json ? JSON.parse(editingQuestion.options_json) : {left:[]};
		editMenjodohkanCount = Math.max(4, opts.left?.length || 4);
	}

	async function removeEmptyMenjodohkanRow(mode: 'create' | 'edit') {
		const count = mode === 'create' ? createMenjodohkanCount : editMenjodohkanCount;
		if (count <= 1) return;

		let rows = [];
		for (let i = 0; i < count; i++) {
			const leftInput = document.getElementById(`${mode}_left_${i}`) as HTMLInputElement;
			const rightInput = document.getElementById(`${mode}_right_${i}`) as HTMLInputElement;
			rows.push({ left: leftInput?.value || '', right: rightInput?.value || '' });
		}

		// Find the last empty row
		const emptyIndex = rows.findLastIndex(r => !r.left.trim() && !r.right.trim());
		if (emptyIndex !== -1) {
			rows.splice(emptyIndex, 1);
			if (mode === 'create') createMenjodohkanCount--;
			else editMenjodohkanCount--;

			await tick(); // wait for DOM to remove the last row

			for (let i = 0; i < rows.length; i++) {
				const leftInput = document.getElementById(`${mode}_left_${i}`) as HTMLInputElement;
				const rightInput = document.getElementById(`${mode}_right_${i}`) as HTMLInputElement;
				if (leftInput) leftInput.value = rows[i].left;
				if (rightInput) rightInput.value = rows[i].right;
			}
		} else {
			toasts.error('Semua baris terisi. Hapus isi baris terlebih dahulu jika ingin menguranginya.');
		}
	}

	$: questions = data.questions as any[];
</script>

<svelte:head><title>Soal - {exam.title} — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div class="flex items-start sm:items-center gap-3">
			<a href="/guru/bank-soal" class="btn-ghost btn-sm mt-1 sm:mt-0">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
				</svg>
			</a>
			<div>
				<h1 class="text-2xl font-bold text-slate-800 leading-tight">{exam.title}</h1>
				<p class="text-sm text-slate-500 mt-1">{exam.subject || 'Umum'} · {questions.length} soal</p>
			</div>
		</div>
		<div class="grid grid-cols-2 sm:flex sm:items-center gap-2 pl-12 sm:pl-0">
			<button class="btn px-2 sm:px-4 justify-center bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-sm" on:click={() => (showImportModal = true)}>
				<svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
				<span class="text-[13px] sm:text-sm font-semibold">Import Excel</span>
			</button>
			<button class="btn-primary px-2 sm:px-4 justify-center shadow-md shadow-indigo-500/20" on:click={() => (showCreateForm = !showCreateForm)}>
				<svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
				</svg>
				<span class="text-[13px] sm:text-sm font-semibold">Tambah Soal</span>
			</button>
		</div>
	</div>

	<!-- Import Modal -->
	<ImportExcelModal bind:show={showImportModal} on:close={() => showImportModal = false} />

	<!-- Create Form -->
	{#if showCreateForm}
		<div class="card p-6 border-2 border-indigo-200 animate-in">
			<h2 class="text-lg font-bold text-slate-800 mb-4">Tambah Soal Baru</h2>
			<form method="POST" action="?/create" use:enhance={() => { 
				return async ({ result, update }) => { 
					if (result.type === 'success') {
						createQuestionText = '';
						options = ['', '', '', '', ''];
						optionCount = 4;
						createMenjodohkanCount = 4;
						await update({ reset: true });
					} else {
						await update();
					}
				}; 
			}} class="space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<div>
						<label class="label" for="q-type">Tipe Soal</label>
						<select id="q-type" name="type" class="select" bind:value={selectedType}>
							{#each Object.entries(QUESTION_TYPE_LABELS) as [val, label]}
								<option value={val}>{label}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="label" for="q-points">Poin</label>
						<input id="q-points" name="points" type="number" min="1" class="input" value="1" />
					</div>
				</div>

				<div class="mb-2">
					<label class="label" for="q-text">Teks Soal</label>
					<RichTextEditor 
						id="q-text" 
						name="question_text" 
						placeholder="Tuliskan pertanyaan di sini... (Bisa langsung Paste / Ctrl+V gambar ke kotak ini)" 
						bind:value={createQuestionText}
						bind:this={qEditorComponent}
						on:paste={(e) => handlePaste(e, qEditorComponent)}
					>
						<div slot="toolbar-right" class="flex gap-1 items-center">
							<button type="button" class="btn-ghost btn-sm text-xs flex items-center gap-1 text-indigo-600 hover:bg-indigo-50" on:click={() => openMediaPickerForEditor(qEditorComponent)}>
								<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
								Tambah Media
							</button>
							<div class="w-px h-3 bg-slate-200 mx-1"></div>
							<button type="button" class="btn-ghost btn-sm text-xs flex items-center gap-1 text-indigo-600 hover:bg-indigo-50" on:click={() => handlePasteButtonClick(qEditorComponent)} disabled={isPastingImage}>
								{#if isPastingImage}
									<svg class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
									Mengunggah...
								{:else}
									<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
									Paste Gambar
								{/if}
							</button>
						</div>
					</RichTextEditor>
				</div>
                <input type="hidden" name="media_url" value="" />
                <input type="hidden" name="media_type" value="none" />
                <input type="hidden" name="audio_max_plays" value="3" />

				<!-- Type-specific fields -->
				{#if selectedType === 'pilihan_ganda' || selectedType === 'pilihan_ganda_kompleks'}
					<div class="space-y-2">
						<label class="label">Opsi Jawaban {selectedType === 'pilihan_ganda_kompleks' ? '(Centang jawaban yang benar)' : ''}</label>
						{#each Array(optionCount) as _, i}
							<div class="flex items-center gap-2">
								<span class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">{String.fromCharCode(65 + i)}</span>
								<input id="create_option_{i}" name="option_{i}" type="text" class="input flex-1" placeholder="Opsi {String.fromCharCode(65 + i)}" required bind:value={options[i]} />
								<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 shrink-0" on:click={() => openMediaPickerForOption('create', selectedType, i)} title="Tambahkan Media">
									🖼️
								</button>
								{#if selectedType === 'pilihan_ganda_kompleks'}
									<label class="flex items-center gap-1 cursor-pointer shrink-0 ml-1">
										<input type="checkbox" name="correct_answer_{i}" value={String.fromCharCode(65 + i)} class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
										<span class="text-sm font-medium text-slate-700">Benar</span>
									</label>
								{/if}
							</div>
						{/each}
						{#if optionCount < 5}
							<button type="button" class="text-xs text-indigo-500 hover:text-indigo-700" on:click={() => optionCount++}>+ Tambah opsi</button>
						{/if}
						{#if selectedType === 'pilihan_ganda'}
							<div class="mt-2">
								<label class="label" for="q-correct">Jawaban Benar</label>
								<select id="q-correct" name="correct_answer" class="select w-32">
									{#each Array(optionCount) as _, i}
										<option value={String.fromCharCode(65 + i)}>{String.fromCharCode(65 + i)}</option>
									{/each}
								</select>
							</div>
						{/if}
					</div>
				{:else if selectedType === 'benar_salah'}
					<div>
						<label class="label" for="q-correct-bs">Jawaban Benar</label>
						<select id="q-correct-bs" name="correct_answer" class="select w-40">
							<option value="Benar">Benar</option>
							<option value="Salah">Salah</option>
						</select>
					</div>
				{:else if selectedType === 'isian_singkat'}
					<div>
						<label class="label" for="q-correct-is">Kunci Jawaban</label>
						<input id="q-correct-is" name="correct_answer" type="text" class="input" placeholder="Jawaban yang benar" />
					</div>
				{:else if selectedType === 'menjodohkan'}
					<div class="space-y-2">
						<label class="label">Pasangan (Kiri → Kanan)</label>
						{#each Array(createMenjodohkanCount) as _, i}
							<div class="grid grid-cols-2 gap-2">
								<div class="flex gap-1">
									<input id="create_left_{i}" name="left_{i}" type="text" class="input w-full" placeholder="Kiri {i + 1}" />
									<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-2 shrink-0" on:click={() => openMediaPickerForOption('create', 'menjodohkan_left', i)} title="Media">🖼️</button>
								</div>
								<div class="flex gap-1">
									<input id="create_right_{i}" name="right_{i}" type="text" class="input w-full" placeholder="Kanan {i + 1}" />
									<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-2 shrink-0" on:click={() => openMediaPickerForOption('create', 'menjodohkan_right', i)} title="Media">🖼️</button>
								</div>
							</div>
						{/each}
						<div class="flex items-center gap-2 mt-1">
							<button type="button" class="btn-ghost btn-sm text-indigo-600 hover:bg-indigo-50" on:click={() => createMenjodohkanCount++}>+ Tambah Baris</button>
							{#if createMenjodohkanCount > 1}
								<button type="button" class="btn-ghost btn-sm text-red-600 hover:bg-red-50" on:click={() => removeEmptyMenjodohkanRow('create')}>- Kurangi Baris</button>
							{/if}
						</div>
					</div>
				{:else if selectedType === 'essay'}
					<div>
						<label class="label" for="q-correct-essay">Kunci Jawaban / Penjelasan</label>
						<textarea id="q-correct-essay" name="correct_answer" class="input min-h-[100px]" placeholder="Penjelasan atau kunci jawaban untuk panduan saat menilai manual..."></textarea>
					</div>
					<p class="text-sm text-slate-500 bg-amber-50 p-3 rounded-xl mt-2">Soal essay dinilai secara manual di halaman Penilaian. Penjelasan di atas akan membantu saat membandingkan jawaban siswa.</p>
				{/if}

				<div class="flex gap-3 pt-2">
					<button type="button" class="btn-ghost flex-1" on:click={() => (showCreateForm = false)}>Batal</button>
					<button type="submit" class="btn-primary flex-1">Simpan Soal</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Questions List -->
	<div class="space-y-3" use:mathRender={questions} use:arabicRender={questions}>
		{#each questions as q, idx (q.id)}
			<div class="card p-4 flex items-start gap-4 group">
				<span class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md shadow-indigo-500/20">
					{q.question_number}
				</span>
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-2 mb-1">
						<span class="badge-primary text-[10px]">{QUESTION_TYPE_LABELS[q.type] || q.type}</span>
						<span class="text-xs text-slate-400">{q.points} poin</span>
						{#if q.media_type}
							<span class="badge-info text-[10px]">📎 {q.media_type === 'image' ? 'Gambar' : 'Audio'}</span>
						{/if}
					</div>
					<div class="text-sm text-slate-700 line-clamp-2 prose prose-sm max-w-none prose-p:m-0 prose-img:m-0 prose-ul:m-0">{@html q.question_text}</div>
					{#if q.options_json}
						{@const opts = JSON.parse(q.options_json)}
						{@const correct = q.correct_answer_json ? JSON.parse(q.correct_answer_json) : null}
						{#if Array.isArray(opts)}
							<div class="flex flex-wrap gap-1.5 mt-2">
								{#each opts as opt, i}
									{@const isCorrect = (q.type === 'pilihan_ganda' && correct === String.fromCharCode(65 + i)) || (q.type === 'pilihan_ganda_kompleks' && Array.isArray(correct) && correct.includes(String.fromCharCode(65 + i))) || (q.type === 'benar_salah' && correct === opt)}
									<span class="text-[10px] px-2 py-0.5 rounded-md {isCorrect ? 'bg-green-100 text-green-700 font-bold border border-green-200' : 'bg-slate-100 text-slate-600'}">
										{q.type.startsWith('pilihan_ganda') ? `${String.fromCharCode(65 + i)}. ` : ''}{opt}
									</span>
								{/each}
							</div>
						{:else if q.type === 'menjodohkan' && opts.left}
							<div class="mt-2 text-xs text-slate-500">
								{#each opts.left as l, i}
									<div class="flex gap-2">
										<span class="font-medium text-slate-700">{l}</span>
										<span>→</span>
										<span class="text-green-600">{opts.right[correct[i]]}</span>
									</div>
								{/each}
							</div>
						{/if}
					{/if}
					{#if q.type === 'isian_singkat' && q.correct_answer_json}
						<div class="mt-2 text-xs">
							<span class="text-slate-500">Jawaban Benar:</span>
							<span class="font-bold text-green-600 ml-1">{JSON.parse(q.correct_answer_json)}</span>
						</div>
					{/if}
				</div>
				<div class="flex items-start gap-2">
					<button type="button" class="p-2 rounded-xl text-sky-600 bg-sky-50 hover:bg-sky-500 hover:text-white transition-all shadow-sm" title="Preview soal" on:click={() => previewQuestionId = q.id}>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
						</svg>
					</button>
					<div class="flex flex-col gap-2">
						<button type="button" class="p-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 transition-colors" title="Edit soal" on:click={() => {
							editingQuestion = { ...q };
							// Migrate old media to rich text
							if (editingQuestion.media_url && editingQuestion.media_type !== 'none') {
								const mediaHtml = editingQuestion.media_type === 'audio' 
									? `<br><audio controls src="${editingQuestion.media_url}" class="w-full mt-2 mb-2"></audio>`
									: `<br><img src="${editingQuestion.media_url}" class="max-h-64 object-contain rounded-lg border border-slate-200 mt-2 mb-2">`;
								editingQuestion.question_text += mediaHtml;
								editingQuestion.media_url = null;
								editingQuestion.media_type = 'none';
							}
							if (q.type.startsWith('pilihan_ganda') && q.options_json) {
								editOptionCount = JSON.parse(q.options_json).length;
							}
							if (q.type === 'menjodohkan' && q.options_json) {
								const parsed = JSON.parse(q.options_json);
								if (parsed.left) editMenjodohkanCount = parsed.left.length;
							}
							editingQuestionId = q.id;
							window.scrollTo({ top: 0, behavior: 'smooth' });
						}}>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.edit} />
							</svg>
						</button>
						<ConfirmForm 
							action="?/delete"
							confirmTitle="Hapus Soal"
							confirmMessage="Hapus soal ini?"
							buttonClass="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center"
							buttonTitle="Hapus soal"
						>
							<svelte:fragment slot="inputs">
								<input type="hidden" name="id" value={q.id} />
							</svelte:fragment>
							<svelte:fragment slot="buttonContent">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
								</svg>
							</svelte:fragment>
						</ConfirmForm>
					</div>
				</div>
			</div>
		{:else}
			<div class="text-center py-12 text-slate-400">
				<p>Belum ada soal. Klik "Tambah Soal" untuk memulai.</p>
			</div>
		{/each}
	</div>
</div>

<!-- Edit Modal -->
{#if editingQuestion}
	<div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
			<div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
				<h3 class="font-bold text-slate-800 text-lg">Edit Soal (No. {editingQuestion.question_number})</h3>
				<button class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors" on:click={() => editingQuestion = null}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.close} />
					</svg>
				</button>
			</div>
			
			<div class="p-6 overflow-y-auto">
				<form method="POST" action="?/edit" use:enhance={() => { return async ({ update }) => { editingQuestion = null; await update(); }; }} class="space-y-4">
					<input type="hidden" name="id" value={editingQuestion.id} />
					<input type="hidden" name="type" value={editingQuestion.type} />
					
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<div>
							<label class="label">Tipe Soal</label>
							<input type="text" class="input bg-slate-50" value={QUESTION_TYPE_LABELS[editingQuestion.type] || editingQuestion.type} disabled />
						</div>
						<div>
							<label class="label" for="eq-points">Poin</label>
							<input id="eq-points" name="points" type="number" min="1" class="input" value={editingQuestion.points} />
						</div>
					</div>

					<div class="mb-2">
						<label class="label" for="eq-text">Teks Soal</label>
						<RichTextEditor 
							id="eq-text" 
							name="question_text" 
							placeholder="Tuliskan soal di sini... (Bisa langsung Paste / Ctrl+V gambar ke kotak ini)" 
							bind:value={editingQuestion.question_text}
							bind:this={eqEditorComponent}
							on:paste={(e) => handlePaste(e, eqEditorComponent)}
						>
							<div slot="toolbar-right" class="flex gap-1 items-center">
								<button type="button" class="btn-ghost btn-sm text-xs flex items-center gap-1 text-indigo-600 hover:bg-indigo-50" on:click={() => openMediaPickerForEditor(eqEditorComponent)}>
									<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
									Tambah Media
								</button>
								<div class="w-px h-3 bg-slate-200 mx-1"></div>
								<button type="button" class="btn-ghost btn-sm text-xs flex items-center gap-1 text-indigo-600 hover:bg-indigo-50" on:click={() => handlePasteButtonClick(eqEditorComponent)} disabled={isPastingImage}>
									{#if isPastingImage}
										<svg class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
										Mengunggah...
									{:else}
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
										Paste Gambar
									{/if}
								</button>
							</div>
						</RichTextEditor>
					</div>
                    <input type="hidden" name="media_url" value={editingQuestion.media_url || ''} />
                    <input type="hidden" name="media_type" value={editingQuestion.media_type || 'none'} />

					<!-- Type-specific fields for edit -->
					{#if editingQuestion.type === 'pilihan_ganda' || editingQuestion.type === 'pilihan_ganda_kompleks'}
						{@const opts = editingQuestion.options_json ? JSON.parse(editingQuestion.options_json) : []}
						{@const correct = editingQuestion.correct_answer_json ? JSON.parse(editingQuestion.correct_answer_json) : (editingQuestion.type === 'pilihan_ganda_kompleks' ? [] : 'A')}
						<div class="space-y-2">
							<label class="label">Opsi Jawaban {editingQuestion.type === 'pilihan_ganda_kompleks' ? '(Centang jawaban yang benar)' : ''}</label>
							{#each Array(editOptionCount) as _, i}
								<div class="flex items-center gap-2">
									<span class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">{String.fromCharCode(65 + i)}</span>
									<input id="edit_option_{i}" name="option_{i}" type="text" class="input flex-1" placeholder="Opsi {String.fromCharCode(65 + i)}" required value={opts[i] || ''} />
									<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 shrink-0" on:click={() => openMediaPickerForOption('edit', editingQuestion.type, i)} title="Tambahkan Media">
										🖼️
									</button>
									{#if editingQuestion.type === 'pilihan_ganda_kompleks'}
										<label class="flex items-center gap-1 cursor-pointer shrink-0 ml-1">
											<input type="checkbox" name="correct_answer_{i}" value={String.fromCharCode(65 + i)} class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={Array.isArray(correct) && correct.includes(String.fromCharCode(65 + i))} />
											<span class="text-sm font-medium text-slate-700">Benar</span>
										</label>
									{/if}
								</div>
							{/each}
							{#if editOptionCount < 5}
								<button type="button" class="text-xs text-indigo-500" on:click={() => editOptionCount++}>+ Tambah opsi</button>
							{/if}
							{#if editingQuestion.type === 'pilihan_ganda'}
								<div class="mt-2">
									<label class="label" for="eq-correct">Jawaban Benar</label>
									<select id="eq-correct" name="correct_answer" class="select w-32" value={correct}>
										{#each Array(editOptionCount) as _, i}
											<option value={String.fromCharCode(65 + i)}>{String.fromCharCode(65 + i)}</option>
										{/each}
									</select>
								</div>
							{/if}
						</div>
					{:else if editingQuestion.type === 'benar_salah'}
						{@const correct = editingQuestion.correct_answer_json ? JSON.parse(editingQuestion.correct_answer_json) : 'Benar'}
						<div>
							<label class="label" for="eq-correct-bs">Jawaban Benar</label>
							<select id="eq-correct-bs" name="correct_answer" class="select w-32" value={correct}>
								<option value="Benar">Benar</option>
								<option value="Salah">Salah</option>
							</select>
						</div>
					{:else if editingQuestion.type === 'isian_singkat'}
						{@const correct = editingQuestion.correct_answer_json ? JSON.parse(editingQuestion.correct_answer_json) : ''}
						<div>
							<label class="label" for="eq-correct-is">Kunci Jawaban</label>
							<input id="eq-correct-is" name="correct_answer" type="text" class="input" value={correct} />
						</div>
					{:else if editingQuestion.type === 'menjodohkan'}
						{@const opts = editingQuestion.options_json ? JSON.parse(editingQuestion.options_json) : {left:[], right:[]}}
						<div class="space-y-2">
							<label class="label">Pasangan (Kiri → Kanan)</label>
							{#each Array(editMenjodohkanCount) as _, i}
								<div class="grid grid-cols-2 gap-2">
									<div class="flex gap-1">
										<input id="edit_left_{i}" name="left_{i}" type="text" class="input w-full" placeholder="Kiri {i + 1}" value={opts.left?.[i] || ''} />
										<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-2 shrink-0" on:click={() => openMediaPickerForOption('edit', 'menjodohkan_left', i)} title="Media">🖼️</button>
									</div>
									<div class="flex gap-1">
										<input id="edit_right_{i}" name="right_{i}" type="text" class="input w-full" placeholder="Kanan {i + 1}" value={opts.right?.[i] || ''} />
										<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-2 shrink-0" on:click={() => openMediaPickerForOption('edit', 'menjodohkan_right', i)} title="Media">🖼️</button>
									</div>
								</div>
							{/each}
							<div class="flex items-center gap-2 mt-1">
								<button type="button" class="btn-ghost btn-sm text-indigo-600 hover:bg-indigo-50" on:click={() => editMenjodohkanCount++}>+ Tambah Baris</button>
								{#if editMenjodohkanCount > 1}
									<button type="button" class="btn-ghost btn-sm text-red-600 hover:bg-red-50" on:click={() => removeEmptyMenjodohkanRow('edit')}>- Kurangi Baris</button>
								{/if}
							</div>
						</div>
					{:else if editingQuestion.type === 'essay'}
						{@const correct = editingQuestion.correct_answer_json ? JSON.parse(editingQuestion.correct_answer_json) : ''}
						<div>
							<label class="label" for="eq-correct-essay">Kunci Jawaban / Penjelasan</label>
							<textarea id="eq-correct-essay" name="correct_answer" class="input min-h-[100px]" value={correct}></textarea>
						</div>
					{/if}

					<div class="flex gap-3 pt-4 border-t border-slate-100">
						<button type="button" class="btn-ghost flex-1" on:click={() => editingQuestion = null}>Batal</button>
						<button type="submit" class="btn-primary flex-1">Simpan Perubahan</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Preview Modal -->
{#if previewQuestionId}
	{@const pq = questions.find(q => q.id === previewQuestionId)}
	{#if pq}
		<div use:portal class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
			<div class="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
				<div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
					<h3 class="font-bold text-slate-800 text-lg">Preview Soal No. {pq.question_number}</h3>
					<button class="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors" on:click={() => previewQuestionId = null}>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.close} />
						</svg>
					</button>
				</div>
				<div class="p-6 overflow-y-auto">
					<QuestionRenderer question={pq} />
				</div>
			</div>
		</div>
	{/if}
{/if}

<!-- Media Picker Modal -->
{#if showMediaPicker}
	<div use:portal class="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
		<div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform scale-100">
			<div class="p-4 border-b flex justify-between items-center bg-slate-50/50">
				<h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
					<svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
					Tambahkan Media {activeMediaTarget?.type === 'option' ? 'ke Opsi' : 'ke Soal'}
				</h3>
				<button type="button" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" on:click={() => showMediaPicker = false}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>
			<div class="p-5">
				<p class="text-sm text-slate-500 mb-4">Pilih media dari bank berkas atau unggah baru. HTML media akan otomatis ditambahkan.</p>
				<div class="border border-indigo-100 bg-indigo-50/30 rounded-xl p-4">
					<MediaUploader 
						label="Pilih / Unggah Media"
						on:upload={(e) => {
							insertMedia(e.detail.url, e.detail.type);
						}}
					/>
				</div>
			</div>
		</div>
	</div>
{/if}
