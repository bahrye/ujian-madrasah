<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, scale } from 'svelte/transition';

	export let action: string;
	export let confirmMessage: string;
	export let confirmTitle: string = 'Konfirmasi';
	export let buttonClass: string = '';
	export let buttonTitle: string = '';

	let showModal = false;
	let formElement: HTMLFormElement;
	let isConfirmed = false;

	function handleSubmit(e: Event) {
		if (!isConfirmed) {
			e.preventDefault();
			showModal = true;
		}
	}

	function confirm() {
		showModal = false;
		isConfirmed = true;
		// Wait a tick for isConfirmed to be true, then trigger form submission natively.
		// Since we use enhance, the native submit event will be caught by SvelteKit.
		setTimeout(() => {
			if (formElement.requestSubmit) {
				formElement.requestSubmit();
			} else {
				formElement.submit(); // Fallback for older browsers
			}
			
			// Reset confirmation state
			setTimeout(() => {
				isConfirmed = false;
			}, 100);
		}, 0);
	}
</script>

<form bind:this={formElement} method="POST" {action} use:enhance on:submit={handleSubmit} class="inline-block">
	<slot name="inputs" />
	<button type="submit" class={buttonClass} title={buttonTitle}>
		<slot name="buttonContent" />
	</button>
</form>

{#if showModal}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" transition:fade={{duration: 200}}>
		<div class="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" transition:scale={{start: 0.95, duration: 200}}>
			<div class="p-6">
				<div class="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				</div>
				<h3 class="text-lg font-bold text-slate-900">{confirmTitle}</h3>
				<p class="text-slate-500 mt-2 text-sm">{confirmMessage}</p>
			</div>
			<div class="px-6 py-4 bg-slate-50 flex justify-end gap-3 rounded-b-2xl border-t border-slate-100">
				<button type="button" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors" on:click={() => showModal = false}>Batal</button>
				<button type="button" class="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-sm transition-colors" on:click={confirm}>Ya, Lanjutkan</button>
			</div>
		</div>
	</div>
{/if}
