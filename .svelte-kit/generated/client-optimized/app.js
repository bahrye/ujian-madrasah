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
	() => import('./nodes/57'),
	() => import('./nodes/58'),
	() => import('./nodes/59'),
	() => import('./nodes/60'),
	() => import('./nodes/61'),
	() => import('./nodes/62'),
	() => import('./nodes/63'),
	() => import('./nodes/64'),
	() => import('./nodes/65'),
	() => import('./nodes/66'),
	() => import('./nodes/67')
];

export const server_loads = [0,2,3,4,5,6,7];

export const dictionary = {
		"/": [~8],
		"/admin": [~9,[2]],
		"/admin/bank-soal": [~10,[2]],
		"/admin/bank-soal/[examId]": [~11,[2]],
		"/admin/bank-soal/[examId]/preview": [~12],
		"/admin/classes": [~13,[2]],
		"/admin/exams": [~14,[2]],
		"/admin/exams/type/[typeId]": [~15,[2]],
		"/admin/exams/[id]": [~16,[2]],
		"/admin/media-bank": [~17,[2]],
		"/admin/monitor": [~18,[2]],
		"/admin/papan-peringkat": [~19,[2]],
		"/admin/papan-peringkat/type/[typeId]": [~20,[2]],
		"/admin/papan-peringkat/type/[typeId]/exams": [~21,[2]],
		"/admin/papan-peringkat/[examId]": [~22,[2]],
		"/admin/results": [~23,[2]],
		"/admin/results/[attemptId]": [~24,[2]],
		"/admin/school-profile": [~25,[2]],
		"/admin/students": [~26,[2]],
		"/admin/subjects": [~27,[2]],
		"/admin/tokens": [~28,[2]],
		"/admin/users": [~29,[2]],
		"/guru": [~30,[3]],
		"/guru/bank-soal": [~31,[3]],
		"/guru/bank-soal/[examId]": [~32,[3]],
		"/guru/bank-soal/[examId]/preview": [~33],
		"/guru/media-bank": [~34,[3]],
		"/guru/papan-peringkat": [~35,[3]],
		"/guru/papan-peringkat/type/[typeId]": [~36,[3]],
		"/guru/papan-peringkat/type/[typeId]/exams": [~37,[3]],
		"/guru/papan-peringkat/[examId]": [~38,[3]],
		"/guru/penilaian": [~39,[3]],
		"/guru/remedial": [~40,[3]],
		"/guru/remedial/[examId]": [~41,[3]],
		"/guru/results": [~42,[3]],
		"/guru/results/[attemptId]": [~43,[3]],
		"/login": [~44],
		"/pengawas": [~45,[4]],
		"/pengawas/jadwal/saya": [~46,[4]],
		"/pengawas/jadwal/semua": [~47,[4]],
		"/pengawas/monitor": [~48,[4]],
		"/pengawas/tata-tertib": [49,[4]],
		"/pengawas/tokens": [~50,[4]],
		"/print/berita-acara/[exam_id]": [~51,[5]],
		"/print/kartu/[exam_id]": [~52,[5]],
		"/print/kehadiran/[exam_id]": [~53,[5]],
		"/siswa": [~54,[6]],
		"/siswa/hasil-ujian": [~55,[6]],
		"/siswa/jadwal": [~56,[6]],
		"/siswa/papan-peringkat": [~57,[6]],
		"/siswa/papan-peringkat/type/[typeId]": [~58,[6]],
		"/siswa/papan-peringkat/type/[typeId]/exams": [~59,[6]],
		"/siswa/papan-peringkat/[examId]": [~60,[6]],
		"/siswa/tata-tertib": [61,[6]],
		"/siswa/ujian": [~62,[6]],
		"/siswa/ujian/[attemptId]": [~63],
		"/superadmin": [~64,[7]],
		"/superadmin/accounts": [~65,[7]],
		"/superadmin/admins": [~66,[7]],
		"/superadmin/schools": [~67,[7]]
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