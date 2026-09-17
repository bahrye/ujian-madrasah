<script lang="ts">
	export let data: any;

	const schoolName = data?.schoolName || 'Madrasah';
	const studentName = data?.user?.name || 'Siswa';
</script>

<svelte:head>
	<title>Wajib Menggunakan Aplikasi Exambro — Ujian Online Madrasah</title>
</svelte:head>

<div class="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 select-none font-sans">
	<div class="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
		<!-- Header Banner -->
		<div class="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 sm:p-8 text-white text-center relative overflow-hidden">
			<div class="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
			<div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto flex items-center justify-center mb-4 ring-8 ring-white/10 shadow-inner">
				<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
				</svg>
			</div>
			<h1 class="text-xl sm:text-2xl font-black tracking-tight">Wajib Aplikasi Exambro</h1>
			<p class="text-xs sm:text-sm text-emerald-100 mt-1.5 font-medium">{schoolName}</p>
		</div>

		<!-- Content -->
		<div class="p-6 sm:p-8 space-y-6">
			<!-- Alert Box -->
			<div class="bg-amber-50 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
				<div class="p-1 rounded-full bg-amber-100 text-amber-700 shrink-0 mt-0.5">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				</div>
				<div class="text-xs text-amber-900 leading-relaxed">
					Halo <strong>{studentName}</strong>, madrasah mewajibkan seluruh siswa untuk login dan mengerjakan ujian menggunakan aplikasi resmi <strong>Exambro Madrasah</strong> di perangkat Android. Akses melalui web browser biasa saat ini dibatasi.
				</div>
			</div>

			<!-- Petunjuk Langkah -->
			<div class="space-y-3">
				<h2 class="text-xs font-bold uppercase tracking-wider text-slate-500">Langkah Membuka Ujian</h2>
				<div class="space-y-2.5 text-xs text-slate-600">
					<div class="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
						<span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
						<span>Jika sudah terpasang di HP Android, silakan buka aplikasi <strong>Exambro Madrasah</strong>.</span>
					</div>
					<div class="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
						<span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
						<span>Pada menu utama aplikasi, pilih tombol <strong>Masuk Ujian</strong>.</span>
					</div>
					<div class="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
						<span class="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
						<span>Login dengan akun Anda dan kerjakan ujian dengan tertib.</span>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="space-y-3 pt-2">
				<a 
					href="https://wa.me/qr/FMVS3NLDIRUAA1" 
					target="_blank" 
					rel="noreferrer"
					class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-[0.99]"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
					</svg>
					<span>Bantuan & Unduh APK Exambro</span>
				</a>

				<form method="POST" action="/logout" class="w-full">
					<button 
						type="submit" 
						class="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
					>
						Keluar dari Akun (Logout)
					</button>
				</form>
			</div>
		</div>

		<!-- Footer -->
		<div class="bg-slate-50 border-t border-slate-100 py-3 px-6 text-center text-[11px] text-slate-400">
			Exambro Madrasah &bull; Sistem Ujian Online Terpadu
		</div>
	</div>
</div>
