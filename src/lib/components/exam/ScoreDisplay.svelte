<script lang="ts">
	export let attempt: any;
	export let currentTime: Date;

	export let type: 'otomatis' | 'manual' | 'akhir' = 'akhir';

	// Helper to parse date from string (similar to the one in +page.svelte)
	function parseDate(dateStr: string | null | undefined): Date | null {
		if (!dateStr) return null;
		const str = String(dateStr).replace(' ', 'T');
		return new Date(str + (str.includes('T') && !str.includes('Z') ? 'Z' : ''));
	}

	$: showScoreType = attempt.show_score_type || 'after_submit';
	$: isManual = showScoreType === 'manual';
	$: isAfterTypeEndTime = showScoreType === 'after_type_end_time';
	$: isAfterEndTime = showScoreType === 'after_end_time';
	$: isObjectiveOnly = showScoreType === 'objective_only';

	$: typeEndTime = parseDate(attempt.exam_type_end_time);
	$: endTime = parseDate(attempt.exam_end_time);

	$: isReleased = attempt.student_is_score_released === 1 || attempt.is_score_released === 1 || attempt.exam_is_score_released === 1;

	$: isScoreVisible = (() => {
		if (isReleased) return true;
		if (isManual) return false;
		if (isAfterTypeEndTime) return typeEndTime && currentTime >= typeEndTime;
		if (isAfterEndTime) return endTime && currentTime >= endTime;
		return true; // objective_only and after_submit are always visible when finished
	})();

	$: statusLabel = (() => {
		if (isManual && !isReleased) return 'Belum dirilis';
		if (isAfterTypeEndTime && (!typeEndTime || currentTime < typeEndTime)) return 'Menunggu jadwal tipe ujian';
		if (isAfterEndTime && (!endTime || currentTime < endTime)) return 'Menunggu jadwal berakhir';
		return '';
	})();

	$: total_points = attempt.total_points || 1;
	
	// Gunakan poin mentah asli dari database agar 100% presisi dan mengatasi data lama yang corrupt
	$: objective_raw = attempt.objective_earned_points ?? 0;
	$: akhir_raw = ((attempt.score ?? 0) / 100) * total_points;
	$: manual_raw = akhir_raw - objective_raw;

	$: otomatis = (objective_raw / total_points) * 100;
	$: akhir = attempt.score ?? 0;
	$: manual = isObjectiveOnly ? null : (manual_raw / total_points) * 100;

	function formatScore(score: number | null) {
		if (score == null) return '-';
		return score.toFixed(1).replace(/\.0$/, '');
	}
</script>

{#if attempt.status !== 'selesai' && attempt.status !== 'waktu_habis'}
	<span class="text-slate-400 font-normal">-</span>
{:else if !isScoreVisible}
	{#if type === 'akhir'}
		<span class="text-slate-400 text-[11px] leading-snug font-normal font-sans bg-slate-100 px-2.5 py-1.5 rounded-md inline-block max-w-[140px] text-center break-words">{statusLabel}</span>
	{:else}
		<span class="text-slate-400 font-normal">-</span>
	{/if}
{:else}
	{#if type === 'otomatis'}
		<span class={otomatis >= 70 ? 'text-emerald-600' : 'text-rose-600'}>{formatScore(otomatis)}</span>
	{:else if type === 'manual'}
		{#if manual === null}
			<span class="text-slate-400 font-normal" title="Disembunyikan">-</span>
		{:else}
			<span class="text-indigo-600 font-semibold">{formatScore(manual)}</span>
		{/if}
	{:else if type === 'akhir'}
		{#if isObjectiveOnly}
			<span class={otomatis >= 70 ? 'text-emerald-600' : 'text-rose-600'} title="Nilai Objektif (Tanpa Isian & Essay)">
				{formatScore(otomatis)}
			</span>
		{:else}
			<span class={akhir >= 70 ? 'text-emerald-600' : 'text-rose-600'}>
				{formatScore(akhir)}
			</span>
		{/if}
	{/if}
{/if}
