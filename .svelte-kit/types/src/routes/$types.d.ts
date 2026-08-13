import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageServerParentData = EnsureDefined<LayoutServerData>;
type PageParentData = EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/" | "/admin" | "/admin/bank-soal" | "/admin/bank-soal/[examId]" | "/admin/bank-soal/[examId]/preview" | "/admin/classes" | "/admin/exams" | "/admin/exams/type/[typeId]" | "/admin/exams/type/[typeId]/class/[classId]" | "/admin/exams/[id]" | "/admin/exams/[id]/analisis" | "/admin/media-bank" | "/admin/monitor" | "/admin/papan-peringkat" | "/admin/papan-peringkat/type/[typeId]" | "/admin/papan-peringkat/type/[typeId]/exams" | "/admin/papan-peringkat/[examId]" | "/admin/results" | "/admin/results/[attemptId]" | "/admin/school-profile" | "/admin/students" | "/admin/subjects" | "/admin/tokens" | "/admin/users" | "/guru" | "/guru/bank-soal" | "/guru/bank-soal/[examId]" | "/guru/bank-soal/[examId]/preview" | "/guru/media-bank" | "/guru/papan-peringkat" | "/guru/papan-peringkat/type/[typeId]" | "/guru/papan-peringkat/type/[typeId]/exams" | "/guru/papan-peringkat/[examId]" | "/guru/penilaian" | "/guru/remedial" | "/guru/remedial/[examId]" | "/guru/results" | "/guru/results/[attemptId]" | "/login" | "/pengawas" | "/pengawas/jadwal/saya" | "/pengawas/jadwal/semua" | "/pengawas/monitor" | "/pengawas/tata-tertib" | "/pengawas/tokens" | "/print/berita-acara/[exam_id]" | "/print/jadwal/type/[typeId]" | "/print/kartu/type/[typeId]" | "/print/kartu/[exam_id]" | "/print/kehadiran/[exam_id]" | "/siswa" | "/siswa/hasil-ujian" | "/siswa/jadwal" | "/siswa/papan-peringkat" | "/siswa/papan-peringkat/type/[typeId]" | "/siswa/papan-peringkat/type/[typeId]/exams" | "/siswa/papan-peringkat/[examId]" | "/siswa/tata-tertib" | "/siswa/ujian" | "/siswa/ujian/[attemptId]" | "/superadmin" | "/superadmin/accounts" | "/superadmin/admins" | "/superadmin/schools" | null
type LayoutParams = RouteParams & { examId?: string | undefined; typeId?: string | undefined; classId?: string | undefined; id?: string | undefined; attemptId?: string | undefined; exam_id?: string | undefined }
type LayoutServerParentData = EnsureDefined<{}>;
type LayoutParentData = EnsureDefined<{}>;

export type PageServerLoad<OutputData extends OutputDataShape<PageServerParentData> = OutputDataShape<PageServerParentData>> = Kit.ServerLoad<RouteParams, PageServerParentData, OutputData, RouteId>;
export type PageServerLoadEvent = Parameters<PageServerLoad>[0];
export type ActionData = unknown;
export type PageServerData = Expand<OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('./proxy+page.server.js').load>>>>>>;
export type PageData = Expand<Omit<PageParentData, keyof PageServerData> & EnsureDefined<PageServerData>>;
export type Action<OutputData extends Record<string, any> | void = Record<string, any> | void> = Kit.Action<RouteParams, OutputData, RouteId>
export type Actions<OutputData extends Record<string, any> | void = Record<string, any> | void> = Kit.Actions<RouteParams, OutputData, RouteId>
export type PageProps = { params: RouteParams; data: PageData; form: ActionData }
export type LayoutServerLoad<OutputData extends OutputDataShape<LayoutServerParentData> = OutputDataShape<LayoutServerParentData>> = Kit.ServerLoad<LayoutParams, LayoutServerParentData, OutputData, LayoutRouteId>;
export type LayoutServerLoadEvent = Parameters<LayoutServerLoad>[0];
export type LayoutServerData = Expand<OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('./proxy+layout.server.js').load>>>>>>;
export type LayoutData = Expand<Omit<LayoutParentData, keyof LayoutServerData> & EnsureDefined<LayoutServerData>>;
export type LayoutProps = { params: LayoutParams; data: LayoutData; children: import("svelte").Snippet }
export type RequestEvent = Kit.RequestEvent<RouteParams, RouteId>;