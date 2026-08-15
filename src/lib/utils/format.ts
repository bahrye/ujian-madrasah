export interface ProctorItem {
	label: string;
	name: string;
}

/**
 * Memformat string daftar pengawas (dipisahkan ||) menjadi list objek Pengawas dengan label
 * Jika 1 pengawas -> label: "Pengawas Ruang"
 * Jika >= 2 pengawas -> label: "Pengawas 1", "Pengawas 2", dst.
 * Gelar akademis dengan koma (seperti "AYU ANDIRA, S.Pd") aman dan tidak akan terpisah.
 */
export function parseProctors(proctorsInput: string | string[] | null | undefined): ProctorItem[] {
	if (!proctorsInput) return [{ label: 'Pengawas Ruang', name: '-' }];

	let names: string[] = [];
	if (Array.isArray(proctorsInput)) {
		names = proctorsInput.map((s) => s.trim()).filter(Boolean);
	} else if (typeof proctorsInput === 'string') {
		const str = proctorsInput.trim();
		if (!str) return [{ label: 'Pengawas Ruang', name: '-' }];

		if (str.includes('||')) {
			names = str.split('||').map((s) => s.trim()).filter(Boolean);
		} else {
			// Tanpa delimiter '||', dianggap 1 nama utuh meski memiliki koma gelar (contoh: "AYU ANDIRA, S.Pd")
			names = [str];
		}
	}

	if (names.length === 0) {
		return [{ label: 'Pengawas Ruang', name: '-' }];
	}

	if (names.length === 1) {
		return [{ label: 'Pengawas Ruang', name: names[0] }];
	}

	return names.map((name, idx) => ({
		label: `Pengawas ${idx + 1}`,
		name
	}));
}

/**
 * Memformat daftar pengawas menjadi string tunggal untuk tampilan ringkas (misal: "Pengawas 1: A | Pengawas 2: B")
 */
export function formatProctorsText(proctorsInput: string | string[] | null | undefined): string {
	const list = parseProctors(proctorsInput);
	return list.map((p) => `${p.label}: ${p.name}`).join(' | ');
}
