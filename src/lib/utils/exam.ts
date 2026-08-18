export function formatExamTitle(params: {
	title?: string | null;
	examTypeCode?: string | null;
	subjectName?: string | null;
	className?: string | null;
	classLevel?: string | number | null;
}): string {
	const code = params.examTypeCode?.trim();
	const subject = params.subjectName?.trim();
	const cls = params.className?.trim() || (params.classLevel ? String(params.classLevel).trim() : '');

	let baseTitle = params.title?.trim() || '';

	if (code && subject) {
		baseTitle = `${code} - ${subject}`;
	} else if (!baseTitle && subject) {
		baseTitle = subject;
	}

	if (cls && baseTitle) {
		if (!baseTitle.includes(`(${cls})`)) {
			baseTitle = `${baseTitle} (${cls})`;
		}
	}

	return baseTitle || 'Ujian Online';
}

/**
 * Normalizes short answer strings for smart comparison:
 * - Strips HTML tags and entities
 * - Converts to lower case
 * - Trims leading/trailing whitespace and punctuation
 * - Normalizes multiple spaces into a single space
 */
export function normalizeShortAnswer(text: string | null | undefined): string {
	if (!text) return '';
	return String(text)
		.replace(/<[^>]*>/g, '') // remove html tags
		.replace(/&nbsp;/g, ' ')
		.trim()
		.toLowerCase()
		.replace(/\s+/g, ' ') // collapse consecutive whitespace
		.replace(/^[.,'"“”‘’`\s\-_:;]+|[.,'"“”‘’`\s\-_:;]+$/g, ''); // remove trailing/leading punctuation
}

/**
 * Checks if student answer matches the correct answer key.
 * Supports:
 * - Direct strings ("Makassar" vs "makassar")
 * - JSON string arrays (["Makassar", "Ujung Pandang"])
 * - Delimited alternatives ("Makassar / Ujung Pandang", "Makassar; Ujung Pandang", "Makassar, Ujung Pandang")
 */
export function matchShortAnswer(studentAnswer: string | null | undefined, correctAnswerRaw: any): boolean {
	if (!studentAnswer) return false;
	const cleanStudent = normalizeShortAnswer(studentAnswer);
	if (!cleanStudent) return false;

	// Extract candidate keys
	let keys: string[] = [];
	if (Array.isArray(correctAnswerRaw)) {
		keys = correctAnswerRaw.map(k => String(k));
	} else if (typeof correctAnswerRaw === 'string') {
		let parsed: any = correctAnswerRaw;
		try {
			parsed = JSON.parse(correctAnswerRaw);
		} catch {}

		if (Array.isArray(parsed)) {
			keys = parsed.map(k => String(k));
		} else if (typeof parsed === 'string') {
			// Check if delimited by / or ; or , (e.g. "Makassar / Ujung Pandang")
			if (parsed.includes('/') || parsed.includes(';')) {
				keys = parsed.split(/[/;]/).map(s => s.trim());
			} else if (parsed.includes(',') && isNaN(Number(parsed.replace(',', '.')))) {
				keys = parsed.split(',').map(s => s.trim());
			} else {
				keys = [parsed];
			}
		} else if (parsed != null) {
			keys = [String(parsed)];
		} else {
			keys = [correctAnswerRaw];
		}
	} else if (correctAnswerRaw != null) {
		keys = [String(correctAnswerRaw)];
	}

	for (const key of keys) {
		const cleanKey = normalizeShortAnswer(key);
		if (!cleanKey) continue;
		if (cleanStudent === cleanKey) return true;
	}

	return false;
}
