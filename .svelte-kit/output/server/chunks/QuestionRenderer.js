import { m as fallback, k as attr, j as attr_class, a as attr_style, e as escape_html, f as bind_props, c as stringify, i as ensure_array_like } from "./index.js";
import { Q as QUESTION_TYPE_LABELS } from "./constants.js";
import "katex/dist/contrib/auto-render.mjs";
/* empty css                                               */
import { h as html } from "./html.js";
function AudioPlayer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let src = $$props["src"];
    let maxPlays = fallback($$props["maxPlays"], 3);
    let playCount = 0;
    let currentTime = 0;
    let duration = 0;
    let progress = 0;
    let canPlay = true;
    let isGoogleDrive = false;
    let gDrivePreviewUrl = "";
    function formatTime(secs) {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s.toString().padStart(2, "0")}`;
    }
    {
      if (src && src.includes("drive.google.com/file/d/")) {
        isGoogleDrive = true;
        const match = src.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          const id = match[1];
          gDrivePreviewUrl = `https://drive.google.com/file/d/${id}/preview`;
          try {
            const urlObj = new URL(src);
            const resourceKey = urlObj.searchParams.get("resourcekey");
            if (resourceKey) gDrivePreviewUrl += `?resourcekey=${resourceKey}`;
          } catch (e) {
          }
        }
      }
    }
    canPlay = playCount < maxPlays;
    if (
      // Do not initialize HTML5 audio for Google Drive
      isGoogleDrive
    ) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden"><iframe${attr("src", gDrivePreviewUrl)} title="Audio Preview" class="w-full h-[140px] border-0" allow="autoplay"></iframe> <div class="p-3 bg-amber-50 border-t border-amber-100 text-xs text-amber-700 flex items-start gap-2 leading-relaxed"><svg class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <p><b>Catatan:</b> File audio ini di-host di Google Drive. Kebijakan keamanan Google mematikan fitur pemutar bawaan kami, sehingga <b>Batas Putar (Max Plays) tidak berlaku</b> untuk file ini. Kami menyarankan Anda memindahkan audio ke layanan <i>hosting</i> langsung (seperti Vocaroo) jika fitur batasan putar dibutuhkan.</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-3"><div class="flex items-center gap-3"><button${attr_class(`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${canPlay ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105" : "bg-slate-300 text-slate-500 cursor-not-allowed"}`)}${attr("disabled", !canPlay, true)}${attr("title", canPlay ? "Putar" : "Batas putar tercapai")}>`);
      {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>`);
      }
      $$renderer2.push(`<!--]--></button> <div class="flex-1 min-w-0 relative flex flex-col justify-center group pt-1"><div class="absolute inset-x-0 top-3 h-2 bg-slate-200 rounded-full overflow-hidden pointer-events-none"><div${attr_class(`h-full bg-gradient-to-r from-indigo-500 to-violet-500 ${"transition-all duration-150"}`)}${attr_style(`width: ${stringify(progress)}%`)}></div></div> <input type="range" min="0"${attr("max", 100)} step="0.1"${attr("value", currentTime)} class="w-full h-4 appearance-none bg-transparent cursor-pointer relative z-10 [&amp;::-webkit-slider-thumb]:appearance-none [&amp;::-webkit-slider-thumb]:w-4 [&amp;::-webkit-slider-thumb]:h-4 [&amp;::-webkit-slider-thumb]:bg-white [&amp;::-webkit-slider-thumb]:rounded-full [&amp;::-webkit-slider-thumb]:shadow-md [&amp;::-webkit-slider-thumb]:border [&amp;::-webkit-slider-thumb]:border-indigo-300 [&amp;::-webkit-slider-thumb]:transition-transform hover:[&amp;::-webkit-slider-thumb]:scale-125 [&amp;::-moz-range-thumb]:w-4 [&amp;::-moz-range-thumb]:h-4 [&amp;::-moz-range-thumb]:bg-white [&amp;::-moz-range-thumb]:rounded-full [&amp;::-moz-range-thumb]:border [&amp;::-moz-range-thumb]:border-indigo-300 [&amp;::-moz-range-thumb]:shadow-md [&amp;::-moz-range-thumb]:transition-transform hover:[&amp;::-moz-range-thumb]:scale-125 focus:outline-none"${attr("disabled", !canPlay && playCount >= maxPlays, true)}/> <div class="flex justify-between mt-1"><span class="text-xs text-slate-500 font-medium">${escape_html(formatTime(currentTime))}</span> <span class="text-xs font-medium text-slate-500 min-w-[36px] text-right">${escape_html(formatTime(duration))}</span></div></div> <div class="flex-shrink-0 text-center"><div${attr_class(`text-xs font-bold ${canPlay ? "text-indigo-600" : "text-rose-500"}`)}>${escape_html(playCount)}/${escape_html(maxPlays)}</div> <div class="text-[10px] text-slate-400">putar</div></div></div></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { src, maxPlays });
  });
}
function QuestionRenderer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let options, matchingLeft, matchingRight, directMediaUrl;
    let question = $$props["question"];
    let answer = fallback($$props["answer"], "");
    let isDoubted = fallback($$props["isDoubted"], false);
    let displayNumber = fallback($$props["displayNumber"], void 0);
    let matchingAnswers = {};
    const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
    function getDirectUrl(url) {
      if (!url) return "";
      if (question.media_type === "audio") return url;
      if (url.includes("drive.google.com/file/d/")) {
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          const id = match[1];
          let directLink = `https://drive.google.com/uc?export=download&id=${id}`;
          try {
            const urlObj = new URL(url);
            const resourceKey = urlObj.searchParams.get("resourcekey");
            if (resourceKey) {
              directLink += `&resourcekey=${resourceKey}`;
            }
          } catch (e) {
          }
          return directLink;
        }
      }
      return url;
    }
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
    directMediaUrl = getDirectUrl(question.media_url);
    $$renderer2.push(`<div class="space-y-5 animate-in" role="presentation"><div class="flex items-center justify-between flex-wrap gap-2"><div class="flex items-center gap-3"><span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20">${escape_html(
      // Image Lightbox
      displayNumber !== void 0 ? displayNumber : question.question_number
    )}</span> <div><span class="badge-primary text-[10px]">${escape_html(QUESTION_TYPE_LABELS[question.type] || question.type)}</span> <span class="text-xs text-slate-400 ml-2">${escape_html(question.points)} poin</span></div></div> <button${attr_class(`btn-sm ${isDoubted ? "bg-amber-100 text-amber-700 border-2 border-amber-400" : "btn-ghost border border-slate-200"}`)}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg> ${escape_html(isDoubted ? "Diragu-ragukan" : "Ragu-ragu")}</button></div> `);
    if (question.media_type === "image" && directMediaUrl) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-xl overflow-hidden border border-slate-200 bg-white"><img${attr("src", directMediaUrl)}${attr("alt", `Media soal ${stringify(question.question_number)}`)} class="max-w-full h-auto max-h-80 mx-auto object-contain" loading="lazy"/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (question.media_type === "audio" && directMediaUrl) {
      $$renderer2.push("<!--[0-->");
      AudioPlayer($$renderer2, { src: directMediaUrl, maxPlays: question.audio_max_plays || 3 });
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
        $$renderer2.push(`<div role="button" tabindex="0"${attr_class(`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${answer === optionLetters[i] ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/10" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"}`)}><span${attr_class(`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${answer === optionLetters[i] ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "bg-slate-100 text-slate-500"}`)}>${escape_html(optionLetters[i])}</span> <div${attr_class(`option-content text-sm prose prose-sm max-w-none flex-1 ${answer === optionLetters[i] ? "text-indigo-700 font-medium" : "text-slate-700"}`, "svelte-v7h8kb")}>${html(option.replace(/^(<br\s*\/?>\s*)+/i, ""))}</div></div>`);
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
      $$renderer2.push(`<input type="search"${attr("name", `jawaban_siswa_${stringify(question.id)}_${stringify(Date.now())}`)}${attr("id", `jawaban_siswa_${stringify(question.id)}`)} data-lpignore="true" data-form-type="other" class="input text-base appearance-none" placeholder="Ketik jawaban singkat di sini..."${attr("value", answer)} autocomplete="do-not-autofill" autocorrect="off" autocapitalize="off" spellcheck="false"/>`);
    } else if (question.type === "essay") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<textarea${attr("name", `jawaban_uraian_${stringify(question.id)}_${stringify(Date.now())}`)}${attr("id", `jawaban_uraian_${stringify(question.id)}`)} data-lpignore="true" data-form-type="other" class="input text-base min-h-[200px] resize-y appearance-none" placeholder="Tulis jawaban uraian di sini..." rows="8" autocomplete="do-not-autofill" autocorrect="off" autocapitalize="off" spellcheck="false">`);
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
        $$renderer2.push(`<div class="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200"><span class="flex-1 text-sm font-medium text-slate-700 prose prose-sm max-w-none">${html(leftItem)}</span> <svg class="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg> `);
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
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { question, answer, isDoubted, displayNumber });
  });
}
export {
  QuestionRenderer as Q
};
