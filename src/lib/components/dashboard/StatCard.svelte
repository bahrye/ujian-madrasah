<script lang="ts">
	export let value: string = '';
	export let label: string = '';
	export let gradient: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose' = 'indigo';
	export let icon: string = '';
	export let trend: string = '';
	export let trendUp: boolean = true;

	const gradients: Record<string, string> = {
		indigo: 'from-indigo-500 to-violet-500',
		cyan: 'from-cyan-500 to-sky-500',
		emerald: 'from-emerald-500 to-teal-500',
		amber: 'from-amber-400 to-orange-500',
		rose: 'from-rose-500 to-pink-500'
	};

	const glows: Record<string, string> = {
		indigo: 'shadow-indigo-500/20',
		cyan: 'shadow-cyan-500/20',
		emerald: 'shadow-emerald-500/20',
		amber: 'shadow-amber-500/20',
		rose: 'shadow-rose-500/20'
	};
</script>

<div class="card-hover p-5 group">
	<div class="flex items-start justify-between">
		<div class="flex-1">
			<p class="text-sm font-medium text-slate-500 mb-1">{label}</p>
			<p class="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
			{#if trend}
				<div class="flex items-center gap-1 mt-2">
					<svg
						class="w-4 h-4 {trendUp ? 'text-emerald-500' : 'text-rose-500'}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d={trendUp ? 'M7 11l5-5m0 0l5 5m-5-5v12' : 'M17 13l-5 5m0 0l-5-5m5 5V6'}
						/>
					</svg>
					<span class="text-xs font-semibold {trendUp ? 'text-emerald-600' : 'text-rose-600'}">{trend}</span>
				</div>
			{/if}
		</div>
		{#if icon}
			<div
				class="w-12 h-12 rounded-xl bg-gradient-to-br {gradients[gradient]} shadow-lg {glows[gradient]}
					   flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
			>
				<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={icon} />
				</svg>
			</div>
		{/if}
	</div>
</div>
