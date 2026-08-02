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
		client: {start:"_app/immutable/entry/start.ZVvh_uA5.js",app:"_app/immutable/entry/app.C8a5KgVu.js",imports:["_app/immutable/entry/start.ZVvh_uA5.js","_app/immutable/chunks/ajrbfWHl.js","_app/immutable/chunks/DMvL3CwU.js","_app/immutable/chunks/qmq1rnYV.js","_app/immutable/chunks/XjMW7FYH.js","_app/immutable/entry/app.C8a5KgVu.js","_app/immutable/chunks/qmq1rnYV.js","_app/immutable/chunks/XjMW7FYH.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DMvL3CwU.js","_app/immutable/chunks/BblmnbLj.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
			__memo(() => import('./nodes/32.js'))
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
				id: "/admin/classes",
				pattern: /^\/admin\/classes\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/admin/exams",
				pattern: /^\/admin\/exams\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/admin/exams/[id]",
				pattern: /^\/admin\/exams\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/admin/results",
				pattern: /^\/admin\/results\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/admin/students",
				pattern: /^\/admin\/students\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/admin/subjects",
				pattern: /^\/admin\/subjects\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/admin/users",
				pattern: /^\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/api/exams/[id]/questions",
				pattern: /^\/api\/exams\/([^/]+?)\/questions\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/exams/_id_/questions/_server.ts.js'))
			},
			{
				id: "/api/logout",
				pattern: /^\/api\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/logout/_server.ts.js'))
			},
			{
				id: "/api/setup",
				pattern: /^\/api\/setup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/setup/_server.ts.js'))
			},
			{
				id: "/guru",
				pattern: /^\/guru\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal",
				pattern: /^\/guru\/bank-soal\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/guru/bank-soal/[examId]",
				pattern: /^\/guru\/bank-soal\/([^/]+?)\/?$/,
				params: [{"name":"examId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,], errors: [1,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/guru/penilaian",
				pattern: /^\/guru\/penilaian\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/pengawas",
				pattern: /^\/pengawas\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/pengawas/monitor",
				pattern: /^\/pengawas\/monitor\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/pengawas/tokens",
				pattern: /^\/pengawas\/tokens\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/siswa",
				pattern: /^\/siswa\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/siswa/jadwal",
				pattern: /^\/siswa\/jadwal\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/siswa/ujian",
				pattern: /^\/siswa\/ujian\/?$/,
				params: [],
				page: { layouts: [0,5,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/siswa/ujian/[attemptId]",
				pattern: /^\/siswa\/ujian\/([^/]+?)\/?$/,
				params: [{"name":"attemptId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,5,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/superadmin",
				pattern: /^\/superadmin\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/superadmin/admins",
				pattern: /^\/superadmin\/admins\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/superadmin/schools",
				pattern: /^\/superadmin\/schools\/?$/,
				params: [],
				page: { layouts: [0,6,], errors: [1,,], leaf: 32 },
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
