<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, scale } from 'svelte/transition';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let action: string;
	export let confirmMessage: string;
	export let confirmTitle: string = 'Konfirmasi';
	export let buttonClass: string = '';
	export let buttonTitle: string = '';
	export let verifyText: string | null = null;
	export let verifyPlaceholder: string | null = null;

	let showModal = false;
	let formElement: HTMLFormElement;
	let isConfirmed = false;
	let verifyInput = '';

	const handleEnhance: SubmitFunction = ({ cancel }) => {
		if (!isConfirmed) {
			cancel();
			showModal = true;
		}
		return async ({ update }) => {
			await update();
		};
	};

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
				verifyInput = '';
			}, 100);
		}, 0);
	}

	function portal(node: HTMLElement) {
		let destroyed = false;
		setTimeout(() => {
			if (!destroyed && node && node.parentNode !== document.body) {
				document.body.appendChild(node);
			}
		}, 0);
		return {
			destroy() {
				destroyed = true;
				if (node && node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}
		};
	}
</script>

<form bind:this={formElement} method="POST" {action} use:enhance={handleEnhance} class="inline-block">
	<slot name="inputs" />
	<button type="submit" class={buttonClass} title={buttonTitle}>
		<slot name="buttonContent" />
	</button>
</form>

{#if showModal}
	<div use:portal class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" transition:fade={{duration: 200}}>
		<div class="max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" transition:scale={{start: 0.95, duration: 200}}>
			<div class="p-6">
				<div class="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
					<svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				</div>
				<h3 class="text-lg font-bold text-slate-900">{confirmTitle}</h3>
				<p class="text-slate-500 mt-2 text-sm">{@html confirmMessage}</p>
				{#if verifyText}
					<div class="mt-4">
						<label class="block text-sm font-medium text-slate-700 mb-1">
							Silakan ketik <strong class="text-rose-600 select-all">{verifyText}</strong> untuk konfirmasi:
						</label>
						<input 
							type="text" 
							bind:value={verifyInput} 
							class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm" 
							placeholder={verifyPlaceholder || verifyText} 
						/>
					</div>
				{/if}
			</div>
			<div class="px-6 py-4 bg-slate-50 flex justify-end gap-3 rounded-b-2xl border-t border-slate-100">
				<button type="button" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors" on:click={() => { showModal = false; verifyInput = ''; }}>Batal</button>
				<button 
					type="button" 
					class="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
					disabled={verifyText !== null && verifyInput !== verifyText}
					on:click={confirm}
				>
					Ya, Lanjutkan
				</button>
			</div>
		</div>
	</div>
{/if}
