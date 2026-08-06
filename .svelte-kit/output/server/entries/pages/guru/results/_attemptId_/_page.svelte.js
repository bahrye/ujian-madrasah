import { h as head, k as attr, e as escape_html, j as attr_class, l as clsx, i as ensure_array_like, f as bind_props } from "../../../../../chunks/index.js";
import { A as ATTEMPT_STATUS_COLORS, a as ATTEMPT_STATUS_LABELS, Q as QUESTION_TYPE_LABELS, I as ICONS } from "../../../../../chunks/constants.js";
import "katex/dist/contrib/auto-render.mjs";
import { h as html } from "../../../../../chunks/html.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let attempt, answers;
    let data = $$props["data"];
    attempt = data.attempt;
    answers = data.answers;
    head("1w23tv2", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Detail Hasil Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex items-center gap-3"><a href="/guru/results" class="btn-ghost btn-sm"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronLeft)}></path></svg> Kembali</a></div> <div class="card p-6 border-t-4 border-indigo-500"><div class="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"><div><h1 class="text-2xl font-bold text-slate-800 mb-1">${escape_html(attempt.student_name)}</h1> <p class="text-sm text-slate-500 mb-2">${escape_html(attempt.nisn)} • ${escape_html(attempt.class_name)}</p> <div class="flex gap-2"><span class="badge-primary">${escape_html(attempt.exam_title)}</span> <span class="badge bg-slate-100 text-slate-600">${escape_html(attempt.subject_name || "Umum")}</span></div></div> <div class="flex gap-4"><div class="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center min-w-[100px]"><p class="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Nilai Akhir</p> <p${attr_class(`text-3xl font-black ${(attempt.score ?? 0) >= 70 ? "text-emerald-500" : "text-rose-500"}`)}>${escape_html(attempt.score != null ? attempt.score.toFixed(1) : "-")}</p></div></div></div> <div class="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div><p class="text-slate-500 mb-1">Status</p> <p class="font-medium"><span${attr_class(clsx(ATTEMPT_STATUS_COLORS[attempt.status]))}>${escape_html(ATTEMPT_STATUS_LABELS[attempt.status])}</span></p></div> <div><p class="text-slate-500 mb-1">Total Poin Didapat</p> <p class="font-medium text-slate-800">${escape_html(attempt.score ? Math.round(attempt.score / 100 * attempt.total_points) : 0)} / ${escape_html(attempt.total_points)}</p></div> <div><p class="text-slate-500 mb-1">Waktu Selesai</p> <p class="font-medium text-slate-800">${escape_html(attempt.submit_time ? (/* @__PURE__ */ new Date(String(attempt.submit_time).replace(" ", "T") + (String(attempt.submit_time).includes(" ") && !String(attempt.submit_time).includes("Z") ? "Z" : ""))).toLocaleString("id-ID") : "-")}</p></div> <div><p class="text-slate-500 mb-1">Pelanggaran</p> <p${attr_class(`font-medium ${attempt.violation_count > 0 ? "text-rose-600" : "text-slate-800"}`)}>${escape_html(attempt.violation_count)} kali</p></div></div></div> <div><h2 class="text-lg font-bold text-slate-800 mb-4">Rincian Jawaban Siswa</h2> <div class="space-y-4"><!--[-->`);
    const each_array = ensure_array_like(answers);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let ans = each_array[i];
      $$renderer2.push(`<div${attr_class(`card p-5 border-l-4 ${ans.score_given === ans.max_points ? "border-emerald-400" : ans.score_given > 0 ? "border-amber-400" : "border-rose-400"}`)}><div class="flex items-start justify-between gap-4 mb-3"><div class="flex flex-wrap items-center gap-2"><span class="badge bg-slate-100 text-slate-700">Soal #${escape_html(ans.question_number)}</span> <span class="badge-info">${escape_html(QUESTION_TYPE_LABELS[ans.type])}</span> `);
      if (ans.is_doubted) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="badge-warning">Ragu-ragu</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="text-right"><span${attr_class(`text-lg font-bold ${ans.score_given === ans.max_points ? "text-emerald-600" : ans.score_given > 0 ? "text-amber-600" : "text-rose-600"}`)}>${escape_html(ans.score_given ?? 0)}</span> <span class="text-sm font-medium text-slate-400">/ ${escape_html(ans.max_points)} poin</span></div></div> <div class="prose prose-sm max-w-none text-slate-700 mb-4 bg-slate-50 p-3 rounded border border-slate-100">${html(ans.question_text)}</div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><p class="text-xs font-semibold text-slate-500 mb-1">Jawaban Siswa:</p> `);
      if (!ans.answer_given) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="text-sm italic text-slate-400">Tidak dijawab</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        if (ans.type === "menjodohkan") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="space-y-2 text-sm bg-white p-2 rounded border border-slate-200"><!--[-->`);
          const each_array_1 = ensure_array_like(Object.entries(JSON.parse(ans.answer_given)));
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let [key, value] = each_array_1[$$index];
            $$renderer2.push(`<div class="flex border-b border-slate-100 last:border-0 pb-1 last:pb-0"><span class="font-medium text-slate-600 w-1/2">${escape_html(key)}</span> <span class="text-slate-800 w-1/2">-> ${escape_html(value)}</span></div>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else if (ans.type === "pilihan_ganda") {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<p class="text-sm text-slate-800 bg-white p-2 rounded border border-slate-200">`);
          if (ans.options_json) {
            $$renderer2.push("<!--[0-->");
            const opts = JSON.parse(ans.options_json);
            const selectedOpt = opts.find((o) => String(o.id) === String(ans.answer_given));
            $$renderer2.push(`${escape_html(selectedOpt ? selectedOpt.text : ans.answer_given)}`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`${escape_html(ans.answer_given)}`);
          }
          $$renderer2.push(`<!--]--></p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<p class="text-sm text-slate-800 bg-white p-2 rounded border border-slate-200 whitespace-pre-wrap">${escape_html(ans.answer_given)}</p>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> <div><p class="text-xs font-semibold text-slate-500 mb-1">Kunci Jawaban:</p> `);
      if (["essay", "isian_singkat"].includes(ans.type)) {
        $$renderer2.push("<!--[0-->");
        if (ans.type === "essay") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-sm italic text-slate-400">Dinilai manual oleh guru</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<p class="text-sm text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-100">${escape_html(ans.correct_answer_json ? JSON.parse(ans.correct_answer_json) : "Tidak ada")}</p>`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
        if (ans.correct_answer_json) {
          $$renderer2.push("<!--[0-->");
          if (ans.type === "menjodohkan") {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="space-y-2 text-sm bg-emerald-50 p-2 rounded border border-emerald-100"><!--[-->`);
            const each_array_2 = ensure_array_like(Object.entries(typeof JSON.parse(ans.correct_answer_json) === "string" ? JSON.parse(JSON.parse(ans.correct_answer_json)) : JSON.parse(ans.correct_answer_json)));
            for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
              let [key, value] = each_array_2[$$index_1];
              $$renderer2.push(`<div class="flex border-b border-emerald-200/50 last:border-0 pb-1 last:pb-0"><span class="font-medium text-emerald-800 w-1/2">${escape_html(key)}</span> <span class="text-emerald-900 w-1/2">-> ${escape_html(value)}</span></div>`);
            }
            $$renderer2.push(`<!--]--></div>`);
          } else if (ans.type === "pilihan_ganda") {
            $$renderer2.push("<!--[1-->");
            $$renderer2.push(`<p class="text-sm text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100">`);
            if (ans.options_json) {
              $$renderer2.push("<!--[0-->");
              const opts = JSON.parse(ans.options_json);
              const correctOptId = JSON.parse(ans.correct_answer_json);
              const correctOpt = opts.find((o) => String(o.id) === String(correctOptId));
              $$renderer2.push(`${escape_html(correctOpt ? correctOpt.text : correctOptId)}`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`${escape_html(JSON.parse(ans.correct_answer_json))}`);
            }
            $$renderer2.push(`<!--]--></p>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<p class="text-sm text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100">${escape_html(JSON.parse(ans.correct_answer_json))}</p>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<p class="text-sm italic text-slate-400">Tidak ada kunci jawaban</p>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div></div> `);
      if (["essay", "isian_singkat"].includes(ans.type) && ans.score_given == null) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between"><span class="text-xs text-rose-500 font-medium">⚠️ Jawaban ini belum dinilai oleh Guru</span></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
