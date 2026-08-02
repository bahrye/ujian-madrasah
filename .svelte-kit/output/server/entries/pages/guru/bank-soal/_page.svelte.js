import { h as head, c as ensure_array_like, i as attr, a as stringify, e as escape_html, b as bind_props } from "../../../../chunks/index.js";
import { I as ICONS } from "../../../../chunks/constants.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    head("y8zzft", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Bank Soal — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Bank Soal</h1> <p class="text-sm text-slate-500 mt-1">Pilih ujian untuk mengelola soal</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`);
    const each_array = ensure_array_like(data.exams);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let exam = each_array[$$index];
        $$renderer2.push(`<a${attr("href", `/guru/bank-soal/${stringify(exam.id)}`)} class="card-hover p-5 group flex flex-col justify-between"><div><div class="flex items-start justify-between mb-2"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg></div> `);
        if (exam.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-success">Aktif</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <h3 class="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">${escape_html(exam.title)}</h3> <p class="text-xs text-slate-500 mt-1">${escape_html(exam.subject || "Umum")} · ${escape_html(exam.duration_minutes)} menit</p></div> <div class="mt-3 flex items-center justify-between"><div class="flex items-center gap-1 text-sm font-semibold text-indigo-600"><span>${escape_html(exam.question_count)} soal</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronRight)}></path></svg></div> `);
        if (exam.question_count > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<button type="button" class="btn-sm btn-ghost p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors z-10 relative" title="Salin Soal"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"></path></svg></button>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></a>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="col-span-full text-center py-12 text-slate-400">Belum ada ujian. Hubungi admin untuk membuat ujian.</div>`);
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
