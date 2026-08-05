import { h as head, j as attr, f as ensure_array_like, e as escape_html, i as attr_class, b as stringify, d as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { I as ICONS } from "../../../../chunks/constants.js";
import { C as ConfirmForm } from "../../../../chunks/ConfirmForm.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let filteredExams;
    let data = $$props["data"];
    let searchTerm = "";
    filteredExams = data.exams.filter((e) => e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.subject_name && e.subject_name.toLowerCase().includes(searchTerm.toLowerCase()));
    head("wqx1rc", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Ujian Remedial | CBT Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Ujian Remedial</h1> <p class="text-slate-500 text-sm mt-1">Kelola dan selenggarakan ujian remedial/susulan mandiri Anda.</p></div> <button class="btn btn-primary"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Buat Ujian Remedial</button></div> <div class="card overflow-hidden animate-in" style="animation-delay: 50ms;"><div class="p-4 border-b border-slate-100 flex gap-3"><div class="relative flex-1 max-w-md"><svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${attr("d", ICONS.search)}></path></svg> <input type="text" placeholder="Cari judul ujian atau mata pelajaran..."${attr("value", searchTerm)} class="input pl-10"/></div></div> <div class="table-container max-h-[calc(100vh-250px)] overflow-y-auto"><table class="table"><thead class="sticky top-0 bg-white z-10"><tr><th>Judul Ujian</th><th>Status</th><th>Jadwal</th><th>Statistik</th><th class="text-right">Aksi</th></tr></thead><tbody>`);
    if (filteredExams.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<tr><td colspan="5" class="text-center py-12 text-slate-400">`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`Anda belum membuat ujian remedial sama sekali.`);
      }
      $$renderer2.push(`<!--]--></td></tr>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(filteredExams);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let exam = each_array[$$index];
        $$renderer2.push(`<tr class="hover:bg-slate-50/50 transition-colors"><td><div class="font-bold text-slate-800 mb-1">${escape_html(exam.title)}</div> <div class="text-xs text-slate-500">Mapel: ${escape_html(exam.subject_name || "-")} | Durasi: ${escape_html(exam.duration_minutes)}m</div> <div class="text-xs text-slate-500 mt-0.5">Pengawas: ${escape_html(data.user?.name || "-")}</div></td><td><form method="POST" action="?/toggleActive" class="inline-block"><input type="hidden" name="id"${attr("value", exam.id)}/> <button type="submit"${attr_class(`badge ${exam.is_active ? "badge-success hover:bg-emerald-200" : "badge-slate hover:bg-slate-300"} transition-colors cursor-pointer`)} title="Klik untuk mengubah status">${escape_html(exam.is_active ? "Aktif" : "Nonaktif")}</button></form></td><td class="text-xs text-slate-600 space-y-1"><div>Mulai: ${escape_html(exam.start_time ? (/* @__PURE__ */ new Date(String(exam.start_time).replace(" ", "T") + (String(exam.start_time).includes(" ") && !String(exam.start_time).includes("Z") ? "Z" : ""))).toLocaleString("id-ID") : "-")}</div> <div>Akhir: ${escape_html(exam.end_time ? (/* @__PURE__ */ new Date(String(exam.end_time).replace(" ", "T") + (String(exam.end_time).includes(" ") && !String(exam.end_time).includes("Z") ? "Z" : ""))).toLocaleString("id-ID") : "-")}</div></td><td><div class="flex items-center gap-3"><span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md" title="Jumlah Soal">${escape_html(exam.question_count)} soal</span> <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md" title="Jumlah Peserta">${escape_html(exam.participant_count)} peserta</span></div></td><td><div class="flex items-center justify-end gap-2"><a${attr("href", `/guru/remedial/${stringify(exam.id)}`)} class="btn-sm btn-ghost text-indigo-600 hover:bg-indigo-50" title="Kelola &amp; Monitor Ujian">Monitor &amp; Kelola</a> <button class="btn-sm btn-ghost text-slate-400 hover:text-indigo-600" title="Edit Ujian"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.edit)}></path></svg></button> `);
        ConfirmForm($$renderer2, {
          action: "?/delete",
          confirmTitle: "Hapus Ujian Remedial",
          confirmMessage: `Hapus ujian '${stringify(exam.title)}'? Semua data soal dan nilai siswa akan ikut terhapus.`,
          buttonClass: "btn-sm btn-ghost text-rose-400 hover:text-rose-600 hover:bg-rose-50",
          buttonTitle: "Hapus ujian",
          $$slots: {
            inputs: ($$renderer3) => {
              {
                $$renderer3.push(`<input type="hidden" name="id"${attr("value", exam.id)}/>`);
              }
            },
            buttonContent: ($$renderer3) => {
              {
                $$renderer3.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg>`);
              }
            }
          }
        });
        $$renderer2.push(`<!----></div></td></tr>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
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
