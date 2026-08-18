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
function normalizeShortAnswer(text) {
  if (!text) return "";
  return String(text).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().toLowerCase().replace(/\s+/g, " ").replace(/^[.,'"“”‘’`\s\-_:;]+|[.,'"“”‘’`\s\-_:;]+$/g, "");
}
function matchShortAnswer(studentAnswer, correctAnswerRaw) {
  if (!studentAnswer) return false;
  const cleanStudent = normalizeShortAnswer(studentAnswer);
  if (!cleanStudent) return false;
  let keys = [];
  if (Array.isArray(correctAnswerRaw)) {
    keys = correctAnswerRaw.map((k) => String(k));
  } else if (typeof correctAnswerRaw === "string") {
    let parsed = correctAnswerRaw;
    try {
      parsed = JSON.parse(correctAnswerRaw);
    } catch {
    }
    if (Array.isArray(parsed)) {
      keys = parsed.map((k) => String(k));
    } else if (typeof parsed === "string") {
      if (parsed.includes("/") || parsed.includes(";")) {
        keys = parsed.split(/[/;]/).map((s) => s.trim());
      } else if (parsed.includes(",") && isNaN(Number(parsed.replace(",", ".")))) {
        keys = parsed.split(",").map((s) => s.trim());
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
export {
  formatExamTitle as f,
  matchShortAnswer as m
};
