<script lang="ts">
	import { enhance } from '$app/forms';
	import { QUESTION_TYPE_LABELS } from '$lib/utils/constants';
	import { toasts } from '$lib/stores/toast';
	import { mathRender } from '$lib/actions/mathRender';

	export let data;
	export let form: any;

	$: if (form?.success) toasts.success(form.success);
	$: if (form?.error) toasts.error(form.error);
	$: answers = data.answers as any[];
</script>

<svelte:head><title>Penilaian — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Penilaian Jawaban</h1>
		<p class="text-sm text-slate-500 mt-1">Nilai jawaban essay dan isian singkat siswa</p>
	</div>

	<!-- Filter -->
	<div class="card p-4">
		<form method="GET" class="flex flex-col md:flex-row gap-3">
			<select name="exam_id" class="select flex-1" on:change={(e) => e.currentTarget.form?.submit()}>
				<option value="" disabled selected={data.examParam === null}>-- Pilih Ujian Terlebih Dahulu --</option>
				<option value="all" selected={data.examParam === 'all'}>Semua Ujian</option>
				{#each data.exams as exam}
					<option value={exam.id} selected={data.examParam === String(exam.id)}>{exam.title}</option>
				{/each}
			</select>
			
			<select name="student_id" class="select flex-1" disabled={data.examParam === null}>
				<option value="">Semua Siswa</option>
				{#each data.students as student}
					<option value={student.id} selected={data.studentFilter === String(student.id)}>{student.name}</option>
				{/each}
			</select>
			
			<button type="submit" class="btn-secondary md:w-auto w-full" disabled={data.examParam === null}>Tampilkan</button>
		</form>
	</div>

	{#if data.selectedExam && data.selectedExam.show_score_type === 'manual'}
		<div class="card p-4 flex items-center justify-between bg-indigo-50/50 border-indigo-100">
			<div>
				<h3 class="font-bold text-slate-800">Status Rilis Nilai Manual</h3>
				<p class="text-xs text-slate-500 mt-0.5">Pengaturan ujian ini mewajibkan nilai dirilis secara manual oleh Guru/Admin.</p>
			</div>
			<form method="POST" action="?/toggleScoreRelease" use:enhance>
				<input type="hidden" name="exam_id" value={data.selectedExam.id} />
				<button type="submit" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 {data.selectedExam.is_score_released ? 'bg-indigo-600' : 'bg-slate-200'}" role="switch" aria-checked={data.selectedExam.is_score_released}>
					<span class="sr-only">Rilis Nilai</span>
					<span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {data.selectedExam.is_score_released ? 'translate-x-6' : 'translate-x-1'}"></span>
				</button>
				<span class="ml-2 text-sm font-medium {data.selectedExam.is_score_released ? 'text-indigo-600' : 'text-slate-400'}">
					{data.selectedExam.is_score_released ? 'Nilai Dirilis' : 'Disembunyikan'}
				</span>
			</form>
		</div>
	{/if}

	<!-- Answers to Grade -->
	{#if data.examParam === null}
		<div class="card p-12 text-center text-slate-400">
			<p class="text-lg font-medium mb-1">Pilih filter ujian di atas</p>
			<p class="text-sm">Anda harus memilih ujian dan/atau siswa terlebih dahulu.</p>
		</div>
	{:else if answers.length === 0}
		<div class="card p-12 text-center text-slate-400">
			<p class="text-lg font-medium mb-1">Tidak ada jawaban yang perlu dinilai</p>
			<p class="text-sm">Jawaban essay/isian siswa akan muncul di sini.</p>
		</div>
	{:else}
		<div class="space-y-4" use:mathRender={answers}>
			{#each answers as a (a.answer_id)}
				<div class="card p-5 {a.score_given != null ? 'border-l-4 border-emerald-400' : 'border-l-4 border-amber-400'}">
					<div class="flex flex-wrap items-center gap-2 mb-3">
						<span class="badge-info">{a.exam_title}</span>
						<span class="badge-primary">{QUESTION_TYPE_LABELS[a.type]}</span>
						<span class="text-sm font-semibold text-slate-700">{a.student_name}</span>
					</div>

					<p class="text-sm font-medium text-slate-700 mb-2">{a.question_text}</p>

					{#if a.correct_answer_json && (a.type === 'isian_singkat' || a.type === 'essay')}
						<div class="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-3">
							<p class="text-xs font-semibold text-emerald-700 mb-1">Kunci Jawaban / Penjelasan:</p>
							<p class="text-sm text-emerald-900 whitespace-pre-wrap">{JSON.parse(a.correct_answer_json)}</p>
						</div>
					{/if}

					<div class="bg-slate-50 rounded-xl p-3 mb-3">
						<p class="text-xs font-semibold text-slate-500 mb-1">Jawaban Siswa:</p>
						<p class="text-sm text-slate-800 whitespace-pre-wrap">{a.answer_given || '(Tidak dijawab)'}</p>
					</div>

					<form method="POST" action="?/grade" use:enhance class="flex items-center gap-3">
						<input type="hidden" name="answer_id" value={a.answer_id} />
						<input type="hidden" name="max_points" value={a.points} />
						<label class="text-sm font-medium text-slate-600">Nilai:</label>
						<input
							name="score_given"
							type="number"
							min="0"
							max={a.points}
							step="0.5"
							class="input w-24"
							value={a.score_given ?? ''}
							placeholder="0-{a.points}"
						/>
						<span class="text-xs text-slate-400">/ {a.points}</span>
						<button type="submit" class="btn-success btn-sm">Simpan</button>
						{#if a.score_given !== null && a.score_given !== undefined}
							<span class="badge-success">✓ Sudah dinilai</span>
						{:else}
							<span class="badge-warning">⚠ Belum dinilai</span>
						{/if}
					</form>
				</div>
			{/each}
		</div>
	{/if}
</div>
