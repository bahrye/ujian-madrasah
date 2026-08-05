export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.BCJ8Ju90.js",app:"_app/immutable/entry/app.pY_CmoTm.js",imports:["_app/immutable/entry/start.BCJ8Ju90.js","_app/immutable/chunks/TnqyH5GP.js","_app/immutable/chunks/CWhSAF0N.js","_app/immutable/chunks/DEmwldwl.js","_app/immutable/chunks/ImmirkrM.js","_app/immutable/chunks/DWGyVREu.js","_app/immutable/chunks/B6Zao61k.js","_app/immutable/entry/app.pY_CmoTm.js","_app/immutable/chunks/DEmwldwl.js","_app/immutable/chunks/ImmirkrM.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CWhSAF0N.js","_app/immutable/chunks/D0MExRDy.js","_app/immutable/chunks/DpA0yPAI.js","_app/immutable/chunks/CARY7BSv.js","_app/immutable/chunks/uSL-mgIf.js","_app/immutable/chunks/B6Zao61k.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js')),
			__memo(() => import('./nodes/22.js')),
			__memo(() => import('./nodes/23.js')),
			__memo(() => import('./nodes/24.js')),
			__memo(() => import('./nodes/25.js')),
			__memo(() => import('./nodes/26.js')),
			__memo(() => import('./nodes/27.js')),
			__memo(() => import('./nodes/28.js')),
			__memo(() => import('./nodes/29.js')),
			__memo(() => import('./nodes/30.js')),
			__memo(() => import('./nodes/31.js')),
			__memo(() => import('./nodes/32.js')),
			__memo(() => import('./nodes/33.js')),
			__memo(() => import('./nodes/34.js')),
			__memo(() => import('./nodes/35.js')),
			__memo(() => import('./nodes/36.js')),
			__memo(() => import('./nodes/37.js')),
			__memo(() => import('./nodes/38.js')),
			__memo(() => import('./nodes/39.js')),
			__memo(() => import('./nodes/40.js')),
			__memo(() => import('./nodes/41.js')),
			__memo(() => import('./nodes/42.js')),
			__memo(() => import('./nodes/43.js')),
			__memo(() => import('./nodes/44.js')),
			__memo(() => import('./nodes/45.js')),
			__memo(() => import('./nodes/46.js')),
			__memo(() => import('./nodes/47.js')),
			__memo(() => import('./nodes/48.js')),
			__memo(() => import('./nodes/49.js')),
			__memo(() => import('./nodes/50.js')),
			__memo(() => import('./nodes/51.js')),
			__memo(() => import('./nodes/52.js')),
			__memo(() => import('./nodes/53.js')),
			__memo(() => import('./nodes/54.js')),
			__memo(() => import('./nodes/55.js')),
			__memo(() => import('./nodes/56.js')),
			__memo(() => import('./nodes/57.js'))
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
				id: "/admin/papan-peringkat",
				pattern: /^\/admin\/papan-peringkat\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/admin/papan-peringkat/type/[typeId]",
				pattern: /^\/admin\/papan-peringkat\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/admin/papan-peringkat/[examId]",
				pattern: /^\/admin\/papan-peringkat\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/admin/results",
				pattern: /^\/admin\/results\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/admin/results/[attemptId]",
				pattern: /^\/admin\/results\/([^/]+?)\/?$/,
				params: [{"name":"attemptId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/admin/school-profile",
				pattern: /^\/admin\/school-profile\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/admin/students",
				pattern: /^\/admin\/students\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/admin/subjects",
				pattern: /^\/admin\/subjects\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/admin/users",
				pattern: /^\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/api/delete-media",
				pattern: /^\/api\/delete-media\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/delete-media/_server.ts.js'))
			},
			{
				id: "/api/exam-type-participants",
				pattern: /^\/api\/exam-type-participants\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/exam-type-participants/_server.ts.js'))
			},
			{
				id: "/api/exams/[id]/questions",
				pattern: /^\/api\/exams\/([^/]+?)\/questions\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/exams/_id_/questions/_server.ts.js'))
			},
			{
				id: "/api/export-results/[examId]",
				pattern: /^\/api\/export-results\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/export-results/_examId_/_server.ts.js'))
			},
			{
				id: "/api/logout",
				pattern: /^\/api\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/logout/_server.ts.js'))
			},
			{
				id: "/api/media",
				pattern: /^\/api\/media\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/media/_server.ts.js'))
			},
			{
				id: "/api/profile",
				pattern: /^\/api\/profile\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/profile/_server.ts.js'))
			},
			{
				id: "/api/proxy-media",
				pattern: /^\/api\/proxy-media\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/proxy-media/_server.ts.js'))
			},
			{
				id: "/api/setup",
				pattern: /^\/api\/setup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/setup/_server.ts.js'))
			},
			{
				id: "/api/track-media",
				pattern: /^\/api\/track-media\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/track-media/_server.ts.js'))
			},
			{
				id: "/guru",
				pattern: /^\/guru\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal",
				pattern: /^\/guru\/bank-soal\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal/[examId]",
				pattern: /^\/guru\/bank-soal\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal/[examId]/preview",
				pattern: /^\/guru\/bank-soal\/([^/]+?)\/preview\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/guru/media-bank",
				pattern: /^\/guru\/media-bank\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/guru/papan-peringkat",
				pattern: /^\/guru\/papan-peringkat\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/guru/papan-peringkat/type/[typeId]",
				pattern: /^\/guru\/papan-peringkat\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/guru/papan-peringkat/[examId]",
				pattern: /^\/guru\/papan-peringkat\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/guru/penilaian",
				pattern: /^\/guru\/penilaian\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/guru/remedial",
				pattern: /^\/guru\/remedial\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/guru/remedial/[examId]",
				pattern: /^\/guru\/remedial\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/guru/results",
				pattern: /^\/guru\/results\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/guru/results/[attemptId]",
				pattern: /^\/guru\/results\/([^/]+?)\/?$/,
				params: [{"name":"attemptId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/pengawas",
				pattern: /^\/pengawas\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/pengawas/jadwal/saya",
				pattern: /^\/pengawas\/jadwal\/saya\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/pengawas/jadwal/semua",
				pattern: /^\/pengawas\/jadwal\/semua\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/pengawas/monitor",
				pattern: /^\/pengawas\/monitor\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/pengawas/tata-tertib",
				pattern: /^\/pengawas\/tata-tertib\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/pengawas/tokens",
				pattern: /^\/pengawas\/tokens\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/siswa",
				pattern: /^\/siswa\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 46 },
				endpoint: null
			},
			{
				id: "/siswa/jadwal",
				pattern: /^\/siswa\/jadwal\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 47 },
				endpoint: null
			},
			{
				id: "/siswa/papan-peringkat",
				pattern: /^\/siswa\/papan-peringkat\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 48 },
				endpoint: null
			},
			{
				id: "/siswa/papan-peringkat/type/[typeId]",
				pattern: /^\/siswa\/papan-peringkat\/type\/([^/]+?)\/?$/,
				params: [{"name":"typeId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 49 },
				endpoint: null
			},
			{
				id: "/siswa/papan-peringkat/[examId]",
				pattern: /^\/siswa\/papan-peringkat\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 50 },
				endpoint: null
			},
			{
				id: "/siswa/tata-tertib",
				pattern: /^\/siswa\/tata-tertib\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 51 },
				endpoint: null
			},
			{
				id: "/siswa/ujian",
				pattern: /^\/siswa\/ujian\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 52 },
				endpoint: null
			},
			{
				id: "/siswa/ujian/[attemptId]",
				pattern: /^\/siswa\/ujian\/([^/]+?)\/?$/,
				params: [{"name":"attemptId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 53 },
				endpoint: null
			},
			{
				id: "/superadmin",
				pattern: /^\/superadmin\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 54 },
				endpoint: null
			},
			{
				id: "/superadmin/accounts",
				pattern: /^\/superadmin\/accounts\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 55 },
				endpoint: null
			},
			{
				id: "/superadmin/admins",
				pattern: /^\/superadmin\/admins\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 56 },
				endpoint: null
			},
			{
				id: "/superadmin/schools",
				pattern: /^\/superadmin\/schools\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 57 },
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
