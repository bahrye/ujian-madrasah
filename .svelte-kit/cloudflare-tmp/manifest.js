export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg","template_soal_ujian.docx"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.CeR4ZgW7.js",app:"_app/immutable/entry/app.TIB72ri7.js",imports:["_app/immutable/entry/start.CeR4ZgW7.js","_app/immutable/chunks/B1w3Sjg2.js","_app/immutable/chunks/DefmdQD4.js","_app/immutable/chunks/D4qA_8uZ.js","_app/immutable/chunks/B8nvzFA9.js","_app/immutable/chunks/B22lS0LW.js","_app/immutable/chunks/Cn73aa_U.js","_app/immutable/entry/app.TIB72ri7.js","_app/immutable/chunks/D4qA_8uZ.js","_app/immutable/chunks/B8nvzFA9.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DefmdQD4.js","_app/immutable/chunks/CvD4UPcL.js","_app/immutable/chunks/CtrZHl5r.js","_app/immutable/chunks/BnvTZMRs.js","_app/immutable/chunks/B8GwE7im.js","_app/immutable/chunks/Cn73aa_U.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:true},
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
			__memo(() => import('../output/server/nodes/63.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/admin/bank-soal",
				pattern: /^\/admin\/bank-soal\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/admin/bank-soal/[examId]",
				pattern: /^\/admin\/bank-soal\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/admin/bank-soal/[examId]/preview",
				pattern: /^\/admin\/bank-soal\/([^/]+?)\/preview\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/admin/classes",
				pattern: /^\/admin\/classes\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/admin/exams",
				pattern: /^\/admin\/exams\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/admin/exams/type/[typeId]",
				pattern: /^\/admin\/exams\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/admin/exams/[id]",
				pattern: /^\/admin\/exams\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/admin/media-bank",
				pattern: /^\/admin\/media-bank\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/admin/monitor",
				pattern: /^\/admin\/monitor\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/admin/papan-peringkat",
				pattern: /^\/admin\/papan-peringkat\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/admin/papan-peringkat/type/[typeId]",
				pattern: /^\/admin\/papan-peringkat\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/admin/papan-peringkat/type/[typeId]/exams",
				pattern: /^\/admin\/papan-peringkat\/type\/([^/]+?)\/exams\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/admin/papan-peringkat/[examId]",
				pattern: /^\/admin\/papan-peringkat\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/admin/results",
				pattern: /^\/admin\/results\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/admin/results/[attemptId]",
				pattern: /^\/admin\/results\/([^/]+?)\/?$/,
				params: [{"name":"attemptId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/admin/school-profile",
				pattern: /^\/admin\/school-profile\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/admin/students",
				pattern: /^\/admin\/students\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/admin/subjects",
				pattern: /^\/admin\/subjects\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/admin/tokens",
				pattern: /^\/admin\/tokens\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/admin/users",
				pattern: /^\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 28 },
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
				id: "/api/exam-type-participants",
				pattern: /^\/api\/exam-type-participants\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/exam-type-participants/_server.ts.js'))
			},
			{
				id: "/api/exams/[id]/questions",
				pattern: /^\/api\/exams\/([^/]+?)\/questions\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/exams/_id_/questions/_server.ts.js'))
			},
			{
				id: "/api/export-results/[examId]",
				pattern: /^\/api\/export-results\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/export-results/_examId_/_server.ts.js'))
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
				page: { layouts: [0,3,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal",
				pattern: /^\/guru\/bank-soal\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal/[examId]",
				pattern: /^\/guru\/bank-soal\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal/[examId]/preview",
				pattern: /^\/guru\/bank-soal\/([^/]+?)\/preview\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/guru/media-bank",
				pattern: /^\/guru\/media-bank\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/guru/papan-peringkat",
				pattern: /^\/guru\/papan-peringkat\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/guru/papan-peringkat/type/[typeId]",
				pattern: /^\/guru\/papan-peringkat\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/guru/papan-peringkat/type/[typeId]/exams",
				pattern: /^\/guru\/papan-peringkat\/type\/([^/]+?)\/exams\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/guru/papan-peringkat/[examId]",
				pattern: /^\/guru\/papan-peringkat\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/guru/penilaian",
				pattern: /^\/guru\/penilaian\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/guru/remedial",
				pattern: /^\/guru\/remedial\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/guru/remedial/[examId]",
				pattern: /^\/guru\/remedial\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/guru/results",
				pattern: /^\/guru\/results\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/guru/results/[attemptId]",
				pattern: /^\/guru\/results\/([^/]+?)\/?$/,
				params: [{"name":"attemptId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/pengawas",
				pattern: /^\/pengawas\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/pengawas/jadwal/saya",
				pattern: /^\/pengawas\/jadwal\/saya\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/pengawas/jadwal/semua",
				pattern: /^\/pengawas\/jadwal\/semua\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 46 },
				endpoint: null
			},
			{
				id: "/pengawas/monitor",
				pattern: /^\/pengawas\/monitor\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 47 },
				endpoint: null
			},
			{
				id: "/pengawas/tata-tertib",
				pattern: /^\/pengawas\/tata-tertib\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 48 },
				endpoint: null
			},
			{
				id: "/pengawas/tokens",
				pattern: /^\/pengawas\/tokens\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 49 },
				endpoint: null
			},
			{
				id: "/siswa",
				pattern: /^\/siswa\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 50 },
				endpoint: null
			},
			{
				id: "/siswa/hasil-ujian",
				pattern: /^\/siswa\/hasil-ujian\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 51 },
				endpoint: null
			},
			{
				id: "/siswa/jadwal",
				pattern: /^\/siswa\/jadwal\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 52 },
				endpoint: null
			},
			{
				id: "/siswa/papan-peringkat",
				pattern: /^\/siswa\/papan-peringkat\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 53 },
				endpoint: null
			},
			{
				id: "/siswa/papan-peringkat/type/[typeId]",
				pattern: /^\/siswa\/papan-peringkat\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 54 },
				endpoint: null
			},
			{
				id: "/siswa/papan-peringkat/type/[typeId]/exams",
				pattern: /^\/siswa\/papan-peringkat\/type\/([^/]+?)\/exams\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 55 },
				endpoint: null
			},
			{
				id: "/siswa/papan-peringkat/[examId]",
				pattern: /^\/siswa\/papan-peringkat\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 56 },
				endpoint: null
			},
			{
				id: "/siswa/tata-tertib",
				pattern: /^\/siswa\/tata-tertib\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 57 },
				endpoint: null
			},
			{
				id: "/siswa/ujian",
				pattern: /^\/siswa\/ujian\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 58 },
				endpoint: null
			},
			{
				id: "/siswa/ujian/[attemptId]",
				pattern: /^\/siswa\/ujian\/([^/]+?)\/?$/,
				params: [{"name":"attemptId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 59 },
				endpoint: null
			},
			{
				id: "/superadmin",
				pattern: /^\/superadmin\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 60 },
				endpoint: null
			},
			{
				id: "/superadmin/accounts",
				pattern: /^\/superadmin\/accounts\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 61 },
				endpoint: null
			},
			{
				id: "/superadmin/admins",
				pattern: /^\/superadmin\/admins\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 62 },
				endpoint: null
			},
			{
				id: "/superadmin/schools",
				pattern: /^\/superadmin\/schools\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 63 },
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
