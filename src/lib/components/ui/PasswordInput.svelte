<script lang="ts">
	export let id: string = 'password';
	export let name: string = 'password';
	export let value: string = '';
	export let placeholder: string = 'Masukkan kata sandi';
	export let required: boolean = false;
	export let autocomplete: string = 'current-password';
	export let iconLeft: boolean = false;
	export let disabled: boolean = false;

	let showPassword = false;

	function togglePassword() {
		showPassword = !showPassword;
	}
</script>

<div class="relative w-full">
	{#if iconLeft}
		<div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
			</svg>
		</div>
	{/if}

	<input
		{id}
		{name}
		type={showPassword ? 'text' : 'password'}
		{required}
		{placeholder}
		{autocomplete}
		{disabled}
		bind:value
		class="input pr-10 {iconLeft ? 'pl-10' : ''}"
	/>

	<button
		type="button"
		class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:text-indigo-600 transition-colors p-1 rounded-md focus:outline-none"
		on:click|preventDefault={togglePassword}
		title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
		aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
		tabindex="-1"
	>
		{#if showPassword}
			<!-- Eye Slash Icon (Sembunyikan) -->
			<svg class="w-5 h-5 text-indigo-600 transition-transform duration-200 scale-105" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
			</svg>
		{:else}
			<!-- Eye Icon (Tampilkan) -->
			<svg class="w-5 h-5 text-slate-400 hover:text-slate-600 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.8">
				<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12c1.074-4.65 5.244-8 10.214-8s9.14 3.35 10.214 8c-1.074 4.65-5.244 8-10.214 8s-9.14-3.35-10.214-8z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
		{/if}
	</button>
</div>
