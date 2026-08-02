
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
		RouteId(): "/" | "/admin" | "/admin/exams" | "/admin/exams/[id]" | "/admin/results" | "/admin/users" | "/api" | "/api/logout" | "/api/setup" | "/guru" | "/guru/bank-soal" | "/guru/bank-soal/[examId]" | "/guru/penilaian" | "/login" | "/pengawas" | "/pengawas/monitor" | "/pengawas/tokens" | "/siswa" | "/siswa/ujian" | "/siswa/ujian/[attemptId]";
		RouteParams(): {
			"/admin/exams/[id]": { id: string };
			"/guru/bank-soal/[examId]": { examId: string };
			"/siswa/ujian/[attemptId]": { attemptId: string }
		};
		LayoutParams(): {
			"/": { id?: string | undefined; examId?: string | undefined; attemptId?: string | undefined };
			"/admin": { id?: string | undefined };
			"/admin/exams": { id?: string | undefined };
			"/admin/exams/[id]": { id: string };
			"/admin/results": Record<string, never>;
			"/admin/users": Record<string, never>;
			"/api": Record<string, never>;
			"/api/logout": Record<string, never>;
			"/api/setup": Record<string, never>;
			"/guru": { examId?: string | undefined };
			"/guru/bank-soal": { examId?: string | undefined };
			"/guru/bank-soal/[examId]": { examId: string };
			"/guru/penilaian": Record<string, never>;
			"/login": Record<string, never>;
			"/pengawas": Record<string, never>;
			"/pengawas/monitor": Record<string, never>;
			"/pengawas/tokens": Record<string, never>;
			"/siswa": { attemptId?: string | undefined };
			"/siswa/ujian": { attemptId?: string | undefined };
			"/siswa/ujian/[attemptId]": { attemptId: string }
		};
		Pathname(): "/" | "/admin" | "/admin/exams" | `/admin/exams/${string}` & {} | "/admin/results" | "/admin/users" | "/api/logout" | "/api/setup" | "/guru" | "/guru/bank-soal" | `/guru/bank-soal/${string}` & {} | "/guru/penilaian" | "/login" | "/pengawas" | "/pengawas/monitor" | "/pengawas/tokens" | "/siswa" | "/siswa/ujian" | `/siswa/ujian/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | string & {};
	}
}