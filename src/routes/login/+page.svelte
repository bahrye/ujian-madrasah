<script lang="ts">
	import { enhance } from '$app/forms';
	import Toast from '$lib/components/ui/Toast.svelte';
	import PasswordInput from '$lib/components/ui/PasswordInput.svelte';
	import QrScannerModal from '$lib/components/auth/QrScannerModal.svelte';
	import PinInputModal from '$lib/components/auth/PinInputModal.svelte';
	import type { ParsedQrLogin } from '$lib/utils/qrLogin';

	export let form: { error?: string } | null;

	let loading = false;
	let showQrModal = false;
	let showPinModal = false;
	let isAuthenticatingQr = false;
	let qrStatusMessage = '';
	let pinUserInfo = { name: '', role: '', username: '' };
	
	// Manual input bindings (never populated by QR scan to prevent exposure)
	let username = '';
	let password = '';

	// Hidden QR login payload bindings
	let qrUsername = '';
	let qrPassword = '';
	let qrToken = '';
	let loginPin = '';
	let formElement: HTMLFormElement;

	async function handleQrScan(event: CustomEvent<ParsedQrLogin>) {
		const { username: scannedUser, password: scannedPass, qrToken: scannedToken } = event.detail;
		qrUsername = scannedUser || '';
		qrPassword = scannedPass || '';
		qrToken = scannedToken || '';
		loginPin = '';
		showQrModal = false;

		isAuthenticatingQr = true;
		qrStatusMessage = 'Memverifikasi kode QR...';

		// Check if this user (staff) requires 5-digit PIN
		try {
			const res = await fetch(`/api/auth/check-pin?u=${encodeURIComponent(qrUsername)}`);
			if (res.ok) {
				const data = (await res.json()) as any;
				if (data?.requires_pin) {
					isAuthenticatingQr = false;
					pinUserInfo = {
						name: data.name || '',
						role: data.role || '',
						username: data.username || qrUsername
					};
					showPinModal = true;
					return;
				}
			}
		} catch (err) {
			console.debug('Check pin failed:', err);
		}

		// If no PIN required (e.g. Siswa), submit directly with smooth transition
		qrStatusMessage = 'Autentikasi Berhasil! Mengalihkan ke Dashboard...';
		submitLoginForm();
	}

	function handlePinSubmit(event: CustomEvent<{ pin: string }>) {
		loginPin = event.detail.pin;
		showPinModal = false;
		isAuthenticatingQr = true;
		qrStatusMessage = 'Memverifikasi Angka Rahasia & Mengalihkan...';
		submitLoginForm();
	}

	function submitLoginForm() {
		setTimeout(() => {
			if (formElement) {
				if (typeof formElement.requestSubmit === 'function') {
					formElement.requestSubmit();
				} else {
					formElement.submit();
				}
			}
		}, 150);
	}
</script>

<svelte:head>
	<title>Masuk — Ujian Online Madrasah</title>
</svelte:head>

<Toast />

<QrScannerModal
	show={showQrModal}
	on:close={() => (showQrModal = false)}
	on:scan={handleQrScan}
/>

<PinInputModal
	show={showPinModal}
	name={pinUserInfo.name}
	role={pinUserInfo.role}
	username={pinUserInfo.username}
	on:submit={handlePinSubmit}
	on:cancel={() => {
		showPinModal = false;
		isAuthenticatingQr = false;
	}}
/>

