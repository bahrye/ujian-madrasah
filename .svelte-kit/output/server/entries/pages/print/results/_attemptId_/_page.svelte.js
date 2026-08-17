import { h as head, e as escape_html, k as attr, j as attr_class, i as ensure_array_like, f as bind_props } from "../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../chunks/date.js";
import { Q as QUESTION_TYPE_LABELS, I as ICONS } from "../../../../../chunks/constants.js";
import "katex/dist/contrib/auto-render.mjs";
import { h as html } from "../../../../../chunks/html.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let school, attempt, answers, locationStr;
    let data = $$props["data"];
    function safeParseJson(str, fallback = null) {
      if (!str) return fallback;
      try {
        const parsed = JSON.parse(str);
        if (typeof parsed === "string") {
          try {
            return JSON.parse(parsed);
          } catch {
            return parsed;
          }
        }
        return parsed;
      } catch {
        return fallback;
      }
    }
    function safeParseObjectEntries(str) {
      const parsed = safeParseJson(str, {});
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return Object.entries(parsed);
      }
      return [];
    }
    school = data.school;
    attempt = data.attempt;
    answers = data.answers || [];
    locationStr = [
      school?.district ? `Kec. ${school.district}` : "",
      school?.city ? school.city.toLowerCase().startsWith("kab") || school.city.toLowerCase().startsWith("kota") ? school.city : `Kab. ${school.city}` : "",
      school?.province ? school.province : ""
    ].filter(Boolean).join(", ");
    head("pp9uw4", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Hasil Ujian - ${escape_html(attempt.student_name)} - ${escape_html(attempt.exam_title)}</title>`);
      });
    });
    $$renderer2.push(`<div class="no-print fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur text-white px-4 py-2.5 shadow-xl flex items-center justify-between svelte-pp9uw4"><div class="flex items-center gap-3"><span class="font-bold text-sm">Cetak Detail Hasil Ujian</span> <span class="text-xs text-slate-400">(${escape_html(attempt.student_name)} — ${escape_html(attempt.exam_title)})</span></div> <div class="flex items-center gap-2"><button type="button" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors">Tampilan: ${escape_html("2 Kolom")}</button> <button type="button" class="btn-primary btn-sm flex items-center gap-1.5"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.print)}></path></svg> Cetak Sekarang (PDF)</button> <button type="button" class="btn-ghost btn-sm text-slate-300 hover:text-white">Tutup</button></div></div> <div class="min-h-screen bg-white text-slate-800 p-3 sm:p-5 print:p-0 print:m-0 pt-14 print:pt-0 font-serif"><div class="max-w-5xl mx-auto space-y-3 print:max-w-none"><div class="flex items-center justify-between gap-3 pb-1 relative"><img src="/kemenag.png" alt="Logo Kemenag" class="w-16 h-16 object-contain shrink-0"/> <div class="flex-1 text-center font-serif px-2"><h4 class="font-semibold text-xs uppercase tracking-wider text-black m-0 leading-tight">KEMENTERIAN AGAMA REPUBLIK INDONESIA</h4> <h3 class="font-bold text-lg uppercase tracking-wide text-black m-0 my-0.5">${escape_html(school?.name || "NAMA SEKOLAH")}</h3> `);
    if (school?.address) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-[11px] italic text-black m-0 leading-tight">${escape_html(school.address)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (locationStr) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-[11px] italic text-black m-0 leading-tight mt-0.5">${escape_html(locationStr)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (school?.logo_url) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", school.logo_url)} alt="Logo Sekolah" class="w-16 h-16 object-contain shrink-0"/>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="w-16 h-16 shrink-0"></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="mt-1 mb-3"><div style="border-bottom: 1px solid #000;"></div> <div style="border-bottom: 2px solid #000; margin-top: 2px;"></div></div> <div class="bg-slate-50 rounded-xl p-3 border border-slate-300 font-sans print:bg-slate-50 print:border-slate-300"><div class="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2.5"><h2 class="font-bold text-sm text-indigo-950 uppercase tracking-wide">Lembar Detail Hasil &amp; Jawaban Ujian</h2> <span class="text-[11px] font-semibold px-2.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-md print:border print:border-indigo-200">${escape_html(attempt.exam_title)}</span></div> <div class="grid grid-cols-3 gap-3 text-[11px]"><div class="space-y-0.5"><div><span class="text-slate-500">Nama Siswa:</span> <strong class="text-slate-900 block font-bold text-xs">${escape_html(attempt.student_name)}</strong></div> <div><span class="text-slate-500">NISN / No. Peserta:</span> <span class="font-semibold text-slate-800">${escape_html(attempt.nomor_peserta || attempt.nisn)}</span></div> <div><span class="text-slate-500">Kelas:</span> <span class="font-semibold text-slate-800">${escape_html(attempt.class_name || "-")}</span></div></div> <div class="space-y-0.5"><div><span class="text-slate-500">Mata Pelajaran:</span> <strong class="text-slate-900 block font-semibold">${escape_html(attempt.subject_name || "Umum")}</strong></div> <div><span class="text-slate-500">Waktu Selesai:</span> <span class="font-semibold text-slate-800">${escape_html(attempt.submit_time ? parseDate(attempt.submit_time).toLocaleString("id-ID") : "-")}</span></div> <div><span class="text-slate-500">Pelanggaran:</span> <span${attr_class(`font-semibold ${attempt.violation_count > 0 ? "text-rose-600" : "text-slate-800"}`)}>${escape_html(attempt.violation_count)} kali</span></div></div> <div class="flex items-center justify-end gap-2.5">`);
    if (attempt.signature) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center"><span class="text-[9px] text-slate-400 block mb-0.5">TTD Siswa</span> <img${attr("src", attempt.signature)} alt="TTD" class="h-9 object-contain mx-auto"/></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="bg-white p-2 rounded-lg border-2 border-indigo-200 text-center min-w-[85px] shadow-sm print:bg-white"><span class="text-[9px] font-bold uppercase text-slate-400 block">Nilai Akhir</span> <span${attr_class(`text-xl font-black ${(attempt.score ?? 0) >= 70 ? "text-emerald-600" : "text-rose-600"}`)}>${escape_html(attempt.score != null ? attempt.score.toFixed(1) : "-")}</span> <span class="text-[9px] font-medium text-slate-500 block mt-0.5">Poin: ${escape_html(attempt.score ? Math.round(attempt.score / 100 * attempt.total_points) : 0)}/${escape_html(attempt.total_points)}</span></div></div></div></div> <div class="font-sans"><div class="flex items-center justify-between mb-2"><h3 class="font-bold text-xs uppercase text-slate-700 tracking-wider">Rincian Jawaban Soal (${escape_html(answers.length)} Soal)</h3></div> <div${attr_class(
      "grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-2.5"
    )}><!--[-->`);
    const each_array = ensure_array_like(answers);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let ans = each_array[i];
      $$renderer2.push(`<div${attr_class(
        `break-inside-avoid bg-white rounded-lg border-2 p-2.5 text-[11px] shadow-sm print:shadow-none flex flex-col justify-between ${ans.score_given === ans.max_points ? "border-emerald-400 bg-emerald-50/10" : ans.score_given > 0 ? "border-amber-400 bg-amber-50/10" : "border-rose-400 bg-rose-50/10"}`,
        "svelte-pp9uw4"
      )}><div><div class="flex items-center justify-between border-b border-slate-100 pb-1 mb-1.5 gap-2"><div class="flex items-center gap-1.5 flex-wrap"><span class="font-bold text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">Soal #${escape_html(ans.question_number)}</span> <span class="text-[10px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">${escape_html(QUESTION_TYPE_LABELS[ans.type])}</span> `);
      if (ans.is_doubted) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-[10px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Ragu</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="font-bold text-xs whitespace-nowrap"><span${attr_class(ans.score_given === ans.max_points ? "text-emerald-600" : ans.score_given > 0 ? "text-amber-600" : "text-rose-600")}>${escape_html(ans.score_given ?? 0)}</span> <span class="text-slate-400 font-normal">/${escape_html(ans.max_points)} Poin</span></div></div> <div class="prose prose-xs max-w-none text-slate-800 mb-2 bg-slate-50 p-2 rounded border border-slate-200/60 font-serif leading-snug text-[11px]">${html(ans.question_text)}</div></div> <div class="space-y-1.5 mt-auto pt-0.5"><div${attr_class(`rounded p-1.5 border ${ans.score_given === ans.max_points ? "bg-emerald-50/50 border-emerald-200" : ans.score_given > 0 ? "bg-amber-50/50 border-amber-200" : "bg-rose-50/50 border-rose-200"}`)}><div class="flex items-center justify-between mb-0.5"><span class="font-bold text-[10px] uppercase tracking-wider text-slate-600">Jawaban Siswa:</span> <span${attr_class(`text-[10px] font-semibold ${ans.score_given === ans.max_points ? "text-emerald-700" : ans.score_given > 0 ? "text-amber-700" : "text-rose-700"}`)}>`);
      if (ans.score_given === ans.max_points) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`Benar`);
      } else if (ans.score_given > 0) {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`Sebagian`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`Salah`);
      }
      $$renderer2.push(`<!--]--></span></div> `);
      if (!ans.answer_given) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="italic text-slate-400">Tidak dijawab</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        if (ans.type === "menjodohkan") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="space-y-0.5 text-[10px]"><!--[-->`);
          const each_array_1 = ensure_array_like(Object.entries(JSON.parse(ans.answer_given)));
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let [key, value] = each_array_1[$$index];
            $$renderer2.push(`<div class="flex border-b border-slate-200/50 last:border-0 pb-0.5"><span class="font-medium text-slate-700 w-1/2">${escape_html(key)}</span> <span class="text-slate-900 w-1/2">➔ ${escape_html(value)}</span></div>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else if (ans.type === "pilihan_ganda") {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<p class="font-medium text-slate-900 text-[11px]">`);
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
        } else if (ans.type === "pilihan_ganda_kompleks") {
          $$renderer2.push("<!--[2-->");
          const givenArr = typeof ans.answer_given === "string" && ans.answer_given.startsWith("[") ? JSON.parse(ans.answer_given) : [ans.answer_given];
          if (Array.isArray(givenArr)) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="flex flex-wrap gap-1"><!--[-->`);
            const each_array_2 = ensure_array_like(givenArr);
            for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
              let item = each_array_2[$$index_1];
              $$renderer2.push(`<span class="px-1.5 py-0.5 bg-white text-slate-800 rounded border border-slate-300 font-medium text-[10px]">${escape_html(item)}</span>`);
            }
            $$renderer2.push(`<!--]--></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<p class="font-medium text-slate-900 text-[11px]">${escape_html(ans.answer_given)}</p>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<p class="font-medium text-slate-900 whitespace-pre-wrap text-[11px]">${escape_html(ans.answer_given)}</p>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> <div class="rounded p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-950"><span class="font-bold text-[10px] uppercase tracking-wider text-emerald-800 block mb-0.5">Kunci Jawaban:</span> `);
      if (["essay", "isian_singkat"].includes(ans.type)) {
        $$renderer2.push("<!--[0-->");
        if (ans.type === "essay") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="italic text-slate-500 text-[10px]">Penilaian manual oleh Guru</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<p class="font-bold text-emerald-900 text-[11px]">${escape_html(safeParseJson(ans.correct_answer_json, "-"))}</p>`);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
        if (ans.correct_answer_json) {
          $$renderer2.push("<!--[0-->");
          if (ans.type === "menjodohkan") {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="space-y-0.5 text-[10px]"><!--[-->`);
            const each_array_3 = ensure_array_like(safeParseObjectEntries(ans.correct_answer_json));
            for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
              let [key, value] = each_array_3[$$index_2];
              $$renderer2.push(`<div class="flex border-b border-emerald-200/60 last:border-0 pb-0.5"><span class="font-medium text-emerald-900 w-1/2">${escape_html(key)}</span> <span class="text-emerald-950 font-bold w-1/2">➔ ${escape_html(value)}</span></div>`);
            }
            $$renderer2.push(`<!--]--></div>`);
          } else if (ans.type === "pilihan_ganda") {
            $$renderer2.push("<!--[1-->");
            $$renderer2.push(`<p class="font-bold text-emerald-900 text-[11px]">`);
            if (ans.options_json) {
              $$renderer2.push("<!--[0-->");
              const opts = safeParseJson(ans.options_json, []);
              const correctOptId = safeParseJson(ans.correct_answer_json, "");
              const correctOpt = Array.isArray(opts) ? opts.find((o) => String(o.id) === String(correctOptId)) : null;
              $$renderer2.push(`${escape_html(correctOpt ? correctOpt.text : correctOptId)}`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`${escape_html(safeParseJson(ans.correct_answer_json, "-"))}`);
            }
            $$renderer2.push(`<!--]--></p>`);
          } else if (ans.type === "pilihan_ganda_kompleks") {
            $$renderer2.push("<!--[2-->");
            const correctArr = safeParseJson(ans.correct_answer_json, []);
            if (Array.isArray(correctArr)) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<div class="flex flex-wrap gap-1"><!--[-->`);
              const each_array_4 = ensure_array_like(correctArr);
              for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
                let item = each_array_4[$$index_3];
                $$renderer2.push(`<span class="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded border border-emerald-300 text-[10px]">${escape_html(item)}</span>`);
              }
              $$renderer2.push(`<!--]--></div>`);
            } else {
              $$renderer2.push("<!--[-1-->");
              $$renderer2.push(`<p class="font-bold text-emerald-900 text-[11px]">${escape_html(safeParseJson(ans.correct_answer_json, "-"))}</p>`);
            }
            $$renderer2.push(`<!--]-->`);
          } else {
            $$renderer2.push("<!--[-1-->");
            $$renderer2.push(`<p class="font-bold text-emerald-900 text-[11px]">${escape_html(safeParseJson(ans.correct_answer_json, "-"))}</p>`);
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<p class="italic text-slate-500 text-[10px]">Tidak ada kunci jawaban</p>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="mt-3 pt-2 border-t border-slate-300 flex items-center justify-between text-[9px] text-slate-500 font-sans"><span>Dicetak otomatis dari Ujian Online Madrasah (${escape_html((/* @__PURE__ */ new Date()).toLocaleDateString("id-ID"))})</span> <span>Halaman Detail Hasil Jawaban — ${escape_html(attempt.student_name)} (${escape_html(attempt.exam_title)})</span></div></div></div>`);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
