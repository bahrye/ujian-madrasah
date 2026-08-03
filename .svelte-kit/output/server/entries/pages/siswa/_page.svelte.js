import { h as head, e as escape_html, i as attr, a as stringify, c as ensure_array_like, d as attr_class, j as clsx, b as bind_props } from "../../../chunks/index.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, I as ICONS } from "../../../chunks/constants.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeExams, myAttempts, activeAttempt;
    let data = $$props["data"];
    let currentTime = /* @__PURE__ */ new Date();
    onDestroy(() => {
    });
    function parseDate(dateStr) {
      if (!dateStr) return /* @__PURE__ */ new Date();
      if (dateStr.includes(" ")) {
        return /* @__PURE__ */ new Date(dateStr.replace(" ", "T") + (dateStr.includes("Z") ? "" : "Z"));
      }
      return new Date(dateStr);
    }
    function formatTimeRange(startStr, endStr) {
      if (!startStr) return "--:--";
      const start = parseDate(startStr);
      const startFormatted = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(start);
      if (!endStr) return `${startFormatted} - Selesai`;
      const end = parseDate(endStr);
      const endFormatted = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(end);
      if (start.getDate() === end.getDate() && start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${startFormatted} - ${endFormatted}`;
      }
      const startDateFormatted = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(start);
      const endDateFormatted = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(end);
      return `${startDateFormatted} ${startFormatted} - ${endDateFormatted} ${endFormatted}`;
    }
    function getCountdownString(startStr, current) {
      const start = parseDate(startStr);
      const diff = start.getTime() - current.getTime();
      if (diff <= 0) return null;
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    function getAttemptRemainingTime(endTimeStr, current) {
      const end = parseDate(endTimeStr);
      const diff = end.getTime() - current.getTime();
      if (diff <= 0) return "00:00:00";
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    activeExams = data.activeExams.filter((exam) => {
      const now = /* @__PURE__ */ new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (exam.end_time && parseDate(exam.end_time) <= now) return false;
      if (exam.start_time) {
        const start = parseDate(exam.start_time);
        const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        if (startDate > today) return false;
      }
      return true;
    });
    myAttempts = data.myAttempts;
    activeAttempt = data.activeAttempt;
    head("1sjgise", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard Siswa — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Dashboard Siswa</h1> <p class="text-sm text-slate-500 mt-1">Selamat datang, ${escape_html(data.user.name)}.</p></div> `);
    if (activeAttempt) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-pulse"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg></div> <div class="flex-1"><h3 class="font-bold text-amber-800">Ujian Sedang Berlangsung</h3> <p class="text-sm text-amber-600">${escape_html(activeAttempt.exam_title)}</p></div> <a${attr("href", `/siswa/ujian/${stringify(activeAttempt.id)}`)} class="btn-warning">Lanjutkan <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronRight)}></path></svg></a></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div><h2 class="text-lg font-bold text-slate-800 mb-3">Ujian Tersedia</h2> `);
    if (activeExams.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-8 text-center text-slate-400"><svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <p>Tidak ada ujian yang tersedia saat ini.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><!--[-->`);
      const each_array = ensure_array_like(activeExams);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let exam = each_array[$$index];
        $$renderer2.push(`<div class="card-hover p-5 flex flex-col h-full"><div class="flex items-start justify-between mb-3"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg></div> <span class="badge-success">Tersedia</span></div> <h3 class="font-bold text-slate-800">${escape_html(exam.title)}</h3> <p class="text-sm text-slate-500 mt-1 mb-4">${escape_html(exam.subject || "Umum")}</p> <div class="space-y-2 mb-4 mt-auto"><div class="flex items-center text-sm text-slate-600"><svg class="w-4 h-4 mr-2 text-slate-400 min-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> <span>Pukul: ${escape_html(formatTimeRange(exam.start_time, exam.end_time))}</span></div> <div class="flex items-center text-sm text-slate-600"><svg class="w-4 h-4 mr-2 text-slate-400 min-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <span>Durasi: ${escape_html(exam.duration_minutes)} menit</span></div> <div class="flex items-center text-sm text-slate-600"><svg class="w-4 h-4 mr-2 text-slate-400 min-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> <span>Soal: ${escape_html(exam.question_count)}</span></div> <div class="flex items-center text-sm text-slate-600"><svg class="w-4 h-4 mr-2 text-slate-400 min-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.users)}></path></svg> <span class="line-clamp-1"${attr("title", exam.proctors || "Belum ada pengawas")}>Pengawas: ${escape_html(exam.proctors || "-")}</span></div></div> <div class="pt-4 border-t border-slate-100 mt-auto">`);
        if (myAttempts.some((a) => a.exam_id === exam.id && ["selesai", "waktu_habis"].includes(a.status))) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<button disabled="" class="btn w-full justify-center bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed shadow-none"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Selesai</button>`);
        } else if (exam.start_time && getCountdownString(exam.start_time, currentTime)) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<button disabled="" class="btn w-full justify-center bg-slate-800 text-white cursor-not-allowed flex gap-2 border-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_2px_4px_rgba(0,0,0,0.3)]"><svg class="w-5 h-5 animate-spin-slow opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> <span class="font-mono text-lg tracking-widest font-bold">${escape_html(getCountdownString(exam.start_time, currentTime))}</span></button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<a${attr("href", `/siswa/ujian?exam_id=${stringify(exam.id)}`)} class="btn btn-primary w-full justify-center shadow-lg shadow-indigo-500/30">Buka Halaman Ujian</a>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div><h2 class="text-lg font-bold text-slate-800 mb-3">Riwayat Ujian</h2> `);
    if (myAttempts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-6 text-center text-slate-400 text-sm">Belum ada riwayat ujian.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="card overflow-hidden"><div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Ujian</th><th>Mapel</th><th>Status</th><th>Sisa Waktu</th><th>Nilai</th><th>Tanggal</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(myAttempts);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let a = each_array_1[$$index_1];
        $$renderer2.push(`<tr><td class="font-medium">${escape_html(a.exam_title)}</td><td class="text-slate-500">${escape_html(a.subject || "-")}</td><td><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[a.status]))}>${escape_html(ATTEMPT_STATUS_LABELS[a.status])}</span></td><td class="font-mono text-sm">`);
        if (a.status === "mengerjakan") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="inline-flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> ${escape_html(getAttemptRemainingTime(a.end_time, currentTime))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="text-slate-400">-</span>`);
        }
        $$renderer2.push(`<!--]--></td><td class="font-bold">`);
        if (a.status !== "selesai") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-slate-400 font-normal">-</span>`);
        } else if ((a.show_score_type || "after_submit") === "manual" && a.is_score_released !== 1) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span class="text-slate-400 text-xs font-normal font-sans bg-slate-100 px-2 py-1 rounded whitespace-nowrap">Belum dirilis</span>`);
        } else if ((a.show_score_type || "after_submit") === "after_end_time" && a.exam_end_time && currentTime < parseDate(a.exam_end_time)) {
          $$renderer2.push("<!--[2-->");
          $$renderer2.push(`<span class="text-slate-400 text-xs font-normal font-sans bg-slate-100 px-2 py-1 rounded whitespace-nowrap">Menunggu jadwal berakhir</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          if ((a.show_score_type || "after_submit") === "objective_only") {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span${attr_class(clsx((a.objective_score ?? 0) >= 70 ? "text-emerald-600" : "text-rose-600"))} title="Nilai Objektif (Tanpa Isian &amp; Essay)">${escape_html(a.objective_score != null ? a.objective_score.toFixed(1) : "-")}</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span${attr_class(clsx((a.score ?? 0) >= 70 ? "text-emerald-600" : "text-rose-600"))}>${escape_html(a.score != null ? a.score.toFixed(1) : "-")}</span>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></td><td class="text-xs text-slate-500">${escape_html((/* @__PURE__ */ new Date(String(a.created_at).replace(" ", "T") + (String(a.created_at).includes("Z") ? "" : "Z"))).toLocaleDateString("id-ID"))}</td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
