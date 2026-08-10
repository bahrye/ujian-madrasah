import { h as head, e as escape_html, k as attr, s as store_get, u as unsubscribe_stores, f as bind_props } from "../../../../../../chunks/index.js";
import { Q as QuestionRenderer } from "../../../../../../chunks/QuestionRenderer.js";
import { I as ICONS } from "../../../../../../chunks/constants.js";
import { p as page } from "../../../../../../chunks/stores.js";
function _page_($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let exam, questions, currentQuestion, answeredCount, doubtedCount, unansweredCount;
    let data = $$props["data"];
    let currentIndex = 0;
    let localAnswers = {};
    let localDoubts = {};
    exam = data.exam;
    questions = data.questions;
    currentQuestion = questions[currentIndex];
    questions.map((q) => ({
      id: q.id,
      question_number: q.question_number,
      answered: !!localAnswers[q.id],
      doubted: !!localDoubts[q.id]
    }));
    answeredCount = questions.filter((q) => localAnswers[q.id]).length;
    doubtedCount = questions.filter((q) => localDoubts[q.id]).length;
    unansweredCount = questions.length - answeredCount;
    head("1y9m143", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Preview Ujian — Ujian Online Madrasah</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-slate-50 flex flex-col font-sans"><header class="bg-indigo-700 text-white shadow-md z-30 sticky top-0"><div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4"><div class="flex items-center gap-3 flex-1 min-w-0"><div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></div> <div class="min-w-0"><h1 class="font-bold text-base sm:text-lg leading-tight truncate">Preview: ${escape_html(exam.title)}</h1> <p class="text-xs text-indigo-200 truncate">Mode Pratinjau Admin</p></div></div> <a${attr("href", store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("from") === "bank" ? "/admin/bank-soal" : `/admin/bank-soal/${exam.id}`)} class="btn-sm bg-white/10 hover:bg-white/20 text-white border-0 flex-shrink-0"><svg class="w-4 h-4 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.close)}></path></svg> <span class="hidden sm:inline">Tutup Preview</span></a></div></header> <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-6">`);
    if (questions.length > 0 && currentQuestion) {
      $$renderer2.push("<!--[0-->");
      QuestionRenderer($$renderer2, {
        question: currentQuestion,
        answer: localAnswers[currentQuestion.id] || "",
        isDoubted: localDoubts[currentQuestion.id] || false
      });
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="flex items-center justify-center h-64"><div class="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full"><div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.questions)}></path></svg></div> <h3 class="text-lg font-bold text-slate-800 mb-2">Belum Ada Soal</h3> <p class="text-slate-500 mb-6">Ujian ini belum memiliki soal untuk dipratinjau.</p> <a${attr("href", store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("from") === "bank" ? "/admin/bank-soal" : `/admin/bank-soal/${exam.id}`)} class="btn btn-primary w-full">Kembali ke Bank Soal</a></div></div>`);
    }
    $$renderer2.push(`<!--]--></main> `);
    if (questions.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<footer class="sticky bottom-0 z-30 bg-white/90 backdrop-blur-xl border-t border-slate-200"><div class="max-w-4xl mx-auto px-4 py-3"><div class="flex items-center justify-between mb-3"><button class="btn-sm btn-ghost border border-slate-200"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg> <span class="ml-1">Navigasi Soal</span></button> <div class="flex items-center gap-3 text-xs"><span class="text-emerald-600 font-semibold">${escape_html(answeredCount)} terjawab</span> `);
      if (doubtedCount > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-amber-600 font-semibold">${escape_html(doubtedCount)} ragu</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <span class="text-slate-400 hidden sm:inline">${escape_html(unansweredCount)} belum</span></div></div> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex items-center gap-3"><button class="btn-ghost flex-1 justify-center"${attr("disabled", currentIndex === 0, true)}><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronLeft)}></path></svg> Sebelumnya</button> <button class="btn-primary flex-1 justify-center"${attr("disabled", currentIndex === questions.length - 1, true)}>Selanjutnya <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronRight)}></path></svg></button></div></div></footer>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data });
  });
}
export {
  _page_ as default
};
