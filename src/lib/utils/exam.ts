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
