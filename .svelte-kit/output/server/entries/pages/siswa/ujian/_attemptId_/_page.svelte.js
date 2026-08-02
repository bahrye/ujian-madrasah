import { ai as ssr_context, l as fallback, d as attr_class, e as escape_html, b as bind_props, i as attr, f as attr_style, a as stringify, c as ensure_array_like, h as head } from "../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import "clsx";
import { Q as QUESTION_TYPE_LABELS, I as ICONS } from "../../../../../chunks/constants.js";
import { T as Toast } from "../../../../../chunks/Toast2.js";
import "../../../../../chunks/toast.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function Timer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let hours, minutes, seconds, formattedTime;
    let endTime = $$props["endTime"];
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
    hours = Math.floor(remainingSeconds / 3600);
    minutes = Math.floor(remainingSeconds % 3600 / 60);
    seconds = remainingSeconds % 60;
    formattedTime = hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
    if (showWarning) {
      isWarning = remainingSeconds <= warningThreshold && remainingSeconds > 60;
      isCritical = remainingSeconds > 0;
    }
    $$renderer2.push(`<div${attr_class(`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold transition-all duration-500 ${isCritical ? "bg-rose-100 text-rose-700 animate-pulse" : isWarning ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`)}><svg${attr_class(`w-5 h-5 ${isCritical ? "text-rose-500" : isWarning ? "text-amber-500" : "text-slate-500"}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>${escape_html(formattedTime)}</span></div>`);
    bind_props($$props, { endTime, showWarning, warningThreshold });
  });
}
function AudioPlayer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let src = $$props["src"];
    let maxPlays = fallback($$props["maxPlays"], 3);
    let playCount = 0;
    let currentTime = 0;
    let duration = 0;
    let progress = 0;
    let canPlay = true;
    function formatTime(secs) {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s.toString().padStart(2, "0")}`;
    }
    canPlay = playCount < maxPlays;
    $$renderer2.push(`<div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-3"><div class="flex items-center gap-3"><button${attr_class(`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${canPlay ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105" : "bg-slate-300 text-slate-500 cursor-not-allowed"}`)}${attr("disabled", !canPlay, true)}${attr("title", canPlay ? "Putar" : "Batas putar tercapai")}>`);
    {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>`);
    }
    $$renderer2.push(`<!--]--></button> <div class="flex-1 min-w-0"><div class="h-2 bg-slate-200 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-150"${attr_style(`width: ${stringify(progress)}%`)}></div></div> <div class="flex justify-between mt-1.5"><span class="text-xs text-slate-500 font-medium">${escape_html(formatTime(currentTime))}</span> <span class="text-xs text-slate-500 font-medium">${escape_html(formatTime(duration))}</span></div></div> <div class="flex-shrink-0 text-center"><div${attr_class(`text-xs font-bold ${canPlay ? "text-indigo-600" : "text-rose-500"}`)}>${escape_html(playCount)}/${escape_html(maxPlays)}</div> <div class="text-[10px] text-slate-400">putar</div></div></div></div>`);
    bind_props($$props, { src, maxPlays });
  });
}
function QuestionRenderer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let options, matchingLeft, matchingRight;
    let question = $$props["question"];
    let answer = fallback($$props["answer"], "");
    let isDoubted = fallback($$props["isDoubted"], false);
    let matchingAnswers = {};
    const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
    options = question.options_json ? JSON.parse(question.options_json) : [];
    matchingLeft = question.type === "menjodohkan" && options?.left ? options.left : [];
    matchingRight = question.type === "menjodohkan" && options?.right ? options.right : [];
    if (question.type === "menjodohkan" && answer) {
      try {
        matchingAnswers = JSON.parse(answer);
      } catch {
        matchingAnswers = {};
      }
    }
    $$renderer2.push(`<div class="space-y-5 animate-in"><div class="flex items-center justify-between flex-wrap gap-2"><div class="flex items-center gap-3"><span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20">${escape_html(question.question_number)}</span> <div><span class="badge-primary text-[10px]">${escape_html(QUESTION_TYPE_LABELS[question.type] || question.type)}</span> <span class="text-xs text-slate-400 ml-2">${escape_html(question.points)} poin</span></div></div> <button${attr_class(`btn-sm ${isDoubted ? "bg-amber-100 text-amber-700 border-2 border-amber-400" : "btn-ghost border border-slate-200"}`)}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg> ${escape_html(isDoubted ? "Diragu-ragukan" : "Ragu-ragu")}</button></div> `);
    if (question.media_type === "image" && question.media_url) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-xl overflow-hidden border border-slate-200 bg-white"><img${attr("src", question.media_url)}${attr("alt", `Media soal ${stringify(question.question_number)}`)} class="max-w-full h-auto max-h-80 mx-auto object-contain" loading="lazy"/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (question.media_type === "audio" && question.media_url) {
      $$renderer2.push("<!--[0-->");
      AudioPlayer($$renderer2, {
        src: question.media_url,
        maxPlays: question.audio_max_plays || 3
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="text-base text-slate-800 leading-relaxed font-medium">${html(question.question_text)}</div> <div class="space-y-2">`);
    if (question.type === "pilihan_ganda") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(options);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let option = each_array[i];
        $$renderer2.push(`<button${attr_class(`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${answer === optionLetters[i] ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/10" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"}`)}><span${attr_class(`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${answer === optionLetters[i] ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "bg-slate-100 text-slate-500"}`)}>${escape_html(optionLetters[i])}</span> <span${attr_class(`text-sm ${answer === optionLetters[i] ? "text-indigo-700 font-medium" : "text-slate-700"}`)}>${escape_html(option)}</span></button>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else if (question.type === "benar_salah") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="grid grid-cols-2 gap-3"><!--[-->`);
      const each_array_1 = ensure_array_like(["Benar", "Salah"]);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let opt = each_array_1[$$index_1];
        $$renderer2.push(`<button${attr_class(`p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${answer === opt ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-500/10" : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50"}`)}>${escape_html(opt)}</button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else if (question.type === "isian_singkat") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<input type="text" class="input text-base" placeholder="Ketik jawaban singkat di sini..."${attr("value", answer)}/>`);
    } else if (question.type === "essay") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<textarea class="input text-base min-h-[200px] resize-y" placeholder="Tulis jawaban uraian di sini..." rows="8">`);
      const $$body = escape_html(answer);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea>`);
    } else if (question.type === "menjodohkan") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array_2 = ensure_array_like(matchingLeft);
      for (let leftIdx = 0, $$length = each_array_2.length; leftIdx < $$length; leftIdx++) {
        let leftItem = each_array_2[leftIdx];
        $$renderer2.push(`<div class="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200"><span class="flex-1 text-sm font-medium text-slate-700">${escape_html(leftItem)}</span> <svg class="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg> `);
        $$renderer2.select(
          {
            class: "select max-w-[200px]",
            value: matchingAnswers[String(leftIdx)] ?? ""
          },
          ($$renderer3) => {
            $$renderer3.option({ value: "" }, ($$renderer4) => {
              $$renderer4.push(`-- Pilih --`);
            });
            $$renderer3.push(`<!--[-->`);
            const each_array_3 = ensure_array_like(matchingRight);
            for (let rightIdx = 0, $$length2 = each_array_3.length; rightIdx < $$length2; rightIdx++) {
              let rightItem = each_array_3[rightIdx];
              $$renderer3.option({ value: String(rightIdx) }, ($$renderer4) => {
                $$renderer4.push(`${escape_html(rightItem)}`);
              });
            }
            $$renderer3.push(`<!--]-->`);
          }
        );
        $$renderer2.push(`</div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { question, answer, isDoubted });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let attempt, questions, answerMap, currentQuestion, answeredCount, doubtedCount, unansweredCount;
    let data = $$props["data"];
    let currentIndex = 0;
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
    head("1ftx0z9", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(attempt.exam_title)} — Ujian Online Madrasah</title>`);
      });
    });
    Toast($$renderer2);
    $$renderer2.push(`<!----> <div class="min-h-screen bg-slate-50 flex flex-col"><header class="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3"><div class="max-w-4xl mx-auto flex items-center justify-between gap-3"><div class="flex-1 min-w-0"><h1 class="text-sm font-bold text-slate-800 truncate">${escape_html(attempt.exam_title)}</h1> <p class="text-xs text-slate-500">${escape_html(attempt.subject || "")} · Soal ${escape_html(currentIndex + 1)}/${escape_html(questions.length)}</p></div> `);
    Timer($$renderer2, { endTime: attempt.end_time });
    $$renderer2.push(`<!----></div> <div class="max-w-4xl mx-auto mt-2"><div class="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"${attr_style(`width: ${stringify(answeredCount / questions.length * 100)}%`)}></div></div></div></header> <main class="flex-1 max-w-4xl mx-auto w-full px-4 py-6">`);
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
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
