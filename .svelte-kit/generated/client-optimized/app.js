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
	() => import('./nodes/32')
];

export const server_loads = [0,2,3,4,5,6];

export const dictionary = {
		"/": [~7],
		"/admin": [~8,[2]],
		"/admin/bank-soal": [~9,[2]],
		"/admin/bank-soal/[examId]": [~10,[2]],
		"/admin/classes": [~11,[2]],
		"/admin/exams": [~12,[2]],
		"/admin/exams/[id]": [~13,[2]],
		"/admin/results": [~14,[2]],
		"/admin/students": [~15,[2]],
		"/admin/subjects": [~16,[2]],
		"/admin/users": [~17,[2]],
		"/guru": [~18,[3]],
		"/guru/bank-soal": [~19,[3]],
		"/guru/bank-soal/[examId]": [~20,[3]],
		"/guru/penilaian": [~21,[3]],
		"/login": [~22],
		"/pengawas": [~23,[4]],
		"/pengawas/monitor": [~24,[4]],
		"/pengawas/tokens": [~25,[4]],
		"/siswa": [~26,[5]],
		"/siswa/jadwal": [~27,[5]],
		"/siswa/ujian": [~28,[5]],
		"/siswa/ujian/[attemptId]": [~29,[5]],
		"/superadmin": [~30,[6]],
		"/superadmin/admins": [~31,[6]],
		"/superadmin/schools": [~32,[6]]
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