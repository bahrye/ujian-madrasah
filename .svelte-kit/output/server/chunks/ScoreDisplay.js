import { e as escape_html, j as attr_class, l as clsx, f as bind_props } from "./index.js";
function ScoreDisplay($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let showScoreType, isManual, isAfterTypeEndTime, isAfterEndTime, isObjectiveOnly, typeEndTime, endTime, isScoreVisible, statusLabel;
    let attempt = $$props["attempt"];
    let currentTime = $$props["currentTime"];
    function parseDate(dateStr) {
      if (!dateStr) return null;
      const str = String(dateStr).replace(" ", "T");
      return /* @__PURE__ */ new Date(str + (str.includes("T") && !str.includes("Z") ? "Z" : ""));
    }
    showScoreType = attempt.show_score_type || "after_submit";
    isManual = showScoreType === "manual";
    isAfterTypeEndTime = showScoreType === "after_type_end_time";
    isAfterEndTime = showScoreType === "after_end_time";
    isObjectiveOnly = showScoreType === "objective_only";
    typeEndTime = parseDate(attempt.exam_type_end_time);
    endTime = parseDate(attempt.exam_end_time);
    isScoreVisible = (() => {
      if (isManual) return attempt.is_score_released === 1;
      if (isAfterTypeEndTime) return typeEndTime && currentTime >= typeEndTime;
      if (isAfterEndTime) return endTime && currentTime >= endTime;
      return true;
    })();
    statusLabel = (() => {
      if (isManual && attempt.is_score_released !== 1) return "Belum dirilis";
      if (isAfterTypeEndTime && (!typeEndTime || currentTime < typeEndTime)) return "Menunggu jadwal tipe ujian";
      if (isAfterEndTime && (!endTime || currentTime < endTime)) return "Menunggu jadwal berakhir";
      return "";
    })();
    if (attempt.status !== "selesai" && attempt.status !== "waktu_habis") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-slate-400 font-normal">-</span>`);
    } else if (!isScoreVisible) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<span class="text-slate-400 text-xs font-normal font-sans bg-slate-100 px-2 py-1 rounded whitespace-nowrap">${escape_html(statusLabel)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      if (isObjectiveOnly) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span${attr_class(clsx((attempt.objective_score ?? 0) >= 70 ? "text-emerald-600" : "text-rose-600"))} title="Nilai Objektif (Tanpa Isian &amp; Essay)">${escape_html(attempt.objective_score != null ? attempt.objective_score.toFixed(1) : "-")}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span${attr_class(clsx((attempt.score ?? 0) >= 70 ? "text-emerald-600" : "text-rose-600"))}>${escape_html(attempt.score != null ? attempt.score.toFixed(1) : "-")}</span>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { attempt, currentTime });
  });
}
export {
  ScoreDisplay as S
};
