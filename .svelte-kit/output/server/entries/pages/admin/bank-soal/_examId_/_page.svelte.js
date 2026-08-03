import { b as bind_props, h as head, e as escape_html, i as attr, k as store_get, c as ensure_array_like, d as attr_class, u as unsubscribe_stores } from "../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import "../../../../../chunks/state.svelte.js";
import { C as ConfirmForm } from "../../../../../chunks/ConfirmForm.js";
import { I as ICONS, Q as QUESTION_TYPE_LABELS } from "../../../../../chunks/constants.js";
/* empty css                                                                   */
import { I as ImportExcelModal } from "../../../../../chunks/ImportExcelModal.js";
import { t as toasts } from "../../../../../chunks/toast.js";
import { p as page } from "../../../../../chunks/stores.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let exam, questions;
    let data = $$props["data"];
    let form = $$props["form"];
    let showImportModal = false;
    if (form?.success) toasts.success(form.success);
    if (form?.error) toasts.error(form.error);
    exam = data.exam;
    questions = data.questions;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1d18evi", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Soal - ${escape_html(exam.title)} — Ujian Online Madrasah</title>`);
        });
      });
      $$renderer3.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div class="flex items-start sm:items-center gap-3"><a${attr("href", store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("from") === "bank" ? "/admin/bank-soal" : `/admin/exams/${exam.id}`)} class="btn-ghost btn-sm mt-1 sm:mt-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronLeft)}></path></svg></a> <div><h1 class="text-2xl font-bold text-slate-800 leading-tight">${escape_html(exam.title)}</h1> <p class="text-sm text-slate-500 mt-1">${escape_html(exam.subject || "Umum")} · ${escape_html(questions.length)} soal</p></div></div> <div class="flex flex-wrap items-center gap-2 pl-12 sm:pl-0"><button class="btn-ghost btn-sm"><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Import Excel</button> <button class="btn-primary btn-sm"><svg class="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Tambah Soal</button></div></div> `);
      ImportExcelModal($$renderer3, {
        get show() {
          return showImportModal;
        },
        set show($$value) {
          showImportModal = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="space-y-3">`);
      const each_array_4 = ensure_array_like(questions);
      if (each_array_4.length !== 0) {
        $$renderer3.push("<!--[-->");
        for (let idx = 0, $$length = each_array_4.length; idx < $$length; idx++) {
          let q = each_array_4[idx];
          $$renderer3.push(`<div class="card p-4 flex items-start gap-4 group"><span class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md shadow-indigo-500/20">${escape_html(q.question_number)}</span> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1"><span class="badge-primary text-[10px]">${escape_html(QUESTION_TYPE_LABELS[q.type] || q.type)}</span> <span class="text-xs text-slate-400">${escape_html(q.points)} poin</span> `);
          if (q.media_type) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<span class="badge-info text-[10px]">📎 ${escape_html(q.media_type === "image" ? "Gambar" : "Audio")}</span>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div> <p class="text-sm text-slate-700 line-clamp-2">${escape_html(q.question_text)}</p> `);
          if (q.options_json) {
            $$renderer3.push("<!--[0-->");
            const opts = JSON.parse(q.options_json);
            const correct = q.correct_answer_json ? JSON.parse(q.correct_answer_json) : null;
            if (Array.isArray(opts)) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="flex flex-wrap gap-1.5 mt-2"><!--[-->`);
              const each_array_5 = ensure_array_like(opts);
              for (let i = 0, $$length2 = each_array_5.length; i < $$length2; i++) {
                let opt = each_array_5[i];
                const isCorrect = q.type === "pilihan_ganda" && correct === String.fromCharCode(65 + i) || q.type === "benar_salah" && correct === opt;
                $$renderer3.push(`<span${attr_class(`text-[10px] px-2 py-0.5 rounded-md ${isCorrect ? "bg-green-100 text-green-700 font-bold border border-green-200" : "bg-slate-100 text-slate-600"}`)}>${escape_html(q.type === "pilihan_ganda" ? `${String.fromCharCode(65 + i)}. ` : "")}${escape_html(opt)}</span>`);
              }
              $$renderer3.push(`<!--]--></div>`);
            } else if (q.type === "menjodohkan" && opts.left) {
              $$renderer3.push("<!--[1-->");
              $$renderer3.push(`<div class="mt-2 text-xs text-slate-500"><!--[-->`);
              const each_array_6 = ensure_array_like(opts.left);
              for (let i = 0, $$length2 = each_array_6.length; i < $$length2; i++) {
                let l = each_array_6[i];
                $$renderer3.push(`<div class="flex gap-2"><span class="font-medium text-slate-700">${escape_html(l)}</span> <span>→</span> <span class="text-green-600">${escape_html(opts.right[correct[i]])}</span></div>`);
              }
              $$renderer3.push(`<!--]--></div>`);
            } else {
              $$renderer3.push("<!--[-1-->");
            }
            $$renderer3.push(`<!--]-->`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> `);
          if (q.type === "isian_singkat" && q.correct_answer_json) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="mt-2 text-xs"><span class="text-slate-500">Jawaban Benar:</span> <span class="font-bold text-green-600 ml-1">${escape_html(JSON.parse(q.correct_answer_json))}</span></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div> <div class="flex items-start gap-2"><button type="button" class="p-2 rounded-xl text-sky-600 bg-sky-50 hover:bg-sky-500 hover:text-white transition-all shadow-sm" title="Preview soal"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button> <div class="flex flex-col gap-2"><button type="button" class="p-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-500 hover:text-white transition-all shadow-sm" title="Edit soal"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.edit)}></path></svg></button> `);
          ConfirmForm($$renderer3, {
            action: "?/delete",
            confirmTitle: "Hapus Soal",
            confirmMessage: "Hapus soal ini?",
            buttonClass: "p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center justify-center",
            buttonTitle: "Hapus soal",
            $$slots: {
              inputs: ($$renderer4) => {
                {
                  $$renderer4.push(`<input type="hidden" name="id"${attr("value", q.id)}/>`);
                }
              },
              buttonContent: ($$renderer4) => {
                {
                  $$renderer4.push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg>`);
                }
              }
            }
          });
          $$renderer3.push(`<!----></div></div></div>`);
        }
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<div class="text-center py-12 text-slate-400"><p>Belum ada soal. Klik "Tambah Soal" untuk memulai.</p></div>`);
      }
      $$renderer3.push(`<!--]--></div></div> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