{#if isAuthenticatingQr}
	<div class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
		<div class="bg-white/10 border border-white/20 rounded-3xl p-8 max-w-sm w-full text-center text-white backdrop-blur-xl shadow-2xl animate-scale-up">
			<div class="w-16 h-16 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center mx-auto mb-4">
				<svg class="w-8 h-8 animate-spin text-cyan-300" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
				</svg>
			</div>
			<h3 class="text-lg font-bold mb-1">Masuk dengan QR</h3>
			<p class="text-xs text-white/80">{qrStatusMessage || 'Memproses...'}</p>
		</div>
	</div>
{/if}

<div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-950 via-primary-900 to-violet-900 relative overflow-hidden">
	<!-- Background decoration -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div class="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
		<div class="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl"></div>
	</div>

	<div class="w-full max-w-md relative z-10 animate-bounce-in">
		<!-- Card -->
		<div class="card-glass p-8 sm:p-10">
			<!-- Logo & Title -->
			<div class="text-center mb-8">
				<div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/30 mb-4">
					<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
				<h1 class="text-2xl font-bold text-slate-800">Ujian Online Madrasah</h1>
				<p class="text-sm text-slate-500 mt-1">Masuk ke akun Anda untuk melanjutkan</p>
			</div>

			<!-- Error message -->
			{#if form?.error}
				<div class="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium space-y-2.5">
					<div class="flex items-center gap-2">
						<svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
						<span>{form.error}</span>
					</div>
					{#if form.error.includes('Exambro')}
						<div class="pt-1">
							<a 
								href="/download-apk" 
								class="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
							>
								<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
								</svg>
								<span>Unduh Aplikasi Exambro (.apk)</span>
							</a>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Login Form -->
			<form
				method="POST"
				bind:this={formElement}
				use:enhance={() => {
					loading = true;
					return async ({ update, result }) => {
						loading = false;
						if (result.type !== 'redirect') {
							isAuthenticatingQr = false;
						}
						await update();
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="qr_token" bind:value={qrToken} />
				<input type="hidden" name="qr_username" bind:value={qrUsername} />
				<input type="hidden" name="qr_password" bind:value={qrPassword} />
				<input type="hidden" name="login_pin" bind:value={loginPin} />

				<div>
					<label for="username" class="label">Username</label>
					<div class="relative">
						<svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						<input
							id="username"
							name="username"
							type="text"
							required={!qrUsername && !qrToken}
							bind:value={username}
							class="input pl-10"
							placeholder="Masukkan username"
							autocomplete="username"
						/>
					</div>
				</div>

				<div>
					<label for="password" class="label">Kata Sandi</label>
					<PasswordInput
						id="password"
						name="password"
						required={!qrPassword && !qrToken}
						iconLeft={true}
						bind:value={password}
						placeholder="Masukkan kata sandi"
						autocomplete="current-password"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="btn-primary w-full justify-center py-3 text-base shadow-lg shadow-indigo-600/20"
				>
					{#if loading}
						<svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
						</svg>
						Memproses...
					{:else}
						Masuk
					{/if}
				</button>

				<!-- Divider -->
				<div class="relative flex items-center justify-center my-3">
					<div class="border-t border-slate-200 w-full"></div>
					<span class="bg-white/80 px-3 text-xs text-slate-400 font-medium uppercase tracking-wider absolute">atau</span>
				</div>

				<!-- QR Code Login Button -->
				<button
					type="button"
					on:click={() => (showQrModal = true)}
					disabled={loading}
					class="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border-2 border-indigo-200/80 hover:border-indigo-500 bg-indigo-50/60 hover:bg-indigo-50 text-indigo-700 font-semibold text-sm transition-all duration-200 hover:shadow-md hover:shadow-indigo-100 active:scale-[0.99] group"
				>
					<div class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
						</svg>
					</div>
					<span>Login dengan Kode QR</span>
				</button>
			</form>
		</div>

		<!-- Footer -->
		<div class="text-center space-y-2.5 mt-6 select-none">
			<p class="text-[11px] text-primary-200/50">
				© 2024 Ujian Online Madrasah. Seluruh hak dilindungi.
			</p>
			<div>
				<a
					href="https://wa.me/qr/FMVS3NLDIRUAA1"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 hover:border-emerald-400/50 text-xs transition-all duration-300 group shadow-sm"
					title="Hubungi Syamsul Bahri via WhatsApp"
				>
					<span class="text-[11px] text-white/70 group-hover:text-white/90 transition-colors">Dibuat oleh</span>
					<span class="relative flex h-1.5 w-1.5">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
					</span>
					<span class="font-extrabold text-white group-hover:text-emerald-300 transition-colors tracking-wide text-[11px]">
						SYAMSUL BAHRI
					</span>
					<span class="w-3.5 h-3.5 rounded-full bg-emerald-500 group-hover:bg-emerald-400 flex items-center justify-center text-white transition-transform group-hover:scale-110">
						<svg class="w-2 h-2 fill-current" viewBox="0 0 24 24">
							<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
						</svg>
					</span>
				</a>
			</div>
		</div>
	</div>
</div>

