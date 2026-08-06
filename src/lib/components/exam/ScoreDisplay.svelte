<script lang="ts">
	export let attempt: any;
	export let currentTime: Date;

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

	$: isScoreVisible = (() => {
		if (isManual) return attempt.is_score_released === 1;
		if (isAfterTypeEndTime) return typeEndTime && currentTime >= typeEndTime;
		if (isAfterEndTime) return endTime && currentTime >= endTime;
		return true; // objective_only and after_submit are always visible when finished
	})();

	$: statusLabel = (() => {
		if (isManual && attempt.is_score_released !== 1) return 'Belum dirilis';
		if (isAfterTypeEndTime && (!typeEndTime || currentTime < typeEndTime)) return 'Menunggu jadwal tipe ujian';
		if (isAfterEndTime && (!endTime || currentTime < endTime)) return 'Menunggu jadwal berakhir';
		return '';
	})();
</script>

{#if attempt.status !== 'selesai' && attempt.status !== 'waktu_habis'}
	<span class="text-slate-400 font-normal">-</span>
{:else if !isScoreVisible}
	<span class="text-slate-400 text-xs font-normal font-sans bg-slate-100 px-2 py-1 rounded whitespace-nowrap">{statusLabel}</span>
{:else}
	{#if isObjectiveOnly}
		<span class={(attempt.objective_score ?? 0) >= 70 ? 'text-emerald-600' : 'text-rose-600'} title="Nilai Objektif (Tanpa Isian & Essay)">
			{attempt.objective_score != null ? attempt.objective_score.toFixed(1) : '-'}
		</span>
	{:else}
		<span class={(attempt.score ?? 0) >= 70 ? 'text-emerald-600' : 'text-rose-600'}>
			{attempt.score != null ? attempt.score.toFixed(1) : '-'}
		</span>
	{/if}
{/if}
