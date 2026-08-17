function formatExamTitle(params) {
  const code = params.examTypeCode?.trim();
  const subject = params.subjectName?.trim();
  const cls = params.className?.trim() || (params.classLevel ? String(params.classLevel).trim() : "");
  let baseTitle = params.title?.trim() || "";
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
  return baseTitle || "Ujian Online";
}
export {
  formatExamTitle as f
};
