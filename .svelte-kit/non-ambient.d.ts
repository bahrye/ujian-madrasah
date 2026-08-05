
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/admin/bank-soal" | "/admin/bank-soal/[examId]" | "/admin/bank-soal/[examId]/preview" | "/admin/classes" | "/admin/exams" | "/admin/exams/type" | "/admin/exams/type/[typeId]" | "/admin/exams/[id]" | "/admin/media-bank" | "/admin/papan-peringkat" | "/admin/papan-peringkat/type" | "/admin/papan-peringkat/type/[typeId]" | "/admin/papan-peringkat/[examId]" | "/admin/results" | "/admin/results/[attemptId]" | "/admin/school-profile" | "/admin/students" | "/admin/subjects" | "/admin/users" | "/api" | "/api/delete-media" | "/api/exams" | "/api/exams/[id]" | "/api/exams/[id]/questions" | "/api/export-results" | "/api/export-results/[examId]" | "/api/logout" | "/api/media" | "/api/profile" | "/api/proxy-media" | "/api/setup" | "/api/track-media" | "/guru" | "/guru/bank-soal" | "/guru/bank-soal/[examId]" | "/guru/bank-soal/[examId]/preview" | "/guru/media-bank" | "/guru/papan-peringkat" | "/guru/papan-peringkat/type" | "/guru/papan-peringkat/type/[typeId]" | "/guru/papan-peringkat/[examId]" | "/guru/penilaian" | "/guru/remedial" | "/guru/remedial/[examId]" | "/guru/results" | "/guru/results/[attemptId]" | "/login" | "/pengawas" | "/pengawas/monitor" | "/pengawas/tata-tertib" | "/pengawas/tokens" | "/siswa" | "/siswa/jadwal" | "/siswa/papan-peringkat" | "/siswa/papan-peringkat/type" | "/siswa/papan-peringkat/type/[typeId]" | "/siswa/papan-peringkat/[examId]" | "/siswa/tata-tertib" | "/siswa/ujian" | "/siswa/ujian/[attemptId]" | "/superadmin" | "/superadmin/accounts" | "/superadmin/admins" | "/superadmin/schools";
		RouteParams(): {
			"/admin/bank-soal/[examId]": { examId: string };
			"/admin/bank-soal/[examId]/preview": { examId: string };
			"/admin/exams/type/[typeId]": { typeId: string };
			"/admin/exams/[id]": { id: string };
			"/admin/papan-peringkat/type/[typeId]": { typeId: string };
			"/admin/papan-peringkat/[examId]": { examId: string };
			"/admin/results/[attemptId]": { attemptId: string };
			"/api/exams/[id]": { id: string };
			"/api/exams/[id]/questions": { id: string };
			"/api/export-results/[examId]": { examId: string };
			"/guru/bank-soal/[examId]": { examId: string };
			"/guru/bank-soal/[examId]/preview": { examId: string };
			"/guru/papan-peringkat/type/[typeId]": { typeId: string };
			"/guru/papan-peringkat/[examId]": { examId: string };
			"/guru/remedial/[examId]": { examId: string };
			"/guru/results/[attemptId]": { attemptId: string };
			"/siswa/papan-peringkat/type/[typeId]": { typeId: string };
			"/siswa/papan-peringkat/[examId]": { examId: string };
			"/siswa/ujian/[attemptId]": { attemptId: string }
		};
		LayoutParams(): {
			"/": { examId?: string | undefined; typeId?: string | undefined; id?: string | undefined; attemptId?: string | undefined };
			"/admin": { examId?: string | undefined; typeId?: string | undefined; id?: string | undefined; attemptId?: string | undefined };
			"/admin/bank-soal": { examId?: string | undefined };
			"/admin/bank-soal/[examId]": { examId: string };
			"/admin/bank-soal/[examId]/preview": { examId: string };
			"/admin/classes": Record<string, never>;
			"/admin/exams": { typeId?: string | undefined; id?: string | undefined };
			"/admin/exams/type": { typeId?: string | undefined };
			"/admin/exams/type/[typeId]": { typeId: string };
			"/admin/exams/[id]": { id: string };
			"/admin/media-bank": Record<string, never>;
			"/admin/papan-peringkat": { typeId?: string | undefined; examId?: string | undefined };
			"/admin/papan-peringkat/type": { typeId?: string | undefined };
			"/admin/papan-peringkat/type/[typeId]": { typeId: string };
			"/admin/papan-peringkat/[examId]": { examId: string };
			"/admin/results": { attemptId?: string | undefined };
			"/admin/results/[attemptId]": { attemptId: string };
			"/admin/school-profile": Record<string, never>;
			"/admin/students": Record<string, never>;
			"/admin/subjects": Record<string, never>;
			"/admin/users": Record<string, never>;
			"/api": { id?: string | undefined; examId?: string | undefined };
			"/api/delete-media": Record<string, never>;
			"/api/exams": { id?: string | undefined };
			"/api/exams/[id]": { id: string };
			"/api/exams/[id]/questions": { id: string };
			"/api/export-results": { examId?: string | undefined };
			"/api/export-results/[examId]": { examId: string };
			"/api/logout": Record<string, never>;
			"/api/media": Record<string, never>;
			"/api/profile": Record<string, never>;
			"/api/proxy-media": Record<string, never>;
			"/api/setup": Record<string, never>;
			"/api/track-media": Record<string, never>;
			"/guru": { examId?: string | undefined; typeId?: string | undefined; attemptId?: string | undefined };
			"/guru/bank-soal": { examId?: string | undefined };
			"/guru/bank-soal/[examId]": { examId: string };
			"/guru/bank-soal/[examId]/preview": { examId: string };
			"/guru/media-bank": Record<string, never>;
			"/guru/papan-peringkat": { typeId?: string | undefined; examId?: string | undefined };
			"/guru/papan-peringkat/type": { typeId?: string | undefined };
			"/guru/papan-peringkat/type/[typeId]": { typeId: string };
			"/guru/papan-peringkat/[examId]": { examId: string };
			"/guru/penilaian": Record<string, never>;
			"/guru/remedial": { examId?: string | undefined };
			"/guru/remedial/[examId]": { examId: string };
			"/guru/results": { attemptId?: string | undefined };
			"/guru/results/[attemptId]": { attemptId: string };
			"/login": Record<string, never>;
			"/pengawas": Record<string, never>;
			"/pengawas/monitor": Record<string, never>;
			"/pengawas/tata-tertib": Record<string, never>;
			"/pengawas/tokens": Record<string, never>;
			"/siswa": { typeId?: string | undefined; examId?: string | undefined; attemptId?: string | undefined };
			"/siswa/jadwal": Record<string, never>;
			"/siswa/papan-peringkat": { typeId?: string | undefined; examId?: string | undefined };
			"/siswa/papan-peringkat/type": { typeId?: string | undefined };
			"/siswa/papan-peringkat/type/[typeId]": { typeId: string };
			"/siswa/papan-peringkat/[examId]": { examId: string };
			"/siswa/tata-tertib": Record<string, never>;
			"/siswa/ujian": { attemptId?: string | undefined };
			"/siswa/ujian/[attemptId]": { attemptId: string };
			"/superadmin": Record<string, never>;
			"/superadmin/accounts": Record<string, never>;
			"/superadmin/admins": Record<string, never>;
			"/superadmin/schools": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/bank-soal" | `/admin/bank-soal/${string}` & {} | `/admin/bank-soal/${string}/preview` & {} | "/admin/classes" | "/admin/exams" | `/admin/exams/type/${string}` & {} | `/admin/exams/${string}` & {} | "/admin/media-bank" | "/admin/papan-peringkat" | `/admin/papan-peringkat/type/${string}` & {} | `/admin/papan-peringkat/${string}` & {} | "/admin/results" | `/admin/results/${string}` & {} | "/admin/school-profile" | "/admin/students" | "/admin/subjects" | "/admin/users" | "/api/delete-media" | `/api/exams/${string}/questions` & {} | `/api/export-results/${string}` & {} | "/api/logout" | "/api/media" | "/api/profile" | "/api/proxy-media" | "/api/setup" | "/api/track-media" | "/guru" | "/guru/bank-soal" | `/guru/bank-soal/${string}` & {} | `/guru/bank-soal/${string}/preview` & {} | "/guru/media-bank" | "/guru/papan-peringkat" | `/guru/papan-peringkat/type/${string}` & {} | `/guru/papan-peringkat/${string}` & {} | "/guru/penilaian" | "/guru/remedial" | `/guru/remedial/${string}` & {} | "/guru/results" | `/guru/results/${string}` & {} | "/login" | "/pengawas" | "/pengawas/monitor" | "/pengawas/tata-tertib" | "/pengawas/tokens" | "/siswa" | "/siswa/jadwal" | "/siswa/papan-peringkat" | `/siswa/papan-peringkat/type/${string}` & {} | `/siswa/papan-peringkat/${string}` & {} | "/siswa/tata-tertib" | "/siswa/ujian" | `/siswa/ujian/${string}` & {} | "/superadmin" | "/superadmin/accounts" | "/superadmin/admins" | "/superadmin/schools";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | string & {};
	}
}