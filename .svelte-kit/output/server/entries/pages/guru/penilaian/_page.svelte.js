import { h as head, i as ensure_array_like, e as escape_html, k as attr, j as attr_class, c as stringify, f as bind_props } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/state.svelte.js";
import { Q as QUESTION_TYPE_LABELS } from "../../../../chunks/constants.js";
import { t as toasts } from "../../../../chunks/toast.js";
import "katex/dist/contrib/auto-render.mjs";
import { h as html } from "../../../../chunks/html.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let answers, allStudentsGraded;
    let data = $$props["data"];
    let form = $$props["form"];
    function parseAnswerKey(jsonStr) {
      if (!jsonStr) return null;
      try {
        const parsed = JSON.parse(jsonStr);
        if (typeof parsed === "string") return parsed;
        return JSON.stringify(parsed);
      } catch (e) {
        return jsonStr;
      }
    }
    if (form?.success) toasts.success(form.success);
    if (form?.error) toasts.error(form.error);
    answers = data.answers;
    allStudentsGraded = data.students.length > 0 && data.students.every((s) => s.is_graded);
    head("u3u0k6", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Penilaian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div><h1 class="text-2xl font-bold text-slate-800">Penilaian Jawaban</h1> <p class="text-sm text-slate-500 mt-1">Nilai jawaban essay dan isian singkat siswa</p></div> <div class="card p-4 flex flex-col md:flex-row items-center gap-3"><form method="GET" class="flex flex-col md:flex-row items-center gap-3 flex-1 w-full"><select name="exam_id" class="select flex-1 w-full">`);
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
    $$renderer2.push(`<!--]--></select> <select name="student_id" class="select flex-1 w-full"${attr("disabled", data.examParam === null, true)}>`);
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
          selected: String(data.studentFilter) === String(student.id)
        },
        ($$renderer3) => {
          $$renderer3.push(`${escape_html(student.is_graded ? "🟢" : "🔴")} ${escape_html(student.name)} (${escape_html(student.is_graded ? "Sudah Dinilai" : "Belum Dinilai")})`);
        }
      );
    }
    $$renderer2.push(`<!--]--></select></form> `);
    if (data.examParam !== null) {
      $$renderer2.push("<!--[0-->");
      const currentStudent = data.students.find((s) => String(s.id) === String(data.studentFilter));
      const isCurrentLocked = currentStudent ? currentStudent.is_locked : data.students.length > 0 && data.students.every((s) => s.is_locked);
      const isAllStudentsSelected = !data.studentFilter || data.studentFilter === "";
      const hasUngradedStudents = data.students.some((s) => !s.is_graded);
      const isButtonDisabled = isAllStudentsSelected && hasUngradedStudents;
      $$renderer2.push(`<form method="POST"${attr("action", isCurrentLocked ? `?/unlockGrading&exam_id=${data.examParam}&student_id=${data.studentFilter}` : `?/finalizeGrading&exam_id=${data.examParam}&student_id=${data.studentFilter}`)} class="w-full md:w-auto flex-shrink-0"><input type="hidden" name="exam_id"${attr("value", data.examParam)}/> <input type="hidden" name="student_id"${attr("value", data.studentFilter)}/> `);
      if (isButtonDisabled) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button type="button" disabled="" class="btn bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed font-semibold text-sm transition-all flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl w-full md:w-auto" title="Semua siswa harus dinilai terlebih dahulu sebelum dapat mengunci/membatalkan penilaian secara bersamaan"><svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Kunci Penilaian</button>`);
      } else if (isCurrentLocked) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<button type="submit" class="btn bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl w-full md:w-auto"><svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg> Batalkan Kunci</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<button type="submit" class="btn bg-rose-600 text-white hover:bg-rose-700 font-semibold text-sm transition-all shadow-sm shadow-rose-500/20 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl w-full md:w-auto"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Kunci Penilaian</button>`);
      }
      $$renderer2.push(`<!--]--></form>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (data.selectedExam && data.selectedExam.show_score_type === "manual") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 ${allStudentsGraded ? "bg-indigo-50/50 border-indigo-100" : "bg-slate-50/50 border-slate-200"}`)}><div><h3 class="font-bold text-slate-800">Status Rilis Nilai Manual</h3> `);
      if (allStudentsGraded) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="text-xs text-slate-500 mt-0.5">Semua siswa sudah dinilai. Anda dapat merilis nilai sekarang.</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<p class="text-xs text-amber-600 mt-0.5 flex items-center gap-1"><svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg> Semua nilai manual siswa harus terisi terlebih dahulu sebelum dapat merilis nilai.</p>`);
      }
      $$renderer2.push(`<!--]--></div> <form method="POST" action="?/toggleScoreRelease" class="flex items-center flex-shrink-0"><input type="hidden" name="exam_id"${attr("value", data.selectedExam.id)}/> `);
      if (allStudentsGraded || data.selectedExam.is_score_released) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button type="submit"${attr_class(`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${data.selectedExam.is_score_released ? "bg-indigo-600" : "bg-slate-200"}`)} role="switch"${attr("aria-checked", data.selectedExam.is_score_released)}><span class="sr-only">Rilis Nilai</span> <span${attr_class(`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${data.selectedExam.is_score_released ? "translate-x-6" : "translate-x-1"}`)}></span></button> <span${attr_class(`ml-2 text-sm font-medium ${data.selectedExam.is_score_released ? "text-indigo-600" : "text-slate-400"}`)}>${escape_html(data.selectedExam.is_score_released ? "Nilai Dirilis" : "Disembunyikan")}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<button type="button" disabled="" class="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 cursor-not-allowed opacity-50" role="switch" aria-checked="false" title="Semua nilai manual siswa harus terisi terlebih dahulu"><span class="sr-only">Rilis Nilai</span> <span class="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1"></span></button> <span class="ml-2 text-sm font-medium text-slate-300">Disembunyikan</span>`);
      }
      $$renderer2.push(`<!--]--></form></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
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
        $$renderer2.push(`<div${attr_class(`card p-5 ${a.is_locked === 1 ? "border-l-4 border-slate-400 opacity-90" : a.score_given != null ? "border-l-4 border-emerald-400" : "border-l-4 border-amber-400"}`)}><div class="flex flex-wrap items-center gap-2 mb-3"><span class="badge-info">${escape_html(a.exam_title)}</span> <span class="badge-primary">${escape_html(QUESTION_TYPE_LABELS[a.type])}</span> `);
        if (a.question_number) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge bg-slate-100 text-slate-700">Soal #${escape_html(a.question_number)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <span class="text-sm font-semibold text-slate-700">${escape_html(a.student_name)}</span></div> <div class="prose prose-sm max-w-none text-slate-800 mb-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">${html(a.question_text || "")}</div> `);
        if (a.media_url) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="mb-3">`);
          if (a.media_type === "image" || !a.media_type && (a.media_url.endsWith(".png") || a.media_url.endsWith(".jpg") || a.media_url.endsWith(".jpeg") || a.media_url.endsWith(".webp") || a.media_url.endsWith(".gif"))) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<img${attr("src", a.media_url)} alt="Media Soal" class="max-h-64 rounded-lg border border-slate-200 object-contain my-1"/>`);
          } else if (a.media_type === "audio" || !a.media_type && (a.media_url.endsWith(".mp3") || a.media_url.endsWith(".wav") || a.media_url.endsWith(".ogg"))) {
            $$renderer2.push("<!--[1-->");
            $$renderer2.push(`<audio controls=""${attr("src", a.media_url)} class="w-full max-w-md my-1"></audio>`);
          } else if (a.media_type === "video" || !a.media_type && (a.media_url.endsWith(".mp4") || a.media_url.endsWith(".webm"))) {
            $$renderer2.push("<!--[2-->");
            $$renderer2.push(`<video controls=""${attr("src", a.media_url)} class="max-h-64 rounded-lg border border-slate-200 my-1"></video>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (a.correct_answer_json && (a.type === "isian_singkat" || a.type === "essay")) {
          $$renderer2.push("<!--[0-->");
          const keyText = parseAnswerKey(a.correct_answer_json);
          $$renderer2.push(`<div class="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 mb-3"><p class="text-xs font-semibold text-emerald-700 mb-1">Kunci Jawaban / Penjelasan:</p> <div class="prose prose-sm max-w-none text-emerald-900">${html(keyText || "")}</div></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="bg-slate-50 rounded-xl p-3.5 mb-3 border border-slate-100"><p class="text-xs font-semibold text-slate-500 mb-1">Jawaban Siswa:</p> <div class="prose prose-sm max-w-none text-slate-800">`);
        if (a.answer_given) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`${html(a.answer_given)}`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="italic text-slate-400">(Tidak dijawab)</span>`);
        }
        $$renderer2.push(`<!--]--></div></div> <form method="POST" action="?/grade" class="flex items-center gap-3"><input type="hidden" name="answer_id"${attr("value", a.answer_id)}/> <input type="hidden" name="max_points"${attr("value", a.points)}/> <label class="text-sm font-medium text-slate-600">Nilai:</label> <input name="score_given" type="number" min="0"${attr("max", a.points)} step="0.5" class="input w-24"${attr("value", a.score_given ?? "")}${attr("placeholder", `0-${stringify(a.points)}`)}${attr("disabled", a.is_locked === 1, true)}/> <span class="text-xs text-slate-400">/ ${escape_html(a.points)}</span> <button type="submit" class="btn-success btn-sm"${attr("disabled", a.is_locked === 1, true)}>Simpan</button> `);
        if (a.is_locked === 1) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge bg-slate-100 text-slate-600 border border-slate-200">🔒 Dikunci (Selesai)</span>`);
        } else if (a.score_given !== null && a.score_given !== void 0) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<span class="badge-success">✓ Sudah dinilai</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge-warning">⚠ Belum dinilai</span>`);
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
