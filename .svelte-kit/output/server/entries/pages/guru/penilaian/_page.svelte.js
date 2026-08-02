import { h as head, c as ensure_array_like, e as escape_html, i as attr, d as attr_class, a as stringify, b as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { Q as QUESTION_TYPE_LABELS } from "../../../../chunks/constants.js";
import { t as toasts } from "../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let answers;
    let data = $$props["data"];
    let form = $$props["form"];
    if (form?.success) toasts.success(form.success);
    if (form?.error) toasts.error(form.error);
    answers = data.answers;
    head("u3u0k6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Penilaian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Penilaian Jawaban</h1> <p class="text-sm text-slate-500 mt-1">Nilai jawaban essay dan isian singkat siswa</p></div> <div class="card p-4"><form method="GET" class="flex flex-col md:flex-row gap-3"><select name="exam_id" class="select flex-1">`);
    $$renderer2.option({ value: "", disabled: true, selected: data.examParam === null }, ($$renderer3) => {
      $$renderer3.push(`-- Pilih Ujian Terlebih Dahulu --`);
    });
    $$renderer2.option({ value: "all", selected: data.examParam === "all" }, ($$renderer3) => {
      $$renderer3.push(`Semua Ujian`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(data.exams);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let exam = each_array[$$index];
      $$renderer2.option({ value: exam.id, selected: data.examParam === String(exam.id) }, ($$renderer3) => {
        $$renderer3.push(`${escape_html(exam.title)}`);
      });
    }
    $$renderer2.push(`<!--]--></select> <select name="student_id" class="select flex-1"${attr("disabled", data.examParam === null, true)}>`);
    $$renderer2.option({ value: "" }, ($$renderer3) => {
      $$renderer3.push(`Semua Siswa`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array_1 = ensure_array_like(data.students);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let student = each_array_1[$$index_1];
      $$renderer2.option(
        {
          value: student.id,
          selected: data.studentFilter === String(student.id)
        },
        ($$renderer3) => {
          $$renderer3.push(`${escape_html(student.name)}`);
        }
      );
    }
    $$renderer2.push(`<!--]--></select> <button type="submit" class="btn-secondary md:w-auto w-full"${attr("disabled", data.examParam === null, true)}>Tampilkan</button></form></div> `);
    if (data.examParam === null) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="card p-12 text-center text-slate-400"><p class="text-lg font-medium mb-1">Pilih filter ujian di atas</p> <p class="text-sm">Anda harus memilih ujian dan/atau siswa terlebih dahulu.</p></div>`);
    } else if (answers.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="card p-12 text-center text-slate-400"><p class="text-lg font-medium mb-1">Tidak ada jawaban yang perlu dinilai</p> <p class="text-sm">Jawaban essay/isian siswa akan muncul di sini.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-4"><!--[-->`);
      const each_array_2 = ensure_array_like(answers);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let a = each_array_2[$$index_2];
        $$renderer2.push(`<div${attr_class(`card p-5 ${a.score_given != null ? "border-l-4 border-emerald-400" : "border-l-4 border-amber-400"}`)}><div class="flex flex-wrap items-center gap-2 mb-3"><span class="badge-info">${escape_html(a.exam_title)}</span> <span class="badge-primary">${escape_html(QUESTION_TYPE_LABELS[a.type])}</span> <span class="text-sm font-semibold text-slate-700">${escape_html(a.student_name)}</span></div> <p class="text-sm font-medium text-slate-700 mb-2">${escape_html(a.question_text)}</p> `);
        if (a.correct_answer_json && a.type === "isian_singkat") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-xs text-emerald-600 mb-2">Kunci: ${escape_html(JSON.parse(a.correct_answer_json))}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="bg-slate-50 rounded-xl p-3 mb-3"><p class="text-xs font-semibold text-slate-500 mb-1">Jawaban Siswa:</p> <p class="text-sm text-slate-800 whitespace-pre-wrap">${escape_html(a.answer_given || "(Tidak dijawab)")}</p></div> <form method="POST" action="?/grade" class="flex items-center gap-3"><input type="hidden" name="answer_id"${attr("value", a.answer_id)}/> <input type="hidden" name="max_points"${attr("value", a.points)}/> <label class="text-sm font-medium text-slate-600">Nilai:</label> <input name="score_given" type="number" min="0"${attr("max", a.points)} step="0.5" class="input w-24"${attr("value", a.score_given ?? "")}${attr("placeholder", `0-${stringify(a.points)}`)}/> <span class="text-xs text-slate-400">/ ${escape_html(a.points)}</span> <button type="submit" class="btn-success btn-sm">Simpan</button> `);
        if (a.score_given != null) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-success">✓ Sudah dinilai</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></form></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
