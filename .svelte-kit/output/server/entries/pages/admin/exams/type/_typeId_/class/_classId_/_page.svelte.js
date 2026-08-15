import { h as head, k as attr, c as stringify, e as escape_html, i as ensure_array_like, j as attr_class, f as bind_props } from "../../../../../../../../chunks/index.js";
import { p as parseDate } from "../../../../../../../../chunks/date.js";
import { p as parseProctors } from "../../../../../../../../chunks/format.js";
import { I as ICONS } from "../../../../../../../../chunks/constants.js";
import "@sveltejs/kit/internal";
import "../../../../../../../../chunks/exports.js";
import "../../../../../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../../../../../chunks/root.js";
import "../../../../../../../../chunks/state.svelte.js";
import { t as toasts } from "../../../../../../../../chunks/toast.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = $$props["data"];
    let form = $$props["form"];
    if (form?.success) toasts.success(form.success);
    if (form?.error) toasts.error(form.error);
    head("fphu4z", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(data.classData.name)} - ${escape_html(data.examType.name)} — Ujian Online</title>`);
      });
    });
    $$renderer2.push(`<div class="space-y-6 animate-in"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div class="flex items-start sm:items-center gap-3"><a${attr("href", `/admin/exams/type/${stringify(data.examType.id)}`)} class="btn-ghost p-2 rounded-lg text-slate-500 hover:text-slate-800 mt-1 sm:mt-0" title="Kembali ke Daftar Kelas"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg></a> <div><div class="flex flex-wrap items-center gap-2"><span class="text-xs font-mono font-bold tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">${escape_html(data.examType.code)}</span> <h1 class="text-2xl font-bold text-slate-800">${escape_html(data.examType.name)} - ${escape_html(data.classData.name)}</h1></div> <p class="text-sm text-slate-500 mt-1">Kelola ujian khusus untuk kelas ini</p></div></div> <div class="w-full sm:w-auto sm:ml-auto flex flex-col sm:flex-row gap-2"><button class="btn-outline w-full sm:w-auto justify-center text-indigo-600 border-indigo-200 hover:bg-indigo-50"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg> Cetak &amp; Export</button> <button class="btn-primary w-full sm:w-auto justify-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.plus)}></path></svg> Buat Ujian Baru</button></div></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`);
    const each_array = ensure_array_like(data.exams);
    if (each_array.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
        let exam = each_array[$$index_2];
        const isOutOfBounds = exam.start_time && exam.start_time < data.examType.start_time || exam.end_time && exam.end_time > data.examType.end_time;
        $$renderer2.push(`<div class="card-hover p-5 flex flex-col"><div class="flex items-start justify-between mb-3"><div class="flex-1 min-w-0">`);
        if (exam.title.length > 20) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<marquee scrollamount="4" class="font-bold text-slate-800 text-base block">${escape_html(exam.title)}</marquee>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<h3 class="font-bold text-slate-800">${escape_html(exam.title)}</h3>`);
        }
        $$renderer2.push(`<!--]--> <p class="text-xs text-slate-500 mt-0.5">${escape_html(exam.subject_name || "Tanpa Mapel")}</p></div> `);
        if (exam.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="badge-success ml-2 flex-shrink-0">Aktif</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span class="badge bg-slate-100 text-slate-500 ml-2 flex-shrink-0">Nonaktif</span>`);
        }
        $$renderer2.push(`<!--]--></div> `);
        if (exam.description) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p class="text-sm text-slate-500 mb-3 line-clamp-2">${escape_html(exam.description)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="flex flex-wrap gap-3 text-xs text-slate-500 mb-4"><span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.clock)}></path></svg> ${escape_html(exam.duration_minutes)} menit</span> <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.questions)}></path></svg> ${escape_html(exam.question_count)} soal</span> <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.users)}></path></svg> ${escape_html(exam.participant_count)} peserta</span> <span class="flex items-center gap-1 w-full mt-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path></svg> Soal: ${escape_html(exam.shuffle_questions ? "Acak" : "Tidak Acak")}</span> <span class="flex items-center gap-1 w-full"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Nilai: ${escape_html({
          after_type_end_time: "Jadwal Tipe Ujian",
          after_submit: "Langsung Tampil",
          after_end_time: "Jadwal Ujian",
          objective_only: "Hanya Nilai Otomatis",
          manual: "Manual (Guru/Admin)"
        }[exam.show_score_type || "after_submit"] || "Langsung Tampil")}</span> `);
        if (exam.proctors) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="mt-1 text-slate-600 flex flex-col gap-1.5 pt-2 border-t border-slate-100 border-dashed w-full"><!--[-->`);
          const each_array_1 = ensure_array_like(parseProctors(exam.proctors));
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let p = each_array_1[$$index];
            $$renderer2.push(`<div class="flex items-center gap-1.5 text-[11px]"><span class="font-semibold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/80 shrink-0">${escape_html(p.label)}:</span> <span class="leading-snug font-medium text-slate-700 truncate"${attr("title", p.name)}>${escape_html(p.name)}</span></div>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div${attr_class(`flex items-start gap-1 w-full mt-0.5 ${isOutOfBounds ? "text-rose-500 font-medium" : "text-slate-500"}`)}${attr("title", isOutOfBounds ? "Waktu ujian berada di luar rentang tipe ujian, sehingga otomatis nonaktif" : "Rentang Waktu Ujian")}><svg class="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.calendar)}></path></svg> `);
        if (exam.sessions && exam.sessions.length > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="flex flex-col gap-1 w-full"><!--[-->`);
          const each_array_2 = ensure_array_like(exam.sessions);
          for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
            let session = each_array_2[$$index_1];
            $$renderer2.push(`<div class="flex items-center justify-between bg-slate-50 p-1.5 rounded border border-slate-100"><span class="font-semibold text-slate-700">Sesi ${escape_html(session.session_number)}</span> <span class="text-slate-600 text-[10px]">${escape_html(session.start_time ? parseDate(session.start_time).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : "-")}
											s/d
											${escape_html(session.end_time ? parseDate(session.end_time).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : "-")}</span></div>`);
          }
          $$renderer2.push(`<!--]--></div>`);
        } else if (exam.start_time || exam.end_time) {
          $$renderer2.push("<!--[1-->");
          $$renderer2.push(`<div class="flex flex-col gap-0.5 min-w-0 flex-1"><span class="text-slate-400 text-[10px] font-medium">Mulai:</span> <span class="truncate text-xs">${escape_html(exam.start_time ? parseDate(exam.start_time).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : "-")}</span> <span class="text-slate-400 text-[10px] font-medium mt-0.5">Berakhir:</span> <span class="truncate text-xs">${escape_html(exam.end_time ? parseDate(exam.end_time).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : "-")}</span> `);
          if (isOutOfBounds) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="mt-0.5 px-1.5 py-0.5 rounded bg-rose-100 text-[9px] text-rose-600 font-bold tracking-wide w-fit">NONAKTIF</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span>Belum diatur</span>`);
        }
        $$renderer2.push(`<!--]--></div></div> <div class="mt-auto flex items-center gap-2 pt-3 border-t border-slate-100"><a${attr("href", `/admin/exams/${stringify(exam.id)}`)} class="btn-sm btn-outline flex-1 text-center">Detail</a> <button class="btn-sm btn-ghost" title="Edit"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.edit)}></path></svg></button> <form method="POST" action="?/toggleActive"><input type="hidden" name="id"${attr("value", exam.id)}/> <button type="submit" class="btn-sm btn-ghost"${attr("title", exam.is_active ? "Nonaktifkan" : "Aktifkan")}>`);
        if (exam.is_active) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.check)}></path></svg>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>`);
        }
        $$renderer2.push(`<!--]--></button></form> <button class="btn-sm btn-ghost text-rose-400 hover:text-rose-600" title="Hapus"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.trash)}></path></svg></button></div></div>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="col-span-full text-center py-12 text-slate-400"><svg class="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round"${attr("d", ICONS.exam)}></path></svg> <p>Belum ada ujian di kelas ini. Klik "Buat Ujian Baru" untuk memulai.</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
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
    bind_props($$props, { data, form });
  });
}
export {
  _page as default
};
