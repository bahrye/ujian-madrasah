export const ROLES = {
	SUPERADMIN: 'superadmin',
	ADMIN: 'admin',
	GURU: 'guru',
	PENGAWAS: 'pengawas',
	SISWA: 'siswa'
} as const;

export const ROLE_LABELS: Record<string, string> = {
	superadmin: 'Super Administrator',
	admin: 'Administrator Sekolah',
	guru: 'Guru',
	pengawas: 'Pengawas',
	siswa: 'Siswa'
};

export const ROLE_COLORS: Record<string, string> = {
	superadmin: 'badge-secondary',
	admin: 'badge-danger',
	guru: 'badge-primary',
	pengawas: 'badge-warning',
	siswa: 'badge-info'
};

export const QUESTION_TYPES = {
	PILIHAN_GANDA: 'pilihan_ganda',
	PILIHAN_GANDA_KOMPLEKS: 'pilihan_ganda_kompleks',
	ISIAN_SINGKAT: 'isian_singkat',
	ESSAY: 'essay',
	BENAR_SALAH: 'benar_salah',
	MENJODOHKAN: 'menjodohkan'
} as const;

export const QUESTION_TYPE_LABELS: Record<string, string> = {
	pilihan_ganda: 'Pilihan Ganda',
	pilihan_ganda_kompleks: 'Pilihan Ganda Kompleks',
	isian_singkat: 'Isian Singkat',
	essay: 'Essay / Uraian',
	benar_salah: 'Benar / Salah',
	menjodohkan: 'Menjodohkan'
};

export const ATTEMPT_STATUS_LABELS: Record<string, string> = {
	mengerjakan: 'Sedang Mengerjakan',
	selesai: 'Selesai',
	waktu_habis: 'Waktu Habis',
	belum_mengerjakan: 'Belum Mengerjakan'
};

export const ATTEMPT_STATUS_COLORS: Record<string, string> = {
	mengerjakan: 'badge-warning',
	selesai: 'badge-success',
	waktu_habis: 'badge-danger',
	belum_mengerjakan: 'badge-secondary'
};

export type MenuItem = {
	label: string;
	href?: string;
	icon: string;
	subItems?: { label: string; href: string }[];
};

export const SIDEBAR_MENUS: Record<string, MenuItem[]> = {
	superadmin: [
		{ label: 'Dashboard', href: '/superadmin', icon: 'dashboard' },
		{ label: 'Daftar Sekolah', href: '/superadmin/schools', icon: 'school' },
		{ label: 'Admin Sekolah', href: '/superadmin/admins', icon: 'users' },
		{ label: 'Akun Superadmin', href: '/superadmin/accounts', icon: 'profile' }
	],
	admin: [
		{ label: 'Dashboard', href: '/admin', icon: 'dashboard' },
		{ label: 'Profil Sekolah', href: '/admin/school-profile', icon: 'profile' },
		{ label: 'Pengguna', href: '/admin/users', icon: 'users' },
		{ label: 'Siswa', href: '/admin/students', icon: 'users' },
		{ label: 'Kelas', href: '/admin/classes', icon: 'school' },
		{ label: 'Mata Pelajaran', href: '/admin/subjects', icon: 'exam' },
		{ label: 'Bank Soal', href: '/admin/bank-soal', icon: 'questions' },
		{ label: 'Bank Media', href: '/admin/media-bank', icon: 'folder' },
		{ 
			label: 'Ujian', 
			icon: 'exam',
			subItems: [
				{ label: 'Daftar Ujian', href: '/admin/exams' },
				{ label: 'Token Ujian', href: '/admin/tokens' },
				{ label: 'Monitoring', href: '/admin/monitor' }
			]
		},
		{ label: 'Hasil Ujian', href: '/admin/results', icon: 'results' },
		{ label: 'Papan Peringkat', href: '/admin/papan-peringkat', icon: 'results' }
	],
	guru: [
		{ label: 'Dashboard', href: '/guru', icon: 'dashboard' },
		{ label: 'Ujian Remedial', href: '/guru/remedial', icon: 'exam' },
		{ label: 'Bank Soal', href: '/guru/bank-soal', icon: 'questions' },
		{ label: 'Bank Media', href: '/guru/media-bank', icon: 'folder' },
		{ label: 'Penilaian', href: '/guru/penilaian', icon: 'grading' },
		{ label: 'Hasil Ujian', href: '/guru/results', icon: 'results' },
		{ label: 'Papan Peringkat', href: '/guru/papan-peringkat', icon: 'results' }
	],
	pengawas: [
		{ label: 'Dashboard', href: '/pengawas', icon: 'dashboard' },
		{ label: 'Tata Tertib Pengawas', href: '/pengawas/tata-tertib', icon: 'rules' },
		{ 
			label: 'Jadwal Mengawas', 
			icon: 'calendar',
			subItems: [
				{ label: 'Jadwal Saya', href: '/pengawas/jadwal/saya' },
				{ label: 'Jadwal Semua', href: '/pengawas/jadwal/semua' }
			]
		},
		{ label: 'Token Ujian', href: '/pengawas/tokens', icon: 'token' },
		{ label: 'Monitoring', href: '/pengawas/monitor', icon: 'monitor' }
	],
	siswa: [
		{ label: 'Dashboard', href: '/siswa', icon: 'dashboard' },
		{ label: 'Tata Tertib Ujian', href: '/siswa/tata-tertib', icon: 'rules' },
		{ label: 'Jadwal Ujian', href: '/siswa/jadwal', icon: 'calendar' },
		{ label: 'Papan Peringkat', href: '/siswa/papan-peringkat', icon: 'results' }
	]
};

/** SVG path data for menu icons */
export const ICONS: Record<string, string> = {
	dashboard:
		'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1',
	users:
		'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
	school:
		'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
	exam: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
	results:
		'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
	questions:
		'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
	grading:
		'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
	token:
		'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
	monitor:
		'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
	logout:
		'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
	menu: 'M4 6h16M4 12h16M4 18h16',
	close: 'M6 18L18 6M6 6l12 12',
	plus: 'M12 4v16m8-8H4',
	edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
	trash: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
	search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
	chevronDown: 'M19 9l-7 7-7-7',
	chevronLeft: 'M15 19l-7-7 7-7',
	chevronRight: 'M9 5l7 7-7 7',
	clock: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
	check: 'M5 13l4 4L19 7',
	warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
	refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
	calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
	folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
	profile: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
	rules: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
};
