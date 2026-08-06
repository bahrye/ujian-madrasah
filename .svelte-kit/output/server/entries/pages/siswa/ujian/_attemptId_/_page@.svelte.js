import { l as fallback, i as attr_class, e as escape_html, d as bind_props, h as head, a as attr_style, b as stringify, j as attr } from "../../../../../chunks/index.js";
import { o as onDestroy } from "../../../../../chunks/index-server.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { Q as QuestionRenderer } from "../../../../../chunks/QuestionRenderer.js";
import { I as ICONS } from "../../../../../chunks/constants.js";
import { T as Toast } from "../../../../../chunks/Toast2.js";
import "../../../../../chunks/toast.js";
function Timer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let minutes, seconds, formattedTime;
    let endTime = $$props["endTime"];
    let isPaused = fallback($$props["isPaused"], false);
    let showWarning = fallback($$props["showWarning"], true);
    let warningThreshold = fallback($$props["warningThreshold"], 300);
    let remainingSeconds = 0;
    let isWarning = false;
    let isCritical = false;
    function pad(n) {
      return n.toString().padStart(2, "0");
    }
    onDestroy(() => {
    });
    minutes = Math.floor(remainingSeconds / 60);
    seconds = remainingSeconds % 60;
    formattedTime = `${pad(minutes)}:${pad(seconds)}`;
    if (showWarning) {
      isWarning = remainingSeconds <= warningThreshold && remainingSeconds > 60;
      isCritical = remainingSeconds > 0;
    }
    $$renderer2.push(`<div${attr_class(`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold transition-all duration-500 ${// Bekukan timer saat ujian ditahan
    isCritical ? "bg-rose-100 text-rose-700 animate-pulse" : isWarning ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`)}><svg${attr_class(`w-5 h-5 ${isCritical ? "text-rose-500" : isWarning ? "text-amber-500" : "text-slate-500"}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>${escape_html(formattedTime)}</span></div>`);
    bind_props($$props, { endTime, isPaused, showWarning, warningThreshold });
  });
}
function _page_($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let attempt, questions, answerMap, currentQuestion, answeredCount, doubtedCount, unansweredCount;
    let data = $$props["data"];
    let currentIndex = 0;
    let isPausedByProctor = false;
    onDestroy(() => {
    });
    let localAnswers = {};
    let localDoubts = {};
    attempt = data.attempt;
    questions = data.questions;
    answerMap = data.answerMap;
    {
      for (const q of questions) {
        const ans = answerMap[q.id];
        if (ans && !(q.id in localAnswers)) {
          localAnswers[q.id] = ans.answer_given || "";
          localDoubts[q.id] = ans.is_doubted === 1;
        }
      }
    }
    currentQuestion = questions[currentIndex];
    questions.map((q, i) => ({
      id: q.id,
      question_number: q.question_number,
      answered: !!localAnswers[q.id],
      doubted: !!localDoubts[q.id]
    }));
    answeredCount = questions.filter((q) => localAnswers[q.id]).length;
    doubtedCount = questions.filter((q) => localDoubts[q.id]).length;
    unansweredCount = questions.length - answeredCount;
    head("1huqvgl", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(attempt.exam_title)} — Ujian Online Madrasah</title>`);
      });
    });
    Toast($$renderer2);
    $$renderer2.push(`<!----> <div class="min-h-screen bg-slate-50 flex flex-col select-none"><header class="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3"><div class="max-w-4xl mx-auto flex items-center justify-between gap-3"><div class="flex-1 min-w-0 overflow-hidden flex flex-col gap-0.5"><div class="flex items-center gap-2"><h1${attr_class(`text-sm font-bold text-slate-800 whitespace-nowrap ${"truncate"}`)}>${escape_html(attempt.exam_title)} `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></h1></div> <div class="flex items-center gap-2 overflow-hidden w-full"><div class="flex-1 min-w-0 overflow-hidden"><p${attr_class(`text-xs text-slate-500 whitespace-nowrap ${"truncate"}`)}>${escape_html(attempt.subject || "")} · Soal ${escape_html(currentIndex + 1)}/${escape_html(questions.length)} `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></p></div> <div class="shrink-0 flex items-center">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">Tersimpan</span>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="flex items-center gap-2 sm:gap-3">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    Timer($$renderer2, { endTime: attempt.end_time, isPaused: isPausedByProctor });
    $$renderer2.push(`<!----></div></div> <div class="max-w-4xl mx-auto mt-2"><div class="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"${attr_style(`width: ${stringify(answeredCount / questions.length * 100)}%`)}></div></div></div></header> <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-6">`);
    if (currentQuestion) {
      $$renderer2.push("<!--[0-->");
      QuestionRenderer($$renderer2, {
        question: currentQuestion,
        answer: localAnswers[currentQuestion.id] || "",
        isDoubted: localDoubts[currentQuestion.id] || false
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></main> <footer class="sticky bottom-0 z-30 bg-white/90 backdrop-blur-xl border-t border-slate-200"><div class="max-w-4xl mx-auto px-4 py-3"><div class="flex items-center justify-between mb-3"><button class="btn-sm btn-ghost border border-slate-200"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg> Navigasi Soal</button> <div class="flex items-center gap-3 text-xs"><span class="text-emerald-600 font-semibold">${escape_html(answeredCount)} terjawab</span> `);
    if (doubtedCount > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-amber-600 font-semibold">${escape_html(doubtedCount)} ragu</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <span class="text-slate-400">${escape_html(unansweredCount)} belum</span></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex items-center gap-3"><button class="btn-ghost flex-1 justify-center"${attr("disabled", currentIndex === 0, true)}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronLeft)}></path></svg> Sebelumnya</button> `);
    if (currentIndex < questions.length - 1) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="btn-primary flex-1 justify-center">Selanjutnya <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronRight)}></path></svg></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button class="btn-success flex-1 justify-center"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.check)}></path></svg> Selesai &amp; Kumpulkan</button>`);
    }
    $$renderer2.push(`<!--]--></div></div></footer></div> `);
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
    bind_props($$props, { data });
  });
}
export {
  _page_ as default
};
