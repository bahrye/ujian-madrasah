<script lang="ts">
	import { enhance } from '$app/forms';
	import ConfirmForm from '$lib/components/ConfirmForm.svelte';
	import MediaUploader from '$lib/components/admin/MediaUploader.svelte';
	import { fade, slide } from 'svelte/transition';
	import { QUESTION_TYPE_LABELS, ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';

	import { page } from '$app/stores';

	export let data;
	export let form: any;

	let showCreateForm = false;
	let selectedType = 'pilihan_ganda';
	let optionCount = 4;
	let editOptionCount = 4;
	let options: string[] = ['', '', '', ''];

	// Media picker for options
	let showOptionMediaPicker = false;
	let activeOptionTarget: { form: 'create' | 'edit', type: 'pilihan_ganda' | 'menjodohkan_left' | 'menjodohkan_right', index: number } | null = null;

	function openOptionMediaPicker(form: 'create' | 'edit', type: 'pilihan_ganda' | 'menjodohkan_left' | 'menjodohkan_right', index: number) {
		activeOptionTarget = { form, type, index };
		showOptionMediaPicker = true;
	}

	function insertMediaToOption(url: string, mediaType: string) {
		if (!activeOptionTarget) return;

		const { form, type, index } = activeOptionTarget;
		const htmlToInsert = mediaType === 'image' 
			? `<br><img src="${url}" class="max-h-32 object-contain mt-2 rounded-lg border border-slate-200">`
			: `<br><audio controls src="${url}" class="mt-2 h-10 w-full max-w-[200px]"></audio>`;

		let inputId = `${form}_`;
		if (type === 'pilihan_ganda') inputId += `option_${index}`;
		else if (type === 'menjodohkan_left') inputId += `left_${index}`;
		else if (type === 'menjodohkan_right') inputId += `right_${index}`;
		
		const inputEl = document.getElementById(inputId) as HTMLInputElement;
		if (inputEl) {
			inputEl.value = inputEl.value + htmlToInsert;
			// Trigger input event to update Svelte bindings if any
			inputEl.dispatchEvent(new Event('input', { bubbles: true }));
		}
		
		showOptionMediaPicker = false;
		activeOptionTarget = null;
	}
	
	let editingQuestion: any = null;

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
	$: exam = data.exam as any;
	$: questions = data.questions as any[];
</script>

<svelte:head><title>Soal - {exam.title} — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex items-center gap-3">
		<a href={$page.url.searchParams.get('from') === 'bank' ? '/admin/bank-soal' : `/admin/exams/${exam.id}`} class="btn-ghost btn-sm">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronLeft} />
			</svg>
		</a>
		<div class="flex-1">
			<h1 class="text-2xl font-bold text-slate-800">{exam.title}</h1>
			<p class="text-sm text-slate-500">{exam.subject || 'Umum'} · {questions.length} soal</p>
		</div>
		<button class="btn-primary" on:click={() => (showCreateForm = !showCreateForm)}>
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.plus} />
			</svg>
			Tambah Soal
		</button>
	</div>

	<!-- Create Form -->
	{#if showCreateForm}
		<div class="card p-6 border-2 border-indigo-200 animate-in">
			<h2 class="text-lg font-bold text-slate-800 mb-4">Tambah Soal Baru</h2>
			<form method="POST" action="?/create" use:enhance={() => { return async ({ update }) => { await update(); }; }} class="space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
					<div>
						<label class="label" for="q-media">Media</label>
						<select id="q-media" name="media_type" class="select">
							<option value="none">Tanpa Media</option>
							<option value="image">Gambar</option>
							<option value="audio">Audio</option>
						</select>
					</div>
				</div>

				<div>
					<label class="label" for="q-text">Teks Soal</label>
					<textarea id="q-text" name="question_text" required class="input min-h-[100px]" placeholder="Tuliskan soal di sini..." rows="3"></textarea>
				</div>

				<div class="bg-slate-50 border border-slate-100 rounded-xl p-4">
					<MediaUploader 
						label="File Media (Opsional)" 
						accept="image/*,audio/*"
						on:upload={(e) => {
							const mediaUrlInput = document.getElementById('q-media-url') as HTMLInputElement;
							const mediaTypeSelect = document.getElementById('q-media') as HTMLSelectElement;
							if (mediaUrlInput) mediaUrlInput.value = e.detail.url;
							if (mediaTypeSelect) mediaTypeSelect.value = e.detail.type;
						}}
						on:remove={() => {
							const mediaUrlInput = document.getElementById('q-media-url') as HTMLInputElement;
							const mediaTypeSelect = document.getElementById('q-media') as HTMLSelectElement;
							if (mediaUrlInput) mediaUrlInput.value = '';
							if (mediaTypeSelect) mediaTypeSelect.value = 'none';
						}}
					/>
					<input type="hidden" id="q-media-url" name="media_url" />
				</div>

				<div>
					<label class="label" for="q-max-plays">Maks. Putar Audio</label>
					<input id="q-max-plays" name="audio_max_plays" type="number" min="1" class="input w-32" value="3" />
				</div>

				<!-- Type-specific fields -->
				{#if selectedType === 'pilihan_ganda'}
					<div class="space-y-2">
						<label class="label">Opsi Jawaban</label>
						{#each Array(optionCount) as _, i}
							<div class="flex items-center gap-2">
								<span class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">{String.fromCharCode(65 + i)}</span>
								<input id="create_option_{i}" name="option_{i}" type="text" class="input flex-1" placeholder="Opsi {String.fromCharCode(65 + i)}" required bind:value={options[i]} />
								<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 shrink-0" on:click={() => openOptionMediaPicker('create', 'pilihan_ganda', i)} title="Tambahkan Media">
									🖼️
								</button>
							</div>
						{/each}
						{#if optionCount < 5}
							<button type="button" class="text-xs text-indigo-500 hover:text-indigo-700" on:click={() => optionCount++}>+ Tambah opsi</button>
						{/if}
						<div class="mt-2">
							<label class="label" for="q-correct">Jawaban Benar</label>
							<select id="q-correct" name="correct_answer" class="select w-32">
								{#each Array(optionCount) as _, i}
									<option value={String.fromCharCode(65 + i)}>{String.fromCharCode(65 + i)}</option>
								{/each}
							</select>
						</div>
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
						{#each [0, 1, 2, 3] as i}
							<div class="grid grid-cols-2 gap-2">
								<div class="flex gap-1">
									<input id="create_left_{i}" name="left_{i}" type="text" class="input w-full" placeholder="Kiri {i + 1}" />
									<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-2 shrink-0" on:click={() => openOptionMediaPicker('create', 'menjodohkan_left', i)} title="Media">🖼️</button>
								</div>
								<div class="flex gap-1">
									<input id="create_right_{i}" name="right_{i}" type="text" class="input w-full" placeholder="Kanan {i + 1}" />
									<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-2 shrink-0" on:click={() => openOptionMediaPicker('create', 'menjodohkan_right', i)} title="Media">🖼️</button>
								</div>
							</div>
						{/each}
					</div>
				{:else if selectedType === 'essay'}
					<p class="text-sm text-slate-500 bg-amber-50 p-3 rounded-xl">Soal essay dinilai secara manual oleh guru di halaman Penilaian.</p>
				{/if}

				<div class="flex gap-3 pt-2">
					<button type="button" class="btn-ghost flex-1" on:click={() => (showCreateForm = false)}>Batal</button>
					<button type="submit" class="btn-primary flex-1">Simpan Soal</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Questions List -->
	<div class="space-y-3">
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
					<p class="text-sm text-slate-700 line-clamp-2">{q.question_text}</p>
					{#if q.options_json}
						{@const opts = JSON.parse(q.options_json)}
						{@const correct = q.correct_answer_json ? JSON.parse(q.correct_answer_json) : null}
						{#if Array.isArray(opts)}
							<div class="flex flex-wrap gap-1.5 mt-2">
								{#each opts as opt, i}
									{@const isCorrect = (q.type === 'pilihan_ganda' && correct === String.fromCharCode(65 + i)) || (q.type === 'benar_salah' && correct === opt)}
									<span class="text-[10px] px-2 py-0.5 rounded-md {isCorrect ? 'bg-green-100 text-green-700 font-bold border border-green-200' : 'bg-slate-100 text-slate-600'}">
										{q.type === 'pilihan_ganda' ? `${String.fromCharCode(65 + i)}. ` : ''}{opt}
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
				<div class="flex flex-col gap-2">
					<button type="button" class="p-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white transition-all shadow-sm" title="Edit soal" on:click={() => {
						editingQuestion = { ...q };
						if (q.type === 'pilihan_ganda' && q.options_json) {
							editOptionCount = JSON.parse(q.options_json).length;
						}
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
					
					<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div>
							<label class="label">Tipe Soal</label>
							<input type="text" class="input bg-slate-50" value={QUESTION_TYPE_LABELS[editingQuestion.type] || editingQuestion.type} disabled />
						</div>
						<div>
							<label class="label" for="eq-points">Poin</label>
							<input id="eq-points" name="points" type="number" min="1" class="input" value={editingQuestion.points} />
						</div>
						<div>
							<label class="label" for="eq-media">Media</label>
							<select id="eq-media" name="media_type" class="select" value={editingQuestion.media_type}>
								<option value={null}>Tanpa Media</option>
								<option value="image">Gambar</option>
								<option value="audio">Audio</option>
							</select>
						</div>
					</div>

					<div>
						<label class="label" for="eq-text">Teks Soal</label>
						<textarea id="eq-text" name="question_text" required class="input min-h-[100px]" rows="3" value={editingQuestion.question_text}></textarea>
					</div>

					<div class="bg-slate-50 border border-slate-100 rounded-xl p-4">
						<MediaUploader 
							label="Ubah/Unggah Media" 
							accept="image/*,audio/*"
							value={editingQuestion.media_url || ''}
							on:upload={(e) => {
								editingQuestion.media_url = e.detail.url;
								editingQuestion.media_type = e.detail.type;
							}}
							on:remove={() => {
								editingQuestion.media_url = '';
								editingQuestion.media_type = null;
							}}
						/>
						<input type="hidden" name="media_url" value={editingQuestion.media_url || ''} />
					</div>

					<!-- Type-specific fields for edit -->
					{#if editingQuestion.type === 'pilihan_ganda'}
						{@const opts = editingQuestion.options_json ? JSON.parse(editingQuestion.options_json) : []}
						{@const correct = editingQuestion.correct_answer_json ? JSON.parse(editingQuestion.correct_answer_json) : 'A'}
						<div class="space-y-2">
							<label class="label">Opsi Jawaban</label>
							{#each Array(editOptionCount) as _, i}
								<div class="flex items-center gap-2">
									<span class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">{String.fromCharCode(65 + i)}</span>
									<input id="edit_option_{i}" name="option_{i}" type="text" class="input flex-1" value={opts[i] || ''} required />
									<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 shrink-0" on:click={() => openOptionMediaPicker('edit', 'pilihan_ganda', i)} title="Tambahkan Media">
										🖼️
									</button>
								</div>
							{/each}
							{#if editOptionCount < 5}
								<button type="button" class="text-xs text-indigo-500" on:click={() => editOptionCount++}>+ Tambah opsi</button>
							{/if}
							<div class="mt-2">
								<label class="label" for="eq-correct">Jawaban Benar</label>
								<select id="eq-correct" name="correct_answer" class="select w-32" value={correct}>
									{#each Array(editOptionCount) as _, i}
										<option value={String.fromCharCode(65 + i)}>{String.fromCharCode(65 + i)}</option>
									{/each}
								</select>
							</div>
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
							{#each [0, 1, 2, 3] as i}
								<div class="grid grid-cols-2 gap-2">
									<div class="flex gap-1">
										<input id="edit_left_{i}" name="left_{i}" type="text" class="input w-full" value={opts.left?.[i] || ''} placeholder="Kiri {i + 1}" />
										<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-2 shrink-0" on:click={() => openOptionMediaPicker('edit', 'menjodohkan_left', i)} title="Media">🖼️</button>
									</div>
									<div class="flex gap-1">
										<input id="edit_right_{i}" name="right_{i}" type="text" class="input w-full" value={opts.right?.[i] || ''} placeholder="Kanan {i + 1}" />
										<button type="button" class="btn bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-2 shrink-0" on:click={() => openOptionMediaPicker('edit', 'menjodohkan_right', i)} title="Media">🖼️</button>
									</div>
								</div>
							{/each}
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

<!-- Media Picker Modal for Options -->
{#if showOptionMediaPicker}
	<div class="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300">
		<div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col transform scale-100">
			<div class="p-4 border-b flex justify-between items-center bg-slate-50/50">
				<h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
					<svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
					Tambahkan Media ke Opsi
				</h3>
				<button type="button" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" on:click={() => showOptionMediaPicker = false}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>
			<div class="p-5">
				<p class="text-sm text-slate-500 mb-4">Pilih media dari bank berkas atau unggah baru. HTML media akan otomatis ditambahkan ke opsi jawaban.</p>
				<div class="border border-indigo-100 bg-indigo-50/30 rounded-xl p-4">
					<MediaUploader 
						label="Pilih / Unggah Media"
						on:upload={(e) => {
							insertMediaToOption(e.detail.url, e.detail.type);
						}}
					/>
				</div>
			</div>
		</div>
	</div>
{/if}
