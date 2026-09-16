import { f as bind_props, h as head, e as escape_html, k as attr, s as store_get, j as attr_class, i as ensure_array_like, c as stringify, u as unsubscribe_stores } from "../../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../../chunks/exports.js";
import "../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../chunks/root.js";
import { p as public_env } from "../../../../../chunks/shared-server.js";
import "../../../../../chunks/state.svelte.js";
import { C as ConfirmForm } from "../../../../../chunks/ConfirmForm.js";
import { I as ICONS, Q as QUESTION_TYPE_LABELS } from "../../../../../chunks/constants.js";
/* empty css                                                                   */
import { I as ImportExcelModal, a as ImportWordModal } from "../../../../../chunks/RichTextEditor.svelte_svelte_type_style_lang.js";
import { t as toasts } from "../../../../../chunks/toast.js";
import { p as page } from "../../../../../chunks/stores.js";
import { h as html } from "../../../../../chunks/html.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let questions, totalSelectedAnswers, isAllSelected, exam;
    let data = $$props["data"];
    let form = $$props["form"];
    let showImportModal = false;
    let showImportWordModal = false;
    let isBulkSelectMode = false;
    let selectedQuestionIds = /* @__PURE__ */ new Set();
    public_env.PUBLIC_CLOUDINARY_CLOUD_NAME || "dfhtjgwcz";
    public_env.PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ujian-madrasah";
    let deletedLocalIds = /* @__PURE__ */ new Set();
    if (form?.success) {
      toasts.success(form.success);
      if (form.deletedIds) {
        form.deletedIds.forEach((id) => deletedLocalIds.add(id));
        deletedLocalIds = deletedLocalIds;
        selectedQuestionIds.clear();
        selectedQuestionIds = selectedQuestionIds;
        isBulkSelectMode = false;
      }
    }
    questions = data.questions.filter((q) => !deletedLocalIds.has(q.id));
    totalSelectedAnswers = questions.filter((q) => selectedQuestionIds.has(q.id)).reduce((sum, q) => sum + (q.answers_count || 0), 0);
    isAllSelected = questions.length > 0 && selectedQuestionIds.size === questions.length;
    if (form?.error) toasts.error(form.error);
    exam = data.exam;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1d18evi", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Soal - ${escape_html(exam.title)} — Ujian Online Madrasah</title>`);
        });
      });
      $$renderer3.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div class="flex items-start sm:items-center gap-3"><a${attr("href", store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("from") === "bank" ? "/admin/bank-soal" : `/admin/exams/${exam.id}`)} class="btn-ghost btn-sm mt-1 sm:mt-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.chevronLeft)}></path></svg></a> <div><h1 class="text-2xl font-bold text-slate-800 leading-snug break-words">${escape_html(exam.title)}</h1> <p class="text-sm text-slate-500 mt-1">${escape_html(exam.subject || "Umum")} · ${escape_html(questions.length)} soal</p></div></div> <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 pl-12 sm:pl-0"><button class="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"><svg class="w-4 h-4 mr-1 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> Import Word</button> `);
      if (questions.length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<button${attr_class(`btn px-2 sm:px-4 justify-center ${isBulkSelectMode ? "bg-indigo-100 text-indigo-700 border-indigo-300" : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"} transition-all shadow-sm`)}><svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg> <span class="text-[13px] sm:text-sm font-semibold">${escape_html(isBulkSelectMode ? "Batal Pilih" : "Pilih Massal")}</span></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <button class="btn-primary px-2 sm:px-4 justify-center shadow-md shadow-indigo-500/20"><svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> <span class="text-[13px] sm:text-sm font-semibold">Tambah Soal</span></button></div></div> `);
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
      ImportWordModal($$renderer3, {
        get show() {
          return showImportWordModal;
        },
        set show($$value) {
          showImportWordModal = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (isBulkSelectMode && questions.length > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-xl mb-4"><label class="flex items-center gap-2 cursor-pointer select-none"><input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"${attr("checked", isAllSelected, true)}/> <span class="font-medium text-slate-700">Pilih Semua (${escape_html(questions.length)} soal)</span></label> <span class="text-sm text-slate-500">${escape_html(selectedQuestionIds.size)} terpilih</span></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="space-y-3">`);
      const each_array_7 = ensure_array_like(questions);
      if (each_array_7.length !== 0) {
        $$renderer3.push("<!--[-->");
        for (let idx = 0, $$length = each_array_7.length; idx < $$length; idx++) {
          let q = each_array_7[idx];
          $$renderer3.push(`<div${attr_class(`card p-4 flex items-start gap-4 group ${selectedQuestionIds.has(q.id) ? "ring-2 ring-indigo-500 bg-indigo-50/20" : ""}`)}>`);
          if (isBulkSelectMode) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="flex flex-col items-center justify-center pt-2"><input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"${attr("checked", selectedQuestionIds.has(q.id), true)}/></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--> <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md shadow-indigo-500/20">${escape_html(q.question_number)}</span> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1"><span class="badge-primary text-[10px]">${escape_html(QUESTION_TYPE_LABELS[q.type] || q.type)}</span> <span class="text-xs text-slate-400">${escape_html(q.points)} poin</span> `);
          if (q.media_type && q.media_type !== "none") {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<span class="badge-info text-[10px]">📎 ${escape_html(q.media_type === "image" ? "Gambar" : "Audio")}</span>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div> <div class="text-sm text-slate-700 line-clamp-2 prose prose-sm max-w-none prose-p:m-0 prose-img:m-0 prose-ul:m-0">${html(q.question_text)}</div> `);
          if (q.options_json) {
            $$renderer3.push("<!--[0-->");
            const opts = JSON.parse(q.options_json);
            const correct = q.correct_answer_json ? JSON.parse(q.correct_answer_json) : null;
            if (Array.isArray(opts)) {
              $$renderer3.push("<!--[0-->");
              $$renderer3.push(`<div class="flex flex-wrap gap-1.5 mt-2"><!--[-->`);
              const each_array_8 = ensure_array_like(opts);
              for (let i = 0, $$length2 = each_array_8.length; i < $$length2; i++) {
                let opt = each_array_8[i];
                const isCorrect = q.type === "pilihan_ganda" && correct === String.fromCharCode(65 + i) || q.type === "pilihan_ganda_kompleks" && Array.isArray(correct) && correct.includes(String.fromCharCode(65 + i)) || q.type === "benar_salah" && correct === opt;
                $$renderer3.push(`<span${attr_class(`text-[10px] px-2 py-0.5 rounded-md ${isCorrect ? "bg-green-100 text-green-700 font-bold border border-green-200" : "bg-slate-100 text-slate-600"} flex items-center gap-1`)}>${escape_html(q.type.startsWith("pilihan_ganda") ? `${String.fromCharCode(65 + i)}.` : "")} ${html(opt)}</span>`);
              }
              $$renderer3.push(`<!--]--></div>`);
            } else if (q.type === "benar_salah" && opts.statements) {
              $$renderer3.push("<!--[1-->");
              $$renderer3.push(`<div class="mt-2 space-y-1 text-xs"><!--[-->`);
              const each_array_9 = ensure_array_like(opts.statements);
              for (let i = 0, $$length2 = each_array_9.length; i < $$length2; i++) {
                let stmt = each_array_9[i];
                const ansKey = typeof correct === "object" && correct !== null ? correct[String(i)] || correct[i] || "Benar" : correct || "Benar";
                $$renderer3.push(`<div class="flex items-center gap-2 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"><span class="font-bold text-slate-700">${escape_html(i + 1)}.</span> <span class="flex-1 truncate">${html(stmt)}</span> <span${attr_class(`px-2 py-0.5 rounded text-[10px] font-bold ${ansKey === "Benar" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-rose-100 text-rose-700 border border-rose-200"}`)}>${escape_html(ansKey)}</span></div>`);
              }
              $$renderer3.push(`<!--]--></div>`);
            } else if (q.type === "menjodohkan" && opts.left) {
              $$renderer3.push("<!--[2-->");
              const correctMap = q.correct_answer_json ? JSON.parse(q.correct_answer_json) : {};
              $$renderer3.push(`<div class="mt-2 text-xs space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200"><div class="font-semibold text-slate-700 mb-1">Kunci Pasangan:</div> <!--[-->`);
              const each_array_10 = ensure_array_like(opts.left);
              for (let i = 0, $$length2 = each_array_10.length; i < $$length2; i++) {
                let l = each_array_10[i];
                const targetIdx = correctMap ? correctMap[String(i)] ?? correctMap[i] ?? i : i;
                const targetLetter = String.fromCharCode(65 + Number(targetIdx));
                const targetText = opts.right?.[Number(targetIdx)] ?? "-";
                $$renderer3.push(`<div class="flex items-center gap-2 text-slate-600"><span class="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0">${escape_html(i + 1)}</span> <span class="font-medium text-slate-700 truncate max-w-[40%]">${html(l)}</span> <span class="text-indigo-500 font-bold">➔</span> <span class="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px] shrink-0">${escape_html(targetLetter)}</span> <span class="text-slate-600 truncate flex-1">${html(targetText)}</span></div>`);
              }
              $$renderer3.push(`<!--]--> `);
              if (opts.right && opts.right.length > opts.left.length) {
                $$renderer3.push("<!--[0-->");
                const pairedRightIdxs = new Set(opts.left.map((_, i) => String(correctMap ? correctMap[String(i)] ?? correctMap[i] ?? i : i)));
                const distractors = opts.right.map((r, j) => ({ text: r, letter: String.fromCharCode(65 + j), idx: String(j) })).filter((item) => !pairedRightIdxs.has(item.idx));
                if (distractors.length > 0) {
                  $$renderer3.push("<!--[0-->");
                  $$renderer3.push(`<div class="pt-1.5 mt-1.5 border-t border-slate-200/80 flex items-center gap-1.5 flex-wrap"><span class="text-amber-700 font-semibold">Pilihan Pengecoh:</span> <!--[-->`);
                  const each_array_11 = ensure_array_like(distractors);
                  for (let $$index_10 = 0, $$length2 = each_array_11.length; $$index_10 < $$length2; $$index_10++) {
                    let d = each_array_11[$$index_10];
                    $$renderer3.push(`<span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-medium border border-amber-200">[${escape_html(d.letter)}] ${html(d.text)}</span>`);
                  }
                  $$renderer3.push(`<!--]--></div>`);
                } else {
                  $$renderer3.push("<!--[-1-->");
                }
                $$renderer3.push(`<!--]-->`);
              } else {
                $$renderer3.push("<!--[-1-->");
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
          $$renderer3.push(`<!--]--></div> <div class="flex items-start gap-2"><button type="button" class="p-2 rounded-xl text-sky-600 bg-sky-50 hover:bg-sky-500 hover:text-white transition-all shadow-sm" title="Preview soal"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button> <div class="flex flex-col gap-2"><button type="button" class="p-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 transition-colors" title="Edit soal"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.edit)}></path></svg></button> `);
          ConfirmForm($$renderer3, {
            action: "?/delete",
            confirmTitle: "Hapus Soal",
            confirmMessage: q.answers_count > 0 ? `Hapus soal ini? <br><br><strong>Perhatian:</strong> Sudah ada ${q.answers_count} jawaban siswa untuk soal ini. Menghapus soal akan ikut menghapus riwayat jawaban mereka.` : "Hapus soal ini?",
            verifyText: q.answers_count > 0 ? q.question_number.toString() : null,
            verifyPlaceholder: "Nomor soal",
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
      $$renderer3.push(`<!--]--></div> `);
      if (selectedQuestionIds.size > 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"><div class="bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-6 animate-in slide-in-from-bottom-8 pointer-events-auto w-full sm:w-auto max-w-md sm:max-w-none"><div class="flex-1 min-w-0"><div class="text-slate-800 font-bold text-sm sm:text-base">${escape_html(selectedQuestionIds.size)} soal terpilih</div> <div class="text-slate-500 text-xs sm:text-sm hidden sm:block">Hapus massal soal yang dipilih</div></div> <div class="flex-shrink-0 flex items-center gap-2"><button type="button" class="btn px-3 sm:px-4 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 shadow-sm border-none whitespace-nowrap transition-colors">Batal</button> `);
        ConfirmForm($$renderer3, {
          action: "?/deleteBulk",
          confirmTitle: "Hapus Massal Soal",
          confirmMessage: totalSelectedAnswers > 0 ? `Hapus ${selectedQuestionIds.size} soal terpilih? <br><br><strong>Perhatian:</strong> Ditemukan ${totalSelectedAnswers} jawaban siswa pada soal-soal ini. Menghapus soal akan ikut menghapus seluruh riwayat jawaban siswa tersebut.` : `Yakin ingin menghapus ${selectedQuestionIds.size} soal yang dipilih?`,
          verifyText: totalSelectedAnswers > 0 ? "HAPUS MASSAL" : null,
          verifyPlaceholder: "Ketik HAPUS MASSAL",
          buttonClass: "btn px-3 sm:px-4 bg-rose-600 text-white hover:bg-rose-700 shadow-sm border-none whitespace-nowrap flex items-center",
          buttonTitle: `Hapus ${stringify(selectedQuestionIds.size)} soal`,
          $$slots: {
            inputs: ($$renderer4) => {
              {
                $$renderer4.push(`<input type="hidden" name="ids"${attr("value", JSON.stringify(Array.from(selectedQuestionIds)))}/>`);
              }
            },
            buttonContent: ($$renderer4) => {
              {
                $$renderer4.push(`<svg class="w-4 h-4 sm:mr-2 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg> <span class="hidden sm:inline">Hapus Terpilih</span> <span class="sm:hidden">Hapus</span>`);
              }
            }
          }
        });
        $$renderer3.push(`<!----></div></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> `);
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
