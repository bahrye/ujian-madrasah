import { m as fallback, j as attr_class, e as escape_html, f as bind_props, h as head, a as attr_style, c as stringify, k as attr } from "../../../../../chunks/index.js";
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
    // Perbaiki format SQLite datetime yang kehilangan 'Z' dan 'T'
    isCritical ? "bg-rose-100 text-rose-700 animate-pulse" : isWarning ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`)}><svg${attr_class(`w-5 h-5 ${isCritical ? "text-rose-500" : isWarning ? "text-amber-500" : "text-slate-500"}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>${escape_html(formattedTime)}</span></div>`);
    bind_props($$props, { endTime, isPaused, showWarning, warningThreshold });
  });
}
function _page_($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let attempt, questions, answerMap, currentQuestion, answeredCount, doubtedCount, unansweredCount;
    let data = $$props["data"];
    let currentIndex = 0;
    let currentEndTime = data?.attempt?.end_time;
    let isPausedByProctor = data?.attempt?.is_paused === 1;
    let warnings = 0;
    let warningLogs = [];
    onDestroy(() => {
      stopWarningSoundLoop();
      if (typeof document !== "undefined" && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {
        });
      }
    });
    function stopWarningSoundLoop() {
      try {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {
      }
    }
    let localAnswers = {};
    let localDoubts = {};
    let lastSavedPayload = null;
    let initializedAttemptId = null;
    attempt = data?.attempt || {};
    questions = data?.questions || [];
    answerMap = data?.answerMap || {};
    if (data?.attempt) {
      if (data.attempt.end_time && data.attempt.end_time !== currentEndTime) {
        currentEndTime = data.attempt.end_time;
      }
      isPausedByProctor = data.attempt.is_paused === 1;
    }
    if (attempt?.id && attempt.id !== initializedAttemptId && Array.isArray(questions) && questions.length > 0) {
      const newAnswers = {};
      const newDoubts = {};
      for (const q of questions) {
        const ans = answerMap?.[q.id];
        newAnswers[q.id] = ans?.answer_given || "";
        newDoubts[q.id] = ans?.is_doubted === 1;
      }
      localAnswers = newAnswers;
      localDoubts = newDoubts;
      initializedAttemptId = attempt.id;
      if (lastSavedPayload === null && Object.keys(localAnswers).length > 0) {
        lastSavedPayload = JSON.stringify({
          answers: localAnswers,
          doubts: localDoubts,
          warnings,
          warningLogs
        });
      }
    }
    currentQuestion = questions && questions.length > 0 ? questions[currentIndex] : null;
    (questions || []).map((q, i) => {
      let isAnswered = false;
      if (localAnswers && localAnswers[q.id]) {
        isAnswered = localAnswers[q.id] !== "[]" && localAnswers[q.id] !== "{}";
      }
      return {
        id: q.id,
        question_number: q.question_number,
        answered: isAnswered,
        doubted: !!(localDoubts && localDoubts[q.id])
      };
    });
    answeredCount = (questions || []).filter((q) => localAnswers && localAnswers[q.id] && localAnswers[q.id] !== "[]" && localAnswers[q.id] !== "{}").length;
    doubtedCount = (questions || []).filter((q) => localDoubts && localDoubts[q.id]).length;
    unansweredCount = (questions?.length || 0) - answeredCount;
    head("1huqvgl", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(attempt?.exam_title || "Ujian Online")} — Ujian Online Madrasah</title>`);
      });
    });
    Toast($$renderer2);
    $$renderer2.push(`<!----> <div class="min-h-screen bg-slate-50 flex flex-col select-none svelte-1huqvgl"><header class="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-2.5 shadow-xs svelte-1huqvgl"><div class="max-w-4xl mx-auto flex flex-col gap-2 svelte-1huqvgl"><div class="w-full overflow-hidden relative svelte-1huqvgl">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="w-full flex items-center py-0.5 svelte-1huqvgl"><h1 class="text-sm sm:text-base font-bold text-slate-800 tracking-tight truncate svelte-1huqvgl">${escape_html(attempt?.exam_title || "")}</h1></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center justify-between gap-3 svelte-1huqvgl"><div class="flex items-center gap-1.5 svelte-1huqvgl">`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs svelte-1huqvgl" title="Jawaban tersimpan di server"><svg class="w-3.5 h-3.5 text-emerald-600 svelte-1huqvgl" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" class="svelte-1huqvgl"></path></svg> <span class="text-[11px] font-semibold svelte-1huqvgl">Tersimpan</span></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-2 sm:gap-3 shrink-0 svelte-1huqvgl">`);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    Timer($$renderer2, { endTime: currentEndTime, isPaused: isPausedByProctor });
    $$renderer2.push(`<!----></div></div> <div class="w-full svelte-1huqvgl"><div class="h-1.5 bg-slate-100 rounded-full overflow-hidden svelte-1huqvgl"><div class="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 svelte-1huqvgl"${attr_style(`width: ${stringify(questions && questions.length > 0 ? answeredCount / questions.length * 100 : 0)}%`)}></div></div></div></div></header> <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-6 svelte-1huqvgl">`);
    if (currentQuestion) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!---->`);
      {
        QuestionRenderer($$renderer2, {
          question: currentQuestion,
          displayNumber: currentIndex + 1,
          answer: localAnswers[currentQuestion.id] || "",
          isDoubted: localDoubts[currentQuestion.id] || false
        });
      }
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></main> <footer class="sticky bottom-0 z-30 bg-white/90 backdrop-blur-xl border-t border-slate-200 svelte-1huqvgl"><div class="max-w-4xl mx-auto px-4 py-3 svelte-1huqvgl"><div class="flex items-center justify-between mb-3 svelte-1huqvgl"><div class="flex items-center gap-2 svelte-1huqvgl"><button class="btn-sm btn-ghost border border-slate-200 svelte-1huqvgl"><svg class="w-3.5 h-3.5 svelte-1huqvgl" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" class="svelte-1huqvgl"></path></svg> Navigasi Soal</button> <button class="btn-sm btn-ghost border border-slate-200 svelte-1huqvgl" title="Muat Ulang Halaman"><svg class="w-3.5 h-3.5 svelte-1huqvgl" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" class="svelte-1huqvgl"></path></svg></button></div> <div class="flex items-center gap-3 text-xs svelte-1huqvgl"><span class="text-emerald-600 font-semibold svelte-1huqvgl">${escape_html(answeredCount)} terjawab</span> `);
    if (doubtedCount > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-amber-600 font-semibold svelte-1huqvgl">${escape_html(doubtedCount)} ragu</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <span class="text-slate-400 svelte-1huqvgl">${escape_html(unansweredCount)} belum</span></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex items-center gap-3 svelte-1huqvgl"><button class="btn-ghost flex-1 justify-center svelte-1huqvgl"${attr("disabled", currentIndex === 0, true)}><svg class="w-4 h-4 svelte-1huqvgl" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronLeft)} class="svelte-1huqvgl"></path></svg> Sebelumnya</button> `);
    if (questions && currentIndex < questions.length - 1) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="btn-primary flex-1 justify-center svelte-1huqvgl">Selanjutnya <svg class="w-4 h-4 svelte-1huqvgl" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronRight)} class="svelte-1huqvgl"></path></svg></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button class="btn-success flex-1 justify-center svelte-1huqvgl"><svg class="w-4 h-4 svelte-1huqvgl" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.check)} class="svelte-1huqvgl"></path></svg> Selesai &amp; Kumpulkan</button>`);
    }
    $$renderer2.push(`<!--]--></div></div></footer></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!isPausedByProctor) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl svelte-1huqvgl"><div class="text-center text-white max-w-md animate-in fade-in zoom-in duration-300 svelte-1huqvgl"><svg class="w-16 h-16 mx-auto mb-6 text-indigo-500 svelte-1huqvgl" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" class="svelte-1huqvgl"></path></svg> <h2 class="text-2xl font-bold mb-4 svelte-1huqvgl">Mode Layar Penuh Diperlukan</h2> <p class="text-slate-300 text-sm mb-6 svelte-1huqvgl">Ujian ini wajib menggunakan mode layar penuh untuk mencegah kecurangan dan menutupi notifikasi sistem. Silakan masuk ke Layar Penuh untuk mulai/melanjutkan.</p> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <button class="btn-primary w-full justify-center py-3 svelte-1huqvgl">Masuk Layar Penuh</button></div></div>`);
    } else {
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
    $$renderer2.push(`<!--]--> `);
    if (isPausedByProctor) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl svelte-1huqvgl"><div class="text-center text-white max-w-md animate-in fade-in zoom-in duration-300 svelte-1huqvgl"><svg class="w-20 h-20 mx-auto mb-6 text-amber-500 animate-pulse svelte-1huqvgl" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" class="svelte-1huqvgl"></path></svg> <h2 class="text-3xl font-bold mb-4 svelte-1huqvgl">Ujian Ditahan</h2> <p class="text-slate-300 text-lg svelte-1huqvgl">Waktu ujian Anda sedang dibekukan oleh Pengawas.</p> <p class="text-slate-400 mt-4 text-sm svelte-1huqvgl">Silakan hubungi pengawas ujian jika ini adalah sebuah kesalahan. Anda tidak dapat melanjutkan ujian atau melihat soal hingga akses dibuka kembali.</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { data });
  });
}
export {
  _page_ as default
};
