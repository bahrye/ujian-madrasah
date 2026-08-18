
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
		RouteId(): "/" | "/admin" | "/admin/bank-soal" | "/admin/bank-soal/[examId]" | "/admin/bank-soal/[examId]/preview" | "/admin/classes" | "/admin/exams" | "/admin/exams/type" | "/admin/exams/type/[typeId]" | "/admin/exams/type/[typeId]/class" | "/admin/exams/type/[typeId]/class/[classId]" | "/admin/exams/[id]" | "/admin/exams/[id]/analisis" | "/admin/exams/[id]/jawaban-siswa" | "/admin/media-bank" | "/admin/monitor" | "/admin/papan-peringkat" | "/admin/papan-peringkat/type" | "/admin/papan-peringkat/type/[typeId]" | "/admin/papan-peringkat/type/[typeId]/exams" | "/admin/papan-peringkat/[examId]" | "/admin/reset-login" | "/admin/results" | "/admin/results/[attemptId]" | "/admin/school-profile" | "/admin/students" | "/admin/subjects" | "/admin/tokens" | "/admin/users" | "/api" | "/api/attempt-status" | "/api/attempt-status/[id]" | "/api/delete-media" | "/api/exam-type-classes" | "/api/exam-type-proctors" | "/api/exams" | "/api/exams/[id]" | "/api/exams/[id]/questions" | "/api/export-results" | "/api/export-results/type" | "/api/export-results/type/[typeId]" | "/api/export-results/[examId]" | "/api/export" | "/api/export/analisis" | "/api/export/analisis/[examId]" | "/api/export/excel" | "/api/export/excel/[exam_id]" | "/api/export/jawaban-siswa" | "/api/export/jawaban-siswa/[examId]" | "/api/heartbeat" | "/api/logout" | "/api/media" | "/api/migrate-sessions" | "/api/monitor-live" | "/api/profile" | "/api/profile/qr-token" | "/api/proxy-media" | "/api/setup" | "/api/track-media" | "/guru" | "/guru/bank-soal" | "/guru/bank-soal/[examId]" | "/guru/bank-soal/[examId]/analisis" | "/guru/bank-soal/[examId]/jawaban-siswa" | "/guru/bank-soal/[examId]/preview" | "/guru/media-bank" | "/guru/papan-peringkat" | "/guru/papan-peringkat/type" | "/guru/papan-peringkat/type/[typeId]" | "/guru/papan-peringkat/type/[typeId]/exams" | "/guru/papan-peringkat/[examId]" | "/guru/penilaian" | "/guru/remedial" | "/guru/remedial/[examId]" | "/guru/results" | "/guru/results/[attemptId]" | "/login" | "/pengawas" | "/pengawas/jadwal" | "/pengawas/jadwal/saya" | "/pengawas/jadwal/semua" | "/pengawas/monitor" | "/pengawas/reset-login" | "/pengawas/tata-tertib" | "/pengawas/tokens" | "/print" | "/print/analisis" | "/print/analisis/[examId]" | "/print/berita-acara" | "/print/berita-acara/type" | "/print/berita-acara/type/[typeId]" | "/print/berita-acara/[exam_id]" | "/print/jadwal-rekap" | "/print/jadwal-rekap/type" | "/print/jadwal-rekap/type/[typeId]" | "/print/jadwal" | "/print/jadwal/type" | "/print/jadwal/type/[typeId]" | "/print/jawaban-siswa" | "/print/jawaban-siswa/[examId]" | "/print/kartu" | "/print/kartu/type" | "/print/kartu/type/[typeId]" | "/print/kartu/[exam_id]" | "/print/kehadiran" | "/print/kehadiran/type" | "/print/kehadiran/type/[typeId]" | "/print/kehadiran/[exam_id]" | "/print/results" | "/print/results/[attemptId]" | "/siswa" | "/siswa/hasil-ujian" | "/siswa/jadwal" | "/siswa/papan-peringkat" | "/siswa/papan-peringkat/type" | "/siswa/papan-peringkat/type/[typeId]" | "/siswa/papan-peringkat/type/[typeId]/exams" | "/siswa/papan-peringkat/[examId]" | "/siswa/tata-tertib" | "/siswa/ujian" | "/siswa/ujian/[attemptId]" | "/superadmin" | "/superadmin/accounts" | "/superadmin/admins" | "/superadmin/schools";
		RouteParams(): {
			"/admin/bank-soal/[examId]": { examId: string };
			"/admin/bank-soal/[examId]/preview": { examId: string };
			"/admin/exams/type/[typeId]": { typeId: string };
			"/admin/exams/type/[typeId]/class": { typeId: string };
			"/admin/exams/type/[typeId]/class/[classId]": { typeId: string; classId: string };
			"/admin/exams/[id]": { id: string };
			"/admin/exams/[id]/analisis": { id: string };
			"/admin/exams/[id]/jawaban-siswa": { id: string };
			"/admin/papan-peringkat/type/[typeId]": { typeId: string };
			"/admin/papan-peringkat/type/[typeId]/exams": { typeId: string };
			"/admin/papan-peringkat/[examId]": { examId: string };
			"/admin/results/[attemptId]": { attemptId: string };
			"/api/attempt-status/[id]": { id: string };
			"/api/exams/[id]": { id: string };
			"/api/exams/[id]/questions": { id: string };
			"/api/export-results/type/[typeId]": { typeId: string };
			"/api/export-results/[examId]": { examId: string };
			"/api/export/analisis/[examId]": { examId: string };
			"/api/export/excel/[exam_id]": { exam_id: string };
			"/api/export/jawaban-siswa/[examId]": { examId: string };
			"/guru/bank-soal/[examId]": { examId: string };
			"/guru/bank-soal/[examId]/analisis": { examId: string };
			"/guru/bank-soal/[examId]/jawaban-siswa": { examId: string };
			"/guru/bank-soal/[examId]/preview": { examId: string };
			"/guru/papan-peringkat/type/[typeId]": { typeId: string };
			"/guru/papan-peringkat/type/[typeId]/exams": { typeId: string };
			"/guru/papan-peringkat/[examId]": { examId: string };
			"/guru/remedial/[examId]": { examId: string };
			"/guru/results/[attemptId]": { attemptId: string };
			"/print/analisis/[examId]": { examId: string };
			"/print/berita-acara/type/[typeId]": { typeId: string };
			"/print/berita-acara/[exam_id]": { exam_id: string };
			"/print/jadwal-rekap/type/[typeId]": { typeId: string };
			"/print/jadwal/type/[typeId]": { typeId: string };
			"/print/jawaban-siswa/[examId]": { examId: string };
			"/print/kartu/type/[typeId]": { typeId: string };
			"/print/kartu/[exam_id]": { exam_id: string };
			"/print/kehadiran/type/[typeId]": { typeId: string };
			"/print/kehadiran/[exam_id]": { exam_id: string };
			"/print/results/[attemptId]": { attemptId: string };
			"/siswa/papan-peringkat/type/[typeId]": { typeId: string };
			"/siswa/papan-peringkat/type/[typeId]/exams": { typeId: string };
			"/siswa/papan-peringkat/[examId]": { examId: string };
			"/siswa/ujian/[attemptId]": { attemptId: string }
		};
		LayoutParams(): {
			"/": { examId?: string | undefined; typeId?: string | undefined; classId?: string | undefined; id?: string | undefined; attemptId?: string | undefined; exam_id?: string | undefined };
			"/admin": { examId?: string | undefined; typeId?: string | undefined; classId?: string | undefined; id?: string | undefined; attemptId?: string | undefined };
			"/admin/bank-soal": { examId?: string | undefined };
			"/admin/bank-soal/[examId]": { examId: string };
			"/admin/bank-soal/[examId]/preview": { examId: string };
			"/admin/classes": Record<string, never>;
			"/admin/exams": { typeId?: string | undefined; classId?: string | undefined; id?: string | undefined };
			"/admin/exams/type": { typeId?: string | undefined; classId?: string | undefined };
			"/admin/exams/type/[typeId]": { typeId: string; classId?: string | undefined };
			"/admin/exams/type/[typeId]/class": { typeId: string; classId?: string | undefined };
			"/admin/exams/type/[typeId]/class/[classId]": { typeId: string; classId: string };
			"/admin/exams/[id]": { id: string };
			"/admin/exams/[id]/analisis": { id: string };
			"/admin/exams/[id]/jawaban-siswa": { id: string };
			"/admin/media-bank": Record<string, never>;
			"/admin/monitor": Record<string, never>;
			"/admin/papan-peringkat": { typeId?: string | undefined; examId?: string | undefined };
			"/admin/papan-peringkat/type": { typeId?: string | undefined };
			"/admin/papan-peringkat/type/[typeId]": { typeId: string };
			"/admin/papan-peringkat/type/[typeId]/exams": { typeId: string };
			"/admin/papan-peringkat/[examId]": { examId: string };
			"/admin/reset-login": Record<string, never>;
			"/admin/results": { attemptId?: string | undefined };
			"/admin/results/[attemptId]": { attemptId: string };
			"/admin/school-profile": Record<string, never>;
			"/admin/students": Record<string, never>;
			"/admin/subjects": Record<string, never>;
			"/admin/tokens": Record<string, never>;
			"/admin/users": Record<string, never>;
			"/api": { id?: string | undefined; typeId?: string | undefined; examId?: string | undefined; exam_id?: string | undefined };
			"/api/attempt-status": { id?: string | undefined };
			"/api/attempt-status/[id]": { id: string };
			"/api/delete-media": Record<string, never>;
			"/api/exam-type-classes": Record<string, never>;
			"/api/exam-type-proctors": Record<string, never>;
			"/api/exams": { id?: string | undefined };
			"/api/exams/[id]": { id: string };
			"/api/exams/[id]/questions": { id: string };
			"/api/export-results": { typeId?: string | undefined; examId?: string | undefined };
			"/api/export-results/type": { typeId?: string | undefined };
			"/api/export-results/type/[typeId]": { typeId: string };
			"/api/export-results/[examId]": { examId: string };
			"/api/export": { examId?: string | undefined; exam_id?: string | undefined };
			"/api/export/analisis": { examId?: string | undefined };
			"/api/export/analisis/[examId]": { examId: string };
			"/api/export/excel": { exam_id?: string | undefined };
			"/api/export/excel/[exam_id]": { exam_id: string };
			"/api/export/jawaban-siswa": { examId?: string | undefined };
			"/api/export/jawaban-siswa/[examId]": { examId: string };
			"/api/heartbeat": Record<string, never>;
			"/api/logout": Record<string, never>;
			"/api/media": Record<string, never>;
			"/api/migrate-sessions": Record<string, never>;
			"/api/monitor-live": Record<string, never>;
			"/api/profile": Record<string, never>;
			"/api/profile/qr-token": Record<string, never>;
			"/api/proxy-media": Record<string, never>;
			"/api/setup": Record<string, never>;
			"/api/track-media": Record<string, never>;
			"/guru": { examId?: string | undefined; typeId?: string | undefined; attemptId?: string | undefined };
			"/guru/bank-soal": { examId?: string | undefined };
			"/guru/bank-soal/[examId]": { examId: string };
			"/guru/bank-soal/[examId]/analisis": { examId: string };
			"/guru/bank-soal/[examId]/jawaban-siswa": { examId: string };
			"/guru/bank-soal/[examId]/preview": { examId: string };
			"/guru/media-bank": Record<string, never>;
			"/guru/papan-peringkat": { typeId?: string | undefined; examId?: string | undefined };
			"/guru/papan-peringkat/type": { typeId?: string | undefined };
			"/guru/papan-peringkat/type/[typeId]": { typeId: string };
			"/guru/papan-peringkat/type/[typeId]/exams": { typeId: string };
			"/guru/papan-peringkat/[examId]": { examId: string };
			"/guru/penilaian": Record<string, never>;
			"/guru/remedial": { examId?: string | undefined };
			"/guru/remedial/[examId]": { examId: string };
			"/guru/results": { attemptId?: string | undefined };
			"/guru/results/[attemptId]": { attemptId: string };
			"/login": Record<string, never>;
			"/pengawas": Record<string, never>;
			"/pengawas/jadwal": Record<string, never>;
			"/pengawas/jadwal/saya": Record<string, never>;
			"/pengawas/jadwal/semua": Record<string, never>;
			"/pengawas/monitor": Record<string, never>;
			"/pengawas/reset-login": Record<string, never>;
			"/pengawas/tata-tertib": Record<string, never>;
			"/pengawas/tokens": Record<string, never>;
			"/print": { examId?: string | undefined; typeId?: string | undefined; exam_id?: string | undefined; attemptId?: string | undefined };
			"/print/analisis": { examId?: string | undefined };
			"/print/analisis/[examId]": { examId: string };
			"/print/berita-acara": { typeId?: string | undefined; exam_id?: string | undefined };
			"/print/berita-acara/type": { typeId?: string | undefined };
			"/print/berita-acara/type/[typeId]": { typeId: string };
			"/print/berita-acara/[exam_id]": { exam_id: string };
			"/print/jadwal-rekap": { typeId?: string | undefined };
			"/print/jadwal-rekap/type": { typeId?: string | undefined };
			"/print/jadwal-rekap/type/[typeId]": { typeId: string };
			"/print/jadwal": { typeId?: string | undefined };
			"/print/jadwal/type": { typeId?: string | undefined };
			"/print/jadwal/type/[typeId]": { typeId: string };
			"/print/jawaban-siswa": { examId?: string | undefined };
			"/print/jawaban-siswa/[examId]": { examId: string };
			"/print/kartu": { typeId?: string | undefined; exam_id?: string | undefined };
			"/print/kartu/type": { typeId?: string | undefined };
			"/print/kartu/type/[typeId]": { typeId: string };
			"/print/kartu/[exam_id]": { exam_id: string };
			"/print/kehadiran": { typeId?: string | undefined; exam_id?: string | undefined };
			"/print/kehadiran/type": { typeId?: string | undefined };
			"/print/kehadiran/type/[typeId]": { typeId: string };
			"/print/kehadiran/[exam_id]": { exam_id: string };
			"/print/results": { attemptId?: string | undefined };
			"/print/results/[attemptId]": { attemptId: string };
			"/siswa": { typeId?: string | undefined; examId?: string | undefined; attemptId?: string | undefined };
			"/siswa/hasil-ujian": Record<string, never>;
			"/siswa/jadwal": Record<string, never>;
			"/siswa/papan-peringkat": { typeId?: string | undefined; examId?: string | undefined };
			"/siswa/papan-peringkat/type": { typeId?: string | undefined };
			"/siswa/papan-peringkat/type/[typeId]": { typeId: string };
			"/siswa/papan-peringkat/type/[typeId]/exams": { typeId: string };
			"/siswa/papan-peringkat/[examId]": { examId: string };
			"/siswa/tata-tertib": Record<string, never>;
			"/siswa/ujian": { attemptId?: string | undefined };
			"/siswa/ujian/[attemptId]": { attemptId: string };
			"/superadmin": Record<string, never>;
			"/superadmin/accounts": Record<string, never>;
			"/superadmin/admins": Record<string, never>;
			"/superadmin/schools": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/bank-soal" | `/admin/bank-soal/${string}` & {} | `/admin/bank-soal/${string}/preview` & {} | "/admin/classes" | "/admin/exams" | `/admin/exams/type/${string}` & {} | `/admin/exams/type/${string}/class/${string}` & {} | `/admin/exams/${string}` & {} | `/admin/exams/${string}/analisis` & {} | `/admin/exams/${string}/jawaban-siswa` & {} | "/admin/media-bank" | "/admin/monitor" | "/admin/papan-peringkat" | `/admin/papan-peringkat/type/${string}` & {} | `/admin/papan-peringkat/type/${string}/exams` & {} | `/admin/papan-peringkat/${string}` & {} | "/admin/reset-login" | "/admin/results" | `/admin/results/${string}` & {} | "/admin/school-profile" | "/admin/students" | "/admin/subjects" | "/admin/tokens" | "/admin/users" | `/api/attempt-status/${string}` & {} | "/api/delete-media" | "/api/exam-type-classes" | "/api/exam-type-proctors" | `/api/exams/${string}/questions` & {} | `/api/export-results/type/${string}` & {} | `/api/export-results/${string}` & {} | `/api/export/analisis/${string}` & {} | `/api/export/excel/${string}` & {} | `/api/export/jawaban-siswa/${string}` & {} | "/api/heartbeat" | "/api/logout" | "/api/media" | "/api/migrate-sessions" | "/api/monitor-live" | "/api/profile" | "/api/profile/qr-token" | "/api/proxy-media" | "/api/setup" | "/api/track-media" | "/guru" | "/guru/bank-soal" | `/guru/bank-soal/${string}` & {} | `/guru/bank-soal/${string}/analisis` & {} | `/guru/bank-soal/${string}/jawaban-siswa` & {} | `/guru/bank-soal/${string}/preview` & {} | "/guru/media-bank" | "/guru/papan-peringkat" | `/guru/papan-peringkat/type/${string}` & {} | `/guru/papan-peringkat/type/${string}/exams` & {} | `/guru/papan-peringkat/${string}` & {} | "/guru/penilaian" | "/guru/remedial" | `/guru/remedial/${string}` & {} | "/guru/results" | `/guru/results/${string}` & {} | "/login" | "/pengawas" | "/pengawas/jadwal/saya" | "/pengawas/jadwal/semua" | "/pengawas/monitor" | "/pengawas/reset-login" | "/pengawas/tata-tertib" | "/pengawas/tokens" | `/print/analisis/${string}` & {} | `/print/berita-acara/type/${string}` & {} | `/print/berita-acara/${string}` & {} | `/print/jadwal-rekap/type/${string}` & {} | `/print/jadwal/type/${string}` & {} | `/print/jawaban-siswa/${string}` & {} | `/print/kartu/type/${string}` & {} | `/print/kartu/${string}` & {} | `/print/kehadiran/type/${string}` & {} | `/print/kehadiran/${string}` & {} | `/print/results/${string}` & {} | "/siswa" | "/siswa/hasil-ujian" | "/siswa/jadwal" | "/siswa/papan-peringkat" | `/siswa/papan-peringkat/type/${string}` & {} | `/siswa/papan-peringkat/type/${string}/exams` & {} | `/siswa/papan-peringkat/${string}` & {} | "/siswa/tata-tertib" | "/siswa/ujian" | `/siswa/ujian/${string}` & {} | "/superadmin" | "/superadmin/accounts" | "/superadmin/admins" | "/superadmin/schools";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | "/kemenag.png" | "/panduan-ui-ujian-2.jpeg" | "/panduan-ui-ujian-3.jpeg" | "/panduan-ui-ujian.jpeg" | "/template_soal_ujian.docx" | string & {};
	}
}