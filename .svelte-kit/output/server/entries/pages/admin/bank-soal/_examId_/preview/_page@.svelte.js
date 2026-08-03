import { b as bind_props, h as head, i as attr, a as stringify, e as escape_html } from "../../../../../../chunks/index.js";
import { Q as QuestionRenderer } from "../../../../../../chunks/QuestionRenderer.js";
import { Q as QuestionNav } from "../../../../../../chunks/QuestionNav.js";
import { I as ICONS } from "../../../../../../chunks/constants.js";
function _page_($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let exam, questions, currentQuestion, navQuestions, answeredCount, doubtedCount, unansweredCount;
    let data = $$props["data"];
    let currentIndex = 0;
    let showNav = false;
    let localAnswers = {};
    let localDoubts = {};
    exam = data.exam;
    questions = data.questions;
    currentQuestion = questions[currentIndex];
    navQuestions = questions.map((q) => ({
      id: q.id,
      question_number: q.question_number,
      answered: !!localAnswers[q.id],
      doubted: !!localDoubts[q.id]
    }));
    answeredCount = questions.filter((q) => localAnswers[q.id]).length;
    doubtedCount = questions.filter((q) => localDoubts[q.id]).length;
    unansweredCount = questions.length - answeredCount;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1y9m143", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Preview Ujian — Ujian Online Madrasah</title>`);
        });
      });
      $$renderer3.push(`<div class="min-h-screen bg-slate-50 flex flex-col font-sans"><header class="bg-indigo-700 text-white shadow-md z-30 sticky top-0"><div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4"><div class="flex items-center gap-4 flex-1 min-w-0"><div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></div> <div class="min-w-0 relative"><h1 class="font-bold text-lg leading-tight truncate pr-8"${attr("title", `Preview: ${stringify(exam.title)}`)}>Preview: ${escape_html(exam.title)}</h1> <p class="text-xs text-indigo-200 truncate" title="Mode Pratinjau Guru/Admin">Mode Pratinjau Guru/Admin</p></div></div> <div class="flex items-center gap-3 flex-shrink-0"><a${attr("href", `/admin/bank-soal/${stringify(exam.id)}`)} class="btn-sm bg-white/10 hover:bg-white/20 text-white border-0"><svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.close)}></path></svg> Tutup Preview</a> <button class="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg></button></div></div></header> <main class="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row relative">`);
      if (questions.length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex-1 flex flex-col min-h-0 relative"><div class="flex-1 overflow-y-auto p-4 md:p-8"><div class="max-w-3xl mx-auto w-full">`);
        QuestionRenderer($$renderer3, {
          question: currentQuestion,
          answer: localAnswers[currentQuestion.id] || "",
          isDoubted: localDoubts[currentQuestion.id] || false
        });
        $$renderer3.push(`<!----></div></div> <div class="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]"><div class="max-w-3xl mx-auto flex items-center justify-between gap-4"><button class="btn btn-secondary flex-1 sm:flex-none"${attr("disabled", currentIndex === 0, true)}><svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronLeft)}></path></svg> <span class="hidden sm:inline">Sebelumnya</span> <span class="sm:hidden">Prev</span></button> <div class="text-sm font-medium text-slate-500 hidden sm:block">Soal <span class="text-slate-900 font-bold">${escape_html(currentIndex + 1)}</span> dari ${escape_html(questions.length)}</div> <button class="btn btn-primary flex-1 sm:flex-none"${attr("disabled", currentIndex === questions.length - 1, true)}><span class="hidden sm:inline">Selanjutnya</span> <span class="sm:hidden">Next</span> <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronRight)}></path></svg></button></div></div></div> `);
        QuestionNav($$renderer3, {
          navQuestions,
          answeredCount,
          doubtedCount,
          unansweredCount,
          currentIndex,
          get showNav() {
            return showNav;
          },
          set showNav($$value) {
            showNav = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!---->`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="flex-1 flex items-center justify-center p-8"><div class="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full"><div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.questions)}></path></svg></div> <h3 class="text-lg font-bold text-slate-800 mb-2">Belum Ada Soal</h3> <p class="text-slate-500 mb-6">Ujian ini belum memiliki soal untuk dipratinjau.</p> <a${attr("href", `/admin/bank-soal/${stringify(exam.id)}`)} class="btn btn-primary w-full">Kembali ke Bank Soal</a></div></div>`);
      }
      $$renderer3.push(`<!--]--></main></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { data });
  });
}
export {
  _page_ as default
};
