<script lang="ts">
	import { enhance } from '$app/forms';
	import { ICONS } from '$lib/utils/constants';

	export let data;
	export let form: { error?: string } | null;

	let loading = false;
</script>

<svelte:head><title>Mulai Ujian — Ujian Online Madrasah</title></svelte:head>

<div class="max-w-md mx-auto mt-8 animate-in">
	<div class="card p-8 text-center">
		<div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-6">
			<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.token} />
			</svg>
		</div>

		<h1 class="text-2xl font-bold text-slate-800 mb-2">Masukkan Token Ujian</h1>
		<div class="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
			<p class="font-bold text-slate-700 text-lg">{data.exam.title}</p>
			<p class="text-sm text-slate-500">{data.exam.subject || 'Umum'}</p>
		</div>
		<p class="text-sm text-slate-500 mb-6">Dapatkan token dari pengawas ujian Anda untuk memulai</p>

		{#if form?.error}
			<div class="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium text-left flex items-center gap-2">
				<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d={ICONS.warning} />
				</svg>
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => { loading = false; await update(); };
			}}
			class="space-y-4"
		>
			<input
				name="token"
				type="text"
				required
				class="input text-center text-2xl font-mono tracking-[0.3em] uppercase py-4"
				placeholder="_ _ _ _ _ _"
				maxlength="10"
				autocomplete="off"
			/>
			<input type="hidden" name="exam_id" value={data.exam.id} />

			<button type="submit" disabled={loading} class="btn-primary w-full py-3 text-base justify-center">
				{#if loading}
					<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
					Memvalidasi...
				{:else}
					Mulai Ujian
				{/if}
			</button>
		</form>

		<p class="text-xs text-slate-400 mt-4">Token bersifat sekali pakai dan memiliki batas waktu.</p>
	</div>
</div>
