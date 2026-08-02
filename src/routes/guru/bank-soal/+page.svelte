<script lang="ts">
	import { ICONS } from '$lib/utils/constants';
	import { enhance } from '$app/forms';
	export let data;

	let showCopyModal = false;
	let sourceExam: any = null;
	let questionsToCopy: any[] = [];
	let selectedQuestionIds: Set<number> = new Set();
	let targetExamId = '';
	let isLoadingQuestions = false;
	let isCopying = false;

	async function openCopyModal(exam: any) {
		sourceExam = exam;
		showCopyModal = true;
		isLoadingQuestions = true;
		questionsToCopy = [];
		selectedQuestionIds.clear();
		targetExamId = '';

		try {
			const res = await fetch(`/api/exams/${exam.id}/questions`);
			if (res.ok) {
				const json = await res.json();
				questionsToCopy = json.questions || [];
			}
		} catch (e) {
			console.error(e);
		} finally {
			isLoadingQuestions = false;
		}
	}

	function toggleSelectAll() {
		if (selectedQuestionIds.size === questionsToCopy.length) {
			selectedQuestionIds.clear();
		} else {
			questionsToCopy.forEach(q => selectedQuestionIds.add(q.id));
		}
		selectedQuestionIds = selectedQuestionIds;
	}

	function toggleSelect(id: number) {
		if (selectedQuestionIds.has(id)) {
			selectedQuestionIds.delete(id);
		} else {
			selectedQuestionIds.add(id);
		}
		selectedQuestionIds = selectedQuestionIds;
	}
</script>

<svelte:head><title>Bank Soal — Ujian Online Madrasah</title></svelte:head>

<div class="space-y-6 animate-in">
	<div>
		<h1 class="text-2xl font-bold text-slate-800">Bank Soal</h1>
		<p class="text-sm text-slate-500 mt-1">Pilih ujian untuk mengelola soal</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
		{#each data.exams as exam (exam.id)}
			<a href="/guru/bank-soal/{exam.id}" class="card-hover p-5 group flex flex-col justify-between">
				<div>
					<div class="flex items-start justify-between mb-2">
						<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform">
							<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.exam} />
							</svg>
						</div>
						{#if exam.is_active}
							<span class="badge-success">Aktif</span>
						{/if}
					</div>
					<h3 class="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{exam.title}</h3>
					<p class="text-xs text-slate-500 mt-1">{exam.subject || 'Umum'} · {exam.duration_minutes} menit</p>
				</div>
				<div class="mt-3 flex items-center justify-between">
					<div class="flex items-center gap-1 text-sm font-semibold text-indigo-600">
						<span>{exam.question_count} soal</span>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.chevronRight} />
						</svg>
					</div>
					{#if exam.question_count > 0}
						<button 
							type="button" 
							class="btn-sm btn-ghost p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors z-10 relative"
							on:click|preventDefault={() => openCopyModal(exam)}
							title="Salin Soal"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
							</svg>
						</button>
					{/if}
				</div>
			</a>
		{:else}
			<div class="col-span-full text-center py-12 text-slate-400">Belum ada ujian. Hubungi admin untuk membuat ujian.</div>
		{/each}
	</div>
</div>

{#if showCopyModal}
	<div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
		<div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
			<div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
				<div>
					<h3 class="font-bold text-lg text-slate-800">Salin Soal</h3>
					<p class="text-sm text-slate-500 mt-1">Dari: {sourceExam?.title}</p>
				</div>
				<button class="text-slate-400 hover:text-slate-600 transition-colors" on:click={() => (showCopyModal = false)}>
					<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={ICONS.close} />
					</svg>
				</button>
			</div>

			<form method="POST" action="?/copyQuestions" use:enhance={() => {
				isCopying = true;
				return async ({ result, update }) => {
					isCopying = false;
					if (result.type === 'success') {
						showCopyModal = false;
						await update();
					}
				};
			}} class="flex flex-col h-full overflow-hidden">
				<input type="hidden" name="question_ids" value={Array.from(selectedQuestionIds).join(',')} />
				
				<div class="p-6 border-b border-slate-100">
					<label class="block text-sm font-medium text-slate-700 mb-1">Pilih Ujian Tujuan</label>
					<select name="target_exam_id" class="input" bind:value={targetExamId} required>
						<option value="" disabled selected>-- Pilih Ujian --</option>
						{#each data.exams.filter(e => e.id !== sourceExam?.id) as target}
							<option value={target.id}>{target.title}</option>
						{/each}
					</select>
				</div>

				<div class="p-6 overflow-y-auto flex-1 bg-slate-50">
					<div class="flex items-center justify-between mb-4">
						<h4 class="font-semibold text-slate-700">Daftar Soal</h4>
						<label class="flex items-center gap-2 text-sm font-medium cursor-pointer text-indigo-600 hover:text-indigo-700">
							<input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
								checked={questionsToCopy.length > 0 && selectedQuestionIds.size === questionsToCopy.length}
								on:change={toggleSelectAll}
							/>
							Pilih Semua
						</label>
					</div>

					{#if isLoadingQuestions}
						<div class="flex items-center justify-center py-8 text-slate-500">
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
							Memuat soal...
						</div>
					{:else if questionsToCopy.length === 0}
						<div class="text-center py-8 text-slate-400">Tidak ada soal di ujian ini.</div>
					{:else}
						<div class="space-y-2">
							{#each questionsToCopy as q}
								<label class="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 cursor-pointer transition-colors shadow-sm">
									<div class="pt-0.5">
										<input type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
											checked={selectedQuestionIds.has(q.id)}
											on:change={() => toggleSelect(q.id)}
										/>
									</div>
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-2 mb-1">
											<span class="text-xs font-bold text-slate-400">#{q.question_number}</span>
											<span class="badge-primary text-[10px] uppercase tracking-wider">{q.type.replace('_', ' ')}</span>
											<span class="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{q.points} Pts</span>
										</div>
										<p class="text-sm text-slate-700 line-clamp-2" title={q.question_text}>
											{q.question_text.replace(/<[^>]*>?/gm, '')}
										</p>
									</div>
								</label>
							{/each}
						</div>
					{/if}
				</div>

				<div class="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
					<button type="button" class="btn btn-secondary" on:click={() => (showCopyModal = false)}>Batal</button>
					<button type="submit" class="btn btn-primary" disabled={isCopying || selectedQuestionIds.size === 0 || !targetExamId}>
						{#if isCopying}
							Menyalin...
						{:else}
							Salin {selectedQuestionIds.size} Soal
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
