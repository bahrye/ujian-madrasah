import { h as head, k as attr, i as ensure_array_like, e as escape_html, j as attr_class, l as clsx, f as bind_props } from "../../../../chunks/index.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, I as ICONS } from "../../../../chunks/constants.js";
import { S as ScoreDisplay } from "../../../../chunks/ScoreDisplay.js";
import { o as onDestroy } from "../../../../chunks/index-server.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let finishedAttempts;
    let data = $$props["data"];
    let currentTime = /* @__PURE__ */ new Date();
    function formatDateTime(dateStr) {
      if (!dateStr) return "-";
      const str = String(dateStr).replace(" ", "T");
      const date = /* @__PURE__ */ new Date(str + (str.includes("T") && !str.includes("Z") ? "Z" : ""));
      return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).replace(/\./g, ":");
    }
    function calculateRemainingTime(attempt) {
      const submitStr = attempt.submit_time || attempt.updated_at;
      if (!attempt.end_time || !submitStr) return "-";
      const submit = /* @__PURE__ */ new Date(String(submitStr).replace(" ", "T") + (String(submitStr).includes(" ") && !String(submitStr).includes("Z") ? "Z" : ""));
      const targetEnd = /* @__PURE__ */ new Date(String(attempt.end_time).replace(" ", "T") + (String(attempt.end_time).includes(" ") && !String(attempt.end_time).includes("Z") ? "Z" : ""));
      let remainingMs = targetEnd.getTime() - submit.getTime();
      if (remainingMs < 0) remainingMs = 0;
      const totalS = Math.floor(remainingMs / 1e3);
      const h = Math.floor(totalS / 3600);
      const m = Math.floor(totalS % 3600 / 60);
      const s = totalS % 60;
      if (h > 0) return `${h} Jam ${m} Menit ${s} Detik`;
      if (m > 0) return `${m} Menit ${s} Detik`;
      return `${s} Detik`;
    }
    onDestroy(() => {
    });
    finishedAttempts = data.finishedAttempts;
    head("1jypawo", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Hasil Ujian Siswa</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h1 class="text-3xl font-bold text-slate-800 tracking-tight">Hasil Ujian</h1> <p class="text-slate-500 mt-1">Daftar nilai dari ujian yang telah Anda selesaikan</p></div></div> `);
    if (finishedAttempts.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-12 text-center flex flex-col items-center justify-center bg-white shadow-sm border border-slate-200"><div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400 mb-4"><svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.results)}></path></svg></div> <h3 class="text-lg font-bold text-slate-800 mb-1">Belum Ada Hasil</h3> <p class="text-slate-500 max-w-sm">Anda belum menyelesaikan ujian apapun. Hasil ujian akan muncul di sini setelah Anda menyelesaikannya.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-1 gap-4"><!--[-->`);
      const each_array = ensure_array_like(finishedAttempts);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let attempt = each_array[$$index];
        const manual_earned = (attempt.score ?? 0) / 100 * (attempt.total_points || 1) - (attempt.objective_earned_points ?? 0);
        $$renderer2.push(`<div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"><div class="flex flex-col md:flex-row md:items-center gap-6"><div class="flex-1 space-y-3"><div><div class="flex items-center gap-2 mb-1"><span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">${escape_html(attempt.subject || "Tanpa Mapel")}</span> <span${attr_class(clsx(ATTEMPT_STATUS_COLORS[attempt.status]))}>${escape_html(ATTEMPT_STATUS_LABELS[attempt.status])}</span></div> <h3 class="text-xl font-bold text-slate-800 leading-tight">${escape_html(attempt.exam_title)}</h3></div> <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500"><div class="flex items-center gap-1.5"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> ${escape_html((/* @__PURE__ */ new Date(String(attempt.submit_time || attempt.updated_at).replace(" ", "T") + (String(attempt.submit_time || attempt.updated_at).includes(" ") && !String(attempt.submit_time || attempt.updated_at).includes("Z") ? "Z" : ""))).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }))}</div> <div class="flex items-center gap-1.5"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> ${escape_html(attempt.duration_minutes)} Menit</div> <div class="flex items-center gap-1.5"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> ${escape_html(attempt.question_count)} Soal</div></div> <div class="pt-4 mt-2 border-t border-dashed border-slate-200"><span class="inline-block px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-semibold rounded-md uppercase tracking-wider mb-3">Proses Ujian</span> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4"><div><p class="text-xs text-slate-400 font-medium mb-0.5">Tanggal Mulai Ujian</p> <p class="text-sm font-semibold text-slate-700">${escape_html(formatDateTime(attempt.start_time))}</p></div> <div><p class="text-xs text-slate-400 font-medium mb-0.5">Tanggal Selesai Ujian</p> <p class="text-sm font-semibold text-slate-700">${escape_html(formatDateTime(attempt.submit_time || attempt.updated_at))}</p></div> <div><p class="text-xs text-slate-400 font-medium mb-0.5">Sisa Waktu Ujian</p> <p class="text-sm font-semibold text-indigo-600">${escape_html(calculateRemainingTime(attempt))}</p></div></div></div></div> <div class="w-full md:w-auto md:border-l border-t md:border-t-0 border-slate-100 md:pl-6 pt-4 md:pt-0 flex items-center justify-between md:justify-end gap-3 md:gap-5"><div class="text-center"><span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">Otomatis</span> <div class="text-xl font-bold">`);
        ScoreDisplay($$renderer2, { attempt, currentTime, type: "otomatis" });
        $$renderer2.push(`<!----></div></div> <div class="text-slate-200 font-black text-xl mb-1">+</div> <div class="text-center"><span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">Manual</span> <div class="text-xl font-bold">`);
        ScoreDisplay($$renderer2, { attempt, currentTime, type: "manual" });
        $$renderer2.push(`<!----></div></div> <div class="text-slate-200 font-black text-xl mb-1">=</div> <div class="text-right"><span class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block mb-0.5">Nilai Akhir</span> <div class="text-3xl font-black">`);
        ScoreDisplay($$renderer2, { attempt, currentTime, type: "akhir" });
        $$renderer2.push(`<!----></div></div></div></div> <div class="mt-5 pt-4 border-t border-slate-100"><details class="group"><summary class="flex justify-between items-center font-medium cursor-pointer list-none text-xs text-slate-500 hover:text-indigo-600 transition-colors"><span>Lihat Rincian Perhitungan Nilai</span> <span class="transition group-open:rotate-180"><svg fill="none" height="16" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="16"><path d="M6 9l6 6 6-6"></path></svg></span></summary> <div class="text-xs text-slate-600 mt-3 bg-slate-50/70 rounded-xl p-4 space-y-3"><p>Nilai ujian selalu dihitung dan ditampilkan dalam <strong>skala persentase (0-100)</strong>.</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"><div class="bg-white p-3 rounded-lg border border-slate-200"><p class="font-semibold text-slate-800 mb-1.5 border-b border-slate-100 pb-1.5">Poin Otomatis</p> <ul class="space-y-1"><li class="flex justify-between"><span>Poin Mentah Didapat:</span> <strong>${escape_html(attempt.objective_earned_points ?? 0)}</strong></li> <li class="flex justify-between text-slate-400"><span>Poin Mentah Maks:</span> <strong>${escape_html(attempt.objective_max_points ?? 0)}</strong></li> <li class="mt-2 pt-2 border-t border-slate-100 flex justify-between text-indigo-600 font-semibold"><span>Kontribusi ke Nilai Akhir:</span> <span>${escape_html(((attempt.objective_earned_points ?? 0) / (attempt.total_points || 1) * 100).toFixed(1).replace(/\.0$/, ""))}</span></li></ul></div> <div class="bg-white p-3 rounded-lg border border-slate-200"><p class="font-semibold text-slate-800 mb-1.5 border-b border-slate-100 pb-1.5">Poin Manual (Essay/Isian)</p> <ul class="space-y-1">`);
        if (attempt.show_score_type === "objective_only") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<li class="text-center text-slate-400 italic py-2">Disembunyikan</li>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<li class="flex justify-between"><span>Poin Mentah Didapat:</span> <strong>${escape_html(manual_earned.toFixed(1).replace(/\.0$/, ""))}</strong></li> <li class="flex justify-between text-slate-400"><span>Poin Mentah Maks:</span> <strong>${escape_html((attempt.total_points || 1) - (attempt.objective_max_points ?? 0))}</strong></li> <li class="mt-2 pt-2 border-t border-slate-100 flex justify-between text-indigo-600 font-semibold"><span>Kontribusi ke Nilai Akhir:</span> <span>${escape_html((manual_earned / (attempt.total_points || 1) * 100).toFixed(1).replace(/\.0$/, ""))}</span></li>`);
        }
        $$renderer2.push(`<!--]--></ul></div></div> <div class="bg-indigo-50/50 border border-indigo-100 p-3 rounded-lg text-indigo-800 flex justify-between items-center"><div><p class="font-semibold text-sm">Rumus Total Nilai Akhir</p> <p class="mt-0.5 text-indigo-600/80">(Total Poin Mentah Didapat ÷ Total Semua Poin Maksimal) × 100</p></div> <div class="text-2xl font-black">`);
        if (attempt.show_score_type === "objective_only") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`${escape_html(((attempt.objective_earned_points ?? 0) / (attempt.total_points || 1) * 100).toFixed(1).replace(/\.0$/, ""))}`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`${escape_html(attempt.score ?? 0)}`);
        }
        $$renderer2.push(`<!--]--></div></div></div></details></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
