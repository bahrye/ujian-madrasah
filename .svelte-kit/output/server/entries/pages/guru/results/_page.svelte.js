import { h as head, i as ensure_array_like, e as escape_html, k as attr, j as attr_class, l as clsx, c as stringify, f as bind_props } from "../../../../chunks/index.js";
import { p as parseDate } from "../../../../chunks/date.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS } from "../../../../chunks/constants.js";
import { t as toasts } from "../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let results, selectedExam, isManualExamSelected, showStatusColumn;
    let data = $$props["data"];
    let form = $$props["form"];
    let isExporting = false;
    results = data.results;
    selectedExam = data.exams.find((e) => String(e.id) === String(data.examFilter));
    isManualExamSelected = selectedExam ? selectedExam.show_score_type === "manual" : false;
    showStatusColumn = Boolean(data.examFilter) && isManualExamSelected;
    if (form?.error) toasts.error(form.error);
    if (form?.released === true) toasts.success("Nilai siswa berhasil dikirim ke siswa!");
    if (form?.released === false) toasts.success("Kirim nilai berhasil dibatalkan!");
    if (form?.releaseAll) toasts.success("Nilai seluruh siswa yang sudah lengkap berhasil dikirim!");
    head("1rowrx5", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Hasil Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Hasil Ujian</h1> <p class="text-sm text-slate-500 mt-1">Rekap nilai seluruh ujian</p></div> <div class="card p-4 flex flex-col md:flex-row gap-3 items-center"><form method="GET" class="flex flex-col md:flex-row gap-3 flex-1 w-full"><select name="exam_id" class="select flex-1">`);
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
          selected: String(data.examFilter) === String(exam.id)
        },
        ($$renderer3) => {
          $$renderer3.push(`${escape_html(exam.title)}`);
        }
      );
    }
    $$renderer2.push(`<!--]--></select> <button type="submit" class="btn-secondary md:w-auto w-full">Tampilkan</button></form> `);
    if (data.examFilter) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">`);
      if (isManualExamSelected) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<form method="POST" action="?/releaseAll" class="w-full md:w-auto"><input type="hidden" name="exam_id"${attr("value", data.examFilter)}/> <button type="submit" class="btn bg-indigo-600 hover:bg-indigo-700 text-white md:w-auto w-full flex items-center justify-center gap-2 shadow-sm"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg> Kirim Semua</button></form>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button type="button" class="btn-primary md:w-auto w-full flex items-center justify-center gap-2"${attr("disabled", isExporting, true)}>`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg> Eksport Excel`);
      }
      $$renderer2.push(`<!--]--></button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="card overflow-hidden">`);
    if (results.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="p-12 text-center text-slate-400">Belum ada hasil ujian.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="table-container border-0 rounded-none"><table class="table"><thead><tr><th>Siswa</th><th>Ujian</th><th>Mapel</th><th>Nilai</th><th>Status Ujian</th>`);
      if (showStatusColumn) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<th class="whitespace-nowrap text-xs">Status Nilai</th>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--><th>Waktu Selesai</th><th class="w-24 text-center">Aksi</th></tr></thead><tbody><!--[-->`);
      const each_array_1 = ensure_array_like(results);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let r = each_array_1[$$index_1];
        const isComplete = r.is_graded === 1 || r.ungraded_count === 0;
        const isManual = r.show_score_type === "manual";
        $$renderer2.push(`<tr><td class="font-semibold text-slate-800">${escape_html(r.student_name)}</td><td>${escape_html(r.exam_title)}</td><td class="text-slate-500">${escape_html(r.subject || "-")}</td><td><span${attr_class(`text-lg font-bold ${(r.score ?? 0) >= 70 ? "text-emerald-600" : "text-rose-600"}`)}>${escape_html(r.score != null ? r.score.toFixed(1) : "-")}</span></td><td><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[r.status] || "badge-info"))}>${escape_html(ATTEMPT_STATUS_LABELS[r.status])}</span></td>`);
        if (showStatusColumn) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<td class="whitespace-nowrap text-xs">`);
          if (isManual) {
            $$renderer2.push("<!--[0-->");
            if (r.is_score_released === 1) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<span class="badge-success text-[11px] whitespace-nowrap px-2 py-0.5 font-medium">🟢 Terkirim</span>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`<span class="badge-error text-[11px] whitespace-nowrap px-2 py-0.5 font-medium">🔴 Belum Terkirim</span>`);
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<span class="text-slate-400 text-xs">-</span>`);
          }
          $$renderer2.push(`<!--]--></td>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--><td class="text-xs text-slate-500">${escape_html(r.submit_time ? parseDate(r.submit_time).toLocaleString("id-ID") : "-")}</td><td class="text-center"><div class="flex items-center justify-center gap-1.5">`);
        if (showStatusColumn && isManual) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<form method="POST" action="?/toggleRelease" class="inline-block"><input type="hidden" name="attempt_id"${attr("value", r.id)}/> `);
          if (r.is_score_released === 1) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<button type="submit" class="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors bg-emerald-50/50" title="Nilai sudah dikirim ke siswa (Klik untuk batalkan)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></button>`);
          } else if (isComplete) {
            $$renderer2.push("<!--[1-->");
            $$renderer2.push(`<button type="submit" class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Kirim nilai ke hasil ujian siswa"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></button>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<button type="button" disabled="" class="p-1.5 text-slate-300 cursor-not-allowed rounded-lg" title="Nilai belum lengkap (penilaian essay/isian belum selesai)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></button>`);
          }
          $$renderer2.push(`<!--]--></form>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <a${attr("href", `/guru/results/${stringify(r.id)}`)} class="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="Lihat Detail Ujian"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></a></div></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
