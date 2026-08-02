import { h as head, i as attr, c as ensure_array_like, e as escape_html, a as stringify, b as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { I as ICONS } from "../../../../chunks/constants.js";
import { t as toasts } from "../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    if (form?.success) toasts.success(form.success);
    if (form?.error) toasts.error(form.error);
    head("x07xsv", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Manajemen Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-slate-800">Manajemen Ujian</h1> <p class="text-sm text-slate-500 mt-1">Buat dan kelola ujian</p></div> <button class="btn-primary"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Buat Ujian Baru</button></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`);
    const each_array = ensure_array_like(data.exams);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let exam = each_array[$$index];
        $$renderer2.push(`<div class="card-hover p-5 flex flex-col"><div class="flex items-start justify-between mb-3"><div class="flex-1 min-w-0"><h3 class="font-bold text-slate-800 truncate">${escape_html(exam.title)}</h3> <p class="text-xs text-slate-500 mt-0.5">${escape_html(exam.subject_name || "Umum")}</p></div> `);
        if (exam.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-success ml-2 flex-shrink-0">Aktif</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge bg-slate-100 text-slate-500 ml-2 flex-shrink-0">Nonaktif</span>`);
        }
        $$renderer2.push(`<!--]--></div> `);
        if (exam.description) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-sm text-slate-500 mb-3 line-clamp-2">${escape_html(exam.description)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="flex flex-wrap gap-3 text-xs text-slate-500 mb-4"><span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> ${escape_html(exam.duration_minutes)} menit</span> <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.questions)}></path></svg> ${escape_html(exam.question_count)} soal</span> <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.users)}></path></svg> ${escape_html(exam.attempt_count)} peserta</span></div> <div class="mt-auto flex items-center gap-2 pt-3 border-t border-slate-100"><a${attr("href", `/admin/exams/${stringify(exam.id)}`)} class="btn-sm btn-outline flex-1 text-center">Detail</a> <button class="btn-sm btn-ghost" title="Edit"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.edit)}></path></svg></button> <form method="POST" action="?/toggleActive"><input type="hidden" name="id"${attr("value", exam.id)}/> <button type="submit" class="btn-sm btn-ghost"${attr("title", exam.is_active ? "Nonaktifkan" : "Aktifkan")}>`);
        if (exam.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.check)}></path></svg>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>`);
        }
        $$renderer2.push(`<!--]--></button></form> <button class="btn-sm btn-ghost text-rose-400 hover:text-rose-600" title="Hapus"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg></button></div></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="col-span-full text-center py-12 text-slate-400"><svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <p>Belum ada ujian. Klik "Buat Ujian Baru" untuk memulai.</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
