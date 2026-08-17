import { h as head, k as attr, i as ensure_array_like, e as escape_html, c as stringify, f as bind_props } from "../../../../chunks/index.js";
import { I as ICONS } from "../../../../chunks/constants.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let filteredExams;
    let data = $$props["data"];
    let searchQuery = "";
    filteredExams = data.exams.filter((exam) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = (exam.title || "").toLowerCase().includes(q);
      const subjectMatch = (exam.subject || "").toLowerCase().includes(q);
      return titleMatch || subjectMatch;
    });
    head("1jq38cd", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Bank Soal — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-slate-800">Bank Soal</h1> <p class="text-sm text-slate-500 mt-1">Pilih ujian untuk mengelola soal</p></div> <div class="relative w-full sm:w-72"><input type="text"${attr("value", searchQuery)} placeholder="Cari ujian atau mapel..." class="input pl-10 pr-9 py-2 w-full text-sm rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"/> <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`);
    const each_array = ensure_array_like(filteredExams);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let exam = each_array[$$index];
        $$renderer2.push(`<div class="card-hover p-5 group flex flex-col justify-between cursor-pointer" role="button" tabindex="0"><div><div class="flex items-start justify-between mb-2"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg></div> `);
        if (exam.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-success">Aktif</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <h3 class="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">${escape_html(exam.title)}</h3> <p class="text-xs text-slate-500 mt-1">${escape_html(exam.subject || "Umum")} · ${escape_html(exam.duration_minutes)} menit</p></div> <div class="mt-3 flex items-center justify-between"><div class="flex items-center gap-1 text-sm font-semibold text-indigo-600"><span>${escape_html(exam.question_count)} soal</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronRight)}></path></svg></div> `);
        if (exam.question_count > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="flex items-center gap-1"><a${attr("href", `/admin/exams/${stringify(exam.id)}/analisis`)} class="btn-sm btn-ghost p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors z-10 relative" title="Analisis Butir Soal"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></a> <a${attr("href", `/admin/results?exam_id=${stringify(exam.id)}`)} class="btn-sm btn-ghost p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors z-10 relative" title="Analisis Jawaban Siswa"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.09 1.976 1.053 1.976 2.188V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.25c0-1.135.845-2.098 1.976-2.188.374-.03.748-.057 1.124-.08M9 14.25l2 2 4-4"></path></svg></a> <a${attr("href", `/admin/bank-soal/${stringify(exam.id)}/preview?from=bank`)} class="btn-sm btn-ghost p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors z-10 relative" title="Preview Soal"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></a> <button type="button" class="btn-sm btn-ghost p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors z-10 relative" title="Salin Soal"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"></path></svg></button></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="col-span-full text-center py-12 text-slate-400">Belum ada ujian. Hubungi admin untuk membuat ujian.</div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
