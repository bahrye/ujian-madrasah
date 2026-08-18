<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ROLE_LABELS } from '$lib/utils/constants';
	import { generateStudentQrData, getQrCodeImageUrl } from '$lib/utils/qrLogin';

	export let show = false;
	export let user: { id?: number | string; name?: string; username?: string; role?: string; photo?: string | null } | null = null;
	export let schoolName: string = '';

	const dispatch = createEventDispatcher<{ close: void }>();

	let customPassword = '';
	let includePassword = false;

	$: qrPayload = generateStudentQrData(
		user?.username || '',
		includePassword && customPassword ? customPassword : ''
	);

	$: qrImageUrl = getQrCodeImageUrl(qrPayload, 250);

	function close() {
		show = false;
		customPassword = '';
		includePassword = false;
		dispatch('close');
	}

	function printQrBadge() {
		if (!user) return;
		const name = user.name || '';
		const role = ROLE_LABELS[user.role || ''] || user.role || 'Petugas';
		const u = user.username || '';
		const sn = schoolName || 'Ujian Online Madrasah';
		const qrUrl = getQrCodeImageUrl(qrPayload, 300);

		const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>QR Akses Login - ${name}</title>
<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
	* { box-sizing: border-box; margin: 0; padding: 0; }
	body { font-family: 'Inter', sans-serif; background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
	.badge { width: 85mm; border: 2px solid #1e293b; border-radius: 16px; overflow: hidden; text-align: center; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
	.header { background: #0f172a; color: #fff; padding: 16px; }
	.school { font-size: 11px; font-weight: 700; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.05em; }
	.title { font-size: 15px; font-weight: 800; margin-top: 2px; }
	.role { display: inline-block; font-size: 10px; font-weight: 700; background: #38bdf8; color: #0f172a; padding: 2px 10px; border-radius: 20px; text-transform: uppercase; margin-top: 6px; }
	.body { padding: 20px; }
	.qr-img { width: 140px; height: 140px; margin: 0 auto; display: block; border-radius: 12px; border: 1px solid #e2e8f0; padding: 6px; }
	.name { font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 14px; }
	.user { font-size: 11px; font-family: monospace; font-weight: 700; color: #64748b; margin-top: 2px; }
	.note { font-size: 9px; color: #94a3b8; margin-top: 14px; padding-top: 12px; border-top: 1px dashed #e2e8f0; }
	@media print {
		body { padding: 0; }
		.badge { box-shadow: none; border: 1.5px solid #000; }
	}
</style>
</head>
<body>
<div class="badge">
	<div class="header">
		<div class="school">${sn}</div>
		<div class="title">QR AKSES LOGIN</div>
		<div class="role">${role}</div>
	</div>
	<div class="body">
		<img src="${qrUrl}" alt="QR" class="qr-img" />
		<div class="name">${name}</div>
		<div class="user">Username: ${u}</div>
		<div class="note">Arahkan QR ke kamera komputer ujian untuk login otomatis</div>
	</div>
</div>
<script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

		const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		window.open(url, '_blank');
		setTimeout(() => URL.revokeObjectURL(url), 10000);
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

{#if show && user}
	<div use:portal class="fixed inset-0 z-[100] flex items-center justify-center p-4">
		<!-- Backdrop -->
		<div
			class="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
			on:click={close}
			role="button"
			tabindex="-1"
			aria-label="Tutup"
		></div>

		<!-- Dialog Card -->
		<div class="bg-white text-slate-800 w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col animate-bounce-in">
			<!-- Header -->
			<div class="p-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center relative overflow-hidden">
				<div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
				<button
					class="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
					on:click={close}
					aria-label="Tutup"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				<div class="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 mx-auto flex items-center justify-center mb-2 shadow-inner">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
					</svg>
				</div>
				<h3 class="text-base font-bold">QR Akses Login Saya</h3>
				<span class="inline-block px-2.5 py-0.5 mt-1 bg-white/20 text-white rounded-full text-[11px] font-semibold uppercase tracking-wider">
					{ROLE_LABELS[user.role || ''] || user.role}
				</span>
			</div>

			<!-- Body -->
			<div class="p-6 flex flex-col items-center text-center space-y-4">
				<!-- QR Code Container -->
				<div class="p-3 bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl shadow-inner relative group">
					<img src={qrImageUrl} alt="QR Code Login" class="w-48 h-48 rounded-xl object-contain bg-white" />
				</div>

				<div class="w-full">
					<p class="font-bold text-base text-slate-800 leading-tight">{user.name}</p>
					<p class="text-xs font-mono font-semibold text-slate-500 mt-1">Username: {user.username}</p>
				</div>

				<!-- Optional: Include direct password in QR for quick 1-click login -->
				<div class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-left text-xs">
					<label class="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
						<input type="checkbox" bind:checked={includePassword} class="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
						<span>Sertakan kata sandi di QR (Login Langsung)</span>
					</label>

					{#if includePassword}
						<div class="mt-2.5 space-y-1 animate-in fade-in duration-150">
							<input
								type="password"
								bind:value={customPassword}
								placeholder="Masukkan kata sandi akun Anda"
								class="input text-xs py-1.5 px-3 bg-white"
							/>
							<p class="text-[10px] text-slate-400">QR akan langsung login tanpa perlu mengetik kata sandi lagi.</p>
						</div>
					{/if}
				</div>

				<p class="text-[11px] text-slate-500 leading-snug">
					Tunjukkan QR ini ke kamera komputer madrasah di halaman login untuk masuk secara otomatis.
				</p>
			</div>

			<!-- Footer -->
			<div class="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
				<button
					type="button"
					class="btn btn-secondary flex-1 text-xs py-2"
					on:click={close}
				>
					Tutup
				</button>
				<button
					type="button"
					class="btn btn-primary flex-1 text-xs py-2 gap-1.5 shadow-md shadow-indigo-500/20"
					on:click={printQrBadge}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
					</svg>
					Cetak / Unduh Badge
				</button>
			</div>
		</div>
	</div>
{/if}
