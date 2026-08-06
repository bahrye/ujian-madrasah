import { m as fallback, e as escape_html, j as attr_class, l as clsx, f as bind_props } from "./index.js";
function ScoreDisplay($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let showScoreType, isManual, isAfterTypeEndTime, isAfterEndTime, isObjectiveOnly, typeEndTime, endTime, isScoreVisible, statusLabel, total_points, objective_max, objective_raw, akhir_raw, manual_raw, otomatis, akhir, manual;
    let attempt = $$props["attempt"];
    let currentTime = $$props["currentTime"];
    let type = fallback($$props["type"], "akhir");
    function parseDate(dateStr) {
      if (!dateStr) return null;
      const str = String(dateStr).replace(" ", "T");
      return /* @__PURE__ */ new Date(str + (str.includes("T") && !str.includes("Z") ? "Z" : ""));
    }
    function formatScore(score) {
      if (score == null) return "-";
      return score.toFixed(1).replace(/\.0$/, "");
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
    total_points = attempt.total_points || 1;
    objective_max = attempt.objective_max_points || 0;
    objective_raw = (attempt.objective_score ?? 0) / 100 * objective_max;
    akhir_raw = (attempt.score ?? 0) / 100 * total_points;
    manual_raw = akhir_raw - objective_raw;
    otomatis = objective_raw / total_points * 100;
    akhir = attempt.score ?? 0;
    manual = isObjectiveOnly ? null : manual_raw / total_points * 100;
    if (attempt.status !== "selesai" && attempt.status !== "waktu_habis") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-slate-400 font-normal">-</span>`);
    } else if (!isScoreVisible) {
      $$renderer2.push("<!--[1-->");
      if (type === "akhir") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-slate-400 text-xs font-normal font-sans bg-slate-100 px-2 py-1 rounded whitespace-nowrap">${escape_html(statusLabel)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span class="text-slate-400 font-normal">-</span>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      if (type === "otomatis") {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span${attr_class(clsx(otomatis >= 70 ? "text-emerald-600" : "text-rose-600"))}>${escape_html(formatScore(otomatis))}</span>`);
      } else if (type === "manual") {
        $$renderer2.push("<!--[1-->");
        if (manual === null) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-slate-400 font-normal" title="Disembunyikan">-</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-indigo-600 font-semibold">${escape_html(formatScore(manual))}</span>`);
        }
        $$renderer2.push(`<!--]-->`);
      } else if (type === "akhir") {
        $$renderer2.push("<!--[2-->");
        if (isObjectiveOnly) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span${attr_class(clsx(otomatis >= 70 ? "text-emerald-600" : "text-rose-600"))} title="Nilai Objektif (Tanpa Isian &amp; Essay)">${escape_html(formatScore(otomatis))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span${attr_class(clsx(akhir >= 70 ? "text-emerald-600" : "text-rose-600"))}>${escape_html(formatScore(akhir))}</span>`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { attempt, currentTime, type });
  });
}
export {
  ScoreDisplay as S
};
