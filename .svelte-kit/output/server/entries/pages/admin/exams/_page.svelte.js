import { h as head, k as attr, i as ensure_array_like, e as escape_html, c as stringify, f as bind_props } from "../../../../chunks/index.js";
import { p as parseDate } from "../../../../chunks/date.js";
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
        $$renderer4.push(`<title>Manajemen Tipe Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-slate-800">Manajemen Ujian</h1> <p class="text-sm text-slate-500 mt-1">Kelola tipe ujian (contoh: UAS, UM) beserta rentang waktunya</p></div> <button class="btn-primary"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Buat Tipe Ujian Baru</button></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`);
    const each_array = ensure_array_like(data.examTypes);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let type = each_array[$$index];
        $$renderer2.push(`<div class="card-hover p-5 flex flex-col border-t-4 border-t-indigo-500"><div class="flex items-start justify-between mb-3"><div class="flex-1 min-w-0"><h3 class="font-bold text-slate-800 truncate">${escape_html(type.name)}</h3> <p class="text-xs text-indigo-500 font-mono font-semibold tracking-wider mt-0.5">${escape_html(type.code)}</p></div></div> `);
        if (type.description) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-sm text-slate-500 mb-4 line-clamp-2">${escape_html(type.description)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="flex flex-col gap-1 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100"><div class="flex items-start gap-2"><svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> <div class="flex flex-col gap-0.5 min-w-0"><span class="text-slate-400 font-medium">Mulai:</span> <span class="truncate font-medium">${escape_html(type.start_time ? parseDate(type.start_time).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "Belum diatur")}</span> <span class="text-slate-400 font-medium mt-1">Berakhir:</span> <span class="truncate font-medium">${escape_html(type.end_time ? parseDate(type.end_time).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "Belum diatur")}</span></div></div> <div class="flex items-center gap-3 mt-1"><div class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <span>${escape_html(type.exam_count)} Ujian</span></div> <div class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> <span class="text-indigo-600 font-semibold">${escape_html(type.participant_count)} Peserta</span></div></div> `);
        if (type.class_names) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="mt-2 text-slate-500 flex items-start gap-1.5 pt-2 border-t border-slate-100 border-dashed text-xs"><svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg> <span class="leading-snug line-clamp-2"${attr("title", type.class_names)}>${escape_html(type.class_names)}</span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (type.proctor_names || type.committee_names || type.supervisor_names) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="mt-2 text-slate-600 flex flex-col gap-1.5 pt-2 border-t border-slate-100 border-dashed">`);
          if (type.proctor_names) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="flex items-center gap-1.5 text-[11px]"><span class="font-semibold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">Proktor:</span> <span class="leading-snug truncate font-medium text-slate-700"${attr("title", type.proctor_names)}>${escape_html(type.proctor_names)}</span></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (type.committee_names) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="flex items-center gap-1.5 text-[11px]"><span class="font-semibold text-indigo-800 bg-indigo-100/80 px-1.5 py-0.5 rounded border border-indigo-200 shrink-0">Panitia:</span> <span class="leading-snug truncate font-medium text-slate-700"${attr("title", type.committee_names)}>${escape_html(type.committee_names)}</span></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (type.supervisor_names) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="flex items-center gap-1.5 text-[11px]"><span class="font-semibold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">Pengawas:</span> <span class="leading-snug truncate font-medium text-slate-700"${attr("title", type.supervisor_names)}>${escape_html(type.supervisor_names)}</span></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="mt-auto flex items-center gap-2 pt-3 border-t border-slate-100"><a${attr("href", `/admin/exams/type/${stringify(type.id)}`)} class="btn-sm btn-outline flex-1 text-center">Lihat Ujian</a> <button class="btn-sm btn-ghost text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50" title="Kelola Peserta Default"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></button> <button class="btn-sm btn-ghost text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50" title="Kelola Petugas Default (Proktor / Panitia / Pengawas)"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg></button> <button class="btn-sm btn-ghost" title="Edit Tipe"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.edit)}></path></svg></button> <button class="btn-sm btn-ghost text-rose-400 hover:text-rose-600" title="Hapus"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg></button></div></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="col-span-full text-center py-12 text-slate-400"><svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <p>Belum ada tipe ujian. Klik "Buat Tipe Ujian Baru" untuk memulai.</p></div>`);
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
