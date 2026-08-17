export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg","kemenag.png","panduan-ui-ujian.jpeg","template_soal_ujian.docx"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".jpeg":"image/jpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.CUcUnFhc.js",app:"_app/immutable/entry/app.DpWICHwu.js",imports:["_app/immutable/entry/start.CUcUnFhc.js","_app/immutable/chunks/C88u1isR.js","_app/immutable/chunks/Bp3hrXGM.js","_app/immutable/chunks/DsjVLxFs.js","_app/immutable/chunks/vU2YrzcE.js","_app/immutable/chunks/BajGDXqa.js","_app/immutable/entry/app.DpWICHwu.js","_app/immutable/chunks/DsjVLxFs.js","_app/immutable/chunks/vU2YrzcE.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Bp3hrXGM.js","_app/immutable/chunks/D5QCWm8k.js","_app/immutable/chunks/ltCG7yBS.js","_app/immutable/chunks/BSSW4fmP.js","_app/immutable/chunks/CFsR1-3_.js","_app/immutable/chunks/BajGDXqa.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js')),
			__memo(() => import('../output/server/nodes/7.js')),
			__memo(() => import('../output/server/nodes/8.js')),
			__memo(() => import('../output/server/nodes/9.js')),
			__memo(() => import('../output/server/nodes/10.js')),
			__memo(() => import('../output/server/nodes/11.js')),
			__memo(() => import('../output/server/nodes/12.js')),
			__memo(() => import('../output/server/nodes/13.js')),
			__memo(() => import('../output/server/nodes/14.js')),
			__memo(() => import('../output/server/nodes/15.js')),
			__memo(() => import('../output/server/nodes/16.js')),
			__memo(() => import('../output/server/nodes/17.js')),
			__memo(() => import('../output/server/nodes/18.js')),
			__memo(() => import('../output/server/nodes/19.js')),
			__memo(() => import('../output/server/nodes/20.js')),
			__memo(() => import('../output/server/nodes/21.js')),
			__memo(() => import('../output/server/nodes/22.js')),
			__memo(() => import('../output/server/nodes/23.js')),
			__memo(() => import('../output/server/nodes/24.js')),
			__memo(() => import('../output/server/nodes/25.js')),
			__memo(() => import('../output/server/nodes/26.js')),
			__memo(() => import('../output/server/nodes/27.js')),
			__memo(() => import('../output/server/nodes/28.js')),
			__memo(() => import('../output/server/nodes/29.js')),
			__memo(() => import('../output/server/nodes/30.js')),
			__memo(() => import('../output/server/nodes/31.js')),
			__memo(() => import('../output/server/nodes/32.js')),
			__memo(() => import('../output/server/nodes/33.js')),
			__memo(() => import('../output/server/nodes/34.js')),
			__memo(() => import('../output/server/nodes/35.js')),
			__memo(() => import('../output/server/nodes/36.js')),
			__memo(() => import('../output/server/nodes/37.js')),
			__memo(() => import('../output/server/nodes/38.js')),
			__memo(() => import('../output/server/nodes/39.js')),
			__memo(() => import('../output/server/nodes/40.js')),
			__memo(() => import('../output/server/nodes/41.js')),
			__memo(() => import('../output/server/nodes/42.js')),
			__memo(() => import('../output/server/nodes/43.js')),
			__memo(() => import('../output/server/nodes/44.js')),
			__memo(() => import('../output/server/nodes/45.js')),
			__memo(() => import('../output/server/nodes/46.js')),
			__memo(() => import('../output/server/nodes/47.js')),
			__memo(() => import('../output/server/nodes/48.js')),
			__memo(() => import('../output/server/nodes/49.js')),
			__memo(() => import('../output/server/nodes/50.js')),
			__memo(() => import('../output/server/nodes/51.js')),
			__memo(() => import('../output/server/nodes/52.js')),
			__memo(() => import('../output/server/nodes/53.js')),
			__memo(() => import('../output/server/nodes/54.js')),
			__memo(() => import('../output/server/nodes/55.js')),
			__memo(() => import('../output/server/nodes/56.js')),
			__memo(() => import('../output/server/nodes/57.js')),
			__memo(() => import('../output/server/nodes/58.js')),
			__memo(() => import('../output/server/nodes/59.js')),
			__memo(() => import('../output/server/nodes/60.js')),
			__memo(() => import('../output/server/nodes/61.js')),
			__memo(() => import('../output/server/nodes/62.js')),
			__memo(() => import('../output/server/nodes/63.js')),
			__memo(() => import('../output/server/nodes/64.js')),
			__memo(() => import('../output/server/nodes/65.js')),
			__memo(() => import('../output/server/nodes/66.js')),
			__memo(() => import('../output/server/nodes/67.js')),
			__memo(() => import('../output/server/nodes/68.js')),
			__memo(() => import('../output/server/nodes/69.js')),
			__memo(() => import('../output/server/nodes/70.js')),
			__memo(() => import('../output/server/nodes/71.js')),
			__memo(() => import('../output/server/nodes/72.js')),
			__memo(() => import('../output/server/nodes/73.js')),
			__memo(() => import('../output/server/nodes/74.js')),
			__memo(() => import('../output/server/nodes/75.js')),
			__memo(() => import('../output/server/nodes/76.js')),
			__memo(() => import('../output/server/nodes/77.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/admin/bank-soal",
				pattern: /^\/admin\/bank-soal\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/admin/bank-soal/[examId]",
				pattern: /^\/admin\/bank-soal\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/admin/bank-soal/[examId]/preview",
				pattern: /^\/admin\/bank-soal\/([^/]+?)\/preview\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/admin/classes",
				pattern: /^\/admin\/classes\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/admin/exams",
				pattern: /^\/admin\/exams\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/admin/exams/type/[typeId]",
				pattern: /^\/admin\/exams\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/admin/exams/type/[typeId]/class/[classId]",
				pattern: /^\/admin\/exams\/type\/([^/]+?)\/class\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false},{"name":"classId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/admin/exams/[id]",
				pattern: /^\/admin\/exams\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/admin/exams/[id]/analisis",
				pattern: /^\/admin\/exams\/([^/]+?)\/analisis\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/admin/media-bank",
				pattern: /^\/admin\/media-bank\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/admin/monitor",
				pattern: /^\/admin\/monitor\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/admin/papan-peringkat",
				pattern: /^\/admin\/papan-peringkat\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/admin/papan-peringkat/type/[typeId]",
				pattern: /^\/admin\/papan-peringkat\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/admin/papan-peringkat/type/[typeId]/exams",
				pattern: /^\/admin\/papan-peringkat\/type\/([^/]+?)\/exams\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/admin/papan-peringkat/[examId]",
				pattern: /^\/admin\/papan-peringkat\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/admin/results",
				pattern: /^\/admin\/results\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/admin/results/[attemptId]",
				pattern: /^\/admin\/results\/([^/]+?)\/?$/,
				params: [{"name":"attemptId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/admin/school-profile",
				pattern: /^\/admin\/school-profile\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/admin/students",
				pattern: /^\/admin\/students\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/admin/subjects",
				pattern: /^\/admin\/subjects\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/admin/tokens",
				pattern: /^\/admin\/tokens\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/admin/users",
				pattern: /^\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/api/attempt-status/[id]",
				pattern: /^\/api\/attempt-status\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/attempt-status/_id_/_server.ts.js'))
			},
			{
				id: "/api/delete-media",
				pattern: /^\/api\/delete-media\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/delete-media/_server.ts.js'))
			},
			{
				id: "/api/exam-type-classes",
				pattern: /^\/api\/exam-type-classes\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/exam-type-classes/_server.ts.js'))
			},
			{
				id: "/api/exam-type-proctors",
				pattern: /^\/api\/exam-type-proctors\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/exam-type-proctors/_server.ts.js'))
			},
			{
				id: "/api/exams/[id]/questions",
				pattern: /^\/api\/exams\/([^/]+?)\/questions\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/exams/_id_/questions/_server.ts.js'))
			},
			{
				id: "/api/export-results/type/[typeId]",
				pattern: /^\/api\/export-results\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/export-results/type/_typeId_/_server.ts.js'))
			},
			{
				id: "/api/export-results/[examId]",
				pattern: /^\/api\/export-results\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/export-results/_examId_/_server.ts.js'))
			},
			{
				id: "/api/export/excel/[exam_id]",
				pattern: /^\/api\/export\/excel\/([^/]+?)\/?$/,
				params: [{"name":"exam_id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/export/excel/_exam_id_/_server.ts.js'))
			},
			{
				id: "/api/logout",
				pattern: /^\/api\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/logout/_server.ts.js'))
			},
			{
				id: "/api/media",
				pattern: /^\/api\/media\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/media/_server.ts.js'))
			},
			{
				id: "/api/migrate-sessions",
				pattern: /^\/api\/migrate-sessions\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/migrate-sessions/_server.ts.js'))
			},
			{
				id: "/api/monitor-live",
				pattern: /^\/api\/monitor-live\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/monitor-live/_server.ts.js'))
			},
			{
				id: "/api/profile",
				pattern: /^\/api\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/profile/_server.ts.js'))
			},
			{
				id: "/api/proxy-media",
				pattern: /^\/api\/proxy-media\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/proxy-media/_server.ts.js'))
			},
			{
				id: "/api/setup",
				pattern: /^\/api\/setup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/setup/_server.ts.js'))
			},
			{
				id: "/api/track-media",
				pattern: /^\/api\/track-media\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/track-media/_server.ts.js'))
			},
			{
				id: "/guru",
				pattern: /^\/guru\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal",
				pattern: /^\/guru\/bank-soal\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal/[examId]",
				pattern: /^\/guru\/bank-soal\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal/[examId]/analisis",
				pattern: /^\/guru\/bank-soal\/([^/]+?)\/analisis\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal/[examId]/preview",
				pattern: /^\/guru\/bank-soal\/([^/]+?)\/preview\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/guru/media-bank",
				pattern: /^\/guru\/media-bank\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/guru/papan-peringkat",
				pattern: /^\/guru\/papan-peringkat\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/guru/papan-peringkat/type/[typeId]",
				pattern: /^\/guru\/papan-peringkat\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/guru/papan-peringkat/type/[typeId]/exams",
				pattern: /^\/guru\/papan-peringkat\/type\/([^/]+?)\/exams\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/guru/papan-peringkat/[examId]",
				pattern: /^\/guru\/papan-peringkat\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/guru/penilaian",
				pattern: /^\/guru\/penilaian\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/guru/remedial",
				pattern: /^\/guru\/remedial\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/guru/remedial/[examId]",
				pattern: /^\/guru\/remedial\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/guru/results",
				pattern: /^\/guru\/results\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/guru/results/[attemptId]",
				pattern: /^\/guru\/results\/([^/]+?)\/?$/,
				params: [{"name":"attemptId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 46 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 47 },
				endpoint: null
			},
			{
				id: "/pengawas",
				pattern: /^\/pengawas\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 48 },
				endpoint: null
			},
			{
				id: "/pengawas/jadwal/saya",
				pattern: /^\/pengawas\/jadwal\/saya\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 49 },
				endpoint: null
			},
			{
				id: "/pengawas/jadwal/semua",
				pattern: /^\/pengawas\/jadwal\/semua\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 50 },
				endpoint: null
			},
			{
				id: "/pengawas/monitor",
				pattern: /^\/pengawas\/monitor\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 51 },
				endpoint: null
			},
			{
				id: "/pengawas/reset-login",
				pattern: /^\/pengawas\/reset-login\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 52 },
				endpoint: null
			},
			{
				id: "/pengawas/tata-tertib",
				pattern: /^\/pengawas\/tata-tertib\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 53 },
				endpoint: null
			},
			{
				id: "/pengawas/tokens",
				pattern: /^\/pengawas\/tokens\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 54 },
				endpoint: null
			},
			{
				id: "/print/berita-acara/type/[typeId]",
				pattern: /^\/print\/berita-acara\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 55 },
				endpoint: null
			},
			{
				id: "/print/berita-acara/[exam_id]",
				pattern: /^\/print\/berita-acara\/([^/]+?)\/?$/,
				params: [{"name":"exam_id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 56 },
				endpoint: null
			},
			{
				id: "/print/jadwal-rekap/type/[typeId]",
				pattern: /^\/print\/jadwal-rekap\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 58 },
				endpoint: null
			},
			{
				id: "/print/jadwal/type/[typeId]",
				pattern: /^\/print\/jadwal\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 57 },
				endpoint: null
			},
			{
				id: "/print/kartu/type/[typeId]",
				pattern: /^\/print\/kartu\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 59 },
				endpoint: null
			},
			{
				id: "/print/kartu/[exam_id]",
				pattern: /^\/print\/kartu\/([^/]+?)\/?$/,
				params: [{"name":"exam_id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 60 },
				endpoint: null
			},
			{
				id: "/print/kehadiran/type/[typeId]",
				pattern: /^\/print\/kehadiran\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 61 },
				endpoint: null
			},
			{
				id: "/print/kehadiran/[exam_id]",
				pattern: /^\/print\/kehadiran\/([^/]+?)\/?$/,
				params: [{"name":"exam_id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 62 },
				endpoint: null
			},
			{
				id: "/print/results/[attemptId]",
				pattern: /^\/print\/results\/([^/]+?)\/?$/,
				params: [{"name":"attemptId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 63 },
				endpoint: null
			},
			{
				id: "/siswa",
				pattern: /^\/siswa\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 64 },
				endpoint: null
			},
			{
				id: "/siswa/hasil-ujian",
				pattern: /^\/siswa\/hasil-ujian\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 65 },
				endpoint: null
			},
			{
				id: "/siswa/jadwal",
				pattern: /^\/siswa\/jadwal\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 66 },
				endpoint: null
			},
			{
				id: "/siswa/papan-peringkat",
				pattern: /^\/siswa\/papan-peringkat\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 67 },
				endpoint: null
			},
			{
				id: "/siswa/papan-peringkat/type/[typeId]",
				pattern: /^\/siswa\/papan-peringkat\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,6,], errors: [1,,], leaf: 68 },
				endpoint: null
			},
			{
				id: "/siswa/papan-peringkat/type/[typeId]/exams",
				pattern: /^\/siswa\/papan-peringkat\/type\/([^/]+?)\/exams\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,6,], errors: [1,,], leaf: 69 },
				endpoint: null
			},
			{
				id: "/siswa/papan-peringkat/[examId]",
				pattern: /^\/siswa\/papan-peringkat\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,6,], errors: [1,,], leaf: 70 },
				endpoint: null
			},
			{
				id: "/siswa/tata-tertib",
				pattern: /^\/siswa\/tata-tertib\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 71 },
				endpoint: null
			},
			{
				id: "/siswa/ujian",
				pattern: /^\/siswa\/ujian\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 72 },
				endpoint: null
			},
			{
				id: "/siswa/ujian/[attemptId]",
				pattern: /^\/siswa\/ujian\/([^/]+?)\/?$/,
				params: [{"name":"attemptId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 73 },
				endpoint: null
			},
			{
				id: "/superadmin",
				pattern: /^\/superadmin\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 74 },
				endpoint: null
			},
			{
				id: "/superadmin/accounts",
				pattern: /^\/superadmin\/accounts\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 75 },
				endpoint: null
			},
			{
				id: "/superadmin/admins",
				pattern: /^\/superadmin\/admins\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 76 },
				endpoint: null
			},
			{
				id: "/superadmin/schools",
				pattern: /^\/superadmin\/schools\/?$/,
				params: [],
				page: { layouts: [0,7,], errors: [1,,], leaf: 77 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);

export const base_path = "";
