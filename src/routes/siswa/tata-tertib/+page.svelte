<script lang="ts">
	import { ICONS } from '$lib/utils/constants';
	
	let activeBadge = 0;
	function highlightBadge(no: number) {
		activeBadge = no;
		const el = document.getElementById(`badge-desc-${no}`);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}
</script>

<svelte:head>
	<title>Tata Tertib Ujian — Ujian Online Madrasah</title>
</svelte:head>

<div class="space-y-8 animate-in pb-10">
	<!-- Header Section with background image -->
	<div class="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl">
		<div class="absolute inset-0">
			<img 
				src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
				alt="Exam Preparation" 
				class="w-full h-full object-cover opacity-30"
			/>
			<div class="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-transparent"></div>
		</div>
		<div class="relative p-8 md:p-12 z-10">
			<span class="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 text-sm font-medium border border-indigo-400/30 mb-4 backdrop-blur-sm">
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
				Penting untuk dibaca
			</span>
			<h1 class="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Tata Tertib & Panduan Ujian</h1>
			<p class="text-indigo-100 max-w-2xl text-lg opacity-90 leading-relaxed">
				Harap membaca seluruh tata tertib dan panduan pengerjaan dengan saksama sebelum Anda memulai ujian untuk memastikan kelancaran proses evaluasi.
			</p>
		</div>
	</div>

	<!-- Two Column Layout: Rules & Allowed Items -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Left Col: Exam Rules -->
		<div class="lg:col-span-2 space-y-6">
			<div class="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
				<div class="absolute top-0 right-0 p-8 opacity-5">
					<svg class="w-48 h-48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
				</div>
				
				<div class="flex items-center gap-4 mb-6 relative z-10">
					<div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
					</div>
					<h2 class="text-2xl font-bold text-slate-800">Tata Tertib Peserta Ujian</h2>
				</div>
				
				<ul class="space-y-4 relative z-10">
					{#each [
						'Peserta wajib login paling lambat 15 menit sebelum ujian dimulai.',
						'Peserta dilarang keras membuka tab baru, browser lain, atau aplikasi lain selama ujian berlangsung (sistem mendeteksi perpindahan tab).',
						'Menjaga ketenangan dan tidak berkomunikasi dengan peserta lain selama ujian.',
						'Dilarang melakukan kecurangan dalam bentuk apapun. Akun yang terdeteksi melakukan kecurangan akan diblokir.',
						'Bagi peserta yang terlambat login, waktu pengerjaan tidak akan ditambah.',
						'Klik tombol "Selesai" jika sudah yakin dengan semua jawaban sebelum waktu habis.'
					] as rule, i}
					<li class="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
						<span class="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold mt-0.5">{i+1}</span>
						<span class="text-slate-700 leading-relaxed">{rule}</span>
					</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Right Col: Allowed Items -->
		<div class="space-y-6">
			<div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-lg overflow-hidden relative">
				<!-- Decorative circles -->
				<div class="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
				<div class="absolute bottom-0 left-0 w-24 h-24 bg-purple-900/20 rounded-full blur-xl"></div>
				
				<div class="relative z-10">
					<div class="flex items-center gap-3 mb-6">
						<div class="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
						</div>
						<h3 class="text-xl font-bold">Barang yang Dibawa</h3>
					</div>
					
					<p class="text-indigo-100 text-sm mb-5 leading-relaxed">
						Hanya perlengkapan berikut yang boleh dibawa masuk / berada di meja ujian Anda:
					</p>
					
					<div class="space-y-3">
						{#each [
							{ name: 'Kartu Peserta', desc: '(Identitas Resmi)', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h3' },
							{ name: 'Alat Tulis Dasar', desc: '(Pensil, Pena, Penghapus)', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
							{ name: 'Air Minum', desc: '(Botol transparan)', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
							{ name: 'Kertas Buram', desc: '(Disediakan pengawas)', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
						] as item}
						<div class="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 flex items-center gap-3">
							<div class="bg-white/20 p-2 rounded-lg text-white">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon}></path>
								</svg>
							</div>
							<div>
								<div class="font-semibold text-sm">{item.name}</div>
								{#if item.desc}
									<div class="text-xs text-indigo-200">{item.desc}</div>
								{/if}
							</div>
						</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Workflow Section -->
	<div class="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
		<div class="text-center max-w-2xl mx-auto mb-12 relative z-10">
			<span class="text-indigo-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Prosedur Ujian</span>
			<h2 class="text-3xl font-bold text-slate-800 mb-4">Alur Pengerjaan Ujian</h2>
			<p class="text-slate-500">
				Ikuti langkah-langkah berikut untuk memastikan kelancaran dalam mengerjakan ujian secara online di sistem ini.
			</p>
		</div>

		<div class="relative z-10">
			<!-- Connect line for desktop -->
			<div class="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-0.5 bg-slate-100 z-0"></div>

			<div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
				{#each [
					{
						title: 'Persiapan',
						desc: 'Login ke akun, pastikan koneksi internet stabil.',
						icon: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
						color: 'text-sky-500',
						bg: 'bg-sky-50'
					},
					{
						title: 'Masuk Jadwal',
						desc: 'Pilih menu Jadwal Ujian, klik Buka Halaman Ujian.',
						icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
						color: 'text-indigo-500',
						bg: 'bg-indigo-50'
					},
					{
						title: 'Mengerjakan',
						desc: 'Masukkan token dari pengawas, lalu kerjakan soal.',
						icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
						color: 'text-purple-500',
						bg: 'bg-purple-50'
					},
					{
						title: 'Selesai',
						desc: 'Pastikan semua terjawab, klik Selesai Ujian.',
						icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
						color: 'text-emerald-500',
						bg: 'bg-emerald-50'
					}
				] as step, i}
				<div class="relative flex flex-col items-center text-center group bg-white pt-2">
					<div class="w-20 h-20 rounded-2xl {step.bg} {step.color} flex items-center justify-center mb-5 shadow-sm border border-white ring-4 ring-slate-50 group-hover:scale-110 transition-transform duration-300 relative z-10">
						<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
							<path stroke-linecap="round" stroke-linejoin="round" d={step.icon}></path>
						</svg>
						<div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold shadow-lg">
							{i+1}
						</div>
					</div>
					<h3 class="font-bold text-slate-800 text-lg mb-2">{step.title}</h3>
					<p class="text-sm text-slate-500 px-4 leading-relaxed">{step.desc}</p>
				</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Panduan Antarmuka Ujian -->
	<div class="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
		<div class="text-center max-w-2xl mx-auto mb-12 relative z-10">
			<span class="text-indigo-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Panduan Antarmuka</span>
			<h2 class="text-3xl font-bold text-slate-800 mb-4">Mengenal Halaman Ujian</h2>
			<p class="text-slate-500">
				Berikut adalah penjelasan mengenai fungsi-fungsi tombol dan informasi yang ada pada halaman pengerjaan ujian.
			</p>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
			<!-- Image with Badges -->
			<div class="relative mx-auto w-full max-w-sm rounded-2xl overflow-hidden border-4 border-slate-100 shadow-xl bg-slate-50">
				<!-- Gambar UI Ujian -->
				<img src="/panduan-ui-ujian.jpeg" alt="Antarmuka Ujian" class="w-full h-auto block object-cover" />
				
				<!-- Badges Overlay (Diperkecil & digeser ke tepi agar tidak menutupi gambar) -->
				<button type="button" on:click={() => highlightBadge(1)} class="absolute w-5 h-5 md:w-6 md:h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md hover:scale-125 transition-all {activeBadge === 1 ? 'bg-rose-500 scale-125 z-10 animate-bounce' : 'bg-indigo-600/95 cursor-pointer'}" style="top: 3%; left: 3%;">1</button>
				<button type="button" on:click={() => highlightBadge(2)} class="absolute w-5 h-5 md:w-6 md:h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md hover:scale-125 transition-all {activeBadge === 2 ? 'bg-rose-500 scale-125 z-10 animate-bounce' : 'bg-indigo-600/95 cursor-pointer'}" style="top: 3%; left: 52%;">2</button>
				<button type="button" on:click={() => highlightBadge(3)} class="absolute w-5 h-5 md:w-6 md:h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md hover:scale-125 transition-all {activeBadge === 3 ? 'bg-rose-500 scale-125 z-10 animate-bounce' : 'bg-indigo-600/95 cursor-pointer'}" style="top: 3%; left: 90%;">3</button>
				<button type="button" on:click={() => highlightBadge(4)} class="absolute w-5 h-5 md:w-6 md:h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md hover:scale-125 transition-all {activeBadge === 4 ? 'bg-rose-500 scale-125 z-10 animate-bounce' : 'bg-indigo-600/95 cursor-pointer'}" style="top: 15%; left: 90%;">4</button>
				<button type="button" on:click={() => highlightBadge(5)} class="absolute w-5 h-5 md:w-6 md:h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md hover:scale-125 transition-all {activeBadge === 5 ? 'bg-rose-500 scale-125 z-10 animate-bounce' : 'bg-indigo-600/95 cursor-pointer'}" style="top: 30%; left: 3%;">5</button>
				<button type="button" on:click={() => highlightBadge(6)} class="absolute w-5 h-5 md:w-6 md:h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md hover:scale-125 transition-all {activeBadge === 6 ? 'bg-rose-500 scale-125 z-10 animate-bounce' : 'bg-indigo-600/95 cursor-pointer'}" style="top: 55%; left: 3%;">6</button>
				<button type="button" on:click={() => highlightBadge(7)} class="absolute w-5 h-5 md:w-6 md:h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md hover:scale-125 transition-all {activeBadge === 7 ? 'bg-rose-500 scale-125 z-10 animate-bounce' : 'bg-indigo-600/95 cursor-pointer'}" style="top: 85%; left: 3%;">7</button>
				<button type="button" on:click={() => highlightBadge(8)} class="absolute w-5 h-5 md:w-6 md:h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md hover:scale-125 transition-all {activeBadge === 8 ? 'bg-rose-500 scale-125 z-10 animate-bounce' : 'bg-indigo-600/95 cursor-pointer'}" style="top: 85%; left: 40%;">8</button>
				<button type="button" on:click={() => highlightBadge(9)} class="absolute w-5 h-5 md:w-6 md:h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md hover:scale-125 transition-all {activeBadge === 9 ? 'bg-rose-500 scale-125 z-10 animate-bounce' : 'bg-indigo-600/95 cursor-pointer'}" style="top: 85%; left: 88%;">9</button>
				<button type="button" on:click={() => highlightBadge(10)} class="absolute w-5 h-5 md:w-6 md:h-6 rounded-full ring-2 ring-white text-white flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md hover:scale-125 transition-all {activeBadge === 10 ? 'bg-rose-500 scale-125 z-10 animate-bounce' : 'bg-indigo-600/95 cursor-pointer'}" style="top: 96%; left: 88%;">10</button>
			</div>

			<!-- Explanations -->
			<div class="space-y-2">
				{#each [
					{ no: 1, title: 'Judul Ujian', desc: 'Menampilkan nama mata pelajaran ujian yang sedang dikerjakan.' },
					{ no: 2, title: 'Indikator Pelanggaran', desc: 'Menampilkan jumlah peringatan jika Anda terdeteksi keluar dari layar penuh/membuka aplikasi lain.' },
					{ no: 3, title: 'Sisa Waktu', desc: 'Menunjukkan batas waktu pengerjaan. Ujian otomatis berakhir jika waktu habis.' },
					{ no: 4, title: 'Tombol Ragu-ragu', desc: 'Tandai soal dengan ini jika Anda belum yakin dengan jawaban yang dipilih.' },
					{ no: 5, title: 'Teks Soal', desc: 'Area utama yang menampilkan pertanyaan ujian yang harus dijawab.' },
					{ no: 6, title: 'Pilihan Jawaban', desc: 'Pilih jawaban yang paling tepat. Jawaban akan langsung tersimpan ke sistem.' },
					{ no: 7, title: 'Navigasi Soal', desc: 'Membuka panel berisi daftar seluruh nomor soal untuk memudahkan berpindah nomor.' },
					{ no: 8, title: 'Tombol Muat Ulang', desc: 'Gunakan tombol ini untuk memuat ulang halaman tanpa keluar dari ujian jika terjadi kendala/error jaringan.' },
					{ no: 9, title: 'Informasi Progres', desc: 'Melihat ringkasan berapa soal yang sudah dijawab dan yang masih kosong.' },
					{ no: 10, title: 'Tombol Navigasi (Sebelumnya/Selanjutnya)', desc: 'Digunakan untuk beralih ke soal sebelum atau soal sesudahnya.' }
				] as item}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div 
						id="badge-desc-{item.no}" 
						on:click={() => activeBadge = item.no}
						class="flex items-start gap-4 p-3 rounded-xl transition-all border cursor-pointer {activeBadge === item.no ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-200' : 'hover:bg-slate-50 border-transparent hover:border-slate-100'}"
					>
						<div class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors {activeBadge === item.no ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}">
							{item.no}
						</div>
						<div>
							<h4 class="font-bold text-slate-800 text-sm transition-colors {activeBadge === item.no ? 'text-indigo-700' : ''}">{item.title}</h4>
							<p class="text-slate-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Bottom Image Banner -->
	<div class="rounded-3xl overflow-hidden shadow-md relative h-48 md:h-64 mt-8 group">
		<img 
			src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
			alt="Sukses Ujian" 
			class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col items-center justify-end pb-8 text-center px-4">
			<h3 class="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-md">Semoga Berhasil!</h3>
			<p class="text-slate-200 md:text-lg drop-shadow">Kejujuran adalah kunci kesuksesan yang sesungguhnya.</p>
		</div>
	</div>
</div>
