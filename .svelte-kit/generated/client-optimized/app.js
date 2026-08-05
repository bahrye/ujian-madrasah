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
	() => import('./nodes/43'),
	() => import('./nodes/44'),
	() => import('./nodes/45'),
	() => import('./nodes/46')
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
		"/admin/exams/type/[typeId]": [~14,[2]],
		"/admin/exams/[id]": [~15,[2]],
		"/admin/media-bank": [~16,[2]],
		"/admin/results": [~17,[2]],
		"/admin/results/[attemptId]": [~18,[2]],
		"/admin/school-profile": [~19,[2]],
		"/admin/students": [~20,[2]],
		"/admin/subjects": [~21,[2]],
		"/admin/users": [~22,[2]],
		"/guru": [~23,[3]],
		"/guru/bank-soal": [~24,[3]],
		"/guru/bank-soal/[examId]": [~25,[3]],
		"/guru/bank-soal/[examId]/preview": [~26],
		"/guru/media-bank": [~27,[3]],
		"/guru/penilaian": [~28,[3]],
		"/guru/remedial": [~29,[3]],
		"/guru/remedial/[examId]": [~30,[3]],
		"/guru/results": [~31,[3]],
		"/guru/results/[attemptId]": [~32,[3]],
		"/login": [~33],
		"/pengawas": [~34,[4]],
		"/pengawas/monitor": [~35,[4]],
		"/pengawas/tata-tertib": [36,[4]],
		"/pengawas/tokens": [~37,[4]],
		"/siswa": [~38,[5]],
		"/siswa/jadwal": [~39,[5]],
		"/siswa/tata-tertib": [40,[5]],
		"/siswa/ujian": [~41,[5]],
		"/siswa/ujian/[attemptId]": [~42],
		"/superadmin": [~43,[6]],
		"/superadmin/accounts": [~44,[6]],
		"/superadmin/admins": [~45,[6]],
		"/superadmin/schools": [~46,[6]]
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