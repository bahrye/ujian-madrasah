<script lang="ts">
	import { enhance } from '$app/forms';
	import { QUESTION_TYPE_LABELS, ICONS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';

	export let data;
	export let form: any;

	let showCreateForm = false;
	let selectedType = 'pilihan_ganda';
	let deleteConfirm: number | null = null;
	let optionCount = 4;

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
	$: exam = data.exam as any;
	$: questions = data.questions as any[];
</script>

<svelte:head><title>Soal - {exam.title} — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div class="flex items-center gap-3">
		<a href="/guru/bank-soal" class="btn-ghost btn-sm">
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

				<div>
					<label class="label" for="q-media-url">URL Media <span class="text-slate-400 font-normal">(opsional)</span></label>
					<input id="q-media-url" name="media_url" type="url" class="input" placeholder="https://example.com/gambar.jpg" />
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
								<input name="option_{i}" type="text" class="input flex-1" placeholder="Opsi {String.fromCharCode(65 + i)}" required />
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
								<input name="left_{i}" type="text" class="input" placeholder="Kiri {i + 1}" />
								<input name="right_{i}" type="text" class="input" placeholder="Kanan {i + 1}" />
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
						{#if Array.isArray(opts)}
							<div class="flex flex-wrap gap-1.5 mt-2">
								{#each opts as opt, i}
									<span class="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{String.fromCharCode(65 + i)}. {opt}</span>
								{/each}
							</div>
						{/if}
					{/if}
				</div>
				<form method="POST" action="?/delete" use:enhance class="opacity-0 group-hover:opacity-100 transition-opacity">
					<input type="hidden" name="id" value={q.id} />
					<button type="submit" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Hapus soal">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.trash} />
						</svg>
					</button>
				</form>
			</div>
		{:else}
			<div class="text-center py-12 text-slate-400">
				<p>Belum ada soal. Klik "Tambah Soal" untuk memulai.</p>
			</div>
		{/each}
	</div>
</div>
