import { h as head, c as ensure_array_like, e as escape_html, d as attr_class, j as clsx, i as attr, a as stringify, b as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS } from "../../../../chunks/constants.js";
import { C as ConfirmForm } from "../../../../chunks/ConfirmForm.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let results;
    let data = $$props["data"];
    results = data.results;
    head("nnpp9p", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Hasil Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Hasil Ujian</h1> <p class="text-sm text-slate-500 mt-1">Rekap nilai seluruh ujian</p></div> <div class="card p-4"><form method="GET" class="flex flex-col md:flex-row gap-3"><select name="exam_id" class="select flex-1">`);
    $$renderer2.option({ value: "" }, ($$renderer3) => {
      $$renderer3.push(`Semua Ujian`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(data.exams);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let exam = each_array[$$index];
      $$renderer2.option(
        {
          value: exam.id,
          selected: data.examFilter === String(exam.id)
        },
        ($$renderer3) => {
          $$renderer3.push(`${escape_html(exam.title)}`);
        }
      );
    }
    $$renderer2.push(`<!--]--></select> <button type="submit" class="btn-secondary md:w-auto w-full">Tampilkan</button></form></div> <div class="card overflow-hidden">`);
    if (results.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-12 text-center text-slate-400">Belum ada hasil ujian.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Siswa</th><th>Ujian</th><th>Mapel</th><th>Nilai</th><th>Status</th><th>Waktu Selesai</th><th class="w-16 text-center">Aksi</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(results);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let r = each_array_1[$$index_1];
        $$renderer2.push(`<tr><td class="font-semibold text-slate-800">${escape_html(r.student_name)}</td><td>${escape_html(r.exam_title)}</td><td class="text-slate-500">${escape_html(r.subject || "-")}</td><td><span${attr_class(`text-lg font-bold ${(r.score ?? 0) >= 70 ? "text-emerald-600" : "text-rose-600"}`)}>${escape_html(r.score != null ? r.score.toFixed(1) : "-")}</span></td><td><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[r.status] || "badge-info"))}>${escape_html(ATTEMPT_STATUS_LABELS[r.status])}</span></td><td class="text-xs text-slate-500">${escape_html(r.submit_time ? new Date(r.submit_time).toLocaleString("id-ID") : "-")}</td><td class="text-center"><div class="flex items-center justify-center gap-2"><a${attr("href", `/admin/results/${stringify(r.id)}`)} class="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded transition-colors" title="Lihat Detail Ujian"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></a> `);
        ConfirmForm($$renderer2, {
          action: "?/delete",
          confirmTitle: "Hapus Hasil Ujian",
          confirmMessage: "Yakin ingin menghapus hasil ujian ini? Ini akan menghapus permanen jawaban siswa!",
          buttonClass: "p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors",
          buttonTitle: "Hapus Ujian",
          $$slots: {
            inputs: ($$renderer3) => {
              {
                $$renderer3.push(`<input type="hidden" name="attempt_id"${attr("value", r.id)}/>`);
              }
            },
            buttonContent: ($$renderer3) => {
              {
                $$renderer3.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`);
              }
            }
          }
        });
        $$renderer2.push(`<!----></div></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
