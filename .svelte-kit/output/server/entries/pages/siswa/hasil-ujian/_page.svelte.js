import { h as head, k as attr, i as ensure_array_like, e as escape_html, j as attr_class, l as clsx, f as bind_props } from "../../../../chunks/index.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, I as ICONS } from "../../../../chunks/constants.js";
import { S as ScoreDisplay } from "../../../../chunks/ScoreDisplay.js";
import { o as onDestroy } from "../../../../chunks/index-server.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let finishedAttempts;
    let data = $$props["data"];
    let currentTime = /* @__PURE__ */ new Date();
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
        $$renderer2.push(`<div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-shadow"><div class="flex-1 space-y-3"><div><div class="flex items-center gap-2 mb-1"><span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">${escape_html(attempt.subject || "Tanpa Mapel")}</span> <span${attr_class(clsx(ATTEMPT_STATUS_COLORS[attempt.status]))}>${escape_html(ATTEMPT_STATUS_LABELS[attempt.status])}</span></div> <h3 class="text-xl font-bold text-slate-800 leading-tight">${escape_html(attempt.exam_title)}</h3></div> <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500"><div class="flex items-center gap-1.5"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> ${escape_html((/* @__PURE__ */ new Date(String(attempt.submit_time || attempt.updated_at).replace(" ", "T") + (String(attempt.submit_time || attempt.updated_at).includes(" ") && !String(attempt.submit_time || attempt.updated_at).includes("Z") ? "Z" : ""))).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }))}</div> <div class="flex items-center gap-1.5"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> ${escape_html(attempt.duration_minutes)} Menit</div> <div class="flex items-center gap-1.5"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> ${escape_html(attempt.question_count)} Soal</div></div></div> <div class="md:w-auto w-full md:border-l border-t md:border-t-0 border-slate-100 md:pl-6 pt-4 md:pt-0 flex flex-col md:items-end gap-1"><span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nilai Akhir</span> <div class="text-3xl font-black">`);
        ScoreDisplay($$renderer2, { attempt, currentTime });
        $$renderer2.push(`<!----></div></div></div>`);
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
