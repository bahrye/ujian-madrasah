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
	() => import('./nodes/26')
];

export const server_loads = [0,2,3,4,5,6];

export const dictionary = {
		"/": [~7],
		"/admin": [~8,[2]],
		"/admin/exams": [~9,[2]],
		"/admin/exams/[id]": [~10,[2]],
		"/admin/results": [~11,[2]],
		"/admin/users": [~12,[2]],
		"/guru": [~13,[3]],
		"/guru/bank-soal": [~14,[3]],
		"/guru/bank-soal/[examId]": [~15,[3]],
		"/guru/penilaian": [~16,[3]],
		"/login": [~17],
		"/pengawas": [~18,[4]],
		"/pengawas/monitor": [~19,[4]],
		"/pengawas/tokens": [~20,[4]],
		"/siswa": [~21,[5]],
		"/siswa/ujian": [~22,[5]],
		"/siswa/ujian/[attemptId]": [~23,[5]],
		"/superadmin": [~24,[6]],
		"/superadmin/admins": [~25,[6]],
		"/superadmin/schools": [~26,[6]]
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