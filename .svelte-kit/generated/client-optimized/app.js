// in dev, this makes Vite inject its client as this module's first dependency,
// so that global constant replacements are installed before any other module
// (including user hooks) evaluates. In build it's inert.
import.meta.hot;




export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37'),
	() => import('./nodes/38'),
	() => import('./nodes/39'),
	() => import('./nodes/40'),
	() => import('./nodes/41'),
	() => import('./nodes/42'),
	() => import('./nodes/43')
];

export const server_loads = [0,2,3,4,5,6];

export const dictionary = {
		"/": [~7],
		"/admin": [~8,[2]],
		"/admin/bank-soal": [~9,[2]],
		"/admin/bank-soal/[examId]": [~10,[2]],
		"/admin/bank-soal/[examId]/preview": [~11],
		"/admin/classes": [~12,[2]],
		"/admin/exams": [~13,[2]],
		"/admin/exams/[id]": [~14,[2]],
		"/admin/media-bank": [~15,[2]],
		"/admin/results": [~16,[2]],
		"/admin/results/[attemptId]": [~17,[2]],
		"/admin/school-profile": [~18,[2]],
		"/admin/students": [~19,[2]],
		"/admin/subjects": [~20,[2]],
		"/admin/users": [~21,[2]],
		"/guru": [~22,[3]],
		"/guru/bank-soal": [~23,[3]],
		"/guru/bank-soal/[examId]": [~24,[3]],
		"/guru/bank-soal/[examId]/preview": [~25],
		"/guru/media-bank": [~26,[3]],
		"/guru/penilaian": [~27,[3]],
		"/guru/remedial": [~28,[3]],
		"/guru/remedial/[examId]": [~29,[3]],
		"/guru/results": [~30,[3]],
		"/guru/results/[attemptId]": [~31,[3]],
		"/login": [~32],
		"/pengawas": [~33,[4]],
		"/pengawas/monitor": [~34,[4]],
		"/pengawas/tokens": [~35,[4]],
		"/siswa": [~36,[5]],
		"/siswa/jadwal": [~37,[5]],
		"/siswa/ujian": [~38,[5]],
		"/siswa/ujian/[attemptId]": [~39],
		"/superadmin": [~40,[6]],
		"/superadmin/accounts": [~41,[6]],
		"/superadmin/admins": [~42,[6]],
		"/superadmin/schools": [~43,[6]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';

export const get_error_template = () => import('../shared/error-template.js').then(m => m.default);