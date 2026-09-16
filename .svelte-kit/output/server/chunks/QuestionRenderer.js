import { m as fallback, k as attr, j as attr_class, a as attr_style, e as escape_html, f as bind_props, c as stringify, i as ensure_array_like } from "./index.js";
import { o as onDestroy } from "./index-server.js";
import { Q as QUESTION_TYPE_LABELS } from "./constants.js";
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
function ImageZoomModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let zoomPercentage;
    let src = fallback($$props["src"], null);
    let alt = fallback($$props["alt"], "Pratinjau Gambar");
    let isOpen = fallback($$props["isOpen"], false);
    let scale = 1;
    const minScale = 1;
    const maxScale = 4;
    const stepScale = 0.1;
    let translateX = 0;
    let translateY = 0;
    onDestroy(() => {
    });
    zoomPercentage = Math.round(scale * 100);
    if (isOpen && src) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between select-none overflow-hidden animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-label="Penampil Gambar" tabindex="-1"><div class="relative z-30 flex items-center justify-between gap-3 px-3 py-2.5 sm:px-6 sm:py-4 pt-[max(0.75rem,env(safe-area-inset-top))] bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent"><div class="flex items-center gap-2 sm:gap-2.5 text-white min-w-0 flex-1"><div class="p-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 shrink-0"><svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg></div> <div class="min-w-0 flex-1"><h3 class="text-xs sm:text-base font-semibold text-slate-100 leading-tight truncate">Perbesar Gambar Soal</h3> <p class="text-[10px] sm:text-xs text-slate-400 hidden sm:block truncate">Gunakan slider zoom di bawah atau geser gambar untuk melihat detail</p></div></div> <button type="button" class="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-800/90 hover:bg-rose-600 active:bg-rose-700 text-slate-200 hover:text-white border border-slate-700 hover:border-rose-500 transition-all duration-150 shadow-lg cursor-pointer shrink-0" title="Tutup (Esc)" aria-label="Tutup penampil gambar"><svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>  <div${attr_class("relative flex-1 w-full h-full flex items-center justify-center overflow-hidden p-2 sm:p-6", void 0, {
        "cursor-grab": scale > 1,
        "cursor-grabbing": scale > 1,
        "cursor-zoom-in": scale === 1
      })}><img${attr("src", src)}${attr("alt", alt)} draggable="false" class="max-w-[94vw] max-h-[70vh] sm:max-h-[76vh] object-contain shadow-2xl rounded-lg pointer-events-none select-none transition-transform duration-75 ease-out"${attr_style(`transform: translate(${stringify(translateX)}px, ${stringify(translateY)}px) scale(${stringify(scale)}); transform-origin: center center;`)}/></div> <div class="relative z-30 pb-[max(0.75rem,env(safe-area-inset-bottom))] px-2.5 sm:px-4 flex flex-col items-center gap-1.5 sm:gap-2 w-full"><div class="flex items-center justify-between gap-1.5 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-2xl bg-slate-900/95 border border-slate-700/90 shadow-2xl backdrop-blur-xl w-full max-w-lg box-border"><button type="button" class="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"${attr("disabled", scale <= minScale, true)} title="Perkecil (-)"><svg class="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"></path></svg></button> <div class="flex items-center flex-1 min-w-[50px] sm:min-w-[120px] px-0.5 sm:px-1"><input type="range"${attr("min", minScale)}${attr("max", maxScale)}${attr("step", stepScale)}${attr("value", scale)} class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 focus:outline-none" aria-label="Tingkat Zoom Gambar"/></div> <button type="button" class="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"${attr("disabled", scale >= maxScale, true)} title="Perbesar (+)"><svg class="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg></button> <div class="h-5 sm:h-6 w-px bg-slate-700/80 shrink-0"></div> <button type="button" class="px-1.5 sm:px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-[11px] sm:text-xs font-bold text-indigo-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1 shrink-0" title="Reset Zoom ke 100%"><span>${escape_html(zoomPercentage)}%</span> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></button> <div class="h-5 sm:h-6 w-px bg-slate-700/80 shrink-0"></div> <button type="button" class="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-[11px] sm:text-xs font-bold border border-rose-500 transition-all flex items-center gap-1 shrink-0 shadow-sm cursor-pointer" title="Tutup penampil gambar"><svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg> <span>Tutup</span></button></div> <div class="text-[10px] sm:text-[11px] text-slate-400 font-medium text-center flex items-center gap-1.5 sm:gap-2"><span>💡 Klik ganda: zoom</span> <span class="text-slate-600">•</span> <span>Geser gambar saat zoom</span></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { src, alt, isOpen });
  });
}
function QuestionRenderer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let safeOptions, safeType, matchingLeft, matchingRight, benarSalahStatements, directMediaUrl;
    let question = $$props["question"];
    let answer = fallback($$props["answer"], "");
    let isDoubted = fallback($$props["isDoubted"], false);
    let displayNumber = fallback($$props["displayNumber"], void 0);
    let options = [];
    function getOptionHtml(opt) {
      if (opt == null) return "";
      if (typeof opt === "object") {
        const str = opt.html || opt.text || opt.label || opt.content || "";
        return String(str).replace(/^(<br\s*\/?>\s*)+/i, "");
      }
      return String(opt).replace(/^(<br\s*\/?>\s*)+/i, "");
    }
    let matchingAnswers = {};
    let complexAnswers = [];
    let benarSalahAnswers = {};
    const MATCH_COLORS = [
      {
        border: "border-blue-500",
        bg: "bg-blue-50/90",
        ring: "ring-blue-400",
        badge: "bg-blue-600 text-white",
        stroke: "#3b82f6",
        hex: "#3b82f6"
      },
      {
        border: "border-emerald-500",
        bg: "bg-emerald-50/90",
        ring: "ring-emerald-400",
        badge: "bg-emerald-600 text-white",
        stroke: "#10b981",
        hex: "#10b981"
      },
      {
        border: "border-purple-500",
        bg: "bg-purple-50/90",
        ring: "ring-purple-400",
        badge: "bg-purple-600 text-white",
        stroke: "#8b5cf6",
        hex: "#8b5cf6"
      },
      {
        border: "border-amber-500",
        bg: "bg-amber-50/90",
        ring: "ring-amber-400",
        badge: "bg-amber-600 text-white",
        stroke: "#f59e0b",
        hex: "#f59e0b"
      },
      {
        border: "border-rose-500",
        bg: "bg-rose-50/90",
        ring: "ring-rose-400",
        badge: "bg-rose-600 text-white",
        stroke: "#f43f5e",
        hex: "#f43f5e"
      },
      {
        border: "border-cyan-500",
        bg: "bg-cyan-50/90",
        ring: "ring-cyan-400",
        badge: "bg-cyan-600 text-white",
        stroke: "#06b6d4",
        hex: "#06b6d4"
      },
      {
        border: "border-indigo-500",
        bg: "bg-indigo-50/90",
        ring: "ring-indigo-400",
        badge: "bg-indigo-600 text-white",
        stroke: "#6366f1",
        hex: "#6366f1"
      },
      {
        border: "border-orange-500",
        bg: "bg-orange-50/90",
        ring: "ring-orange-400",
        badge: "bg-orange-600 text-white",
        stroke: "#f97316",
        hex: "#f97316"
      }
    ];
    let selectedLeftIdx = null;
    let selectedRightIdx = null;
    let connectionLines = [];
    let recalcRaf = null;
    function scheduleRecalculate() {
      if (recalcRaf) cancelAnimationFrame(recalcRaf);
      recalcRaf = requestAnimationFrame(() => {
      });
      setTimeout(() => recalculateLines(), 40);
      setTimeout(() => recalculateLines(), 120);
      setTimeout(() => recalculateLines(), 250);
    }
    function recalculateLines() {
      return;
    }
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
    let lightboxImage = null;
    {
      const raw = question?.options_json;
      if (raw) {
        if (typeof raw === "object") {
          options = raw;
        } else if (typeof raw === "string") {
          try {
            let parsed = JSON.parse(raw);
            if (typeof parsed === "string") {
              try {
                parsed = JSON.parse(parsed);
              } catch {
              }
            }
            options = parsed || [];
          } catch (e) {
            console.error("Invalid options_json for question", question?.id, e);
            options = [];
          }
        } else {
          options = [];
        }
      } else if (question?.options) {
        options = question.options;
      } else {
        options = [];
      }
    }
    safeOptions = Array.isArray(options) ? options : [];
    safeType = (question?.type || "").trim().toLowerCase();
    matchingLeft = safeType === "menjodohkan" && options?.left ? options.left : [];
    matchingRight = safeType === "menjodohkan" && options?.right ? options.right : [];
    if (safeType === "menjodohkan" && answer) {
      try {
        matchingAnswers = JSON.parse(answer);
      } catch {
        matchingAnswers = {};
      }
    }
    if (safeType === "pilihan_ganda_kompleks") {
      if (answer) {
        try {
          const parsed = JSON.parse(answer);
          complexAnswers = Array.isArray(parsed) ? parsed : [];
        } catch {
          complexAnswers = [];
        }
      } else {
        complexAnswers = [];
      }
    }
    benarSalahStatements = safeType === "benar_salah" && options?.statements && Array.isArray(options.statements) ? options.statements : [];
    if (safeType === "benar_salah" && answer) {
      try {
        const parsed = JSON.parse(answer);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          benarSalahAnswers = parsed;
        } else {
          benarSalahAnswers = { "0": String(answer) };
        }
      } catch {
        benarSalahAnswers = { "0": String(answer) };
      }
    } else if (safeType === "benar_salah" && !answer) {
      benarSalahAnswers = {};
    }
    if (safeType === "menjodohkan" && (matchingAnswers || matchingLeft || matchingRight)) {
      scheduleRecalculate();
    }
    directMediaUrl = getDirectUrl(question.media_url);
    $$renderer2.push(`<div class="space-y-5 animate-in" role="presentation"><div class="flex items-center justify-between flex-wrap gap-2"><div class="flex items-center gap-3"><span class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-500/20">${escape_html(
      // Image Lightbox
      displayNumber !== void 0 ? displayNumber : question.question_number
    )}</span> <div><span class="badge-primary text-[10px]">${escape_html(QUESTION_TYPE_LABELS[question.type] || question.type)}</span> <span class="text-xs text-slate-400 ml-2">${escape_html(question.points)} poin</span></div></div> <button${attr_class(`btn-sm ${isDoubted ? "bg-amber-100 text-amber-700 border-2 border-amber-400" : "btn-ghost border border-slate-200"}`)}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg> ${escape_html(isDoubted ? "Diragu-ragukan" : "Ragu-ragu")}</button></div> `);
    if (question.media_type === "image" && directMediaUrl) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="rounded-xl overflow-hidden border border-slate-200 bg-white hover:border-indigo-300 transition-colors shadow-xs"><img${attr("src", directMediaUrl)}${attr("alt", `Media soal ${stringify(question.question_number)}`)} class="max-w-full h-auto max-h-80 mx-auto object-contain cursor-zoom-in hover:opacity-95 transition-opacity" loading="lazy" title="Klik untuk memperbesar gambar"/></div>`);
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
    $$renderer2.push(`<!--]--> <div class="text-base text-slate-800 leading-relaxed font-medium prose prose-sm max-w-none">${html(question.question_text)}</div> <div class="space-y-2">`);
    if (safeType === "pilihan_ganda" || safeType === "pilihan_ganda_kompleks") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(safeOptions);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let option = each_array[i];
        const isSelected = safeType === "pilihan_ganda_kompleks" ? complexAnswers.includes(optionLetters[i]) : answer === optionLetters[i];
        $$renderer2.push(`<div role="button" tabindex="0"${attr_class(`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${isSelected ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-500/10" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"}`)}>`);
        if (safeType === "pilihan_ganda_kompleks") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div${attr_class(`flex items-center justify-center w-6 h-6 rounded border-2 flex-shrink-0 transition-colors mr-1 ${isSelected ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-300 bg-white"}`)}>`);
          if (isSelected) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <span${attr_class(`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${isSelected ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white" : "bg-slate-100 text-slate-500"}`)}>${escape_html(optionLetters[i])}</span> <div${attr_class(`option-content text-sm prose prose-sm max-w-none flex-1 ${isSelected ? "text-indigo-700 font-medium" : "text-slate-700"}`, "svelte-v7h8kb")}>${html(getOptionHtml(option))}</div></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else if (safeType === "benar_salah") {
      $$renderer2.push("<!--[1-->");
      if (benarSalahStatements.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs"><table class="w-full text-xs sm:text-sm border-collapse text-left table-fixed"><thead><tr class="bg-slate-50 border-b border-slate-200 text-slate-700"><th class="py-2.5 sm:py-3 px-1.5 sm:px-3 w-8 sm:w-12 text-center font-semibold">No</th><th class="py-2.5 sm:py-3 px-2 sm:px-4 font-semibold">Pernyataan</th><th class="py-2.5 sm:py-3 px-1 sm:px-3 w-14 sm:w-28 text-center font-semibold text-emerald-700 bg-emerald-50/50"><span class="sm:hidden">B</span> <span class="hidden sm:inline">Benar</span></th><th class="py-2.5 sm:py-3 px-1 sm:px-3 w-14 sm:w-28 text-center font-semibold text-rose-700 bg-rose-50/50"><span class="sm:hidden">S</span> <span class="hidden sm:inline">Salah</span></th></tr></thead><tbody class="divide-y divide-slate-100"><!--[-->`);
        const each_array_1 = ensure_array_like(benarSalahStatements);
        for (let idx = 0, $$length = each_array_1.length; idx < $$length; idx++) {
          let stmt = each_array_1[idx];
          const choice = benarSalahAnswers[String(idx)];
          $$renderer2.push(`<tr class="hover:bg-slate-50/70 transition-colors"><td class="py-2.5 sm:py-3.5 px-1.5 sm:px-3 text-center text-slate-500 font-semibold">${escape_html(idx + 1)}</td><td class="py-2.5 sm:py-3.5 px-2 sm:px-4 text-slate-800 prose prose-sm max-w-none break-words">${html(stmt)}</td><td class="py-2.5 sm:py-3.5 px-1 sm:px-2 text-center bg-emerald-50/20"><button type="button"${attr_class(`w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg border-2 font-bold sm:font-medium text-xs transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${choice === "Benar" ? "bg-emerald-500 border-emerald-500 text-white shadow-xs" : "border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50"}`)} title="Benar"><span${attr_class(`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border flex items-center justify-center shrink-0 ${choice === "Benar" ? "border-white bg-white" : "border-slate-400"}`)}>`);
          if (choice === "Benar") {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></span> <span class="sm:hidden">B</span> <span class="hidden sm:inline">Benar</span></button></td><td class="py-2.5 sm:py-3.5 px-1 sm:px-2 text-center bg-rose-50/20"><button type="button"${attr_class(`w-full py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg border-2 font-bold sm:font-medium text-xs transition-all flex items-center justify-center gap-1 sm:gap-1.5 ${choice === "Salah" ? "bg-rose-500 border-rose-500 text-white shadow-xs" : "border-slate-200 text-slate-600 hover:border-rose-300 hover:bg-rose-50/50"}`)} title="Salah"><span${attr_class(`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border flex items-center justify-center shrink-0 ${choice === "Salah" ? "border-white bg-white" : "border-slate-400"}`)}>`);
          if (choice === "Salah") {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></span> <span class="sm:hidden">S</span> <span class="hidden sm:inline">Salah</span></button></td></tr>`);
        }
        $$renderer2.push(`<!--]--></tbody></table></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div class="grid grid-cols-2 gap-3"><!--[-->`);
        const each_array_2 = ensure_array_like(["Benar", "Salah"]);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let opt = each_array_2[$$index_2];
          $$renderer2.push(`<button${attr_class(`p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${answer === opt ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-500/10" : "border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50"}`)}>${escape_html(opt)}</button>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    } else if (safeType === "isian_singkat") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<input type="search"${attr("name", `jawaban_siswa_${stringify(question.id)}_${stringify(Date.now())}`)}${attr("id", `jawaban_siswa_${stringify(question.id)}`)} data-lpignore="true" data-form-type="other" class="input text-base appearance-none" placeholder="Ketik jawaban singkat di sini..."${attr("value", answer)} autocomplete="do-not-autofill" autocorrect="off" autocapitalize="off" spellcheck="false"/>`);
    } else if (safeType === "essay") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<textarea${attr("name", `jawaban_uraian_${stringify(question.id)}_${stringify(Date.now())}`)}${attr("id", `jawaban_uraian_${stringify(question.id)}`)} data-lpignore="true" data-form-type="other" class="input text-base min-h-[200px] resize-y appearance-none" placeholder="Tulis jawaban uraian di sini..." rows="8" autocomplete="do-not-autofill" autocorrect="off" autocapitalize="off" spellcheck="false">`);
      const $$body = escape_html(answer);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea>`);
    } else if (safeType === "menjodohkan") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<div class="space-y-3"><div class="flex items-center justify-between p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-800"><div class="flex items-center gap-2"><span class="text-base">🔗</span> <span><b>Petunjuk Menjodohkan:</b> Klik pernyataan di kiri lalu klik jawaban pasangannya di kanan untuk menghubungkan.</span></div> `);
      if (Object.keys(matchingAnswers).length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="font-semibold px-2 py-0.5 bg-indigo-200/70 rounded-full text-indigo-900 text-[11px] shrink-0">${escape_html(Object.keys(matchingAnswers).length)} dari ${escape_html(matchingLeft.length)} terhubung</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="relative"><svg${attr("id", `match-svg-${stringify(question.id)}`)} class="absolute inset-0 w-full h-full pointer-events-none z-20 block overflow-visible"><!--[-->`);
      const each_array_3 = ensure_array_like(connectionLines);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let line = each_array_3[$$index_3];
        const dx = Math.abs(line.x2 - line.x1) * 0.45;
        $$renderer2.push(`<path${attr("d", `M ${stringify(line.x1)} ${stringify(line.y1)} C ${stringify(line.x1 + dx)} ${stringify(line.y1)}, ${stringify(line.x2 - dx)} ${stringify(line.y2)}, ${stringify(line.x2)} ${stringify(line.y2)}`)} fill="none"${attr("stroke", line.color)} stroke-width="5" stroke-opacity="0.2" stroke-linecap="round"></path><path${attr("d", `M ${stringify(line.x1)} ${stringify(line.y1)} C ${stringify(line.x1 + dx)} ${stringify(line.y1)}, ${stringify(line.x2 - dx)} ${stringify(line.y2)}, ${stringify(line.x2)} ${stringify(line.y2)}`)} fill="none"${attr("stroke", line.color)} stroke-width="2.5" stroke-linecap="round"></path><circle${attr("cx", line.x1)}${attr("cy", line.y1)} r="4"${attr("fill", line.color)} stroke="#ffffff" stroke-width="1.5"></circle><circle${attr("cx", line.x2)}${attr("cy", line.y2)} r="4"${attr("fill", line.color)} stroke="#ffffff" stroke-width="1.5"></circle>`);
      }
      $$renderer2.push(`<!--]--></svg> <div class="grid grid-cols-2 gap-2 sm:gap-4 relative z-10"><div class="space-y-2 sm:space-y-3"><div class="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Kolom Kiri (Pernyataan)</div> <!--[-->`);
      const each_array_4 = ensure_array_like(matchingLeft);
      for (let leftIdx = 0, $$length = each_array_4.length; leftIdx < $$length; leftIdx++) {
        let leftItem = each_array_4[leftIdx];
        const hasMatch = matchingAnswers[String(leftIdx)] !== void 0;
        const matchedRightIdx = hasMatch ? Number(matchingAnswers[String(leftIdx)]) : null;
        const pairColor = hasMatch ? MATCH_COLORS[leftIdx % MATCH_COLORS.length] : null;
        const isSelected = selectedLeftIdx === leftIdx;
        $$renderer2.push(`<div role="button" tabindex="0"${attr_class(
          `relative flex items-center justify-between gap-1.5 sm:gap-3 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none text-left ${hasMatch ? `${pairColor.bg} ${pairColor.border} shadow-xs` : isSelected ? "border-indigo-600 bg-indigo-50/70 ring-2 sm:ring-4 ring-indigo-500/20 shadow-sm" : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/70"}`,
          "svelte-v7h8kb"
        )}><div class="flex items-start gap-1.5 sm:gap-2.5 flex-1 min-w-0"><span${attr_class(
          `w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 transition-colors ${stringify(hasMatch ? pairColor.badge : isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600")}`,
          "svelte-v7h8kb"
        )}>${escape_html(leftIdx + 1)}</span> <div class="flex-1 min-w-0"><div${attr_class(`text-xs sm:text-sm font-medium ${hasMatch ? "text-slate-900 font-semibold" : "text-slate-700"} prose prose-sm max-w-none break-words`)}>${html(leftItem)}</div> `);
        if (hasMatch && matchedRightIdx !== null) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="flex items-center gap-1 mt-1 sm:mt-2 flex-wrap"><span${attr_class(`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-bold ${stringify(pairColor.badge)} shadow-xs`, "svelte-v7h8kb")}>➔ [${escape_html(String.fromCharCode(65 + matchedRightIdx))}]</span> <button type="button" class="px-1 py-0.5 rounded text-[9px] sm:text-[11px] bg-white/80 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 transition-colors" title="Hapus Sambungan">✕</button></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div${attr("id", `match-port-left-${stringify(question.id)}-${stringify(leftIdx)}`)}${attr_class(
          `w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ml-0.5 sm:ml-1 ${hasMatch ? `${pairColor.border} bg-white shadow-xs ring-1 sm:ring-2 ${pairColor.ring}` : isSelected ? "border-indigo-600 bg-indigo-600 ring-2 sm:ring-4 ring-indigo-500/30" : "border-slate-300 bg-slate-100"}`,
          "svelte-v7h8kb"
        )}>`);
        if (isSelected && !hasMatch) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping"></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="space-y-2 sm:space-y-3"><div class="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Kolom Kanan (Pilihan Jawaban)</div> <!--[-->`);
      const each_array_5 = ensure_array_like(matchingRight);
      for (let rightIdx = 0, $$length = each_array_5.length; rightIdx < $$length; rightIdx++) {
        let rightItem = each_array_5[rightIdx];
        const matchedLeftKeys = Object.keys(matchingAnswers).filter((k) => matchingAnswers[k] === String(rightIdx));
        const isMatched = matchedLeftKeys.length > 0;
        const primaryLeftIdx = isMatched ? Number(matchedLeftKeys[0]) : null;
        const pairColor = isMatched && primaryLeftIdx !== null ? MATCH_COLORS[primaryLeftIdx % MATCH_COLORS.length] : null;
        const isSelected = selectedRightIdx === rightIdx;
        $$renderer2.push(`<div role="button" tabindex="0"${attr_class(
          `relative flex items-center justify-between gap-1.5 sm:gap-3 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none text-left ${isMatched ? `${pairColor.bg} ${pairColor.border} shadow-xs` : isSelected ? "border-indigo-600 bg-indigo-50/70 ring-2 sm:ring-4 ring-indigo-500/20 shadow-sm" : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/70"}`,
          "svelte-v7h8kb"
        )}><div${attr("id", `match-port-right-${stringify(question.id)}-${stringify(rightIdx)}`)}${attr_class(
          `w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all mr-0.5 sm:mr-1 ${isMatched ? `${pairColor.border} bg-white shadow-xs ring-1 sm:ring-2 ${pairColor.ring}` : isSelected ? "border-indigo-600 bg-indigo-600 ring-2 sm:ring-4 ring-indigo-500/30" : "border-slate-300 bg-slate-100"}`,
          "svelte-v7h8kb"
        )}>`);
        if (isSelected && !isMatched) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-ping"></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <div class="flex items-start gap-1.5 sm:gap-2.5 flex-1 min-w-0"><span${attr_class(
          `w-5 h-5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 transition-colors ${stringify(isMatched ? pairColor.badge : isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600")}`,
          "svelte-v7h8kb"
        )}>${escape_html(String.fromCharCode(65 + rightIdx))}</span> <div class="flex-1 min-w-0"><div${attr_class(`text-xs sm:text-sm font-medium ${isMatched ? "text-slate-900 font-semibold" : "text-slate-700"} prose prose-sm max-w-none break-words`)}>${html(rightItem)}</div> `);
        if (isMatched) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="flex items-center gap-1 mt-1 sm:mt-2 flex-wrap"><!--[-->`);
          const each_array_6 = ensure_array_like(matchedLeftKeys);
          for (let $$index_5 = 0, $$length2 = each_array_6.length; $$index_5 < $$length2; $$index_5++) {
            let lKey = each_array_6[$$index_5];
            $$renderer2.push(`<span${attr_class(`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-bold ${stringify(MATCH_COLORS[Number(lKey) % MATCH_COLORS.length].badge)} shadow-xs`, "svelte-v7h8kb")}>No. ${escape_html(Number(lKey) + 1)}</span>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    ImageZoomModal($$renderer2, {
      src: lightboxImage,
      isOpen: false,
      alt: `Gambar Soal ${stringify(displayNumber !== void 0 ? displayNumber : question?.question_number || "")}`
    });
    $$renderer2.push(`<!---->`);
    bind_props($$props, { question, answer, isDoubted, displayNumber });
  });
}
export {
  QuestionRenderer as Q
};
