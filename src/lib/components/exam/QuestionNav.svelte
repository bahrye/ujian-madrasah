<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let questions: Array<{
		id: number;
		question_number: number;
		answered: boolean;
		doubted: boolean;
	}> = [];
	export let currentIndex: number = 0;

	const dispatch = createEventDispatcher();

	function goTo(index: number) {
		dispatch('navigate', { index });
	}

	function getButtonClass(q: { answered: boolean; doubted: boolean }, index: number): string {
		if (index === currentIndex) {
			return 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 scale-110';
		}
		if (q.doubted) {
			return 'bg-amber-100 text-amber-700 border-2 border-amber-400';
		}
		if (q.answered) {
			return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
		}
		return 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50';
	}
</script>

<div class="space-y-3">
	<!-- Legend -->
	<div class="flex flex-wrap gap-3 text-xs">
		<div class="flex items-center gap-1.5">
			<div class="w-4 h-4 rounded bg-gradient-to-r from-indigo-500 to-violet-500"></div>
			<span class="text-slate-600">Aktif</span>
		</div>
		<div class="flex items-center gap-1.5">
			<div class="w-4 h-4 rounded bg-emerald-100 border border-emerald-300"></div>
			<span class="text-slate-600">Terjawab</span>
		</div>
		<div class="flex items-center gap-1.5">
			<div class="w-4 h-4 rounded bg-amber-100 border-2 border-amber-400"></div>
			<span class="text-slate-600">Ragu-ragu</span>
		</div>
		<div class="flex items-center gap-1.5">
			<div class="w-4 h-4 rounded bg-white border border-slate-200"></div>
			<span class="text-slate-600">Belum</span>
		</div>
	</div>

	<!-- Question Grid -->
	<div class="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
		{#each questions as q, index}
			<button
				class="w-full aspect-square rounded-lg text-xs font-bold transition-all duration-200 {getButtonClass(q, index)}"
				on:click={() => goTo(index)}
				title="Soal {index + 1}"
			>
				{index + 1}
			</button>
		{/each}
	</div>
</div>
