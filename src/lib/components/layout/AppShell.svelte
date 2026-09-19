<script lang="ts">
	import { page } from '$app/stores';
	import Sidebar from './Sidebar.svelte';
	import Navbar from './Navbar.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import type { MenuItem } from '$lib/utils/constants';

	export let user: App.Locals['user'];
	export let userInfo: any = null;
	export let menuItems: MenuItem[] = [];

	let sidebarOpen = false;

	$: currentPath = $page.url.pathname;
	$: role = user?.role === 'panitia' ? 'admin' : (user?.role || 'siswa');
	$: homeUrl = `/${role}`;

	interface BreadcrumbItem {
		label: string;
		href?: string;
	}

	const KNOWN_LABELS: Record<string, string> = {
		// Siswa
		'simulasi': 'Simulasi CBT',
		'tata-tertib': 'Tata Tertib Ujian',
		'jadwal': 'Jadwal Ujian',
		'hasil-ujian': 'Hasil Ujian',
		'papan-peringkat': 'Papan Peringkat',

		// Admin, Guru, Pengawas, Superadmin
		'schools': 'Lembaga Madrasah',
		'school-profile': 'Profil Lembaga',
		'users': 'Pengguna',
		'students': 'Data Siswa',
		'teachers': 'Data Guru',
		'proctors': 'Data Pengawas',
		'classes': 'Data Kelas',
		'sessions': 'Sesi Ujian',
		'exam-types': 'Jenis Ujian',
		'rooms': 'Ruang Ujian',
		'subjects': 'Mata Pelajaran',
		'bank-soal': 'Bank Soal',
		'media-bank': 'Bank Media',
		'exams': 'Daftar Ujian',
		'tokens': 'Token Ujian',
		'monitor': 'Monitoring Ujian',
		'reset-login': 'Reset Login Siswa',
		'results': 'Hasil Ujian',
		'laporan-analisis': 'Laporan & Analisis',
		'apk-settings': 'Pengaturan APK',
		'activity-logs': 'Log Aktivitas',
		'remedial': 'Ujian Remedial',
		'penilaian': 'Penilaian',
		'saya': 'Jadwal Saya',
		'semua': 'Jadwal Semua',
		'preview': 'Pratinjau Soal',
		'analisis': 'Analisis Soal',
		'jawaban-siswa': 'Jawaban Siswa'
	};

	function formatSegment(seg: string): string {
		return seg
			.split('-')
			.map(w => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');
	}

	function dedupeCrumbs(crumbs: BreadcrumbItem[]): BreadcrumbItem[] {
		return crumbs.filter((c, idx) => idx === 0 || c.label !== crumbs[idx - 1].label);
	}

	function parsePathRest(baseHref: string, rest: string): BreadcrumbItem[] {
		const rawParts = rest.split('/').filter(Boolean);
		const items: { label: string; href: string }[] = [];
		let currentUrl = baseHref;

		let i = 0;
		while (i < rawParts.length) {
			const p = rawParts[i];

			// Handle structural keywords paired with an ID (e.g. /type/1 or /class/2)
			if ((p === 'type' || p === 'class') && i + 1 < rawParts.length) {
				const nextPart = rawParts[i + 1];
				currentUrl += `/${p}/${nextPart}`;
				const label = p === 'type' ? 'Tipe Ujian' : 'Kelas';
				items.push({ label, href: currentUrl });
				i += 2;
				continue;
			}

			// If bare 'type' or 'class' without following ID, skip completely
			if (p === 'type' || p === 'class') {
				i++;
				continue;
			}

			currentUrl += `/${p}`;
			let label = KNOWN_LABELS[p];
			if (!label) {
				if (!isNaN(Number(p))) {
					label = baseHref.includes('bank-soal') ? 'Detail Soal' : (baseHref.includes('exams') ? 'Detail Ujian' : 'Detail');
				} else {
					label = formatSegment(p);
				}
			}
			items.push({ label, href: currentUrl });
			i++;
		}

		return items.map((item, idx) => ({
			label: item.label,
			href: idx === items.length - 1 ? undefined : item.href
		}));
	}

	function buildBreadcrumbs(path: string, items: MenuItem[], baseHome: string): BreadcrumbItem[] {
		const cleanPath = path.replace(/\/+$/, '') || '/';
		if (cleanPath === baseHome || cleanPath === '' || cleanPath === '/') {
			return [{ label: 'Beranda' }];
		}

		const crumbs: BreadcrumbItem[] = [{ label: 'Beranda', href: baseHome }];

		// 1. Exact match in subItems (e.g. /admin/students -> Data Master / Data Siswa)
		for (const item of items) {
			if (item.subItems) {
				for (const sub of item.subItems) {
					if (sub.href && sub.href.replace(/\/+$/, '') === cleanPath) {
						crumbs.push({ label: item.label });
						const lastLabel = KNOWN_LABELS[cleanPath.split('/').pop() || ''] || sub.label;
						crumbs.push({ label: lastLabel });
						return crumbs;
					}
				}
			}
		}

		// 2. Exact match in direct items (e.g. /siswa/simulasi -> Simulasi CBT)
		for (const item of items) {
			if (item.href && item.href.replace(/\/+$/, '') === cleanPath) {
				const lastLabel = KNOWN_LABELS[cleanPath.split('/').pop() || ''] || item.label;
				crumbs.push({ label: lastLabel });
				return crumbs;
			}
		}

		// 3. Prefix match in subItems (e.g. /admin/exams/12/jawaban-siswa or /admin/exams/type/1)
		for (const item of items) {
			if (item.subItems) {
				for (const sub of item.subItems) {
					if (sub.href && cleanPath.startsWith(sub.href + '/')) {
						crumbs.push({ label: item.label });
						crumbs.push({ label: sub.label, href: sub.href });
						const rest = cleanPath.slice(sub.href.length).replace(/^\/+/, '');
						if (rest) {
							crumbs.push(...parsePathRest(sub.href, rest));
						}
						return dedupeCrumbs(crumbs);
					}
				}
			}
		}

		// 4. Prefix match in direct items (e.g. /guru/bank-soal/12/preview or /admin/papan-peringkat/type/1)
		for (const item of items) {
			if (item.href && item.href !== baseHome && cleanPath.startsWith(item.href + '/')) {
				crumbs.push({ label: item.label, href: item.href });
				const rest = cleanPath.slice(item.href.length).replace(/^\/+/, '');
				if (rest) {
					crumbs.push(...parsePathRest(item.href, rest));
				}
				return dedupeCrumbs(crumbs);
			}
		}

		// 5. Fallback path parsing
		const relativePath = cleanPath.startsWith(baseHome) ? cleanPath.slice(baseHome.length) : cleanPath;
		crumbs.push(...parsePathRest(baseHome, relativePath));
		return dedupeCrumbs(crumbs);
	}

	$: breadcrumbs = buildBreadcrumbs(currentPath, menuItems, homeUrl);
	$: isExamPage = currentPath.startsWith('/siswa/ujian');
</script>

<div class="min-h-screen bg-slate-50 flex flex-col">
	<Sidebar {menuItems} {user} bind:isOpen={sidebarOpen} />
	<Navbar {user} {userInfo} on:toggle={() => (sidebarOpen = !sidebarOpen)} />

	<main class="lg:ml-64 min-h-screen flex flex-col justify-between">
		<div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
			<!-- Breadcrumb Navigation for Fast Return to Home -->
			{#if breadcrumbs && breadcrumbs.length > 1}
				<nav class="mb-4 sm:mb-6 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-500 flex-wrap select-none" aria-label="Breadcrumb">
					{#each breadcrumbs as crumb, idx}
						{#if idx > 0}
							<span class="text-slate-400 font-normal">/</span>
						{/if}
						{#if idx === breadcrumbs.length - 1}
							<span class="text-indigo-600 font-bold tracking-tight">{crumb.label}</span>
						{:else if crumb.href}
							<a href={crumb.href} class="hover:text-indigo-600 transition-colors flex items-center gap-1 group">
								{#if idx === 0}
									<svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
									</svg>
								{/if}
								<span>{crumb.label}</span>
							</a>
						{:else}
							<span>{crumb.label}</span>
						{/if}
					{/each}
				</nav>
			{/if}

			<slot />
		</div>

		{#if !isExamPage}
			<footer class="mt-auto py-3.5 px-4 border-t border-slate-200/70 text-center text-xs text-slate-400 select-none">
				Dibuat oleh <a href="https://wa.me/qr/FMVS3NLDIRUAA1" target="_blank" rel="noopener noreferrer" class="font-semibold text-slate-600 hover:text-indigo-600 transition-colors hover:underline">SYAMSUL BAHRI</a>
			</footer>
		{/if}
	</main>

	<Toast />
</div>
