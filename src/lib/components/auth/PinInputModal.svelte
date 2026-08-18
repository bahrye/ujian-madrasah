<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { ROLE_LABELS } from '$lib/utils/constants';

	export let show = false;
	export let username = '';
	export let name = '';
	export let role = '';

	const dispatch = createEventDispatcher<{
		submit: { pin: string };
		cancel: void;
	}>();

	let digits: string[] = ['', '', '', '', ''];
	let errorMessage = '';

	$: if (show) {
		digits = ['', '', '', '', ''];
		errorMessage = '';
	}

	function pressKeypad(num: string) {
		errorMessage = '';
		const firstEmpty = digits.findIndex((d) => !d);
		if (firstEmpty !== -1) {
			digits[firstEmpty] = num;
			digits = [...digits];
			if (digits.every((d) => d !== '')) {
				setTimeout(() => submitPin(), 120);
			}
		}
	}

	function backspaceKeypad() {
		errorMessage = '';
		for (let i = 4; i >= 0; i--) {
			if (digits[i]) {
				digits[i] = '';
				digits = [...digits];
				break;
			}
		}
	}

	function clearAll() {
		errorMessage = '';
		digits = ['', '', '', '', ''];
	}

	function submitPin() {
		const pin = digits.join('');
		if (pin.length !== 5) {
			errorMessage = 'Masukkan 5 digit angka rahasia lengkap.';
			return;
		}
		errorMessage = '';
		dispatch('submit', { pin });
	}

	function cancel() {
		dispatch('cancel');
	}

	// Physical keyboard listener for Desktop users (without popping up mobile virtual keyboards)
	function handleWindowKeydown(event: KeyboardEvent) {
		if (!show) return;

		if (event.key >= '0' && event.key <= '9') {
			event.preventDefault();
			pressKeypad(event.key);
		} else if (event.key === 'Backspace') {
			event.preventDefault();
			backspaceKeypad();
		} else if (event.key === 'Enter') {
			event.preventDefault();
			submitPin();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			cancel();
		}
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
				if (node && node.parentNode) node.parentNode.removeChild(node);
			}
		};
	}
</script>

<svelte:window on:keydown={handleWindowKeydown} />

{#if show}
	<div use:portal class="fixed inset-0 z-[100] flex items-center justify-center p-4">
		<!-- Backdrop -->
		<div
			class="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
			on:click={cancel}
			role="button"
			tabindex="-1"
			aria-label="Batal"
		></div>

		<!-- Dialog Modal -->
		<div class="bg-white text-slate-800 w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col animate-bounce-in border border-slate-100">
			<!-- Header -->
			<div class="p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-center relative overflow-hidden">
				<div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
				<button
					class="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
					on:click={cancel}
					aria-label="Tutup"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<div class="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 mx-auto flex items-center justify-center mb-2 shadow-inner">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
					</svg>
				</div>
				<h3 class="text-base font-bold">Verifikasi Angka Rahasia</h3>
				<p class="text-xs text-white/90 mt-0.5">Keamanan Tambahan Login Petugas</p>
			</div>

			<!-- Body -->
			<div class="p-6 flex flex-col items-center text-center space-y-4">
				<!-- User Info Card -->
				<div class="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3">
					<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm shadow-sm">
						{name ? name.charAt(0).toUpperCase() : '👤'}
					</div>
					<div class="text-left min-w-0 flex-1">
						<p class="text-xs font-bold text-slate-800 truncate">{name || username}</p>
						<p class="text-[11px] text-slate-500 truncate">@{username}</p>
					</div>
					<span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded-lg uppercase tracking-wider">
						{ROLE_LABELS[role] || role || 'Petugas'}
					</span>
				</div>

				<p class="text-xs text-slate-600">
					Tekan tombol angka di bawah untuk memasukkan <strong>5 digit angka rahasia</strong>:
				</p>

				<!-- 5-Digit Display Boxes (No virtual keyboard on mobile) -->
				<div class="flex items-center justify-center gap-2.5 my-1">
					{#each [0, 1, 2, 3, 4] as i}
						{@const isFilled = Boolean(digits[i])}
						{@const isCurrent = digits.findIndex((d) => !d) === i}
						<div
							class="w-12 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 select-none
								{isFilled ? 'border-amber-500 bg-amber-50/60 shadow-sm text-slate-900' : isCurrent ? 'border-amber-400 bg-white ring-4 ring-amber-500/20' : 'border-slate-200 bg-slate-50 text-slate-400'}"
						>
							{#if isFilled}
								<span class="text-2xl font-black font-mono animate-scale-up">
									{digits[i]}
								</span>
							{:else if isCurrent}
								<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
							{:else}
								<span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
							{/if}
						</div>
					{/each}
				</div>

				{#if errorMessage}
					<p class="text-xs font-semibold text-rose-600 animate-shake">{errorMessage}</p>
				{/if}

				<!-- Numeric Keypad for fast input -->
				<div class="grid grid-cols-3 gap-2 w-full pt-2 select-none">
					{#each ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as key}
						<button
							type="button"
							class="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 font-bold text-lg text-slate-700 transition-colors shadow-xs active:scale-95"
							on:click={() => pressKeypad(key)}
						>
							{key}
						</button>
					{/each}
					<button
						type="button"
						class="py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 font-bold text-xs transition-colors flex items-center justify-center active:scale-95 border border-rose-100"
						on:click={backspaceKeypad}
						title="Hapus Digit Terakhir"
					>
						⌫ Hapus
					</button>
					<button
						type="button"
						class="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 font-bold text-lg text-slate-700 transition-colors shadow-xs active:scale-95"
						on:click={() => pressKeypad('0')}
					>
						0
					</button>
					<button
						type="button"
						class="py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-xs transition-all flex items-center justify-center shadow-md shadow-amber-500/25"
						on:click={submitPin}
					>
						Masuk ➔
					</button>
				</div>
			</div>

			<!-- Footer -->
			<div class="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
				<button
					type="button"
					class="btn btn-secondary w-full text-xs py-2"
					on:click={cancel}
				>
					Batal
				</button>
			</div>
		</div>
	</div>
{/if}
