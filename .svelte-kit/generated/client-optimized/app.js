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
	() => import('./nodes/46'),
	() => import('./nodes/47'),
	() => import('./nodes/48'),
	() => import('./nodes/49'),
	() => import('./nodes/50'),
	() => import('./nodes/51'),
	() => import('./nodes/52'),
	() => import('./nodes/53'),
	() => import('./nodes/54'),
	() => import('./nodes/55'),
	() => import('./nodes/56'),
	() => import('./nodes/57')
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
		"/admin/papan-peringkat": [~17,[2]],
		"/admin/papan-peringkat/type/[typeId]": [~18,[2]],
		"/admin/papan-peringkat/[examId]": [~19,[2]],
		"/admin/results": [~20,[2]],
		"/admin/results/[attemptId]": [~21,[2]],
		"/admin/school-profile": [~22,[2]],
		"/admin/students": [~23,[2]],
		"/admin/subjects": [~24,[2]],
		"/admin/users": [~25,[2]],
		"/guru": [~26,[3]],
		"/guru/bank-soal": [~27,[3]],
		"/guru/bank-soal/[examId]": [~28,[3]],
		"/guru/bank-soal/[examId]/preview": [~29],
		"/guru/media-bank": [~30,[3]],
		"/guru/papan-peringkat": [~31,[3]],
		"/guru/papan-peringkat/type/[typeId]": [~32,[3]],
		"/guru/papan-peringkat/[examId]": [~33,[3]],
		"/guru/penilaian": [~34,[3]],
		"/guru/remedial": [~35,[3]],
		"/guru/remedial/[examId]": [~36,[3]],
		"/guru/results": [~37,[3]],
		"/guru/results/[attemptId]": [~38,[3]],
		"/login": [~39],
		"/pengawas": [~40,[4]],
		"/pengawas/jadwal/saya": [~41,[4]],
		"/pengawas/jadwal/semua": [~42,[4]],
		"/pengawas/monitor": [~43,[4]],
		"/pengawas/tata-tertib": [44,[4]],
		"/pengawas/tokens": [~45,[4]],
		"/siswa": [~46,[5]],
		"/siswa/jadwal": [~47,[5]],
		"/siswa/papan-peringkat": [~48,[5]],
		"/siswa/papan-peringkat/type/[typeId]": [~49,[5]],
		"/siswa/papan-peringkat/[examId]": [~50,[5]],
		"/siswa/tata-tertib": [51,[5]],
		"/siswa/ujian": [~52,[5]],
		"/siswa/ujian/[attemptId]": [~53],
		"/superadmin": [~54,[6]],
		"/superadmin/accounts": [~55,[6]],
		"/superadmin/admins": [~56,[6]],
		"/superadmin/schools": [~57,[6]]
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